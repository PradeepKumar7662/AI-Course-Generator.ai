
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/configs/db";
import { CourseList, Chapters } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";



async function getOwnedCourse(courseId) {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Please sign in first.", status: 401 };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (!email) {
    return { error: "User email is unavailable.", status: 400 };
  }

  const rows = await db
    .select()
    .from(CourseList)
    .where(
      and(
        eq(CourseList.courseId, courseId),
        eq(CourseList.createdBy, email)
      )
    )
    .limit(1);

  if (!rows.length) {
    return { error: "Course not found.", status: 404 };
  }

  return { course: rows[0] };
}

function getOutline(courseOutput, index) {
  const chapters =
    courseOutput?.Chapters ??
    courseOutput?.chapters ??
    [];

  return Array.isArray(chapters) ? chapters[index] : null;
}

async function findChapter(courseId, chapterId) {
  const rows = await db
    .select()
    .from(Chapters)
    .where(
      and(
        eq(Chapters.courseId, courseId),
        eq(Chapters.chapterId, chapterId)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

async function searchYouTubeVideo(courseName, chapterName, category) {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn("YOUTUBE_API_KEY is missing.");
    return "";
  }

  const query = `${courseName} ${chapterName} ${category} tutorial`;

  const url = new URL(
    "https://www.googleapis.com/youtube/v3/search"
  );

  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("videoEmbeddable", "true");
  url.searchParams.set("maxResults", "5");
  url.searchParams.set("regionCode", "IN");
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const error = await response.text();
    console.error("YouTube search failed:", error);
    return "";
  }

  const data = await response.json();

  // Prefer a result whose title closely matches the chapter topic.
  const items = data.items ?? [];
  const normalizedTopic = chapterName.toLowerCase();

  const bestMatch =
    items.find((item) =>
      item.snippet?.title?.toLowerCase().includes(normalizedTopic)
    ) ?? items[0];

  return bestMatch?.id?.videoId ?? "";
}

function isValidVideoId(videoId) {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId || "");
}

async function getVideoId(course, chapterName) {
  try {
    return await searchYouTubeVideo(
      course.name,
      chapterName,
      course.category
    );
  } catch (error) {
    console.error("YouTube search error:", error);
    return "";
  }
}

// GET: Load an existing chapter.
export async function GET(request, { params }) {
  try {
    const { courseId, chapterId } = await params;
    const index = Number(chapterId);

    if (!courseId || !Number.isInteger(index) || index < 0) {
      return NextResponse.json(
        { error: "Invalid course ID or chapter index." },
        { status: 400 }
      );
    }

    const access = await getOwnedCourse(courseId);

    if (access.error) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const saved = await findChapter(courseId, index + 1);

    if (!saved) {
      return NextResponse.json(
        { error: "Chapter content has not been generated yet." },
        { status: 404 }
      );
    }

    return NextResponse.json(saved);
  } catch (error) {
    console.error("GET chapter error:", error);

    return NextResponse.json(
      { error: "Failed to load chapter content." },
      { status: 500 }
    );
  }
}

// POST: Generate missing content, or repair a missing video ID.
export async function POST(request, { params }) {
  try {
    const { courseId, chapterId } = await params;
    const index = Number(chapterId);

    if (!courseId || !Number.isInteger(index) || index < 0) {
      return NextResponse.json(
        { error: "Invalid course ID or chapter index." },
        { status: 400 }
      );
    }

    const access = await getOwnedCourse(courseId);

    if (access.error) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const outline = getOutline(access.course.courseOutput, index);

    if (!outline) {
      return NextResponse.json(
        { error: "Chapter outline not found in this course." },
        { status: 404 }
      );
    }

    const chapterName =
      outline["Chapter Name"] ??
      outline.chapterName ??
      outline.title ??
      `Chapter ${index + 1}`;

    // Repair the video ID for an already saved chapter.
    const existing = await findChapter(courseId, index + 1);

    if (existing) {
      if (!isValidVideoId(existing.videoId)) {
        const videoId = await getVideoId(
          access.course,
          chapterName
        );

        if (videoId) {
          const updated = await db
            .update(Chapters)
            .set({ videoId })
            .where(
              and(
                eq(Chapters.courseId, courseId),
                eq(Chapters.chapterId, index + 1)
              )
            )
            .returning();

          return NextResponse.json(updated[0] ?? existing);
        }
      }

      return NextResponse.json(existing);
    }

    // Generate chapter content only if it is not saved yet.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env.local." },
        { status: 500 }
      );
    }

    const prompt = `
Create detailed educational content for this course chapter.

Course: ${access.course.name}
Category: ${access.course.category}
Level: ${access.course.level}
Chapter: ${chapterName}
Outline: ${outline.about ?? outline.description ?? ""}
Duration: ${outline.Duration ?? outline.duration ?? ""}

Return valid JSON only with this structure:
{
  "title": "Chapter title",
  "description": "Detailed explanation using paragraphs",
  "key_points": ["Important point 1", "Important point 2"],
  "code_example": "A relevant code example as a string, or empty string if not applicable",
  "summary": "Short chapter summary"
}

The title and content must match the specified chapter.
Make the explanation suitable for the learner's level.
Do not return Markdown fences or text outside the JSON.
`;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      generationConfig: {
        temperature: 0.5,
        responseMimeType: "application/json",
      },
    });

   
let result;

try {
  result = await model.generateContent(prompt);
} catch (error) {
  console.error("GEMINI ERROR:", error);

  return NextResponse.json(
    {
      error: "Chapter generate nahi hua",
      details: error?.message || "Unknown AI error",
    },
    { status: 502 }
  );
}

    const content = JSON.parse(result.response.text());

    if (
      !content ||
      typeof content !== "object" ||
      typeof content.description !== "string"
    ) {
      throw new Error("Gemini returned an invalid chapter response.");
    }

    // Search YouTube for a relevant, embeddable video.
    const videoId = await getVideoId(access.course, chapterName);

    // Check once more before inserting.
    const alreadySaved = await findChapter(courseId, index + 1);

    if (alreadySaved) {
      if (!isValidVideoId(alreadySaved.videoId) && videoId) {
        const updated = await db
          .update(Chapters)
          .set({ videoId })
          .where(
            and(
              eq(Chapters.courseId, courseId),
              eq(Chapters.chapterId, index + 1)
            )
          )
          .returning();

        return NextResponse.json(updated[0] ?? alreadySaved);
      }

      return NextResponse.json(alreadySaved);
    }

    const inserted = await db
      .insert(Chapters)
      .values({
        courseId,
        chapterId: index + 1,
        content,
        videoId,
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error("POST chapter generation error:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to generate chapter content." },
      { status: 500 }
    );
  }
}

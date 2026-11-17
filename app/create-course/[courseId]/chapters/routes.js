
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { Chapters, CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export async function POST(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    const { courseId } = await params;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    // Verify that the signed-in user owns this course.
    const ownedCourse = await db
      .select({ courseId: CourseList.courseId })
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, courseId),
          eq(CourseList.createdBy, email)
        )
      );

    if (ownedCourse.length === 0) {
      return NextResponse.json(
        { error: "Course not found or access denied." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { chapters } = body;

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json(
        { error: "No chapter content provided." },
        { status: 400 }
      );
    }

    // Validate all chapters before changing existing records.
    const invalidChapter = chapters.some(
      (chapter) =>
        !chapter ||
        typeof chapter.content !== "object" ||
        chapter.content === null ||
        Array.isArray(chapter.content)
    );

    if (invalidChapter) {
      return NextResponse.json(
        { error: "One or more chapters have invalid content." },
        { status: 400 }
      );
    }

    const chapterRows = chapters.map((chapter, index) => ({
      courseId,
      chapterId: index,
      content: chapter.content,
      videoId: chapter.videoId || "",
    }));

    // Replace existing generated chapters for this course.
    await db
      .delete(Chapters)
      .where(eq(Chapters.courseId, courseId));

    await db.insert(Chapters).values(chapterRows);

    // publish is a varchar column in the current schema.
    await db
      .update(CourseList)
      .set({ publish: "true" })
      .where(eq(CourseList.courseId, courseId));

    return NextResponse.json({
      success: true,
      savedCount: chapterRows.length,
    });
  } catch (error) {
    console.error("Save chapters error:", error);

    return NextResponse.json(
      { error: "Failed to save chapter content." },
      { status: 500 }
    );
  }
}

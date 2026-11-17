
"use client";

import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CourseBasicInfo from "./components/CourseBasicInfo";
import CourseDetail from "./components/CourseDetail";
import ChapterList from "./components/ChapterList";

import { Button } from "@/components/ui/button";
import { GeneraterChapterContent_AI } from "@/configs/AiModel";
import LoadingDialog from "../_components/LoadingDialog";
import service from "@/configs/service";

export default function CourseLayout() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();

  const courseId = params?.courseId;

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch course details
  const Getcourse = useCallback(async () => {
    if (!courseId || !user) return;

    try {
      setPageLoading(true);
      setError("");

      const response = await fetch(`/api/courses/${courseId}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load course.");
      }

      const courseData = data.course ?? data;

      if (!courseData?.courseId) {
        throw new Error("Invalid course data received.");
      }

      setCourse(courseData);
    } catch (err) {
      console.error("Get course error:", err);
      setError(err.message || "Unable to load course.");
    } finally {
      setPageLoading(false);
    }
  }, [courseId, user]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setPageLoading(false);
      return;
    }

    Getcourse();
  }, [isLoaded, user, Getcourse]);

  // Generate chapter content
  const GeneraterChapterContent = async () => {
    if (!course?.courseId) {
      alert("Course data is not available. Please try again.");
      return;
    }

    const chapters =
      course?.courseOutput?.Chapters ??
      course?.courseOutput?.chapters ??
      [];

    if (!Array.isArray(chapters) || chapters.length === 0) {
      alert("No chapters found in this course.");
      return;
    }

    setLoading(true);

    try {
      const generatedChapters = [];

      for (let index = 0; index < chapters.length; index++) {
        const chapter = chapters[index];

        const chapterName =
          chapter?.["Chapter Name"] ||
          chapter?.chapterName ||
          chapter?.title ||
          chapter?.name ||
          `Chapter ${index + 1}`;

        const courseName =
          course?.name ||
          course?.courseOutput?.["Course Name"] ||
          "General Course";

        const PROMPT = `
You are an expert teacher and professional educational content writer.

Create a complete, detailed, beginner-friendly lesson.

COURSE NAME: ${courseName}
CHAPTER NAME: ${chapterName}

WRITING STYLE:
- Use simple, clear, professional English.
- Explain concepts in well-developed paragraphs.
- Include practical examples.
- Use technically accurate information.

REQUIRED CONTENT:

1. Introduction
Explain the topic, its importance and uses.

2. Detailed Explanation
Explain all main concepts with headings and subheadings.

3. Important Concepts
Explain important terminology, features and components.

4. Practical Examples
Include relevant real-world examples.

5. Code Example and Explanation
For programming topics, provide working code and explain it.
For non-programming topics, provide a relevant practical example.

6. Common Mistakes and Tips
Include useful beginner tips.

7. Summary
Summarize the important ideas.

8. Key Points to Remember
Provide 4 to 7 revision points.

Return ONLY valid JSON with these exact fields:
{
  "title": "Meaningful chapter title",
  "description": "Full detailed lesson using Markdown",
  "key_points": [
    "Revision point 1",
    "Revision point 2",
    "Revision point 3",
    "Revision point 4"
  ],
  "code_example": "Relevant code example as a string, or empty string",
  "summary": "Concise chapter summary"
}

All five fields must be present.
Return valid JSON only, without Markdown code fences.
`;

        console.log("Generating chapter:", chapterName);

        const result =
          await GeneraterChapterContent_AI.sendMessage(PROMPT);

        let responseText = result?.response?.text();

        if (!responseText) {
          throw new Error(
            `AI returned empty content for ${chapterName}.`
          );
        }

        // Remove optional Markdown code fences
        responseText = responseText
          .replace(/^```(?:json)?\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        let content;

        try {
          content = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Invalid AI JSON:", responseText);
          throw new Error(
            `AI returned invalid JSON for ${chapterName}.`
          );
        }

        // Validate AI response
        if (
          !content ||
          typeof content !== "object" ||
          typeof content.title !== "string" ||
          typeof content.description !== "string" ||
          !Array.isArray(content.key_points) ||
          typeof content.summary !== "string" ||
          typeof content.code_example !== "string"
        ) {
          throw new Error(
            `Incomplete chapter content for ${chapterName}.`
          );
        }

        // Fetch related YouTube video
        let videoId = "";

        try {
          const videos = await service.getVideos(
            `${courseName}: ${chapterName}`
          );

          videoId =
            videos?.[0]?.id?.videoId ??
            videos?.items?.[0]?.id?.videoId ??
            "";
        } catch (videoError) {
          console.error(
            `Video fetch failed for ${chapterName}:`,
            videoError
          );
        }

        generatedChapters.push({
          content,
          videoId,
        });
      }

      // Save generated chapters
      const response = await fetch(
        `/api/courses/${course.courseId}/chapters`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chapters: generatedChapters,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save chapter content."
        );
      }

      console.log("Chapters saved successfully:", data);

      router.push(`/course/${course.courseId}/start`);
    } catch (err) {
      console.error("Chapter generation error:", err);

      alert(
        err.message ||
          "Something went wrong while generating the course."
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!isLoaded || pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading course...</p>
      </div>
    );
  }

  // Authentication state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Please sign in to view this course.</p>

        <Button
          type="button"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="text-xl font-bold text-red-600">
          Unable to load course
        </h2>

        <p className="text-center">{error}</p>

        <Button type="button" onClick={Getcourse}>
          Try Again
        </Button>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="mt-10 px-7 md:px-20 lg:px-44">
      <h2 className="font-bold text-center text-2xl">
        Course Layout
      </h2>

      <LoadingDialog loading={loading} />

      <CourseBasicInfo
        course={course}
        refreshData={Getcourse}
      />

      <CourseDetail course={course} />

      <ChapterList
        course={course}
        refreshData={Getcourse}
      />

      <div className="flex justify-center">
        <Button
          type="button"
          onClick={GeneraterChapterContent}
          disabled={loading || !course}
          className="my-10"
        >
          {loading
            ? "Generating Course Content..."
            : "Generate Course Content"}
        </Button>
      </div>
    </div>
  );
}

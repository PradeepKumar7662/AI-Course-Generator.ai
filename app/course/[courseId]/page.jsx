
"use client";

import Header from "@/app/_components/Header";
import ChapterList from "@/app/create-course/[courseId]/components/ChapterList";
import CourseBasicInfo from "@/app/create-course/[courseId]/components/CourseBasicInfo";
import CourseDetail from "@/app/create-course/[courseId]/components/CourseDetail";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

export default function Course() {
  const { user, isLoaded } = useUser();
  const params = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const courseId = params?.courseId;

  useEffect(() => {
    if (!isLoaded) return;

    if (!user?.id) {
      setError("Please sign in to view this course.");
      setLoading(false);
      return;
    }

    if (!courseId) {
      setError("Course ID is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function getCourse() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/course/${courseId}`,
          { cache: "no-store" }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              (response.status === 404
                ? "Course not found."
                : "Unable to load course.")
          );
        }

        // Supports both API response formats.
        const courseData = data?.course ?? data;

        if (!courseData?.courseId) {
          throw new Error(
            "Course data is missing or has an unexpected format."
          );
        }

        if (!cancelled) {
          setCourse(courseData);
        }
      } catch (err) {
        console.error("Get course error:", err);

        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getCourse();

    return () => {
      cancelled = true;
    };
  }, [courseId, user?.id, isLoaded]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="px-5 py-10 md:px-20 lg:px-44">
        {loading ? (
          <p className="text-center text-gray-600">
            Loading course...
          </p>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-600">
            <h2 className="font-semibold">
              Unable to load course
            </h2>
            <p className="mt-2">{error}</p>
          </div>
        ) : course ? (
          <>
            <CourseBasicInfo course={course} edit={false} />
            <CourseDetail course={course} />
            <ChapterList course={course} edit={false} />
          </>
        ) : (
          <p className="text-center text-gray-600">
            Course not found.
          </p>
        )}
      </main>
    </div>
  );
}


"use client";

import { useUser } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CourseBasicInfo from "./components/CourseBasicInfo";
import CourseDetail from "./components/CourseDetail";
import ChapterList from "./components/ChapterList";

import { Button } from "@/components/ui/button";

export default function CourseLayout() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const router = useRouter();

  const courseId = params?.courseId;

  const [course, setCourse] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
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

      <CourseBasicInfo
        course={course}
        refreshData={Getcourse}
      />

      <CourseDetail course={course} />

      <ChapterList
        course={course}
        refreshData={Getcourse}
      />
    </div>
  );
}

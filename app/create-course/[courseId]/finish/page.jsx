
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CourseBasicInfo from "../components/CourseBasicInfo";
import { HiClipboardDocumentCheck } from "react-icons/hi2";

function FinishScreen({ params }) {
  const { user, isLoaded } = useUser();

  const [course, setCourse] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !user || !params?.courseId) {
      return;
    }

    const getCourse = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/course/${params.courseId}`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to fetch course"
          );
        }

        setCourse(result.course);

      } catch (error) {
        console.error("Get Course Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getCourse();
  }, [params?.courseId, user, isLoaded]);

  const copyCourseUrl = async () => {
    if (!course?.courseId) return;

    const courseUrl =
      `${process.env.NEXT_PUBLIC_HOST_NAME}/course/view/${course.courseId}`;

    try {
      await navigator.clipboard.writeText(courseUrl);
    } catch (error) {
      console.error("Copy URL Error:", error);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center mt-10">
        Unable to load course. Please try again.
      </div>
    );
  }

  return (
    <div className="px-10 md:px-20 lg:px-44 my-7">

      <h2 className="text-center font-bold text-2xl my-3 text-purple-600">
        Congrats! Your Course Ready.
      </h2>

      <CourseBasicInfo
        course={course}
        refreshData={() => {}}
      />

      <h2 className="mt-3 gap-4">
        Course URL!
      </h2>

      <h2 className="text-center text-gray-500 border p-2 rounded flex gap-5 items-center">
        {process.env.NEXT_PUBLIC_HOST_NAME}/course/view/
        {course.courseId}

        <HiClipboardDocumentCheck
          className="h-6 w-6 cursor-pointer"
          onClick={copyCourseUrl}
        />
      </h2>

    </div>
  );
}

export default FinishScreen;

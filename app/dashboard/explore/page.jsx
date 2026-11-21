
"use client";

import React, { useEffect, useState } from "react";
import CourseCard from "../_components/CourseCard";
import { Button } from "@/components/ui/button";

const Explore = () => {
  const [courseList, setCourseList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const getAllCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/explore?page=${pageIndex}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        console.log("Explore API response:", result);

        if (!response.ok) {
          throw new Error(
            result.error || "Courses fetch nahi ho paaye."
          );
        }

        if (!Array.isArray(result.courses)) {
          throw new Error(
            "Courses array missing hai. API route check karo."
          );
        }

        setCourseList(result.courses);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Explore error:", err);
          setError(err.message || "Something went wrong.");
          setCourseList([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    getAllCourse();

    return () => controller.abort();
  }, [pageIndex]);

  return (
    <div>
      <h2 className="font-bold text-3xl">
        Explore More Projects!
      </h2>

  <p>
  Explore your AI-generated courses and continue learning with{" "}
  <span className="font-bold text-purple-800">AI</span>.
</p>

      {loading && (
        <p className="mt-5">Loading courses...</p>
      )}

      {error && (
        <p className="mt-5 text-red-500">{error}</p>
      )}

      {!loading && !error && courseList.length === 0 && (
        <p className="mt-5">No courses found on this page.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {courseList.map((course, index) => (
          <div key={course.courseId || course.id || index}>
            <CourseCard
              course={course}
              displayUser={true}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-5">
        {pageIndex > 0 ? (
          <Button
            onClick={() => setPageIndex((prev) => prev - 1)}
            disabled={loading}
          >
            Previous Page
          </Button>
        ) : (
          <div />
        )}

        <Button
          onClick={() => setPageIndex((prev) => prev + 1)}
          disabled={loading || courseList.length < 9}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default Explore;

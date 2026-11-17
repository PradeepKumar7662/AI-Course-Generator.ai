
"use client";

import { useUser } from "@clerk/nextjs";
import React, { useContext, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { UserCourseListContext } from "@/app/_context/UserCourseListsContext";

function UserCourseList() {
  const { user, isLoaded } = useUser();

  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { setUserCourseList } = useContext(UserCourseListContext);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      setCourseList([]);
      setUserCourseList?.([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function getUserCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/courses", {
          method: "GET",
          cache: "no-store",
        });

     const data = await response.json();

if (!response.ok) {
  throw new Error(data.error || `Request failed: ${response.status}`);
}

const courses = Array.isArray(data)
  ? data
  : data?.courses;

if (!Array.isArray(courses)) {
  throw new Error("Invalid courses API response.");
}

if (!cancelled) {
  setCourseList(courses);
  setUserCourseList?.(courses);
}
      } catch (err) {
        console.error("Get user courses error:", err);

        if (!cancelled) {
          setError(err.message || "Courses load nahi ho paaye.");
          setCourseList([]);
          setUserCourseList?.([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getUserCourse();

    return () => {
      cancelled = true;
    };
  }, [user, isLoaded, setUserCourseList]);

  return (
    <div className="relative isolate mt-10 overflow-hidden rounded-3xl border border-indigo-100/80 bg-white/75 px-4 py-7 shadow-sm backdrop-blur-sm sm:px-6 sm:py-9 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.09) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 85%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-violet-200/30 blur-3xl"
      />

      <div className="mb-7 text-center sm:mb-9">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-indigo-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
          Your Learning Space
        </span>

        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          My{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            AI Courses
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
          Continue learning, explore your courses, and build new skills at your own pace.
        </p>

        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[320px] animate-pulse rounded-2xl border border-indigo-100 bg-white/80"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="font-semibold text-red-700">
            Unable to load your courses
          </p>
          <p className="mt-2 break-words text-sm text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : courseList.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 sm:gap-6">
          {courseList.map((course, index) => (
            <div
              key={course.courseId ?? index}
              className="min-w-0 transition-transform duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${Math.min(index * 100, 500)}ms` }}
            >
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-5 py-12 text-center">
          <p className="text-lg font-bold text-slate-800">
            No courses found yet
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Create your first AI course to see it here.
          </p>
        </div>
      )}
    </div>
  );
}

export default UserCourseList;

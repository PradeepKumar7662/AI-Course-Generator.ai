
"use client";

import React, { useContext, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserCourseListContext } from "@/app/_context/UserCourseListsContext";
import {
  FiPlus,
  FiArrowRight,
  FiBookOpen,
  FiStar,
} from "react-icons/fi";

function AddCourse() {
  const { user } = useUser();
  const { UserCourseList } = useContext(UserCourseListContext);
  const router = useRouter();

  const [checkingPlan, setCheckingPlan] = useState(false);

  const handleCreateCourse = async () => {
    if (checkingPlan) return;

    try {
      setCheckingPlan(true);

      const response = await fetch("/api/plan-status", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to check plan status");
      }

      if (!data.isPro && data.freeCoursesUsed >= data.freeCourseLimit) {
        router.push("/dashboard/upgrade");
        return;
      }

      router.push("/create-course");
    } catch (error) {
      console.error("Plan check error:", error);
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setCheckingPlan(false);
    }
  };

  return (
    <section className="relative isolate mb-8 overflow-hidden rounded-3xl border border-indigo-400/30 bg-gradient-to-r from-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-950/20 sm:p-7 lg:p-8">

      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-violet-300/30 blur-[100px]" />

        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-300/30 blur-[100px]" />

        <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-purple-300/20 blur-[100px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-900/20" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

        {/* Greeting */}
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
            <FiStar className="h-4 w-4" />
            AI-powered learning
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Hello,{" "}
            <span className="bg-gradient-to-r from-white via-indigo-100 to-violet-200 bg-clip-text text-transparent">
              {user?.firstName || user?.fullName || "Learner"}
            </span>
            <span className="ml-1 inline-block">👋</span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-indigo-50 sm:text-base">
            Turn your ideas into structured courses with AI.
            Learn something new and share your knowledge.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-indigo-100 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <FiBookOpen className="h-4 w-4 text-white" />
              Personalized courses
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-indigo-200 sm:block" />

            <span>Created just for you</span>
          </div>
        </div>

        {/* Create Course Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={handleCreateCourse}
            disabled={checkingPlan}
            className="group inline-flex w-full items-center justify-center rounded-2xl bg-white/30 p-[1px] shadow-lg shadow-indigo-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-white/50 hover:shadow-xl hover:shadow-indigo-950/25 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            <span className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 px-5 py-4 transition-all duration-300 group-hover:from-indigo-600 group-hover:via-violet-600 group-hover:to-indigo-600 sm:px-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                <FiPlus className="h-6 w-6" />
              </span>

              <span className="flex flex-col items-start">
                <span className="text-sm font-bold tracking-wide sm:text-base">
                  {checkingPlan ? "Checking Plan..." : "Create AI Course"}
                </span>

                <span className="mt-1 text-xs font-medium text-indigo-100">
                  Generate a course with AI
                </span>
              </span>

              <FiArrowRight className="ml-2 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default AddCourse;

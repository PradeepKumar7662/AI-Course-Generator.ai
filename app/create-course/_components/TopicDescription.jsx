
"use client";

import { UserInputContext } from "@/app/_context/UserInputContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext } from "react";
import { BookOpen, Sparkles, FileText } from "lucide-react";

function TopicDescription() {
  const { userCourseInput, setUserCourseInput } =
    useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-7 mt-6 text-center sm:mb-9">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          <span>Personalize Your Course</span>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Let&apos;s Build Your{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Dream Course
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Tell us what you want to learn, and we&apos;ll help create a
          course tailored to your goals.
        </p>
      </div>

      {/* Form Card */}
      <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 sm:p-7 md:p-8">
        {/* Topic Input */}
        <div className="mb-7">
          <label
            htmlFor="course-topic"
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition-transform duration-300 group-hover:scale-105">
              <BookOpen className="h-5 w-5" />
            </span>
            What topic would you like to create a course about?
          </label>

          <Input
            id="course-topic"
            placeholder="e.g. Python Programming, Yoga, Web Development"
            className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-sm transition-all duration-300 placeholder:text-slate-400 hover:border-violet-300 focus-visible:border-violet-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-violet-100 sm:h-14 sm:text-base"
            value={userCourseInput?.topic ?? ""}
            onChange={(e) =>
              handleInputChange("topic", e.target.value)
            }
          />

          <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
            Choose a clear topic for the course you want to generate.
          </p>
        </div>

        {/* Course Description */}
        <div>
          <label
            htmlFor="course-description"
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800 sm:text-base"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition-transform duration-300 group-hover:scale-105">
              <FileText className="h-5 w-5" />
            </span>
            What would you like to learn in this course?
            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
              Optional
            </span>
          </label>

          <Textarea
            id="course-description"
            placeholder="Describe the topics, skills, or concepts you want to include in your course..."
            className="min-h-32 resize-y rounded-xl border-slate-200 bg-slate-50/50 px-4 py-3 text-sm leading-6 transition-all duration-300 placeholder:text-slate-400 hover:border-violet-300 focus-visible:border-violet-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-violet-100 sm:min-h-36 sm:text-base"
            value={userCourseInput?.description ?? ""}
            onChange={(e) =>
              handleInputChange("description", e.target.value)
            }
          />

          <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
            Add your learning goals or specific topics to make the
            generated course more relevant.
          </p>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-indigo-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <p className="text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-800">
            Pro tip:
          </span>{" "}
          Be specific about your topic and learning goals to get a
          more useful course outline.
        </p>
      </div>
    </div>
  );
}

export default TopicDescription;

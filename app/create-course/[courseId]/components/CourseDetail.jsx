
"use client";

import React from "react";
import {
  TrendingUp,
  Clock3,
  BookOpen,
  Video,
} from "lucide-react";

function CourseDetail({ course }) {
  const output = course?.courseOutput;

  const chapters =
    output?.Chapters ??
    output?.chapters ??
    [];

  const details = [
    {
      title: "Skill Level",
      value: course?.level || output?.Level || output?.level || "Beginner",
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Duration",
      value: output?.Duration || output?.duration || "N/A",
      icon: Clock3,
      color: "blue",
    },
    {
      title: "Total Chapters",
      value:
        output?.["NoOf Chapter"] ??
        output?.noOfChapters ??
        (Array.isArray(chapters) ? chapters.length : 0),
      icon: BookOpen,
      color: "violet",
    },
    {
      title: "Video Lessons",
      value:
        course?.includeVideo ??
        output?.["Video Including"] ??
        output?.includeVideo ??
        "N/A",
      icon: Video,
      color: "rose",
    },
  ];

  const themes = {
    emerald: {
      icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
      line: "bg-emerald-500",
    },
    blue: {
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
      line: "bg-blue-500",
    },
    violet: {
      icon: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
      line: "bg-violet-500",
    },
    rose: {
      icon: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
      line: "bg-rose-500",
    },
  };

  return (
    <section className="mt-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {details.map((item, index) => {
          const Icon = item.icon;
          const theme = themes[item.color];

          return (
            <div
              key={item.title}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg sm:p-5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${theme.icon}`}
                >
                  <Icon size={21} strokeWidth={2} />
                </div>

                <p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                  {item.title}
                </p>
              </div>

              <h2 className="mt-4 break-words text-base font-bold leading-snug text-slate-900 sm:text-lg dark:text-white">
                {item.value}
              </h2>

              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full w-1/3 rounded-full transition-all duration-500 group-hover:w-full ${theme.line}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CourseDetail;

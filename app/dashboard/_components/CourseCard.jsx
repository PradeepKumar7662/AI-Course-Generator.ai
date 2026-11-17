
"use client";

import Image from "next/image";
import React from "react";
import { useUser } from "@clerk/nextjs";

import {
  IoBookOutline,
  IoEllipsisVertical,
} from "react-icons/io5";

import {
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import DropdownOption from "./DropdownOption";
import Link from "next/link";

function CourseCard({
  course,
  refreshData,
  displayUser = false,
}) {
  const { user } = useUser();

  const courseName =
    course?.courseOutput?.["Course Name"] ||
    course?.courseOutput?.courseName ||
    course?.name ||
    "Untitled Course";

  const chapters =
    course?.courseOutput?.["NoOf Chapter"] ??
    course?.courseOutput?.noOfChapters ??
    course?.courseOutput?.Chapters?.length ??
    course?.courseOutput?.chapters?.length ??
    0;

  const level =
    course?.level ||
    course?.courseOutput?.Level ||
    course?.courseOutput?.level ||
    "Beginner";

  // Only course owner can delete
  const currentEmail =
    user?.primaryEmailAddress?.emailAddress;

  const isOwner = Boolean(
    currentEmail &&
    course?.createdBy &&
    currentEmail.toLowerCase() ===
      course.createdBy.toLowerCase()
  );

  // Delete course API
  const handleOnDelete = async () => {
    const response = await fetch(
      `/api/courses/${course?.courseId}`,
      { method: "DELETE" }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.error || "Failed to delete course"
      );
    }

    if (refreshData) {
      refreshData();
    } else {
      window.location.reload();
    }
  };

  return (
    <article className="course-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-indigo-300 hover:shadow-[0_22px_45px_-18px_rgba(79,70,229,0.30)]">

      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

      {/* Course banner */}
      <Link
        href={`/course/${course?.courseId}`}
        aria-label={`Open ${courseName}`}
        className="relative block overflow-hidden bg-slate-100"
      >
        <div className="relative h-48 overflow-hidden sm:h-52">
          <Image
            src={course?.courseBanner || "/placeholder.png"}
            alt={courseName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/10 opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md">
            <Sparkles
              size={13}
              className="text-violet-600"
            />
            AI Generated
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <span className="rounded-lg border border-white/30 bg-black/25 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
              {course?.category || "Learning"}
            </span>

            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-800 shadow-md transition-all duration-300 group-hover:rotate-45 group-hover:bg-purple-600 group-hover:text-white">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </Link>

      {/* Three dot Delete menu */}
      {isOwner && (
        <div className="absolute right-3 top-3 z-30">
          <DropdownOption
            handleOnDelete={handleOnDelete}
          >
            <button
              type="button"
              aria-label="Course options"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/95 text-slate-700 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              <IoEllipsisVertical size={21} />
            </button>
          </DropdownOption>
        </div>
      )}

      {/* Course details */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">

        {/* Course title */}
        <Link
          href={`/course/${course?.courseId}`}
          className="block min-w-0"
        >
          <h3 className="line-clamp-2 break-words text-base font-bold leading-6 text-slate-900 transition-colors duration-200 group-hover:text-indigo-700 sm:text-lg">
            {courseName}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500">
          {course?.courseOutput?.Description ||
            course?.courseOutput?.description ||
            "Explore concepts, learn practical skills, and progress at your own pace."}
        </p>

        {/* Course metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
            <IoBookOutline size={15} />
            {chapters} Chapters
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-2.5 py-1.5 text-xs font-semibold text-violet-700">
            <Sparkles size={13} />
            {level}
          </span>
        </div>

        {/* Creator information */}
        {displayUser && (
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-violet-100">
              <Image
                src={
                  course?.userProfileImage ||
                  "/default-avatar.png"
                }
                alt={`${course?.userName || "Course creator"} profile`}
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">
                CREATED BY
              </p>

              <p className="truncate text-sm font-bold text-slate-800">
                {course?.userName || "Course Creator"}
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              Creator
            </span>
          </div>
        )}

        {/* Bottom action */}
        <div className="mt-auto pt-4">
          <Link
            href={`/course/${course?.courseId}`}
            className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-200/50 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
          >
            View Course

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

      </div>
    </article>
  );
}

export default CourseCard;

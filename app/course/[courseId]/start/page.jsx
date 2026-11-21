
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  FaBars,
  FaBookOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

import ChapterListCard from "./_components/ChapterListCard";
import ChapterContent from "./_components/ChapterContent";

export default function CourseStart() {
  const params = useParams();
  const courseId = params?.courseId;

  const [course, setCourse] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const chapters =
    course?.courseOutput?.Chapters ??
    course?.courseOutput?.chapters ??
    [];

  const courseName =
    course?.courseOutput?.["Course Name"] ??
    course?.courseOutput?.courseName ??
    course?.name ??
    "My Learning Course";

  const getSelectedChapterContent = useCallback(
    async (chapterIndex) => {
      if (!courseId) return;

      try {
        setContentLoading(true);
        setError("");
        setChapterContent(null);

        const url = `/api/course/${courseId}/chapter/${chapterIndex}`;

        let response = await fetch(url, {
          method: "GET",
          cache: "no-store",
        });

        let data = await response.json();

        if (!response.ok && response.status !== 404) {
          throw new Error(
            data?.error || "Unable to load chapter content."
          );
        }

        const isValidVideoId = (value) =>
          typeof value === "string" &&
          /^[a-zA-Z0-9_-]{11}$/.test(value);

        const videoId = data?.videoId || data?.content?.videoId;

        // Generate content if it does not exist.
        // Repair missing video ID if the POST route supports it.
        if (response.status === 404 || !isValidVideoId(videoId)) {
          response = await fetch(url, {
            method: "POST",
            cache: "no-store",
          });

          data = await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error || "Unable to generate chapter content."
            );
          }
        }

        setChapterContent(data);
      } catch (err) {
        console.error("Chapter content error:", err);
        setChapterContent(null);
        setError(err.message || "Unable to load chapter content.");
      } finally {
        setContentLoading(false);
      }
    },
    [courseId]
  );

  useEffect(() => {
    if (!courseId) return;

    let cancelled = false;

    async function loadCourse() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/course/${courseId}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load course.");
        }

        const courseData = data.course ?? data;

        if (cancelled) return;

        setCourse(courseData);

        const courseChapters =
          courseData?.courseOutput?.Chapters ??
          courseData?.courseOutput?.chapters ??
          [];

        if (!courseChapters.length) {
          setError("No chapters found for this course.");
          return;
        }

        setSelectedIndex(0);
        setSelectedChapter(courseChapters[0]);
      } catch (err) {
        if (!cancelled) {
          console.error("Course loading error:", err);
          setError(err.message || "Unable to load course.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCourse();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  useEffect(() => {
    if (!loading && selectedChapter && courseId) {
      getSelectedChapterContent(selectedIndex);
    }
  }, [
    loading,
    selectedChapter,
    selectedIndex,
    courseId,
    getSelectedChapterContent,
  ]);

  useEffect(() => {
    if (!sidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [sidebarOpen]);

  const selectChapter = (chapter, index) => {
    setSelectedIndex(index);
    setSelectedChapter(chapter);
    setSidebarOpen(false);
  };

  const goToPrevious = () => {
    if (selectedIndex > 0) {
      selectChapter(chapters[selectedIndex - 1], selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex < chapters.length - 1) {
      selectChapter(chapters[selectedIndex + 1], selectedIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          <p className="mt-4 font-medium text-slate-700">
            Loading your course...
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Getting your learning materials ready
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border bg-white p-6 text-center shadow-sm">
          <FaBookOpen className="mx-auto text-4xl text-purple-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Course unavailable
          </h2>
          <p className="mt-2 text-sm text-red-500">
            {error || "Unable to load this course."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const sidebar = (
    <>
      <div className="border-b border-slate-200 bg-white p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <FaBookOpen className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
              Learning Space
            </p>
            <h2 className="mt-1 break-words text-sm font-bold text-slate-800">
              {courseName}
            </h2>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
          <span>Course chapters</span>
          <span className="font-semibold text-slate-700">
            {chapters.length} chapters
          </span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width: `${
                chapters.length
                  ? ((selectedIndex + 1) / chapters.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-slate-500">
          Chapter {selectedIndex + 1} of {chapters.length}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          Course content
        </p>

        {chapters.map((chapter, index) => {
          const active = selectedIndex === index;

          return (
            <button
              key={chapter?.chapterId ?? index}
              type="button"
              onClick={() => selectChapter(chapter, index)}
              aria-current={active ? "step" : undefined}
              className={`mb-2 w-full rounded-xl border text-left transition ${
                active
                  ? "border-purple-200 bg-purple-50 shadow-sm"
                  : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-start gap-3 p-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                    active
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {active ? (
                    <FaBookOpen />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className={`break-words text-sm font-semibold ${
                      active ? "text-purple-800" : "text-slate-700"
                    }`}
                  >
                    {chapter?.chapterName ||
                      chapter?.["Chapter Name"] ||
                      chapter?.title ||
                      chapter?.name ||
                      `Chapter ${index + 1}`}
                  </p>

                  {chapter?.duration && (
                    <p className="mt-1 text-xs text-slate-500">
                      {chapter.duration}
                    </p>
                  )}
                </div>

                {active && (
                  <FaCheckCircle className="mt-1 shrink-0 text-purple-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-slate-200 bg-white p-4">
        <p className="text-center text-xs text-slate-500">
          Learn at your own pace
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-80 flex-col border-r border-slate-200 bg-white md:flex">
        {sidebar}
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open chapter list"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700"
          >
            <FaBars />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold">{courseName}</h1>
            <p className="mt-1 text-xs text-slate-500">
              Chapter {selectedIndex + 1} of {chapters.length}
            </p>
          </div>
        </div>
      </header>

      {/* Mobile chapter drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close chapter list"
            onClick={() => setSidebarOpen(false)}
            className="absolute inset-0 h-full w-full bg-slate-950/50"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(86vw,340px)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <span className="font-bold text-slate-800">
                Course chapters
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100"
              >
                <FaTimes />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main learning area */}
      <main className="min-w-0 md:ml-80">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
          {/* Desktop course header */}
          <div className="mb-6 hidden items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                Your learning journey
              </p>
              <h1 className="mt-1 break-words text-xl font-bold text-slate-900">
                {courseName}
              </h1>
            </div>

            <div className="shrink-0 rounded-xl bg-purple-50 px-4 py-3 text-right">
              <p className="text-lg font-bold text-purple-700">
                {selectedIndex + 1}/{chapters.length}
              </p>
              <p className="text-xs text-slate-500">Current chapter</p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
              <button
                type="button"
                onClick={() => getSelectedChapterContent(selectedIndex)}
                className="ml-2 font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Chapter title */}
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <FaBookOpen className="text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                  Chapter {selectedIndex + 1}
                </p>
                <h2 className="mt-1 break-words text-lg font-bold leading-snug text-slate-900 sm:text-2xl">
                  {selectedChapter?.chapterName ||
                    selectedChapter?.["Chapter Name"] ||
                    selectedChapter?.title ||
                    selectedChapter?.name ||
                    `Chapter ${selectedIndex + 1}`}
                </h2>
                {selectedChapter?.duration && (
                  <p className="mt-2 text-sm text-slate-500">
                    {selectedChapter.duration}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Loading content */}
          {contentLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
              <p className="mt-4 text-center font-semibold text-slate-700">
                Preparing your chapter...
              </p>
              <p className="mt-1 text-center text-sm text-slate-500">
                Your learning content is loading
              </p>
              <div className="mx-auto mt-6 max-w-xl animate-pulse space-y-3">
                <div className="h-4 rounded bg-slate-100" />
                <div className="h-4 w-5/6 rounded bg-slate-100" />
                <div className="h-4 w-4/6 rounded bg-slate-100" />
              </div>
            </div>
          ) : chapterContent ? (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm [&_iframe]:max-w-full [&_img]:max-w-full">
              <div className="p-4 sm:p-6 lg:p-8">
                <ChapterContent
                  chapter={selectedChapter}
                  content={chapterContent}
                />
              </div>
            </div>
          ) : !error ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <FaBookOpen className="mx-auto text-3xl text-slate-300" />
              <p className="mt-3 font-medium text-slate-700">
                Select a chapter to start learning.
              </p>
            </div>
          ) : null}

          {/* Previous / Next chapter */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={selectedIndex === 0 || contentLoading}
              onClick={goToPrevious}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 sm:text-sm">
              {selectedIndex + 1} of {chapters.length}
            </span>

            <button
              type="button"
              disabled={
                selectedIndex >= chapters.length - 1 || contentLoading
              }
              onClick={goToNext}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
            >
              <span>Next chapter</span>
              <FaChevronRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

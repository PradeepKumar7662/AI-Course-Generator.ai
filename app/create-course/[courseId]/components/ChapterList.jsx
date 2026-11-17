
"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuClock } from "react-icons/lu";

import {
  BookOpen,
  ArrowUpRight,
  Sparkles,
  GraduationCap,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import EditChapters from "./EditChapters";

// ---------------------------------------------
// Helper: Format chapter content
// ---------------------------------------------

function ChapterContent({ data }) {
  if (data === null || data === undefined) return null;

  // Parse JSON string if necessary
  if (typeof data === "string") {
    const trimmed = data.trim();

    if (
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    ) {
      try {
        return <ChapterContent data={JSON.parse(trimmed)} />;
      } catch {
        // Display as normal text if not valid JSON
      }
    }

    return (
      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">
        {data}
      </p>
    );
  }

  if (typeof data === "number") {
    return <p className="text-sm leading-7">{data}</p>;
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <ChapterContent data={item} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === "object") {
    const ignoredKeys = [
      "id",
      "chapterId",
      "courseId",
      "videoId",
    ];

    return (
      <div className="space-y-5">
        {Object.entries(data)
          .filter(
            ([key, value]) =>
              !ignoredKeys.includes(key) &&
              value !== null &&
              value !== undefined
          )
          .map(([key, value]) => {
            const heading = key
              .replace(/([A-Z])/g, " $1")
              .replace(/[_-]/g, " ")
              .replace(/^\w/, (letter) => letter.toUpperCase());

            const isCode = /code|program|syntax/i.test(key);

            const isHeading = /title|heading|topic|name/i.test(key);

            const isList =
              Array.isArray(value) &&
              /point|list|objective|benefit|step|concept/i.test(key);

            return (
              <div key={key}>
                {isHeading && typeof value === "string" ? (
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    {value}
                  </h3>
                ) : (
                  <div>
                    <h4 className="mb-2 text-sm font-bold text-violet-700 dark:text-violet-300">
                      {heading}
                    </h4>

                    {isCode && typeof value === "string" ? (
                      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6 text-green-300">
                        <code>{value}</code>
                      </pre>
                    ) : isList ? (
                      <ul className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-700 dark:text-slate-300">
                        {value.map((item, index) => (
                          <li key={index}>
                            <ChapterContent data={item} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ChapterContent data={value} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    );
  }

  return null;
}

// ---------------------------------------------
// Main Chapter List Component
// ---------------------------------------------

function ChapterList({ course, refreshData, edit = true }) {
  const listRef = useRef(null);
  const requestIdRef = useRef(0);

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState(null);
  const [videoId, setVideoId] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const chapters =
    course?.courseOutput?.Chapters ??
    course?.courseOutput?.chapters ??
    [];

  const colors = [
    "from-violet-500 to-indigo-500",
    "from-sky-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
    "from-fuchsia-500 to-purple-500",
    "from-teal-500 to-emerald-500",
  ];

  // ---------------------------------------------
  // Chapter card animation
  // ---------------------------------------------

  useEffect(() => {
    const container = listRef.current;

    if (!container) return;

    const cards = container.querySelectorAll(".chapter-reveal");

    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) =>
        card.classList.add("chapter-visible")
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("chapter-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [chapters.length]);

  // ---------------------------------------------
  // Modal keyboard and scrolling
  // ---------------------------------------------

  useEffect(() => {
    if (!selectedChapter) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowRight") {
        changeChapter(1);
      }

      if (event.key === "ArrowLeft") {
        changeChapter(-1);
      }
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedChapter]);

  // ---------------------------------------------
  // Close Modal
  // ---------------------------------------------

  function closeModal() {
    requestIdRef.current += 1;

    setSelectedChapter(null);
    setChapterContent(null);
    setVideoId("");
    setModalError("");
    setModalLoading(false);
  }

  // ---------------------------------------------
  // Load chapter content from API
  // GET first, POST if chapter is missing
  // ---------------------------------------------

 
async function openChapter(chapter, index) {
  const requestId = ++requestIdRef.current;

  setSelectedChapter({ chapter, index });
  setChapterContent(null);
  setVideoId("");
  setModalError("");
  setModalLoading(true);

  try {
    const inlineContent =
      chapter?.content ?? chapter?.chapterContent;

    if (inlineContent) {
      setChapterContent(inlineContent);
      setModalLoading(false);
      return;
    }

    if (!course?.courseId) {
      throw new Error("Course ID is missing.");
    }

    const apiUrl = `/api/course/${encodeURIComponent(
      course.courseId
    )}/chapter/${index}`;

    // GET existing chapter
    let response = await fetch(apiUrl, {
      method: "GET",
      cache: "no-store",
    });

    let rawResponse = await response.text();

    // If chapter does not exist, generate it using POST
    if (response.status === 404) {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      rawResponse = await response.text();
    }

    if (requestId !== requestIdRef.current) return;

    // Safely parse API response
    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      console.error("Non-JSON API response:", {
        status: response.status,
        url: apiUrl,
        response: rawResponse.slice(0, 1000),
      });

      throw new Error(
        `API returned invalid JSON. HTTP ${response.status}. Check browser Console and Network tab.`
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data?.details ||
        `API request failed: ${response.status}`
      );
    }

    const content =
      data?.content ??
      data?.chapter?.content ??
      data?.chapterContent ??
      data?.data?.content;

    if (!content) {
      throw new Error("Chapter content is empty.");
    }

    setChapterContent(content);

    setVideoId(
      /^[a-zA-Z0-9_-]{11}$/.test(data?.videoId || "")
        ? data.videoId
        : ""
    );

  } catch (error) {
    console.error("Chapter loading error:", error);

    if (requestId === requestIdRef.current) {
      setModalError(
        error?.message || "Something went wrong."
      );
    }
  } finally {
    if (requestId === requestIdRef.current) {
      setModalLoading(false);
    }
  }
}


  // ---------------------------------------------
  // Previous / Next Chapter
  // ---------------------------------------------

  function changeChapter(direction) {
    if (!selectedChapter) return;

    const nextIndex = selectedChapter.index + direction;

    if (nextIndex < 0 || nextIndex >= chapters.length) {
      return;
    }

    openChapter(chapters[nextIndex], nextIndex);
  }

  // ---------------------------------------------
  // Chapter Name Helper
  // ---------------------------------------------

  function getChapterName(chapter, index) {
    return (
      chapter?.["Chapter Name"] ||
      chapter?.chapterName ||
      chapter?.title ||
      chapter?.name ||
      `Chapter ${index + 1}`
    );
  }

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <section className="mt-10 pb-10">

      {/* Heading */}

      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">
            <Sparkles size={16} />
            YOUR LEARNING JOURNEY
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Course Curriculum
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Explore each lesson and build your knowledge step by step.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-violet-100 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
            <BookOpen size={20} />
          </div>

          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              {chapters.length}
            </p>

            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total lessons
            </p>
          </div>
        </div>
      </div>

      {/* Chapter Cards */}

      <div ref={listRef} className="space-y-4">
        {chapters.map((chapter, index) => {
          const chapterName = getChapterName(chapter, index);

          const description =
            chapter?.about ||
            chapter?.description ||
            chapter?.["Description"] ||
            "Explore the key concepts and practical examples in this lesson.";

          const duration =
            chapter?.Duration ||
            chapter?.duration ||
            chapter?.["Chapter Duration"] ||
            "";

          const gradient = colors[index % colors.length];

          return (
            <article
              key={chapter?.chapterId ?? index}
              role="button"
              tabIndex={0}
              onClick={() => openChapter(chapter, index)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  openChapter(chapter, index);
                }
              }}
              className="chapter-reveal group relative cursor-pointer translate-y-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 opacity-0 shadow-sm transition-all duration-700 ease-out hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-violet-500 sm:p-5 dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-extrabold text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14`}
                >
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-violet-700 sm:text-lg dark:text-white dark:group-hover:text-violet-300">
                      {chapterName}
                    </h3>

                    {edit && (
                      <div
                        className="shrink-0"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                        onKeyDown={(event) =>
                          event.stopPropagation()
                        }
                      >
                        <EditChapters
                          course={course}
                          index={index}
                          refreshData={refreshData}
                        />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {duration && (
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                        <LuClock size={14} />
                        {duration}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
                      <GraduationCap size={15} />
                      Lesson {index + 1}
                    </span>

                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                      Click to read →
                    </span>
                  </div>
                </div>

                <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-violet-100 group-hover:text-violet-600 sm:flex dark:bg-slate-900 dark:group-hover:bg-violet-950">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${gradient} transition-all duration-500 group-hover:w-full`}
              />
            </article>
          );
        })}

        {chapters.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <BookOpen className="mx-auto h-14 w-14 rounded-full bg-violet-100 p-3 text-violet-600 dark:bg-violet-950 dark:text-violet-300" />

            <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
              No chapters available
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Your course chapters will appear here once they are added.
            </p>
          </div>
        )}
      </div>

      {/* Chapter Content Modal */}

      {selectedChapter && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="relative flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-[90vh] sm:max-w-3xl sm:rounded-3xl dark:bg-slate-950">

            {/* Modal Header */}

            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:px-7 dark:border-slate-800 dark:bg-slate-950">
              <div className="min-w-0">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Lesson {selectedChapter.index + 1} of {chapters.length}
                </span>

                <h2 className="mt-1 truncate text-lg font-extrabold text-slate-900 sm:text-xl dark:text-white">
                  {getChapterName(
                    selectedChapter.chapter,
                    selectedChapter.index
                  )}
                </h2>
              </div>

              <button
                onClick={closeModal}
                aria-label="Close chapter"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-red-100 hover:text-red-600 dark:bg-slate-900 dark:text-slate-300"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal Body */}

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-7 sm:py-8">

              {modalLoading ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-violet-600" />

                  <p className="text-sm font-medium text-slate-500">
                    Loading / Generating chapter content...
                  </p>

                  <p className="text-xs text-slate-400">
                    Please wait while AI prepares your lesson.
                  </p>
                </div>
              ) : modalError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950/30">
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    Unable to load chapter
                  </p>

                  <p className="mt-2 break-words text-sm text-red-600 dark:text-red-400">
                    {modalError}
                  </p>

                  <button
                    onClick={() =>
                      openChapter(
                        selectedChapter.chapter,
                        selectedChapter.index
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    <RefreshCw size={15} />
                    Try Again
                  </button>
                </div>
              ) : chapterContent ? (
                <div className="space-y-7">

                  <ChapterContent data={chapterContent} />

                  {/* YouTube Video */}

                  {videoId && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Related Video Tutorial
                      </h3>

                      <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title="Chapter Video Tutorial"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <p className="text-center text-slate-500">
                  No chapter content available.
                </p>
              )}
            </div>

            {/* Modal Footer */}

            <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-3 sm:px-7 dark:border-slate-800 dark:bg-slate-950">

              <button
                disabled={selectedChapter.index === 0}
                onClick={() => changeChapter(-1)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                onClick={closeModal}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Close
              </button>

              <button
                disabled={
                  selectedChapter.index === chapters.length - 1
                }
                onClick={() => changeChapter(1)}
                className="inline-flex items-center gap-1 rounded-xl border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-violet-900 dark:text-violet-300 dark:hover:bg-violet-950"
              >
                Next
                <ChevronRight size={17} />
              </button>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ChapterList;

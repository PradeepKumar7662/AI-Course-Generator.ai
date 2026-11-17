
"use client";

import React from "react";
import YouTube from "react-youtube";
import ReactMarkdown from "react-markdown";

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="mb-4 mt-8 text-3xl font-extrabold tracking-tight text-slate-900">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-3 mt-7 border-b border-violet-100 pb-2 text-2xl font-bold text-slate-800">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-5 text-xl font-bold text-violet-800">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-[15px] leading-8 text-slate-600">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="my-4 space-y-3 pl-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 list-decimal space-y-3 pl-6 marker:font-bold marker:text-violet-600">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="flex items-start gap-3 text-[15px] leading-7 text-slate-600 [&>p]:mb-0">
      <span className="mt-[10px] h-2 w-2 shrink-0 rounded-full bg-violet-500" />
      <span className="min-w-0 flex-1">{children}</span>
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-slate-900">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-xl border-l-4 border-violet-500 bg-violet-50 px-5 py-4 text-slate-700">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => (
    <code
      className={`rounded-md bg-slate-100 px-1.5 py-1 font-mono text-sm text-violet-700 ${
        className || ""
      }`}
    >
      {children}
    </code>
  ),
};

function ChapterContent({ chapter, content }) {
  let chapterContent = content;

  if (typeof chapterContent === "string") {
    try {
      chapterContent = JSON.parse(chapterContent);
    } catch {
      chapterContent = null;
    }
  }

  if (
    chapterContent?.content &&
    typeof chapterContent.content === "object"
  ) {
    chapterContent = chapterContent.content;
  }

  const chapterName =
    chapter?.chapterName ??
    chapter?.["Chapter Name"] ??
    chapter?.title ??
    chapterContent?.title ??
    "Chapter";

  const videoId =
    content?.videoId ||
    chapterContent?.videoId ||
    chapter?.videoId ||
    "";

  const description = chapterContent?.description;
  const keyPoints = Array.isArray(chapterContent?.key_points)
    ? chapterContent.key_points
    : [];

  const hasContent =
    chapterContent &&
    typeof chapterContent === "object" &&
    (description ||
      chapterContent.title ||
      keyPoints.length > 0 ||
      chapterContent.code_example ||
      chapterContent.summary);

  return (
    <div className="chapter-page mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-10">
      {/* Chapter heading */}
      <header className="chapter-animate relative mb-8 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-6 shadow-sm sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-500" />
            Learning Chapter
          </div>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {chapterName}
          </h2>

          {chapter?.about && (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              {chapter.about}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-lg bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-700">
              📘 Study Material
            </span>
            {videoId && (
              <span className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                ▶ Video Lesson
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Video player */}
      {videoId && (
        <section
          className="chapter-animate mb-8"
          style={{ animationDelay: "100ms" }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-lg">
              ▶
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Watch & Learn
              </h3>
              <p className="text-sm text-slate-500">
                Watch the lesson to understand the topic better.
              </p>
            </div>
          </div>

          <div className="video-card overflow-hidden rounded-2xl border border-slate-200 bg-black p-1 shadow-lg">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <YouTube
                videoId={videoId}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    autoplay: 0,
                    rel: 0,
                  },
                }}
                className="absolute inset-0 h-full w-full"
                iframeClassName="absolute inset-0 h-full w-full"
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Main description */}
{/* Premium Lesson Content */}
{description && (
  <section
    className="chapter-animate mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
    style={{ animationDelay: "160ms" }}
  >
    {/* Header */}
    <div className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-r from-violet-50 via-white to-indigo-50 px-5 py-6 sm:px-8">
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-violet-200/30 blur-2xl" />

      <div className="relative flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-200">
          📖
        </div>

        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
            Learn & Understand
          </p>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Lesson Content
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Explore the concepts in detail
          </p>
        </div>
      </div>
    </div>

    {/* Reading Area */}
    <div className="px-5 py-7 sm:px-9 sm:py-9">
      <div className="lesson-reading">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h2 className="mb-5 mt-9 border-b border-violet-100 pb-3 text-2xl font-extrabold leading-tight text-slate-900 first:mt-0 sm:text-3xl">
                {children}
              </h2>
            ),
            h2: ({ children }) => (
              <h3 className="mb-4 mt-8 flex items-start gap-3 text-xl font-bold leading-snug text-slate-900">
                <span className="mt-1 h-6 w-1 shrink-0 rounded-full bg-violet-500" />
                {children}
              </h3>
            ),
            h3: ({ children }) => (
              <h4 className="mb-3 mt-6 text-lg font-bold text-violet-800">
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className="mb-5 text-[15px] leading-8 text-slate-600 sm:text-base sm:leading-8">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="mb-6 mt-3 space-y-3">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-6 mt-3 list-decimal space-y-3 pl-6 marker:font-bold marker:text-violet-600">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-3 text-[15px] leading-7 text-slate-600">
                <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-violet-500" />
                <span className="min-w-0 flex-1">{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="rounded-sm font-bold text-slate-900 decoration-violet-300 underline-offset-4">
                {children}
              </strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-6 rounded-r-xl border-l-4 border-violet-500 bg-violet-50 px-5 py-4 text-slate-700">
                {children}
              </blockquote>
            ),
            pre: ({ children }) => (
              <pre className="my-6 overflow-x-auto rounded-xl border border-slate-700 bg-slate-950 p-5 text-sm leading-7 text-emerald-300 shadow-md">
                {children}
              </pre>
            ),
            code: ({ children, className }) => (
              <code
                className={`rounded-md bg-violet-50 px-1.5 py-1 font-mono text-sm text-violet-700 ${
                  className || ""
                }`}
              >
                {children}
              </code>
            ),
            hr: () => <hr className="my-8 border-slate-200" />,
          }}
        >
          {String(description)}
        </ReactMarkdown>
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:px-8">
      <p className="text-xs font-medium text-slate-500">
        ✨ Take your time, understand the concepts, and learn step by step.
      </p>
    </div>
  </section>
)}


      {/* Key points */}
      {keyPoints.length > 0 && (
        <section
          className="chapter-animate content-card mb-6 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-5 shadow-sm sm:p-7"
          style={{ animationDelay: "220ms" }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Key Points
              </h3>
              <p className="text-sm text-slate-500">
                Important things to remember.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {keyPoints.map((item, index) => {
              const text =
                typeof item === "string"
                  ? item
                  : item?.text || item?.point || JSON.stringify(item);

              return (
                <div
                  key={index}
                  className="point-card flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-sm leading-6 text-slate-700">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Code example */}
      {chapterContent?.code_example && (
        <section
          className="chapter-animate mb-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-lg"
          style={{ animationDelay: "280ms" }}
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <h3 className="font-semibold text-white">Code Example</h3>
            </div>
            <span className="text-xs text-slate-400">CODE</span>
          </div>

          <pre className="overflow-x-auto p-5 text-sm leading-7 text-emerald-300 sm:p-6">
            <code>{String(chapterContent.code_example)}</code>
          </pre>
        </section>
      )}

      {/* Summary */}
      {chapterContent?.summary && (
        <section
          className="chapter-animate content-card mb-6 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50/50 p-5 shadow-sm sm:p-7"
          style={{ animationDelay: "340ms" }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-xl">
              💡
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Quick Summary
              </h3>
              <p className="text-sm text-slate-600">
                Revise the main ideas.
              </p>
            </div>
          </div>

          <div className="chapter-markdown">
            <ReactMarkdown components={markdownComponents}>
              {String(chapterContent.summary)}
            </ReactMarkdown>
          </div>
        </section>
      )}

      {/* Empty state */}
      {!hasContent && (
        <div className="chapter-animate rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div className="mb-3 text-4xl">📚</div>
          <h3 className="text-lg font-bold text-slate-800">
            Chapter content is not available
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            The learning material for this chapter has not been generated yet.
          </p>
        </div>
      )}

      <style jsx>{`
        .chapter-animate {
          opacity: 0;
          animation: chapterEnter 650ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }

        @keyframes chapterEnter {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-card,
        .video-card,
        .point-card {
          transition:
            transform 250ms ease,
            box-shadow 250ms ease,
            border-color 250ms ease;
        }

        .content-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 35px rgba(15, 23, 42, 0.07);
          border-color: #ddd6fe;
        }

        .video-card:hover {
          box-shadow: 0 18px 40px rgba(124, 58, 237, 0.16);
        }

        .point-card:hover {
          transform: translateY(-2px);
          border-color: #6ee7b7;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          .chapter-animate {
            opacity: 1;
            animation: none;
            transform: none;
          }

          .content-card,
          .video-card,
          .point-card {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default ChapterContent;

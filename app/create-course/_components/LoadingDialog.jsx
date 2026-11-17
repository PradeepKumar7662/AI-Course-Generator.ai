
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Sparkles, BrainCircuit, BookOpen } from "lucide-react";

function LoadingDialog({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent
        className="
          w-[calc(100%-1.5rem)] max-w-[390px]
          max-h-[90dvh] overflow-y-auto overflow-x-hidden
          rounded-2xl border border-violet-200/70
          bg-white p-0 shadow-2xl shadow-violet-200/40
          [&>button]:hidden
        "
      >
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 px-4 pb-4 pt-5 text-center text-white sm:px-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 animate-pulse rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-24 w-24 rounded-full bg-fuchsia-300/20 blur-2xl" />

          <div className="relative mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl border border-white/25 bg-white/15 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-6 w-6 animate-pulse text-white" />
          </div>

          <AlertDialogHeader className="relative space-y-1 text-center">
            <AlertDialogTitle className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Creating Your Course
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs leading-5 text-violet-100 sm:text-sm">
              Our AI is preparing a personalized learning experience
              just for you.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        {/* Main Loading Section */}
        <div className="px-3 pb-4 pt-3 sm:px-5">
          <div className="relative overflow-hidden rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-3 py-3 text-center sm:px-4">

            {/* Animated rings */}
            <div className="relative mx-auto mb-2 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500 border-r-indigo-400" />

              <div className="absolute inset-2 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-dashed border-violet-200" />

              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white shadow-lg shadow-violet-100">
                <Image
                  src="/loader.gif"
                  alt="AI generating your course"
                  width={60}
                  height={60}
                  unoptimized
                  priority
                  className="h-16 w-16 object-contain"
                />
              </div>

              <Sparkles className="absolute right-0 top-2 h-4 w-4 animate-pulse text-violet-500" />
              <Sparkles className="absolute bottom-1 left-1 h-3.5 w-3.5 animate-pulse text-indigo-500" />
            </div>

            <h3 className="text-base font-bold text-slate-800 sm:text-lg">
              Please wait a moment...
            </h3>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-500 sm:text-sm">
              Generating course topics, chapters, and learning content.
            </p>

            {/* Progress bar */}
            <div
              className="mt-4 h-1.5 overflow-hidden rounded-full bg-violet-100"
              role="progressbar"
              aria-label="Course generation in progress"
              aria-valuetext="In progress"
            >
              <div className="h-full w-2/5 animate-[loading_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-fuchsia-500" />
            </div>

            <style jsx>{`
              @keyframes loading {
                0% {
                  transform: translateX(-110%);
                }
                100% {
                  transform: translateX(280%);
                }
              }
            `}</style>
          </div>

          {/* Feature Highlights */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                <BrainCircuit className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">
                  AI Powered
                </p>
                <p className="text-[11px] text-slate-500">
                  Smart content
                </p>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <BookOpen className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">
                  Course Ready
                </p>
                <p className="text-[11px] text-slate-500">
                  Organized lessons
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[11px] leading-4 text-slate-400">
            Please keep this window open while your course is being generated.
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LoadingDialog;

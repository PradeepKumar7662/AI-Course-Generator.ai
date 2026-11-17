"use client";

import React from "react";
import { ArrowRight, Sparkles, BookOpen, BrainCircuit, Zap, Play } from "lucide-react";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#070B18] text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-12 lg:py-24">
        {/* Left content */}
        <div className="animate-[fadeInUp_.8s_ease-out_both]">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-4 py-2 text-sm text-violet-200 shadow-lg shadow-violet-950/20">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <span>AI-Powered Personalized Learning</span>
            <span className="ml-1 rounded-full bg-violet-400/20 px-2 py-0.5 text-xs">
              NEW
            </span>
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.13] tracking-tight sm:text-5xl lg:text-6xl">
            Turn Your Goals Into
            <span className="mt-2 block bg-gradient-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text pb-2 text-transparent">
              Personalized Courses
            </span>
            <span className="mt-1 block text-white">With AI.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
            Learn smarter, not harder. Generate personalized courses, explore
            structured chapters, and build your own learning path with the
            power of artificial intelligence.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-violet-900/30 transition duration-300 hover:-translate-y-1 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/25 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#070B18]"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            <a
              href="/explore"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold text-slate-200 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:bg-white/[0.08]"
            >
              <Play className="h-4 w-4 fill-current" />
              Explore Courses
            </a>
          </div>

          {/* Feature points */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              AI Course Creation
            </span>
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-cyan-400" />
              Structured Chapters
            </span>
            <span className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-violet-400" />
              Learn at Your Pace
            </span>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative mx-auto w-full max-w-lg animate-[fadeInUp_1s_ease-out_.15s_both]">
          <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-violet-600/20 to-cyan-500/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#10172A]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-violet-400/30 sm:p-6">
            {/* Preview header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-900/30">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Your AI Classroom</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Personalized learning dashboard
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Ready
              </span>
            </div>

            {/* Course card */}
            <div className="mt-6 rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/15 via-blue-500/10 to-transparent p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-md bg-violet-400/15 px-2.5 py-1 text-xs font-medium text-violet-300">
                    AI GENERATED
                  </span>
                  <h3 className="mt-4 text-xl font-bold sm:text-2xl">
                    Full Stack Development
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    From fundamentals to building real-world applications.
                  </p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-400/10">
                  <BookOpen className="h-6 w-6 text-blue-300" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  React.js
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  Node.js
                </span>
                <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  MongoDB
                </span>
              </div>
            </div>

            {/* Learning roadmap */}
            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold">Your Learning Roadmap</h4>
                <span className="text-xs text-slate-500">Course preview</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    number: "01",
                    title: "Web Development Basics",
                    subtitle: "HTML, CSS & JavaScript",
                    color: "bg-violet-400/15 text-violet-300",
                  },
                  {
                    number: "02",
                    title: "Frontend with React",
                    subtitle: "Components & Hooks",
                    color: "bg-blue-400/15 text-blue-300",
                  },
                  {
                    number: "03",
                    title: "Backend Development",
                    subtitle: "APIs & Databases",
                    color: "bg-cyan-400/15 text-cyan-300",
                  },
                ].map((chapter) => (
                  <div
                    key={chapter.number}
                    className="group flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 transition duration-300 hover:border-violet-400/30 hover:bg-white/[0.05]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${chapter.color}`}
                    >
                      {chapter.number}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-200">
                        {chapter.title}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {chapter.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-300" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] p-3">
              <Sparkles className="h-5 w-5 shrink-0 text-emerald-300" />
              <p className="text-xs leading-5 text-slate-400">
                A learning path designed around your goals and skill level.
              </p>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-2 top-16 hidden animate-bounce rounded-2xl border border-white/10 bg-[#171E32] p-3 shadow-xl sm:block sm:-right-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <div>
                <p className="text-xs font-bold text-white">Powered by AI</p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  Your learning, reimagined
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;

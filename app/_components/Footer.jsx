"use client";

import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#080D1B] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 sm:px-10 lg:px-12">
        {/* Main footer */}
        <div className="grid gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition duration-300 group-hover:rotate-6 group-hover:scale-110">
                <BrainCircuit className="h-7 w-7 text-white" />
              </div>

              <div>
                <p className="text-xl font-extrabold tracking-tight">
                  Courses<span className="text-violet-400">Generator</span>
                </p>
                <p className="mt-1 text-xs tracking-widest text-slate-400">
                  YOUR PERSONAL AI CLASSROOM
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
              Turn your learning goals into personalized courses with AI.
              Explore new skills, follow structured chapters, and learn at
              your own pace — one step at a time.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs font-medium text-violet-300">
              <Sparkles className="h-4 w-4" />
              Learn Smarter. Build Your Future.
            </div>

            {/* Social links: replace placeholders with your real profiles */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>

              <a
                href="mailto:your-email@example.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Quick Links
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Explore Courses", href: "/dashboard/explore" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Create a Course", href: "/create-course" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition hover:translate-x-1 hover:text-violet-300"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white">
              Discover
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                "AI Course Generation",
                "Personalized Learning",
                "Structured Chapters",
                "Learn at Your Own Pace",
              ].map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2.5 text-sm text-slate-400 transition hover:text-violet-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              href="/dashboard"
              className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500"
            >
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            © {currentYear} CoursesGenerator. All rights reserved.
          </p>

          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 sm:text-sm">
            Made for curious minds with
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
            and AI
          </p>

          <Link
            href="/"
            className="text-xs font-medium text-slate-400 transition hover:text-violet-300 sm:text-sm"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

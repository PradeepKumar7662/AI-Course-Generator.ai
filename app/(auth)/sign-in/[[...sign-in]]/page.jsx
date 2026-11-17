
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  BookOpen,
  Code2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Page() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#080D1B] text-white">

      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl lg:grid-cols-2">

        {/* Left Side */}
        <section className="relative hidden flex-col justify-between px-12 py-12 lg:flex xl:px-20">

          {/* Logo */}
          <Link href="/" className="flex w-fit items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/30">
              <BrainCircuit className="h-7 w-7 text-white" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight">
                Courses <span className="text-violet-400">Generator</span>
              </h2>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Learn Smarter with AI
              </p>
            </div>
          </Link>

          {/* Main Content */}
          <div className="my-12 max-w-xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles className="h-4 w-4" />
              Your AI-powered learning journey
            </div>

            <h1 className="text-5xl font-extrabold leading-tight xl:text-6xl">
              Learn Anything.
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Anytime, Anywhere.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
              Create personalized courses, explore new skills and
              transform your learning experience with the power of AI.
            </p>

            {/* Feature Cards */}
            <div className="mt-12 space-y-4">

              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition hover:border-violet-400/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Personalized Courses</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Learn with AI-generated study materials.
                  </p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" />
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition hover:border-blue-400/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                  <Code2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Learn New Skills</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Build your knowledge step by step.
                  </p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" />
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl transition hover:border-cyan-400/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Learn at Your Pace</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Your learning journey, your way.
                  </p>
                </div>
                <CheckCircle2 className="ml-auto h-5 w-5 text-emerald-400" />
              </div>

            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-slate-500">
            © 2026 Courses Generator. Learn smarter with AI.
          </p>
        </section>

        {/* Right Side - Sign In */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-8">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <Link href="/" className="mb-10 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-extrabold">
                Courses <span className="text-violet-400">Generator</span>
              </h2>
            </Link>

            {/* Heading */}
            <div className="mb-8 text-center lg:text-left">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 lg:mx-0">
                <Sparkles className="h-7 w-7 text-violet-400" />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Welcome Back!
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to continue your personalized AI learning journey.
              </p>
            </div>

            {/* Clerk Authentication */}
            <div className="flex justify-center lg:justify-start">
              <SignIn
                routing="hash"
                signUpUrl="/sign-up"
                forceRedirectUrl="/dashboard"
                appearance={{
                  variables: {
                    colorPrimary: "#8b5cf6",
                    colorBackground: "#111827",
                    colorText: "#f8fafc",
                    colorTextSecondary: "#94a3b8",
                    colorInputBackground: "#1e293b",
                    colorInputText: "#f8fafc",
                    borderRadius: "12px",
                  },
                  elements: {
                    rootBox: "w-full",
                    cardBox: "w-full shadow-none",
                    card: "w-full bg-[#111827] border border-white/10 shadow-2xl shadow-black/20",
                    headerTitle: "text-white",
                    headerSubtitle: "text-slate-400",
                    socialButtonsBlockButton:
                      "border border-white/10 bg-[#1e293b] text-white hover:bg-slate-700",
                    formFieldLabel: "text-slate-300",
                    formFieldInput:
                      "bg-[#1e293b] border-white/10 text-white placeholder:text-slate-500",
                    footerActionLink: "text-violet-400 hover:text-violet-300",
                    dividerLine: "bg-white/10",
                    dividerText: "text-slate-500",
                  },
                }}
              />
            </div>

            {/* Back Home */}
            <Link
              href="/"
              className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-violet-400"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back to Home
            </Link>

          </div>
        </section>

      </div>
    </main>
  );
}

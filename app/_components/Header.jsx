
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  BrainCircuit,
  House,
  Compass,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  const navItems = [
    { label: "Home", href: "/", icon: House },
    {
      label: "Explore Courses",
      href: "/dashboard/explore",
      icon: Compass,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";

    if (href === "/dashboard") {
      return (
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/")
      );
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  // Get Started Authentication
  const handleGetStarted = () => {
    if (!isLoaded) return;

    closeMenu();

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080D1B]/95 text-white shadow-lg shadow-black/10 backdrop-blur-2xl">

      {/* Top animation */}
      <div className="h-[2px] w-full overflow-hidden bg-white/[0.03]">
        <div className="h-full w-1/3 animate-[headerGlow_4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-500 via-blue-400 to-cyan-400" />
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="Courses Generator home"
          className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/40 opacity-0 blur-lg transition duration-500 group-hover:opacity-100" />

            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-500/20 transition duration-300 group-hover:rotate-6 sm:h-11 sm:w-11">
              <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>

          <div className="min-w-0">
            <p className="whitespace-nowrap text-sm font-extrabold tracking-tight sm:text-xl">
              Courses
              <span className="bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent">
                {" "}Generator
              </span>
            </p>

            <p className="mt-0.5 flex items-center gap-1 text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:text-[10px] sm:tracking-[0.17em]">
              <Sparkles className="h-3 w-3 text-violet-400" />
              Learn Smarter with AI
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-1.5 md:flex"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-violet-500/20 to-blue-500/20 text-white"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                {active && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
                )}

                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-violet-300" : "text-slate-500"
                  }`}
                />

                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">

          {/* User Profile */}
          {isLoaded && user && (
            <Link
              href="/dashboard"
              onClick={closeMenu}
              aria-label="Open your dashboard"
              title={user.fullName || "My Profile"}
              className="shrink-0 rounded-full ring-2 ring-violet-400/40 transition hover:ring-violet-300"
            >
              <Image
                src={user.imageUrl}
                alt={user.fullName || "User profile"}
                width={40}
                height={40}
                unoptimized
                className="h-9 w-9 rounded-full border border-white/20 object-cover sm:h-10 sm:w-10"
              />
            </Link>
          )}

          {/* Desktop Get Started */}
          <button
            type="button"
            onClick={handleGetStarted}
            disabled={!isLoaded}
            className="hidden items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-violet-400/30 hover:bg-violet-500/10 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`grid transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="overflow-hidden">
          <nav
            aria-label="Mobile navigation"
            className="space-y-2 border-t border-white/[0.08] px-4 py-4 sm:px-8"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm font-medium transition-all ${
                    active
                      ? "border-violet-400/20 bg-violet-500/10 text-white"
                      : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-violet-300" : "text-slate-500"
                    }`}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Get Started */}
            <button
              type="button"
              onClick={handleGetStarted}
              disabled={!isLoaded}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:from-violet-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>

      <style jsx>{`
        @keyframes headerGlow {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(400%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[headerGlow_4s_ease-in-out_infinite\\] {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;

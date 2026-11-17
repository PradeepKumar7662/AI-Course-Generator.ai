
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { FiBookOpen, FiStar } from "react-icons/fi";

function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 shadow-sm shadow-slate-200/30 backdrop-blur-xl sm:px-6 lg:px-8">
      <Link href="/dashboard" className="group flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-xl text-white shadow-md">
          <FiBookOpen />
        </span>

        <span className="min-w-0">
          <span className="block truncate text-base font-extrabold text-slate-900 sm:text-lg">
            AI <span className="text-indigo-600">Courses</span>
          </span>
          <span className="hidden items-center gap-1 text-[11px] font-medium text-slate-500 sm:flex">
            <FiStar className="text-violet-500" />
            Your learning journey
          </span>
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-3">
        <span className="hidden rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:inline-flex">
          Keep Learning ✨
        </span>

        <div className="flex h-10 min-w-10 items-center justify-center rounded-full ring-2 ring-indigo-100 ring-offset-2">
          {mounted ? (
            <UserButton />
          ) : (
            <span className="h-8 w-8 rounded-full bg-slate-100" />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;


"use client";

import React, {
  useContext,
  useState,
  useEffect,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";

import { HiHome } from "react-icons/hi2";
import { BsStack } from "react-icons/bs";
import { IoShieldCheckmark } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";

import {
  FiMenu,
  FiX,
  FiBookOpen,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";

import { Progress } from "@/components/ui/progress";
import { UserCourseListContext } from "@/app/_context/UserCourseListsContext";

function SideBar() {
  const { UserCourseList } = useContext(UserCourseListContext);

  const path = usePathname();
  const { signOut } = useClerk();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Subscription status
  const [isPro, setIsPro] = useState(false);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  // Fetch subscription status from database
  useEffect(() => {
    let isMounted = true;

    async function getSubscriptionStatus() {
      try {
        const response = await fetch("/api/subscription/status", {
          cache: "no-store",
        });

        const data = await response.json();

        if (isMounted && response.ok) {
          setIsPro(data.isPro === true);
        }
      } catch (error) {
        console.error("Subscription fetch error:", error);
      } finally {
        if (isMounted) {
          setSubscriptionLoaded(true);
        }
      }
    }

    getSubscriptionStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  // Course usage
  const courseCount = UserCourseList?.length ?? 0;
  const courseLimit = 5;

  const progressValue = Math.min(
    (courseCount / courseLimit) * 100,
    100
  );

  const closeMobileMenu = () => setMobileOpen(false);

  const Menu = [
    {
      id: 1,
      name: "Home",
      icon: <HiHome />,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Explore",
      icon: <BsStack />,
      path: "/dashboard/explore",
    },
    {
      id: 3,
      name: "Upgrade",
      icon: <IoShieldCheckmark />,
      path: "/dashboard/upgrade",
    },
    {
      id: 4,
      name: "Logout",
      icon: <AiOutlineLogout />,
      path: "/dashboard/logout",
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl md:hidden">

        <Link
          href="/dashboard"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg text-white shadow-md">
            <FiBookOpen />
          </span>

          <span className="truncate text-lg font-extrabold tracking-tight text-slate-900">
            AI <span className="text-indigo-600">Courses</span>
          </span>
        </Link>

        {/* Profile photo + sidebar menu */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-indigo-100">
            <UserButton />
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,280px)] flex-col border-r border-slate-200/80 bg-white/95 px-4 py-5 shadow-xl shadow-slate-200/30 backdrop-blur-xl transition-transform duration-300 ease-out md:z-30 md:w-64 md:translate-x-0 md:shadow-sm ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-3 px-2 py-2"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-xl text-white shadow-lg shadow-indigo-200/70">
            <FiBookOpen />
          </span>

          <span>
            <span className="block text-lg font-extrabold tracking-tight text-slate-900">
              AI Courses
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Your learning space
            </span>
          </span>
        </Link>

        {/* Section label */}
        <div className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation">
          <ul className="space-y-1.5">
            {Menu.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? path === "/dashboard"
                  : item.path === "/dashboard/logout"
                    ? false
                    : path === item.path ||
                      path.startsWith(item.path + "/");

              const itemClass = `group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200/70"
                  : item.name === "Logout"
                    ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`;

              const itemContent = (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100/80 text-slate-500 group-hover:bg-white group-hover:text-indigo-600"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="flex-1 text-left">
                    {item.name}
                  </span>

                  {isActive && (
                    <FiChevronRight className="text-lg text-white/80" />
                  )}
                </>
              );

              return (
                <li key={item.id}>
                  {item.name === "Logout" ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={itemClass}
                    >
                      {itemContent}
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={closeMobileMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={itemClass}
                    >
                      {itemContent}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Course Usage Card */}
        <div className="mt-auto pt-8">
          <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-200/40 blur-2xl"
            />

            {/* Heading */}
            <div className="relative mb-4 flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg text-indigo-600 shadow-sm">
                <FiStar />
              </span>

              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">
                  Course Usage
                </p>

                <p className="text-[11px] text-slate-500">
                  Your courses
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  !subscriptionLoaded
                    ? "bg-slate-100 text-slate-500"
                    : isPro
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {!subscriptionLoaded
                  ? "CHECKING..."
                  : isPro
                    ? "PRO PLAN"
                    : "FREE PLAN"}
              </span>
            </div>

            {/* Course Count */}
            <div className="relative mb-2 flex items-end justify-between gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                {courseCount}

                <span className="ml-1 text-sm font-medium text-slate-400">
                  / {isPro ? "Unlimited" : courseLimit}
                </span>
              </span>

              <span
                className={`pb-1 text-xs font-semibold ${
                  isPro
                    ? "text-emerald-600"
                    : "text-indigo-600"
                }`}
              >
                {isPro
                  ? "Unlimited Access"
                  : `${Math.round(progressValue)}% used`}
              </span>
            </div>

            {/* Progress Bar */}
            {!isPro && (
              <Progress
                value={progressValue}
                className="h-2 bg-indigo-100"
              />
            )}

            {/* Description */}
            <p className="relative mt-3 text-xs leading-5 text-slate-500">
              {!subscriptionLoaded
                ? "Checking your subscription details..."
                : isPro
                  ? "Enjoy unlimited AI-powered course creation and manage all your learning courses."
                  : courseCount >= courseLimit
                    ? "You've reached your free course limit. Upgrade to Pro for unlimited courses."
                    : `You have ${Math.max(
                        0,
                        courseLimit - courseCount
                      )} free courses remaining. Keep learning and growing!`}
            </p>

            {/* Upgrade Button */}
            {!isPro && subscriptionLoaded && (
              <Link
                href="/dashboard/upgrade"
                onClick={closeMobileMenu}
                className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                {courseCount >= courseLimit
                  ? "Upgrade to Pro"
                  : "Explore Plans"}

                <FiChevronRight className="text-sm" />
              </Link>
            )}
          </div>

          <p className="mt-4 text-center text-[10px] text-slate-400">
            Learn something amazing today ✨
          </p>
        </div>
      </aside>
    </>
  );
}

export default SideBar;

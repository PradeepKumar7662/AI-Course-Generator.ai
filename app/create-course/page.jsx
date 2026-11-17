
"use client";

import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from "react";
import { FaServicestack } from "react-icons/fa";
import {
  HiClipboardDocumentCheck,
  HiLightBulb,
} from "react-icons/hi2";

import SelectCategory from "./_components/SelectCategory";
import TopicDescription from "./_components/TopicDescription";
import SelectOption from "./_components/SelectOption";
import { UserInputContext } from "../_context/UserInputContext";
import LoadingDialog from "./_components/LoadingDialog";
import { useUser } from "@clerk/nextjs";

function CreateCourse() {
  const StepperOption = [
    { id: 1, name: "Category", icon: <FaServicestack /> },
    { id: 2, name: "Topic & Description", icon: <HiLightBulb /> },
    {
      id: 3,
      name: "Course Options",
      icon: <HiClipboardDocumentCheck />,
    },
  ];

  const { userCourseInput } = useContext(UserInputContext);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { user } = useUser();

  // Generate the course banner and save it.
  const GenerateCourseBanner = async (
    topic,
    category,
    description
  ) => {
    const response = await fetch("/api/generate-banner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        category,
        description,
      }),
    });

    const responseText = await response.text();

    console.log("Banner API status:", response.status);
    console.log("Banner API response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Generate banner API returned invalid JSON. Status: ${response.status}`
      );
    }

    if (!response.ok || !data.image) {
      throw new Error(
        data.error || "Cloudflare banner generation failed"
      );
    }

    // Save the generated image.
    const saveResponse = await fetch("/api/save-banner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: `data:image/jpeg;base64,${data.image}`,
      }),
    });

    const saveText = await saveResponse.text();

    console.log("Save banner status:", saveResponse.status);
    console.log("Save banner response:", saveText);

    let saveData;

    try {
      saveData = JSON.parse(saveText);
    } catch {
      throw new Error(
        `Save banner API returned invalid JSON. Status: ${saveResponse.status}`
      );
    }

    if (!saveResponse.ok || !saveData.url) {
      throw new Error(
        saveData.error || "Unable to save generated banner"
      );
    }

    return saveData.url;
  };

  useEffect(() => {
    console.log("User course input:", userCourseInput);
  }, [userCourseInput]);

  // Validate the current step.
  const checkStatus = () => {
    if (
      !userCourseInput ||
      Object.keys(userCourseInput).length === 0
    ) {
      return true;
    }

    if (
      activeIndex === 0 &&
      !userCourseInput?.category
    ) {
      return true;
    }

    if (
      activeIndex === 1 &&
      !userCourseInput?.topic
    ) {
      return true;
    }

    if (
      activeIndex === 2 &&
      (
        userCourseInput?.level === undefined ||
        userCourseInput?.duration === undefined ||
        userCourseInput?.displayVideo === undefined ||
        userCourseInput?.noOfChapter === undefined
      )
    ) {
      return true;
    }

    return false;
  };

  // Save the course layout in the database.
  const SaveCourseLayoutInDb = async (
    courseLayout,
    courseBanner = "/images.png"
  ) => {
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userCourseInput?.topic,
        level: userCourseInput?.level,
        category: userCourseInput?.category,
        courseOutput: courseLayout,
        courseBanner,
      }),
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Save course API returned invalid JSON. Status: ${response.status}`
      );
    }

    console.log("Save course status:", response.status);
    console.log("Save course response:", data);

    if (!response.ok || !data.courseId) {
      throw new Error(
        data.error || "Failed to save course."
      );
    }

    const courseUrl = `/create-course/${data.courseId}`;

    console.log("Course saved successfully:", data.courseId);
    console.log("Navigating to:", courseUrl);

    // Force navigation to the Course Layout page.
    window.location.assign(courseUrl);
  };

  // Generate the course layout.
  const GeneraterCourseLayout = async () => {
    if (!user?.id) {
      alert("Please sign in before creating a course.");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // Step 1: Generate course layout.
      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: userCourseInput?.category,
          topic: userCourseInput?.topic,
          level: userCourseInput?.level,
          duration: userCourseInput?.duration,
          noOfChapter: userCourseInput?.noOfChapter,
        }),
      });

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Course API returned invalid JSON. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Course generation failed"
        );
      }

      if (!data.courseLayout) {
        throw new Error(
          "Course layout was not returned by the API."
        );
      }

      // Step 2: Generate banner.
      let courseBanner = "/images.png";

      try {
        courseBanner = await GenerateCourseBanner(
          userCourseInput?.topic,
          userCourseInput?.category,
          userCourseInput?.description
        );
      } catch (bannerError) {
        console.error(
          "Banner generation failed:",
          bannerError
        );
      }

      // Step 3: Save course and navigate.
      await SaveCourseLayoutInDb(
        data.courseLayout,
        courseBanner
      );

    } catch (error) {
      console.error("Course generation failed:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Course generation failed. Please try again."
      );

      setLoading(false);
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/80 text-slate-900">
      {/* Background grid and glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.055) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-indigo-300/20 blur-[110px]" />

        <div className="absolute -right-24 top-48 h-80 w-80 rounded-full bg-violet-300/20 blur-[120px]" />

        <div className="absolute bottom-0 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-200/20 blur-[100px]" />
      </div>

      {/* Page heading */}
      <header className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pb-2 pt-10 text-center sm:px-6 sm:pt-12">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-indigo-700 shadow-sm backdrop-blur-md sm:text-sm">
          <HiLightBulb className="h-4 w-4" />
          YOUR AI LEARNING STUDIO
        </span>

        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Create Your{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            AI Course
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Build a personalized learning experience in just a
          few simple steps. Choose your topic, customize your
          course, and let AI do the rest.
        </p>
      </header>

      {/* Stepper */}
      <section
        aria-label="Course creation progress"
        className="mx-auto mt-8 w-full max-w-4xl px-3 sm:mt-10 sm:px-6"
      >
        <div className="flex items-start justify-center">
          {StepperOption.map((item, index) => {
            const isActive = activeIndex === index;
            const isCompleted = activeIndex > index;

            return (
              <React.Fragment key={item.id}>
                <div className="flex w-[96px] shrink-0 flex-col items-center text-center sm:w-44">
                  <div
                    className={`
                      flex h-11 w-11 items-center justify-center rounded-2xl
                      border transition-all duration-300 sm:h-14 sm:w-14 sm:rounded-2xl
                      ${
                        isActive
                          ? "scale-105 border-indigo-500 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25"
                          : isCompleted
                          ? "border-violet-300 bg-violet-100 text-violet-700"
                          : "border-slate-200 bg-white/90 text-slate-400 shadow-sm"
                      }
                    `}
                  >
                    <span className="text-lg sm:text-xl">
                      {item.icon}
                    </span>
                  </div>

                  <span
                    className={`mt-3 text-[11px] font-semibold leading-5 transition-colors sm:text-sm ${
                      isActive || isCompleted
                        ? "text-indigo-700"
                        : "text-slate-500"
                    }`}
                  >
                    {item.name}
                  </span>

                  <span className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    {isCompleted
                      ? "Completed"
                      : isActive
                      ? "In progress"
                      : `Step ${item.id}`}
                  </span>
                </div>

                {index < StepperOption.length - 1 && (
                  <div className="relative mt-5 h-1 w-8 shrink-0 overflow-hidden rounded-full bg-slate-200 sm:mt-7 sm:w-20 md:w-28">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ${
                        isCompleted ? "w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Course form */}
      <section className="mx-auto mt-8 w-full max-w-6xl px-4 pb-12 sm:mt-10 sm:px-6 lg:px-8">
        <div
          key={activeIndex}
          className="animate-[fadeIn_.35s_ease-out]"
        >
          {activeIndex === 0 ? (
            <SelectCategory />
          ) : activeIndex === 1 ? (
            <TopicDescription />
          ) : (
            <SelectOption />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mx-auto mt-8 flex w-full max-w-5xl items-center justify-between gap-4 border-t border-indigo-100/80 pt-5 sm:mt-10 sm:pt-6">
          <Button
            type="button"
            disabled={activeIndex === 0 || loading}
            variant="outline"
            onClick={() =>
              setActiveIndex((prev) =>
                Math.max(0, prev - 1)
              )
            }
            className="h-11 min-w-24 rounded-xl border-slate-200 bg-white px-4 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md disabled:translate-y-0 disabled:opacity-40 sm:h-12 sm:min-w-32 sm:px-6"
          >
            Previous
          </Button>

          {activeIndex < 2 && (
            <Button
              type="button"
              disabled={checkStatus() || loading}
              onClick={() =>
                setActiveIndex((prev) =>
                  Math.min(2, prev + 1)
                )
              }
              className="h-11 min-w-24 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:h-12 sm:min-w-32 sm:px-7"
            >
              Next <span className="ml-2">→</span>
            </Button>
          )}

          {activeIndex === 2 && (
            <Button
              type="button"
              disabled={checkStatus() || loading}
              onClick={GeneraterCourseLayout}
              className="h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-500 hover:to-violet-500 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50 sm:h-12 sm:px-7 sm:text-base"
            >
              {loading
                ? "Generating..."
                : "Generate Course Layout"}

              {!loading && (
                <span className="ml-2">→</span>
              )}
            </Button>
          )}
        </div>
      </section>

      <LoadingDialog loading={loading} />
    </main>
  );
}

export default CreateCourse;

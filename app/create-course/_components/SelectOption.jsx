
"use client";

import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UserInputContext } from "@/app/_context/UserInputContext";
import {
  Gauge,
  Clock3,
  Video,
  Layers3,
  Sparkles,
} from "lucide-react";

function SelectOption() {
  const { userCourseInput, setUserCourseInput } =
    useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserCourseInput((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const optionFields = [
    {
      title: "Difficulty Level",
      description: "Choose your learning level",
      icon: Gauge,
      field: "level",
      placeholder: "Select difficulty",
      options: [
        { label: "Beginner", value: "Beginner" },
        { label: "Intermediate", value: "Intermediate" },
        { label: "Advanced", value: "Advance" },
      ],
    },
    {
      title: "Course Duration",
      description: "Set your course length",
      icon: Clock3,
      field: "duration",
      placeholder: "Select duration",
      options: [
        { label: "1 Hour", value: "1 Hours" },
        { label: "2 Hours", value: "2 Hours" },
        { label: "More than 3 Hours", value: "More than 3 Hours" },
      ],
    },
    {
      title: "Include Videos",
      description: "Add video resources to lessons",
      icon: Video,
      field: "displayVideo",
      placeholder: "Choose an option",
      options: [
        { label: "Yes, include videos", value: "Yes" },
        { label: "No videos", value: "No" },
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-7 mt-6 text-center sm:mb-9">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm">
          <Sparkles className="h-4 w-4" />
          Customize Your Learning
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Course{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Preferences
          </span>
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
          Personalize your course by selecting the difficulty,
          duration, video resources, and number of chapters.
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-2">
        {optionFields.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.field}
              className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/50 sm:p-6"
            >
              {/* Card Heading */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="break-words text-sm font-semibold text-slate-800 transition-colors duration-300 group-hover:text-violet-700 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Select */}
              <Select
                value={userCourseInput?.[item.field] ?? ""}
                onValueChange={(value) =>
                  handleInputChange(item.field, value)
                }
              >
                <SelectTrigger className="h-12 w-full min-w-0 rounded-xl border-slate-200 bg-slate-50/70 text-sm transition-all duration-300 hover:border-violet-300 focus:ring-4 focus:ring-violet-100 data-[state=open]:border-violet-500 data-[state=open]:bg-white sm:h-13 sm:text-base">
                  <SelectValue placeholder={item.placeholder} />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                  {item.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer rounded-lg py-2.5 focus:bg-violet-50 focus:text-violet-700"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}

        {/* Number of Chapters */}
        <div className="group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/50 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
              <Layers3 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="chapter-count"
                className="block text-sm font-semibold text-slate-800 transition-colors duration-300 group-hover:text-violet-700 sm:text-base"
              >
                Number of Chapters
              </label>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                How many chapters do you need?
              </p>
            </div>
          </div>

          <Input
            id="chapter-count"
            type="number"
            min="1"
            max="50"
            placeholder="e.g. 8"
            value={userCourseInput?.noOfChapter ?? ""}
            onChange={(event) =>
              handleInputChange("noOfChapter", event.target.value)
            }
            className="h-12 w-full rounded-xl border-slate-200 bg-slate-50/70 text-sm transition-all duration-300 placeholder:text-slate-400 hover:border-violet-300 focus-visible:border-violet-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-violet-100 sm:text-base"
          />

          <p className="mt-2 text-xs text-slate-500">
            Enter the number of chapters for your course.
          </p>
        </div>
      </div>

      {/* Helpful Tip */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-4">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
        <p className="text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-800">
            Pro tip:
          </span>{" "}
          Choose a difficulty level that matches your experience
          and a chapter count that suits your learning goals.
        </p>
      </div>
    </div>
  );
}

export default SelectOption;


"use client";

import { UserInputContext } from "@/app/_context/UserInputContext";
import CategoryList from "@/app/_shared/CategoryList";
import Image from "next/image";
import React, { useContext } from "react";

function SelectCategory() {
  const { userCourseInput, setUserCourseInput } =
    useContext(UserInputContext);

  const handleCategoryChange = (category) => {
    setUserCourseInput((prev) => ({
      ...prev,
      category,
    }));
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
      <h2 className="my-5 text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
        Select the Course Category
      </h2>

     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {CategoryList.map((item) => {
          const isSelected = userCourseInput?.category === item.name;

          return (
            <button
              type="button"
              key={item.name}
              onClick={() => handleCategoryChange(item.name)}
              aria-pressed={isSelected}
              className={`
                group relative flex min-w-0 flex-col items-center
                justify-center gap-3 overflow-hidden rounded-2xl
                border p-3 text-center
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-violet-500
                focus-visible:ring-offset-2
                sm:gap-4 sm:p-5 md:p-6
                ${
                  isSelected
                    ? "border-violet-500 bg-violet-50 shadow-md ring-1 ring-violet-200"
                    : "border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50/70"
                }
              `}
            >
              {/* Subtle hover glow */}
              <span
                className={`
                  pointer-events-none absolute inset-0
                  bg-gradient-to-br from-violet-100/0
                  via-indigo-50/0 to-purple-100/0
                  transition-all duration-300
                  ${
                    isSelected
                      ? "from-violet-100/70 to-purple-100/40"
                      : "group-hover:from-violet-100/60 group-hover:to-purple-100/40"
                  }
                `}
              />

              {/* Category Image */}
            

{/* Category Image */}
<span
  className={`
    relative block h-20 w-20 shrink-0
    overflow-hidden rounded-xl
    transition-transform duration-300 ease-out
    group-hover:scale-110
    sm:h-24 sm:w-24
    md:h-[110px] md:w-[110px]
    ${
      isSelected
        ? "ring-2 ring-violet-200"
        : "group-hover:ring-2 group-hover:ring-violet-200"
    }
  `}
>
  <Image
    src={item.icon}
    alt={`${item.name} category`}
    fill
    sizes="(max-width: 640px) 80px, 110px"
    className="object-cover"
  />
</span>



              {/* Category Name */}
              <span
                className={`
                  relative block w-full min-w-0
                  break-words text-center text-sm font-semibold
                  leading-snug transition-colors duration-300
                  sm:text-base md:text-lg
                  ${
                    isSelected
                      ? "text-violet-700"
                      : "text-slate-700 group-hover:text-violet-700"
                  }
                `}
              >
                {item.name}
              </span>

              {/* Selected Indicator */}
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs text-white shadow-sm sm:right-3 sm:top-3">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SelectCategory;

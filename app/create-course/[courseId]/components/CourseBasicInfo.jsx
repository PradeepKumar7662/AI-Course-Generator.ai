
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import EditCourseBasicinfo from "./EditCourseBasicinfo";
import { PiPuzzlePieceFill } from "react-icons/pi";
import { storage } from "@/configs/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ImagePlus,
  LoaderCircle,
  Sparkles,
  Play,
} from "lucide-react";

function CourseBasicInfo({ course, refreshData, edit = true }) {
  const [selectedFile, setSelectedFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setSelectedFile("");
  }, [course?.courseBanner]);

  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5 MB.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const previewUrl = URL.createObjectURL(file);
    setSelectedFile(previewUrl);

    try {
      const fileName = `${Date.now()}-${file.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;

      const storageRef = ref(storage, `ai-course/${fileName}`);
      await uploadBytes(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);
      setSelectedFile(downloadURL);

      // Next: save downloadURL to the course record through your update API.
      console.log("Image uploaded successfully:", downloadURL);
    } catch (error) {
      console.error("Image upload failed:", error);
      setUploadError("Image upload failed. Please try again.");
      setSelectedFile("");
      URL.revokeObjectURL(previewUrl);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const courseName =
    course?.courseOutput?.["Course Name"] ||
    course?.name ||
    "Untitled Course";

  const description =
    course?.courseOutput?.Description ||
    "Explore the concepts, practice with examples, and build your knowledge step by step.";

  const category = course?.category || "General";

  const banner =
    selectedFile || course?.courseBanner || "/images.png";

  return (
    <section className="group relative mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-100/70 blur-3xl dark:bg-violet-950/30" />

      <div className="relative grid lg:min-h-[390px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Course information */}
        <div className="flex flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <PiPuzzlePieceFill size={15} />
              {category}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
              <Sparkles size={14} />
              AI Generated
            </span>
          </div>

          <h2 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[42px]">
            {courseName}
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            {description}
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <BookOpen size={18} className="text-violet-600" />
            Structured learning, one chapter at a time
          </div>

        
<div className="mt-7 flex w-full flex-wrap items-center gap-3">
  <Link
    href={`/course/${course?.courseId}/start`}
    className="w-full sm:w-auto"
  >
    <Button className="h-12 w-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-white shadow-lg shadow-violet-200 transition-all hover:-translate-y-0.5 hover:from-violet-700 hover:to-indigo-700 sm:w-auto dark:shadow-none">
      <Play size={17} className="mr-2 fill-current" />
      Start Learning
      <ArrowRight
        size={17}
        className="ml-3 transition-transform group-hover:translate-x-1"
      />
    </Button>
  </Link>

  {edit && (
    <EditCourseBasicinfo
      course={course}
      refreshData={() => refreshData?.(true)}
    />
  )}
</div>

        </div>

        {/* Course banner */}
        <div className="relative min-h-[250px] overflow-hidden bg-gradient-to-br from-violet-100 via-indigo-50 to-sky-100 sm:min-h-[320px] lg:min-h-full dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900">
          <Image
            src={banner}
            alt={`${courseName} course banner`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={selectedFile.startsWith("blob:")}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/10 lg:via-transparent lg:to-transparent" />

          {edit && (
            <label
              htmlFor="course-banner-upload"
              className="absolute bottom-4 right-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 bg-slate-950/75 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-slate-950"
            >
              {uploading ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <ImagePlus size={16} />
              )}
              {uploading ? "Uploading..." : "Change banner"}
            </label>
          )}
        </div>
      </div>

      {edit && (
        <input
          id="course-banner-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={onFileSelected}
          disabled={uploading}
        />
      )}

      {uploadError && (
        <p
          role="alert"
          className="px-6 pb-4 text-sm text-red-600 dark:text-red-400"
        >
          {uploadError}
        </p>
      )}
    </section>
  );
}

export default CourseBasicInfo;


"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function EditChapters({ course, index, refreshData }) {
  const chapters =
    course?.courseOutput?.Chapters ??
    course?.courseOutput?.chapters ??
    [];

  const currentChapter = Array.isArray(chapters)
    ? chapters[index]
    : null;

  const [chapterName, setChapterName] = useState("");
  const [about, setAbout] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentChapter) return;

    setChapterName(
      currentChapter.chapterName ||
        currentChapter["Chapter Name"] ||
        currentChapter.title ||
        currentChapter.name ||
        ""
    );

    setAbout(
      currentChapter.about ||
        currentChapter.description ||
        currentChapter["Description"] ||
        ""
    );
  }, [currentChapter]);

  const onUpdateHandler = async () => {
    if (!currentChapter || !course?.courseId) {
      alert("Chapter or course data is missing.");
      return;
    }

    if (!chapterName.trim()) {
      alert("Please enter chapter name.");
      return;
    }

    try {
      setSaving(true);

      const updatedChapters = chapters.map((chapter, chapterIndex) => {
        if (chapterIndex !== index) return chapter;

        return {
          ...chapter,
          chapterName: chapterName.trim(),
          about: about.trim(),
        };
      });

      const updatedCourseOutput = {
        ...course.courseOutput,
        ...(Array.isArray(course.courseOutput?.Chapters)
          ? { Chapters: updatedChapters }
          : { chapters: updatedChapters }),
      };

      const response = await fetch(
        `/api/courses/${course.courseId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseOutput: updatedCourseOutput,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update chapter.");
      }

      alert("Chapter updated successfully!");

      setOpen(false);

      if (refreshData) {
        await refreshData();
      }
    } catch (error) {
      console.error("Update chapter error:", error);
      alert(error.message || "Unable to update chapter.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentChapter) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Edit chapter"
        >
          <HiOutlinePencilSquare size={20} />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black dark:bg-slate-950 dark:text-white">
        <DialogHeader>
          <DialogTitle>Edit Chapter</DialogTitle>

          <DialogDescription>
            Update your chapter title and description.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Chapter Title
            </label>

            <Input
              value={chapterName}
              onChange={(event) =>
                setChapterName(event.target.value)
              }
              placeholder="Enter chapter title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <Textarea
              className="h-40"
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="Enter chapter description"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={onUpdateHandler}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update Chapter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditChapters;

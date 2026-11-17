
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { HiOutlinePencilSquare } from "react-icons/hi2";

function EditCourseBasicinfo({ course, refreshData }) {
  const [courseName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 useEffect(() => {
  setName(
    course?.courseOutput?.["Course Name"] ??
    course?.courseOutput?.courseName ??
    ""
  );

  setDescription(
    course?.courseOutput?.Description ??
    course?.courseOutput?.description ??
    ""
  );
}, [course]);

  const onUpdateHandler = async () => {
    if (!course?.id) {
      setError("Course ID is missing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/course/update-basic-info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: course.id,
          courseName,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update course.");
      }

      setOpen(false);

      if (typeof refreshData === "function") {
        refreshData(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit course">
          <HiOutlinePencilSquare />
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle>
            Edit Course Title & Description
          </DialogTitle>
          <DialogDescription>
            Update your course title and description below.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="course-title">Course Title</label>
            <Input
              id="course-title"
              value={courseName}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="course-description">Description</label>
            <Textarea
              id="course-description"
              className="h-40"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <DialogFooter>
          <Button
            onClick={onUpdateHandler}
            disabled={loading || !courseName.trim()}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditCourseBasicinfo;

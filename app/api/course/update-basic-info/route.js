
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export async function PATCH(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email is unavailable." },
        { status: 400 }
      );
    }

    const { id, courseName, description } = await request.json();
    const courseId = Number(id);

    if (
      !Number.isInteger(courseId) ||
      courseId <= 0 ||
      typeof courseName !== "string" ||
      typeof description !== "string" ||
      !courseName.trim()
    ) {
      return NextResponse.json(
        { error: "Valid course details are required." },
        { status: 400 }
      );
    }

    const existing = await db
      .select({ courseOutput: CourseList.courseOutput })
      .from(CourseList)
      .where(
        and(
          eq(CourseList.id, courseId),
          eq(CourseList.createdBy, email)
        )
      )
      .limit(1);

    if (!existing.length) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

   const updatedOutput = {
  ...existing[0].courseOutput,
  "Course Name": courseName.trim(),
  Description: description.trim(),
};

    await db
      .update(CourseList)
      .set({ courseOutput: updatedOutput })
      .where(
        and(
          eq(CourseList.id, courseId),
          eq(CourseList.createdBy, email)
        )
      );

    return NextResponse.json({
      success: true,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Unable to update course." },
      { status: 500 }
    );
  }
}

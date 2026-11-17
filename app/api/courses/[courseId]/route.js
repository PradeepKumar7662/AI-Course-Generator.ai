
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { and, eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

// GET: Fetch course (owner only)
export async function GET(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId))
      .limit(1);

    if (!result.length) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const course = result[0];

    if (course.createdBy?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot access this course." },
        { status: 403 }
      );
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch course." },
      { status: 500 }
    );
  }
}

// PATCH: Update course
export async function PATCH(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in." },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (
      !body.courseOutput ||
      typeof body.courseOutput !== "object" ||
      Array.isArray(body.courseOutput)
    ) {
      return NextResponse.json(
        { error: "Invalid course data." },
        { status: 400 }
      );
    }

    const result = await db
      .update(CourseList)
      .set({
        courseOutput: body.courseOutput,
      })
      .where(
        and(
          eq(CourseList.courseId, courseId),
          eq(CourseList.createdBy, email)
        )
      )
      .returning({
        courseId: CourseList.courseId,
      });

    if (!result.length) {
      return NextResponse.json(
        { error: "Course not found or access denied." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update course." },
      { status: 500 }
    );
  }
}

// DELETE: Delete course and all its chapters
export async function DELETE(request, { params }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing." },
        { status: 400 }
      );
    }

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    // Verify course ownership
    const existingCourse = await db
      .select({
        courseId: CourseList.courseId,
        createdBy: CourseList.createdBy,
      })
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId))
      .limit(1);

    if (!existingCourse.length) {
      return NextResponse.json(
        { error: "Course not found." },
        { status: 404 }
      );
    }

    const course = existingCourse[0];

    if (course.createdBy?.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: "You are not authorized to delete this course." },
        { status: 403 }
      );
    }

    // Atomic deletion: chapters and course in one PostgreSQL statement
    await db.execute(sql`
      WITH owned_course AS (
        SELECT "courseId", "createdBy"
        FROM "courseList"
        WHERE "courseId" = ${courseId}
          AND LOWER("createdBy") = LOWER(${email})
      ),
      deleted_chapters AS (
        DELETE FROM "chapters"
        USING owned_course
        WHERE "chapters"."courseId" = owned_course."courseId"
        RETURNING "chapters"."id"
      ),
      deleted_course AS (
        DELETE FROM "courseList"
        USING owned_course
        WHERE "courseList"."courseId" = owned_course."courseId"
          AND "courseList"."createdBy" = owned_course."createdBy"
        RETURNING "courseList"."courseId"
      )
      SELECT 1;
    `);

    return NextResponse.json({
      success: true,
      message: "Course and all chapters deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete course. Please try again." },
      { status: 500 }
    );
  }
}

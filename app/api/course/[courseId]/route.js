
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get course ID
    const { courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is missing." },
        { status: 400 }
      );
    }

    // Get signed-in user's email
    const clerkUser = await currentUser();

    const email =
      clerkUser?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    // Fetch only the user's own course
    const result = await db
      .select()
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, courseId),
          eq(CourseList.createdBy, email)
        )
      )
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course not found or access denied." },
        { status: 404 }
      );
    }

    const course = result[0];

    return NextResponse.json({ course });

  } catch (error) {
    console.error("Get course API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch course.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

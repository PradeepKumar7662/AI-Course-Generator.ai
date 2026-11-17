
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { eq } from "drizzle-orm";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const { userId } = await auth();

    console.log("Course API userId:", userId);

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Get course ID from route params
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

    // Fetch course from database
    const result = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.courseId, courseId))
      .limit(1);

    console.log("Requested course ID:", courseId);
    console.log("Course found:", result.length > 0);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Course not found.", courseId },
        { status: 404 }
      );
    }

    const course = result[0];

    // Allow access only to the course owner
    if (
      course.createdBy?.toLowerCase() !== email.toLowerCase()
    ) {
      return NextResponse.json(
        { error: "You cannot access this course." },
        { status: 403 }
      );
    }

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

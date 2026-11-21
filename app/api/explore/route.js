
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request) {
  try {
    // Check logged-in user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    // Get logged-in user's email
    const clerkUser = await currentUser();
    const email = clerkUser?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 0);

    if (!Number.isInteger(page) || page < 0) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    // Fetch only logged-in user's courses
    const courses = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, email))
      .orderBy(desc(CourseList.id))
      .limit(9)
      .offset(page * 9);

    return NextResponse.json({
      courses,
      page,
      limit: 9,
    });
  } catch (error) {
    console.error("Explore API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

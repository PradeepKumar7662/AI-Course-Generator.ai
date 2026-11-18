export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { desc } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page") || 0);

    if (!Number.isInteger(page) || page < 0) {
      return NextResponse.json(
        { error: "Invalid page number" },
        { status: 400 }
      );
    }

    const courses = await db
      .select()
      .from(CourseList)
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

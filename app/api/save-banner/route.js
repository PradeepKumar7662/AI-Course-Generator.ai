
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { db } from "@/configs/db";
import { CourseList } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

import cloudinary from "@/configs/cloudinary";

export const runtime = "nodejs";

function isValidImage(buffer, type) {
  if (type === "image/jpeg") {
    return (
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  if (type === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  if (type === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
}

export async function POST(request) {
  try {
    // Verify logged-in user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const clerkUser = await currentUser();
    const email =
      clerkUser?.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 401 }
      );
    }

    // Read selected image
    const formData = await request.formData();

    const file = formData.get("file");
    const courseId = formData.get("courseId");

    if (
      !file ||
      typeof file === "string" ||
      typeof file.arrayBuffer !== "function"
    ) {
      return NextResponse.json(
        { error: "Please select an image." },
        { status: 400 }
      );
    }

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { error: "Course ID is required." },
        { status: 400 }
      );
    }

    // Verify course ownership
    const ownedCourse = await db
      .select({ courseId: CourseList.courseId })
      .from(CourseList)
      .where(
        and(
          eq(CourseList.courseId, courseId),
          eq(CourseList.createdBy, email)
        )
      )
      .limit(1);

    if (!ownedCourse.length) {
      return NextResponse.json(
        { error: "Course not found or access denied." },
        { status: 404 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG and WEBP images are allowed." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image size must be less than 4 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (!isValidImage(buffer, file.type)) {
      return NextResponse.json(
        { error: "Invalid image file." },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      `data:${file.type};base64,${buffer.toString("base64")}`,
      {
        folder: `ai-course-banners/manual/${userId}`,
        resource_type: "image",
      }
    );

    // Update course banner URL in Neon database
    const updated = await db
      .update(CourseList)
      .set({
        courseBanner: uploadResult.secure_url,
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

    if (!updated.length) {
      return NextResponse.json(
        { error: "Unable to update course banner." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      courseId,
    });

  } catch (error) {
    console.error("SAVE BANNER ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to upload course banner.",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

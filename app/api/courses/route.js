
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/configs/db";
import {
  CourseList,
  FreeCourseUsage,
  UserSubscription,
} from "@/configs/schema";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";

export const runtime = "nodejs";

const FREE_COURSE_LIMIT = 5;

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    const user = await currentUser();

    const email = user?.emailAddresses?.find(
      (item) => item.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      level,
      category,
      courseOutput,
      courseBanner,
    } = body;

    if (!name || !level || !category || !courseOutput) {
      return NextResponse.json(
        { error: "Missing required course details." },
        { status: 400 }
      );
    }

    const courseId = randomUUID();

    const result = await db.transaction(async (tx) => {
      const [subscription] = await tx
        .select()
        .from(UserSubscription)
        .where(eq(UserSubscription.userId, userId))
        .limit(1);

      const isPro = subscription?.status === "active";

      const courseData = {
        courseId,
        name,
        level,
        category,
        courseOutput,
        courseBanner: courseBanner || "/images.png",
        createdBy: email,
        userName: user?.fullName || "",
        userProfileImage: user?.imageUrl || "",
        createdOnPlan: isPro ? "pro" : "free",
      };

      // PRO USERS: Unlimited courses
      if (isPro) {
        await tx.insert(CourseList).values(courseData);

        return {
          success: true,
          isPro: true,
        };
      }

      // Check existing Free usage
      const [usage] = await tx
        .select()
        .from(FreeCourseUsage)
        .where(eq(FreeCourseUsage.userId, userId))
        .limit(1);

      // Initialize counter using existing Free courses.
      // Existing courses receive "free" through the schema default.
      if (!usage) {
    const [existingCourses] = await tx
  .select({
    count: sql`count(*)::int`,
  })
  .from(CourseList)
  .where(
    and(
      eq(CourseList.createdBy, email),
      eq(CourseList.createdOnPlan, "free")
    )
  );

        await tx
          .insert(FreeCourseUsage)
          .values({
            userId,
            courseCount: Number(existingCourses?.count || 0),
            updatedAt: new Date(),
          })
          .onConflictDoNothing({
            target: FreeCourseUsage.userId,
          });
      }

      // Lock counter to prevent simultaneous limit bypass.
      const [lockedUsage] = await tx
        .select()
        .from(FreeCourseUsage)
        .where(eq(FreeCourseUsage.userId, userId))
        .for("update")
        .limit(1);

      const courseCount = Number(
        lockedUsage?.courseCount || 0
      );

      // Enforce lifetime limit
      if (courseCount >= FREE_COURSE_LIMIT) {
        return {
          limitReached: true,
          courseCount,
        };
      }

      // Create Free course
      await tx.insert(CourseList).values(courseData);

      // Increase Free usage counter
      await tx
        .update(FreeCourseUsage)
        .set({
          courseCount: courseCount + 1,
          updatedAt: new Date(),
        })
        .where(
          eq(FreeCourseUsage.userId, userId)
        );

      return {
        success: true,
        isPro: false,
        courseCount: courseCount + 1,
      };
    });

    if (result.limitReached) {
      return NextResponse.json(
        {
          error:
            "You have used all 5 free lifetime courses. Upgrade to Pro to create unlimited courses.",
          code: "FREE_LIMIT_REACHED",
          courseCount: result.courseCount,
          limit: FREE_COURSE_LIMIT,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        courseId,
        isPro: result.isPro,
        courseCount: result.courseCount ?? null,
        message: "Course created successfully.",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("POST /api/courses error:", error);

    return NextResponse.json(
      { error: "Failed to create course." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    const user = await currentUser();

    const email = user?.emailAddresses?.find(
      (item) => item.id === user.primaryEmailAddressId
    )?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "User email not found." },
        { status: 400 }
      );
    }

    const courses = await db
      .select()
      .from(CourseList)
      .where(eq(CourseList.createdBy, email));

    return NextResponse.json(
      { courses },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/courses error:", error);

    return NextResponse.json(
      { error: "Failed to fetch courses." },
      { status: 500 }
    );
  }
}

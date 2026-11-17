
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { UserSubscription, FreeCourseUsage } from "@/configs/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const [subscriptionRows, usageRows] = await Promise.all([
      db
        .select({ status: UserSubscription.status })
        .from(UserSubscription)
        .where(eq(UserSubscription.userId, userId))
        .limit(1),

      db
        .select({ courseCount: FreeCourseUsage.courseCount })
        .from(FreeCourseUsage)
        .where(eq(FreeCourseUsage.userId, userId))
        .limit(1),
    ]);

    const isPro = subscriptionRows[0]?.status === "active";
    const freeCoursesUsed = usageRows[0]?.courseCount ?? 0;

    return NextResponse.json(
      {
        isPro,
        freeCoursesUsed,
        freeCourseLimit: 5,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Plan status API error:", error);

    return NextResponse.json(
      { error: "Unable to check your plan status" },
      { status: 500 }
    );
  }
}

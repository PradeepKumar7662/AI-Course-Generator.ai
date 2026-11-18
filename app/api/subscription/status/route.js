export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { UserSubscription } from "@/configs/schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    const [subscription] = await db
      .select({
        status: UserSubscription.status,
        planId: UserSubscription.razorpayPlanId,
        subscriptionId: UserSubscription.razorpaySubscriptionId,
      })
      .from(UserSubscription)
      .where(eq(UserSubscription.userId, userId))
      .limit(1);

    const isPro = subscription?.status === "active";

    return NextResponse.json({
      isPro,
      status: subscription?.status || "free",
      subscriptionId: subscription?.subscriptionId || null,
    });
  } catch (error) {
    console.error("Subscription status error:", error);

    return NextResponse.json(
      { error: "Unable to fetch subscription status." },
      { status: 500 }
    );
  }
}

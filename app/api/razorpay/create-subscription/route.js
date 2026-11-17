
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { UserSubscription } from "@/configs/schema";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay API keys are not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { planType } = body;

    if (!["monthly", "yearly"].includes(planType)) {
      return NextResponse.json(
        { error: "Invalid subscription plan." },
        { status: 400 }
      );
    }

    const planId =
      planType === "monthly"
        ? process.env.RAZORPAY_MONTHLY_PLAN_ID
        : process.env.RAZORPAY_YEARLY_PLAN_ID;

    if (!planId) {
      return NextResponse.json(
        { error: "Razorpay plan ID is missing." },
        { status: 500 }
      );
    }

    const [existing] = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.userId, userId))
      .limit(1);

    const terminalStatuses = [
      "cancelled",
      "completed",
      "expired",
    ];

    // Reuse an existing unactivated subscription for the same plan.
    if (
      existing &&
      existing.status === "created" &&
      existing.razorpayPlanId === planId &&
      existing.razorpaySubscriptionId
    ) {
      return NextResponse.json({
        subscriptionId: existing.razorpaySubscriptionId,
        keyId,
        planType,
      });
    }

    // Do not create another subscription while an earlier one is still active or pending.
    if (
      existing &&
      !terminalStatuses.includes(existing.status)
    ) {
      return NextResponse.json(
        {
          error:
            "An existing subscription is already present. Please complete or resolve it before creating another one.",
          status: existing.status,
        },
        { status: 409 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: planType === "monthly" ? 1200 : 100,
      quantity: 1,
      customer_notify: true,
      notes: {
        clerkUserId: userId,
        planType,
      },
    });

    await db
      .insert(UserSubscription)
      .values({
        userId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: planId,
        status: subscription.status || "created",
        currentPeriodStart: null,
        currentPeriodEnd: null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: UserSubscription.userId,
        set: {
          razorpaySubscriptionId: subscription.id,
          razorpayPlanId: planId,
          status: subscription.status || "created",
          currentPeriodStart: null,
          currentPeriodEnd: null,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      subscriptionId: subscription.id,
      keyId,
      planType,
    });
  } catch (error) {
    console.error("Create subscription error:", error);

    return NextResponse.json(
      { error: error.message || "Unable to create subscription." },
      { status: 500 }
    );
  }
}

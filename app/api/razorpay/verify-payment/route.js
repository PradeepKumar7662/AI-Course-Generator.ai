
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createHmac, timingSafeEqual } from "crypto";
import { and, eq } from "drizzle-orm";
import Razorpay from "razorpay";
import { db } from "@/configs/db";
import { UserSubscription } from "@/configs/schema";

export const runtime = "nodejs";

function toDate(timestamp) {
  if (!timestamp) return null;
  return new Date(Number(timestamp) * 1000);
}

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

    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = body;

    if (
      typeof razorpay_payment_id !== "string" ||
      typeof razorpay_subscription_id !== "string" ||
      typeof razorpay_signature !== "string" ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      return NextResponse.json(
        { error: "Invalid payment verification details." },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(UserSubscription)
      .where(eq(UserSubscription.userId, userId))
      .limit(1);

    if (
      !existing ||
      existing.razorpaySubscriptionId !== razorpay_subscription_id
    ) {
      return NextResponse.json(
        { error: "Subscription not found for this account." },
        { status: 404 }
      );
    }

    // Verify Razorpay Checkout signature.
    const generatedSignature = createHmac("sha256", keySecret)
      .update(
        `${razorpay_payment_id}|${existing.razorpaySubscriptionId}`
      )
      .digest("hex");

    const expected = Buffer.from(generatedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return NextResponse.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Fetch the subscription from Razorpay instead of trusting browser data.
    const subscription = await razorpay.subscriptions.fetch(
      existing.razorpaySubscriptionId
    );

    if (subscription.plan_id !== existing.razorpayPlanId) {
      return NextResponse.json(
        { error: "Subscription plan does not match." },
        { status: 400 }
      );
    }

    const status = subscription.status || "created";

    await db
      .update(UserSubscription)
      .set({
        status,
        currentPeriodStart: toDate(subscription.current_start),
        currentPeriodEnd: toDate(subscription.current_end),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(UserSubscription.userId, userId),
          eq(
            UserSubscription.razorpaySubscriptionId,
            existing.razorpaySubscriptionId
          )
        )
      );

    return NextResponse.json({
      success: true,
      status,
      isPro: status === "active",
      message:
        status === "active"
          ? "Your Pro subscription is now active."
          : `Payment verified. Current subscription status: ${status}.`,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return NextResponse.json(
      { error: error.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}

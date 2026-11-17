
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { UserSubscription } from "@/configs/schema";

export const runtime = "nodejs";

function toDate(timestamp) {
  if (!timestamp) return null;
  return new Date(Number(timestamp) * 1000);
}

export async function POST(request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("RAZORPAY_WEBHOOK_SECRET is missing.");

      return NextResponse.json(
        { error: "Webhook secret is not configured." },
        { status: 500 }
      );
    }

    // Read the raw body before parsing JSON.
    const rawBody = await request.text();

    const signature = request.headers.get("x-razorpay-signature");

    if (
      !signature ||
      !/^[a-f0-9]{64}$/i.test(signature)
    ) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const generatedSignature = createHmac(
      "sha256",
      webhookSecret
    )
      .update(rawBody)
      .digest("hex");

    const expected = Buffer.from(generatedSignature, "hex");
    const received = Buffer.from(signature, "hex");

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      return NextResponse.json(
        { error: "Webhook signature verification failed." },
        { status: 400 }
      );
    }

    const eventData = JSON.parse(rawBody);
    const event = eventData.event;

    const supportedEvents = [
      "subscription.authenticated",
      "subscription.activated",
      "subscription.charged",
      "subscription.updated",
      "subscription.pending",
      "subscription.halted",
      "subscription.cancelled",
      "subscription.completed",
      "subscription.paused",
      "subscription.resumed",
    ];

    if (!supportedEvents.includes(event)) {
      return NextResponse.json({
        success: true,
        message: "Event ignored.",
      });
    }

    const subscription =
      eventData.payload?.subscription?.entity;

    if (!subscription?.id || !subscription?.status) {
      return NextResponse.json(
        { error: "Subscription details missing in webhook." },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(UserSubscription)
      .where(
        eq(
          UserSubscription.razorpaySubscriptionId,
          subscription.id
        )
      )
      .limit(1);

    // Return an error so Razorpay can retry if the database row
    // has not been created yet.
    if (!existing) {
      console.error(
        "Subscription record not found:",
        subscription.id
      );

      return NextResponse.json(
        { error: "Subscription record not found. Retry webhook." },
        { status: 500 }
      );
    }

    if (
      existing.razorpayPlanId &&
      subscription.plan_id !== existing.razorpayPlanId
    ) {
      console.error("Webhook plan ID mismatch.");

      return NextResponse.json(
        { error: "Subscription plan mismatch." },
        { status: 400 }
      );
    }

    await db
      .update(UserSubscription)
      .set({
        status: subscription.status,
        currentPeriodStart: toDate(subscription.current_start),
        currentPeriodEnd: toDate(subscription.current_end),
        updatedAt: new Date(),
      })
      .where(
        eq(
          UserSubscription.razorpaySubscriptionId,
          subscription.id
        )
      );

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully.",
      status: subscription.status,
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}

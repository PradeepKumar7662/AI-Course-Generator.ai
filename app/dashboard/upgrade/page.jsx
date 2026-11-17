
"use client";

import Link from "next/link";
import { useState } from "react";
import { FiCheck, FiZap, FiArrowLeft, FiShield } from "react-icons/fi";

const plans = [
  {
    name: "Free",
    type: "free",
    price: "₹0",
    period: "forever",
    description: "Get started with AI-powered learning.",
    features: [
      "Create up to 5 lifetime courses",
      "Generate chapter content",
      "Explore available courses",
      "Track your learning",
    ],
    button: "Current Plan",
  },
  {
    name: "Monthly Pro",
    type: "monthly",
    price: "₹199",
    period: "/ month",
    description: "More flexibility for your learning journey.",
    features: [
      "Unlimited AI-generated courses",
      "Generate chapter content",
      "Organize your learning library",
      "Monthly recurring billing",
    ],
    button: "Choose Monthly",
  },
  {
    name: "Yearly Pro",
    type: "yearly",
    price: "₹999",
    period: "/ year",
    description: "Enjoy Pro access with yearly billing.",
    features: [
      "Unlimited AI-generated courses",
      "Generate chapter content",
      "Organize your learning library",
      "Yearly recurring billing",
    ],
    button: "Choose Yearly",
    popular: true,
  },
];

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById("razorpay-checkout");

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });

      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout.")),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");

    script.id = "razorpay-checkout";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay Checkout."));

    document.body.appendChild(script);
  });
}

export default function UpgradePage() {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubscribe = async (planType) => {
    try {
      setLoading(planType);
      setMessage("");
      setError("");

      // 1. Load Razorpay Checkout
      await loadRazorpayScript();

      // 2. Create subscription from backend
      const createResponse = await fetch(
        "/api/razorpay/create-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planType }),
        }
      );

      const subscriptionData = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(
          subscriptionData.error || "Unable to create subscription."
        );
      }

      if (
        !subscriptionData.subscriptionId ||
        !subscriptionData.keyId
      ) {
        throw new Error("Invalid subscription response from server.");
      }

      // 3. Razorpay Checkout configuration
      const options = {
        key: subscriptionData.keyId,

        subscription_id: subscriptionData.subscriptionId,

        name: "AI Courses",

        description:
          planType === "monthly"
            ? "Monthly Pro Subscription - ₹199"
            : "Yearly Pro Subscription - ₹999",

        theme: {
          color: "#6366F1",
        },

        modal: {
          ondismiss: () => {
            setLoading(null);
          },
        },

        // 4. Verify payment on backend
        handler: async function (response) {
          try {
            setLoading("verifying");
            setError("");
            setMessage("");

            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed."
              );
            }

            if (verifyData.status === "active") {
              setMessage(
                "Payment successful! Your Pro subscription is now active."
              );
            } else {
              setMessage(
                `Payment verified. Subscription status: ${verifyData.status}. Pro access will be available after activation.`
              );
            }
          } catch (err) {
            setError(
              err.message || "Payment verification failed."
            );
          } finally {
            setLoading(null);
          }
        },
      };

      // 5. Open Razorpay Checkout
      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setError(
          response.error?.description ||
            "Payment failed. Please try again."
        );

        setLoading(null);
      });

      razorpay.open();
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <FiArrowLeft />
          Back to Dashboard
        </Link>

        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl text-indigo-600">
            <FiZap />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Upgrade Your Learning
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Unlock more possibilities with AI-powered learning.
            Choose a plan that works best for you.
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div
            role="status"
            className="mx-auto mb-6 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700"
          >
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mx-auto mb-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-600"
          >
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">

          {plans.map((plan) => (
            <section
              key={plan.name}
              className={`relative flex flex-col rounded-3xl border bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${
                plan.popular
                  ? "border-indigo-500 ring-2 ring-indigo-100"
                  : "border-slate-200"
              }`}
            >

              {/* Popular Badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                  BEST VALUE
                </span>
              )}

              <h2 className="text-xl font-bold text-slate-900">
                {plan.name}
              </h2>

              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                {plan.description}
              </p>

              {/* Price */}
              <div className="my-7 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {plan.price}
                </span>

                <span className="text-sm text-slate-500">
                  {plan.period}
                </span>
              </div>

              <div className="mb-7 h-px bg-slate-100" />

              {/* Features */}
              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <FiCheck className="text-xs" />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              {plan.type === "free" ? (
                <button
                  type="button"
                  disabled
                  className="mt-8 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500"
                >
                  {plan.button}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!!loading}
                  onClick={() => handleSubscribe(plan.type)}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    plan.popular
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {loading === "verifying"
                    ? "Verifying payment..."
                    : loading === plan.type
                    ? "Please wait..."
                    : plan.button}
                </button>
              )}
            </section>
          ))}

        </div>

        {/* Security Information */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400">
          <FiShield className="shrink-0 text-emerald-600" />
          Secure payment processing powered by Razorpay.
        </div>

        <p className="mt-3 text-center text-xs text-slate-400">
          Subscriptions are billed automatically according to the selected
          billing cycle.
        </p>

      </div>
    </main>
  );
}

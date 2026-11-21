
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      );
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !apiToken) {
      return NextResponse.json(
        { error: "Cloudflare credentials are missing." },
        { status: 500 }
      );
    }

    const { topic, category, description } = await request.json();

    if (
      typeof topic !== "string" ||
      !topic.trim() ||
      topic.length > 150
    ) {
      return NextResponse.json(
        { error: "A valid course topic is required." },
        { status: 400 }
      );
    }

    const safeTopic = topic.trim().slice(0, 150);

    const safeCategory =
      typeof category === "string"
        ? category.trim().slice(0, 80)
        : "Education";

    const safeDescription =
      typeof description === "string"
        ? description.trim().slice(0, 250)
        : "";

   const apiUrl =
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/`;
    // STEP 1: AI understands the course and creates an image prompt.

    const textResponse = await fetch(
      `${apiUrl}@cf/meta/llama-3.2-3b-instruct`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `
You are an expert commercial educational photographer
and AI image prompt engineer.

Your job is to understand any course topic and create
a highly specific image-generation prompt.

The image must look like REAL PROFESSIONAL PHOTOGRAPHY.

Never create 3D renders, cartoons, illustrations,
fantasy landscapes or generic office backgrounds.

Identify the actual objects, tools, equipment,
environment and visual details related to the course.

For programming courses, show relevant code and
a realistic software development environment.

For business courses, show relevant business objects.
For science courses, show relevant scientific equipment.
For creative courses, show relevant creative tools.

Do not use the same generic laptop or office scene
for every course.

The image must represent the exact course topic,
not just its broad category.

Use realistic lighting, natural shadows,
professional composition and sharp details.

Wide landscape 16:9 composition.
No text, no logos, no watermark.

Return ONLY the final image prompt.
Do not include explanations or markdown.
              `,
            },
            {
              role: "user",
              content: `
Course name: ${safeTopic}
Category: ${safeCategory}
Description: ${safeDescription}

Create a unique, detailed and realistic
photographic image prompt for this course.
              `,
            },
          ],
          max_tokens: 400,
        }),
        cache: "no-store",
      }
    );

    const textResult = await textResponse.json();

    if (
      !textResponse.ok ||
      !textResult.success ||
      !textResult.result?.response
    ) {
      console.error(
        "AI PROMPT GENERATION ERROR:",
        textResponse.status,
        textResult.errors
      );

      return NextResponse.json(
        { error: "Unable to create course image prompt." },
        { status: 502 }
      );
    }

    const imagePrompt = textResult.result.response.trim();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: "AI generated an empty image prompt." },
        { status: 502 }
      );
    }

    console.log("AI GENERATED IMAGE PROMPT:", imagePrompt);

    // STEP 2: Generate the actual course banner using FLUX.

    const imageResponse = await fetch(
      `${apiUrl}@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          steps: 4,
        }),
        cache: "no-store",
      }
    );

    const imageResult = await imageResponse.json();

    if (
      !imageResponse.ok ||
      !imageResult.success ||
      !imageResult.result?.image
    ) {
      console.error(
        "FLUX IMAGE GENERATION ERROR:",
        imageResponse.status,
        imageResult.errors
      );

      return NextResponse.json(
        { error: "Course banner image generation failed." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      image: imageResult.result.image,
      contentType: "image/jpeg",
      prompt: imagePrompt,
    });

  } catch (error) {
    console.error("GENERATE BANNER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to generate course banner." },
      { status: 500 }
    );
  }
}

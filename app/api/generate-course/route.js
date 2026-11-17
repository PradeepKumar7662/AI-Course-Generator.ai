
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";

const MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const { category, topic, level, duration, noOfChapter } =
      await request.json();

    if (!category || !topic || !level || !duration || !noOfChapter) {
      return NextResponse.json(
        { error: "Please fill in all course details." },
        { status: 400 }
      );
    }

    const prompt = `
Generate a complete course layout as valid JSON only.
Do not use Markdown code fences or extra text.

Required JSON structure:
{
  "Course Name": "string",
  "Description": "string",
  "Category": "string",
  "Topic": "string",
  "Level": "string",
  "Duration": "string",
  "NoOf Chapter": number,
  "Chapters": [
    {
      "Chapter Name": "string",
      "about": "string",
      "Duration": "string"
    }
  ]
}

Course details:
Category: ${category}
Topic: ${topic}
Level: ${level}
Duration: ${duration}
Number of chapters: ${noOfChapter}

Return exactly the requested number of chapters.
All fields must contain useful values.
`;

    const genAI = new GoogleGenerativeAI(apiKey);
    let lastError;

  
for (const modelName of MODELS) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `Trying ${modelName}, attempt ${attempt}/2`
      );

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const courseLayout = JSON.parse(text);

      if (
        !courseLayout ||
        !Array.isArray(courseLayout.Chapters)
      ) {
        throw new Error("Invalid course JSON returned by Gemini");
      }

      console.log("Course generated successfully:", modelName);

      return NextResponse.json({
        success: true,
        model: modelName,
        courseLayout,
      });
    } catch (error) {
      lastError = error;
      const message = error?.message || "";

      console.error(`${modelName} attempt ${attempt} failed:`, message);

      if (
        message.includes("400") ||
        message.includes("401") ||
        message.includes("403") ||
        message.includes("GEMINI_API_KEY")
      ) {
        break;
      }

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }
}


    console.error("All Gemini models failed:", lastError);

    return NextResponse.json(
      {
        error:
          "Course generation failed on all available models. Please check the server logs and Gemini API status.",
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Generate course API error:", error);

    return NextResponse.json(
      { error: "Invalid request or course generation failed." },
      { status: 500 }
    );
  }
}

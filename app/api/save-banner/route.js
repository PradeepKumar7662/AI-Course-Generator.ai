import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

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

    const { image } = await request.json();

    if (typeof image !== "string") {
      return NextResponse.json(
        { error: "Image is required." },
        { status: 400 }
      );
    }

    const match = image.match(
      /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/
    );

    if (!match) {
      return NextResponse.json(
        { error: "Invalid JPEG image." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(match[1], "base64");

    if (
      buffer.length === 0 ||
      buffer.length > 4 * 1024 * 1024 ||
      buffer[0] !== 0xff ||
      buffer[1] !== 0xd8 ||
      buffer[2] !== 0xff
    ) {
      return NextResponse.json(
        { error: "Image is invalid or larger than 4 MB." },
        { status: 400 }
      );
    }

    const folder = path.join(
      process.cwd(),
      "public",
      "course-banners"
    );

    await mkdir(folder, { recursive: true });

    const fileName = `${crypto.randomUUID()}.jpg`;

    await writeFile(
      path.join(folder, fileName),
      buffer,
      { flag: "wx" }
    );

    return NextResponse.json({
      url: `/course-banners/${fileName}`,
    });
  } catch (error) {
    console.error("SAVE BANNER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to save banner locally." },
      { status: 500 }
    );
  }
} 
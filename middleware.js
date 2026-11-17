
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Check authentication
  const { userId } = await auth();

  // Allow logged-in users
  if (userId) {
    return NextResponse.next();
  }

  // Return 401 for unauthenticated API requests
  if (
    req.nextUrl.pathname.startsWith("/api/") ||
    req.nextUrl.pathname.startsWith("/trpc/")
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Redirect unauthenticated users to sign-in
  return NextResponse.redirect(new URL("/sign-in", req.url));
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

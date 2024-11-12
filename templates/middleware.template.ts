import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware function for handling requests.
 * Customize the logic below as needed.
 */
export function middleware(req: NextRequest): NextResponse | undefined {
  console.log(`Middleware triggered for ${req.nextUrl.pathname}`);

  // Example: Continue to the next middleware or route
  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    "/api/:path*", // Apply to all API routes
    "/protected/*", // Apply to protected routes
  ],
};

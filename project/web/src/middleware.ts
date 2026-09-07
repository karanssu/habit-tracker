import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

// NOTE: middleware runs on the Edge runtime, where the `jsonwebtoken`
// package's Node crypto APIs aren't available. So this only checks that a
// token cookie exists (fast redirect for logged-out users); the actual
// signature verification happens in the dashboard Server Component, which
// runs on Node. If you outgrow this, swap to the `jose` library here so you
// can verify properly at the edge too.
export function middleware(req: NextRequest) {
  const hasToken = req.cookies.has(COOKIE_NAME);
  if (!hasToken && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

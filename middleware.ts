import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Redirect root to dashboard
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  // Matcher to protect all routes except login, api/auth, and static files
  matcher: [
    "/",
    "/dashboard/:path*",
    "/settings/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/customers/:path*",
  ],
};
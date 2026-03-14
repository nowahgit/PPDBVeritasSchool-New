import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If no token and not on public route, withAuth handles redirection to signIn page automatically
    
    if (token) {
      const role = token.role;

      // Pendaftar access control
      if (
        (path.startsWith("/dashboard") ||
          path.startsWith("/pendaftaran") ||
          path.startsWith("/status")) &&
        role !== "PENDAFTAR"
      ) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // Admin access control
      if (path.startsWith("/admin") && role !== "PANITIA") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/pendaftaran/:path*", "/status/:path*", "/admin/:path*"],
};

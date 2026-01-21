import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // IMPORTANT: middleware runs on the Edge runtime.
  // Do NOT import Prisma/bcrypt/NextAuth server helpers here.
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });
  const role = (token as any)?.role as string | undefined;
  const isAdmin = role === "ADMIN" || role === "DEVELOPER";

  // Allow public routes
  const publicRoutes = ["/", "/team", "/services", "/contact", "/privacy", "/auth"];
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Protect project routes
  if (request.nextUrl.pathname.startsWith("/projects")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*", "/admin/:path*"]
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {

  // const token = request.cookies.get("token")?.value;
  // const { pathname } = request.nextUrl;

  // // Allow login page
  // if (pathname.startsWith("/login")) {

  //   if (token) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }

  //   return NextResponse.next();
  // }

  // // If not logged in → redirect
  // if (!token) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|_next|favicon.ico).*)",
  ],
};
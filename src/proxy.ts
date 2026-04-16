import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  validateSessionToken,
} from "@/lib/admin-auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const session = validateSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
  );

  if (pathname === ADMIN_LOGIN_PATH) {
    if (session) {
      return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

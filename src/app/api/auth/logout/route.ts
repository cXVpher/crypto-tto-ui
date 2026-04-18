import { NextResponse } from "next/server";

import { getAccessTokenCookieOptions } from "@/lib/auth-cookie";

export async function POST() {
  const response = NextResponse.json({
    message: "Logged out successfully.",
  });

  response.cookies.set({
    ...getAccessTokenCookieOptions(0),
    value: "",
  });

  return response;
}

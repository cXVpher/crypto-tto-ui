import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_COOKIE_NAME, getAccessTokenCookieOptions } from "@/lib/auth-cookie";
import { getWalletSessionSnapshot } from "@/lib/server-wallet-session";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const session = await getWalletSessionSnapshot(accessToken);

    return NextResponse.json({
      message: "Success",
      data: session,
    });
  } catch (error) {
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : 500;

    const response = NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to restore wallet session.",
      },
      { status }
    );

    if (status === 401) {
      response.cookies.set({
        ...getAccessTokenCookieOptions(0),
        value: "",
      });
    }

    return response;
  }
}

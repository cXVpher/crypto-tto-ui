export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

export function getAccessTokenCookieOptions(maxAge?: number) {
  return {
    name: ACCESS_TOKEN_COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(typeof maxAge === "number" ? { maxAge } : {}),
  };
}

import "server-only";

import { cookies, headers } from "next/headers";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

const ACCESS_TOKEN_COOKIE_NAMES = [
  "accessToken",
  "access_token",
  "token",
  "authToken",
  "auth_token",
] as const;

const ACCESS_TOKEN_HEADER_NAMES = [
  "authorization",
  "x-access-token",
  "x-auth-token",
] as const;

function readBearerToken(value: string | null) {
  if (!value) return undefined;

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return undefined;
  }

  if (/^Bearer\s+/i.test(trimmedValue)) {
    return trimmedValue.replace(/^Bearer\s+/i, "").trim() || undefined;
  }

  return trimmedValue;
}

export async function getServerAccessToken() {
  if (USE_MOCK_API) {
    return undefined;
  }

  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()]);

  for (const headerName of ACCESS_TOKEN_HEADER_NAMES) {
    const headerToken = readBearerToken(headerStore.get(headerName));

    if (headerToken) {
      return headerToken;
    }
  }

  for (const cookieName of ACCESS_TOKEN_COOKIE_NAMES) {
    const cookieToken = readBearerToken(cookieStore.get(cookieName)?.value ?? null);

    if (cookieToken) {
      return cookieToken;
    }
  }

  return undefined;
}

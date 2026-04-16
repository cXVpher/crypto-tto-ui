import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_HOME_PATH,
  ADMIN_LOGIN_PATH,
  ADMIN_SESSION_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  type AdminSession,
  validateSessionToken,
} from "@/lib/admin-auth";

const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};

export const readAdminSession = cache(async (): Promise<AdminSession | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  return validateSessionToken(token);
});

export async function requireAdminSession() {
  const session = await readAdminSession();

  if (!session) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return session;
}

export async function createAdminSession() {
  const cookieStore = await cookies();
  const token = createSessionToken();

  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, token, ADMIN_COOKIE_OPTIONS);

  return token;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE_NAME, "", {
    ...ADMIN_COOKIE_OPTIONS,
    maxAge: 0,
  });
}

export function redirectToAdminHome() {
  redirect(ADMIN_HOME_PATH);
}

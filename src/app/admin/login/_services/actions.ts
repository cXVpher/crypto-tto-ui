"use server";

import { redirect } from "next/navigation";

import type { AdminLoginActionState } from "@/app/admin/login/_services/action-types";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH, verifyPassphrase } from "@/lib/admin-auth";
import {
  clearAdminSession,
  createAdminSession,
  requireAdminSession,
} from "@/lib/admin-session";

export async function loginAdminAction(
  _previousState: AdminLoginActionState,
  formData: FormData
): Promise<AdminLoginActionState> {
  const passphrase = String(formData.get("passphrase") ?? "");

  if (!verifyPassphrase(passphrase)) {
    return {
      error: "The admin passphrase is invalid.",
    };
  }

  await createAdminSession();
  redirect(ADMIN_HOME_PATH);
}

export async function logoutAdminAction() {
  await requireAdminSession();
  await clearAdminSession();
  redirect(ADMIN_LOGIN_PATH);
}

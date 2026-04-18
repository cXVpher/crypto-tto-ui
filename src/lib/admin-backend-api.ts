import "server-only";

import { cookies } from "next/headers";

import { ACCESS_TOKEN_COOKIE_NAME } from "@/lib/auth-cookie";
import { fetchApi, type FetchApiOptions } from "@/lib/fetcher";

function getApiErrorStatus(error: unknown) {
  return typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
    ? error.status
    : undefined;
}

function getApiErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Admin API request failed.";
}

export async function getAdminBackendAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    throw new Error(
      "Admin API access requires a logged-in backend wallet session. Connect an admin wallet first."
    );
  }

  return {
    type: "bearer" as const,
    token,
  };
}

export async function fetchAdminBackendApi<T>(
  path: string,
  options: Omit<FetchApiOptions, "auth"> = {}
) {
  try {
    return await fetchApi<T>(path, {
      ...options,
      auth: await getAdminBackendAuth(),
    });
  } catch (error) {
    const status = getApiErrorStatus(error);

    if (status === 401) {
      throw new Error(
        "The backend wallet session is missing or expired. Reconnect the admin wallet and try again."
      );
    }

    if (status === 403) {
      throw new Error(
        "The current backend wallet is authenticated but is not allowed to access admin endpoints."
      );
    }

    throw new Error(getApiErrorMessage(error));
  }
}

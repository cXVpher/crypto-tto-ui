import { fetchApi } from "@/lib/fetcher";
import {
  TOKEN_NAME,
  TOKEN_PRICE_USDT,
  TOKEN_SYMBOL,
} from "@/app/_lib/mock-data";
import type { ApiAuthOptions, TokenConfig } from "@/app/_types/api-types";

const MOCK_DELAY_MS = 250;

export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
export const BROWSER_API_PROXY_BASE_URL = "/api/backend";

export { fetchApi, TOKEN_NAME, TOKEN_PRICE_USDT, TOKEN_SYMBOL };

export function cloneData<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

export async function resolveMock<T>(value: T) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return cloneData(value);
}

function canUseProxyAuth(baseURL?: string) {
  return typeof baseURL === "string" && baseURL.startsWith("/");
}

export function resolveAuth(options: ApiAuthOptions = {}) {
  if (options.accessToken) {
    return {
      type: "bearer" as const,
      token: options.accessToken,
    };
  }

  if (canUseProxyAuth(options.baseURL)) {
    return undefined;
  }

  throw new Error(
    "An access token is required when NEXT_PUBLIC_USE_MOCK_API=false."
  );
}

export function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

export function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function formatDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatDateTime(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);

  return `${datePart} ${timePart} UTC`;
}

export function formatLevelLabel(level: number) {
  return `LV-${String(level).padStart(2, "0")}`;
}

export function formatStatusLabel(value: unknown, fallback = "Pending") {
  const status = toString(value, fallback)
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();

  if (!status) {
    return fallback;
  }

  return status.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getTokenConfig(): TokenConfig {
  return {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    priceUsdt: TOKEN_PRICE_USDT,
  };
}

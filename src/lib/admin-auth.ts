import crypto from "node:crypto";

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";
export const ADMIN_SESSION_COOKIE_NAME = "admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface AdminSession {
  sub: "admin";
  iat: number;
  exp: number;
}

function getRequiredEnv(name: "ADMIN_PASSPHRASE" | "ADMIN_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required for the admin dashboard.`);
  }

  return value;
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sha256(value: string) {
  return crypto.createHash("sha256").update(value, "utf8").digest();
}

function signPayload(payload: string) {
  return crypto
    .createHmac("sha256", getRequiredEnv("ADMIN_SECRET"))
    .update(payload, "utf8")
    .digest("base64url");
}

function safeCompare(left: string, right: string) {
  return crypto.timingSafeEqual(sha256(left), sha256(right));
}

export function verifyPassphrase(input: string) {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    return false;
  }

  return safeCompare(normalizedInput, getRequiredEnv("ADMIN_PASSPHRASE"));
}

export function createSessionToken() {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload: AdminSession = {
    sub: "admin",
    iat: nowInSeconds,
    exp: nowInSeconds + ADMIN_SESSION_MAX_AGE_SECONDS,
  };

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function validateSessionToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signPayload(encodedPayload);

  if (!safeCompare(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as Partial<AdminSession>;

    if (
      payload.sub !== "admin" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload as AdminSession;
  } catch {
    return null;
  }
}

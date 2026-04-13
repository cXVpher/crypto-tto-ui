type QueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean | null | undefined>;

type QueryParams = Record<string, QueryValue>;

type AuthOptions =
  | {
      type: "basic";
      username: string;
      password: string;
    }
  | {
      type: "bearer";
      token: string;
    };

export interface FetchApiOptions extends Omit<RequestInit, "body" | "headers"> {
  baseURL?: string;
  query?: QueryParams;
  headers?: HeadersInit;
  body?: BodyInit | FormData | Record<string, unknown> | null;
  auth?: AuthOptions;
  unwrapData?: boolean;
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
  meta?: unknown;
  statusCode?: number;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function encodeBase64(value: string) {
  if (typeof window === "undefined") {
    return Buffer.from(value).toString("base64");
  }

  return window.btoa(value);
}

function buildAuthorizationHeader(auth?: AuthOptions) {
  if (!auth) return undefined;

  if (auth.type === "basic") {
    return `Basic ${encodeBase64(`${auth.username}:${auth.password}`)}`;
  }

  return `Bearer ${auth.token}`;
}

function joinUrl(baseURL: string | undefined, url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  const normalizedBase = (baseURL ?? process.env.NEXT_PUBLIC_API_URL ?? "").replace(
    /\/+$/,
    ""
  );
  const normalizedPath = url.replace(/^\/+/, "");

  if (!normalizedBase) {
    return normalizedPath ? `/${normalizedPath}` : "/";
  }

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase;
}

function appendQueryParams(url: string, query?: QueryParams) {
  if (!query) return url;

  const parsedUrl = new URL(
    url,
    url.startsWith("http") ? undefined : "http://localhost"
  );

  Object.entries(query).forEach(([key, value]) => {
    if (value == null) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry != null) {
          parsedUrl.searchParams.append(key, String(entry));
        }
      });
      return;
    }

    parsedUrl.searchParams.set(key, String(value));
  });

  if (url.startsWith("http")) {
    return parsedUrl.toString();
  }

  return `${parsedUrl.pathname}${parsedUrl.search}`;
}

function isRedirectError(error: unknown): error is { digest: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.includes("NEXT_REDIRECT")
  );
}

export async function fetchApi<T>(url: string, options: FetchApiOptions = {}) {
  const {
    baseURL,
    query,
    headers,
    body,
    auth,
    unwrapData = true,
    cache = "no-store",
    ...rest
  } = options;

  const finalUrl = appendQueryParams(joinUrl(baseURL, url), query);
  const requestHeaders = new Headers(headers);
  const authorizationHeader = buildAuthorizationHeader(auth);

  if (authorizationHeader) {
    requestHeaders.set("Authorization", authorizationHeader);
  }

  const isJsonBody = isPlainObject(body);
  const requestBody =
    body == null ? undefined : isJsonBody ? JSON.stringify(body) : body;

  if (isJsonBody && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (!requestHeaders.has("Accept")) {
    requestHeaders.set("Accept", "application/json");
  }

  try {
    const response = await fetch(finalUrl, {
      ...rest,
      cache,
      headers: requestHeaders,
      body: requestBody,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const isJsonResponse = contentType.includes("application/json");
    const payload = isJsonResponse ? await response.json() : await response.text();

    if (!response.ok) {
      const apiError = new Error(
        isPlainObject(payload) && typeof payload.message === "string"
          ? payload.message
          : response.statusText || "Request failed"
      ) as Error & {
        status?: number;
        payload?: unknown;
      };

      apiError.status = response.status;
      apiError.payload = payload;
      throw apiError;
    }

    if (!isJsonResponse) {
      return payload as T;
    }

    if (
      unwrapData &&
      isPlainObject(payload) &&
      "data" in payload
    ) {
      return (payload as unknown as ApiEnvelope<T>).data;
    }

    return payload as T;
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    throw error;
  }
}

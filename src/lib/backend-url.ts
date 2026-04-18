const API_VERSION_PREFIX = "/api/v1";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function normalizeBackendApiPath(path: string) {
  const normalizedPath = path.replace(/^\/+/, "");

  if (!normalizedPath) {
    return API_VERSION_PREFIX;
  }

  if (/^api\/v1(?:\/|$)/i.test(normalizedPath)) {
    return `/${normalizedPath}`;
  }

  if (/^v1(?:\/|$)/i.test(normalizedPath)) {
    return `/api/${normalizedPath}`;
  }

  return `${API_VERSION_PREFIX}/${normalizedPath}`;
}

export function getBackendBaseUrl(baseURL = process.env.NEXT_PUBLIC_API_URL) {
  if (!baseURL) {
    return "";
  }

  return trimTrailingSlash(baseURL).replace(/\/api(?:\/v1)?$/i, "");
}

export function buildBackendApiUrl(
  path: string,
  baseURL = process.env.NEXT_PUBLIC_API_URL
) {
  const apiPath = normalizeBackendApiPath(path);
  const backendBaseUrl = getBackendBaseUrl(baseURL);

  return backendBaseUrl ? `${backendBaseUrl}${apiPath}` : apiPath;
}

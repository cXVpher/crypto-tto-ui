import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_TOKEN_COOKIE_NAME, getAccessTokenCookieOptions } from "@/lib/auth-cookie";
import { buildBackendApiUrl } from "@/lib/backend-url";

export const runtime = "nodejs";

function cloneProxyHeaders(request: NextRequest) {
  const headers = new Headers(request.headers);

  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("cookie");
  headers.delete("host");

  return headers;
}

function cloneResponseHeaders(headers: Headers) {
  const nextHeaders = new Headers(headers);

  nextHeaders.delete("connection");
  nextHeaders.delete("content-encoding");
  nextHeaders.delete("content-length");
  nextHeaders.delete("keep-alive");
  nextHeaders.delete("transfer-encoding");

  return nextHeaders;
}

function isAuthVerifyPath(pathname: string) {
  return pathname === "v1/auth/verify" || pathname === "api/v1/auth/verify";
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const backendPathname = path.join("/");
  const backendUrl = new URL(buildBackendApiUrl(`/${backendPathname}`), request.url);
  backendUrl.search = request.nextUrl.search;

  const requestHeaders = cloneProxyHeaders(request);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;

  if (accessToken && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
  }

  const requestInit: RequestInit = {
    method: request.method,
    headers: requestHeaders,
    cache: "no-store",
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    requestInit.body = await request.arrayBuffer();
  }

  const backendResponse = await fetch(backendUrl, requestInit);

  if (isAuthVerifyPath(backendPathname)) {
    const responseText = await backendResponse.text();
    const responseHeaders = cloneResponseHeaders(backendResponse.headers);
    const response = new NextResponse(responseText, {
      status: backendResponse.status,
      headers: responseHeaders,
    });

    if (backendResponse.ok) {
      try {
        const payload = JSON.parse(responseText) as {
          data?: {
            accessToken?: string;
            expiresIn?: number;
          };
        };

        if (payload.data?.accessToken) {
          response.cookies.set({
            ...getAccessTokenCookieOptions(payload.data.expiresIn),
            value: payload.data.accessToken,
          });
        }
      } catch {
        // Keep the backend response intact even if the payload is not JSON.
      }
    }

    return response;
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: cloneResponseHeaders(backendResponse.headers),
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

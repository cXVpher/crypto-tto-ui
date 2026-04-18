"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BROWSER_API_PROXY_BASE_URL,
  getDashboardData,
} from "@/lib/api-service";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export function useDashboardData(enabled = true) {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: () =>
      getDashboardData({
        baseURL: USE_MOCK_API ? undefined : BROWSER_API_PROXY_BASE_URL,
      }),
    staleTime: 60_000,
    enabled,
  });
}

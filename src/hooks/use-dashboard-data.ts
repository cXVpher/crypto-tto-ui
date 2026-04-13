"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardData } from "@/lib/api-service";

export function useDashboardData(enabled = true) {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: getDashboardData,
    staleTime: 60_000,
    enabled,
  });
}

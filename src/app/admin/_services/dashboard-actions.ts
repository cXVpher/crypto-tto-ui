"use server";

import { revalidatePath } from "next/cache";

import { fetchAdminBackendApi } from "@/app/admin/_services/admin-backend-api";
import { requireAdminSession } from "@/lib/admin-session";

function revalidateAdminRoutes() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/bonding");
  revalidatePath("/admin/transactions");
  revalidatePath("/admin/token");
  revalidatePath("/admin/settings");
}

export async function setAdminUserSuspensionAction(input: {
  userId: string;
  shouldSuspend: boolean;
}) {
  await requireAdminSession();

  if (input.shouldSuspend) {
    await fetchAdminBackendApi(`/v1/admin/users/${input.userId}/suspend`, {
      method: "POST",
      body: {
        reason: "Suspended from the admin dashboard",
      },
    });
  } else {
    await fetchAdminBackendApi(`/v1/admin/users/${input.userId}`, {
      method: "PATCH",
      body: {
        isSuspended: false,
      },
    });
  }

  revalidateAdminRoutes();
}

export async function updateAdminBondingRateAction(input: {
  packageId: string;
  dailyProfitRate: number;
}) {
  await requireAdminSession();

  await fetchAdminBackendApi(`/v1/admin/bonding/config/${input.packageId}`, {
    method: "PATCH",
    body: {
      dailyRate: Number((input.dailyProfitRate / 100).toFixed(4)),
    },
  });

  revalidateAdminRoutes();
}

export async function retryAdminWithdrawalAction(input: { withdrawalId: string }) {
  await requireAdminSession();

  await fetchAdminBackendApi(`/v1/admin/withdrawals/${input.withdrawalId}/retry`, {
    method: "POST",
  });

  revalidateAdminRoutes();
}

export async function updateAdminTokenPriceAction(input: { priceUsdt: number }) {
  await requireAdminSession();

  await fetchAdminBackendApi("/v1/admin/config/tto-price", {
    method: "PATCH",
    body: {
      priceUsdt: input.priceUsdt,
    },
  });

  revalidateAdminRoutes();
}

export async function updateAdminFeesAction(input: {
  swapFeePercent: number;
  flatFeeUsdt: number;
}) {
  await requireAdminSession();

  await Promise.all([
    fetchAdminBackendApi("/v1/admin/config/swap-fee", {
      method: "PATCH",
      body: {
        feePercentage: input.swapFeePercent,
      },
    }),
    fetchAdminBackendApi("/v1/admin/config/withdraw-fee", {
      method: "PATCH",
      body: {
        networkFeeUsdt: input.flatFeeUsdt,
      },
    }),
  ]);

  revalidateAdminRoutes();
}

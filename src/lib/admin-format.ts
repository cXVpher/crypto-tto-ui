import type { AdminTone } from "@/lib/admin-types";

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function formatCompactNumber(value: number) {
  return compactFormatter.format(value);
}

export function formatInteger(value: number) {
  return integerFormatter.format(value);
}

export function formatUsd(value: number) {
  return currencyFormatter.format(value);
}

export function formatPrice(value: number) {
  return priceFormatter.format(value);
}

export function formatTokenAmount(value: number, symbol = "TTO") {
  return `${formatCompactNumber(value)} ${symbol}`;
}

export function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

const adminMonthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export function parseAdminDate(value: string) {
  const normalizedValue = value.trim().replace(/\s+/g, " ");
  const match = normalizedValue.match(
    /^(\d{1,2})\s([A-Za-z]{3})\s(\d{4})(?:\s(\d{2}):(\d{2}))?$/
  );

  if (!match) {
    const parsed = new Date(normalizedValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const [, dayValue, monthKey, yearValue, hourValue = "00", minuteValue = "00"] = match;
  const monthIndex = adminMonthMap[monthKey];

  if (monthIndex == null) {
    return null;
  }

  const date = new Date(
    Number(yearValue),
    monthIndex,
    Number(dayValue),
    Number(hourValue),
    Number(minuteValue)
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getToneClasses(tone: AdminTone) {
  switch (tone) {
    case "emerald":
      return {
        border: "border-emerald-300/16",
        background: "bg-emerald-300/10",
        text: "text-emerald-100",
        accent: "bg-emerald-300",
      };
    case "amber":
      return {
        border: "border-amber-300/16",
        background: "bg-amber-300/10",
        text: "text-amber-100",
        accent: "bg-amber-300",
      };
    case "rose":
      return {
        border: "border-rose-300/16",
        background: "bg-rose-300/10",
        text: "text-rose-100",
        accent: "bg-rose-300",
      };
    case "cyan":
    default:
      return {
        border: "border-cyan-300/16",
        background: "bg-cyan-300/10",
        text: "text-cyan-100",
        accent: "bg-cyan-300",
      };
  }
}

export function getStatusClasses(
  status:
    | "ACTIVE"
    | "SUSPENDED"
    | "REVIEW"
    | "UNKNOWN"
    | "RUNNING"
    | "IDLE"
    | "ENDED"
    | "MATURED"
    | "CANCELLED"
    | "PENDING"
    | "INACTIVE"
    | "COMPLETED"
    | "FAILED"
    | "VERIFIED"
    | "PROCESSING"
) {
  if (status === "ACTIVE" || status === "RUNNING" || status === "COMPLETED") {
    return "border-emerald-300/16 bg-emerald-300/10 text-emerald-100";
  }

  if (
    status === "REVIEW" ||
    status === "PENDING" ||
    status === "VERIFIED" ||
    status === "PROCESSING"
  ) {
    return "border-amber-300/16 bg-amber-300/10 text-amber-100";
  }

  if (status === "FAILED" || status === "SUSPENDED" || status === "CANCELLED") {
    return "border-rose-300/16 bg-rose-300/10 text-rose-100";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

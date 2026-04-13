"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Fire } from "@phosphor-icons/react";
import type { BondingPackage } from "@/lib/api-service";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

interface AddBondingFormProps {
  packages: BondingPackage[];
  preselectedPackage?: string;
}

export function AddBondingForm({
  packages,
  preselectedPackage,
}: AddBondingFormProps) {
  const fallbackPackageId = String(packages[1]?.id ?? packages[0]?.id ?? "");
  const [selectedPackage, setSelectedPackage] = useState(() => {
    const initialPackage = preselectedPackage || fallbackPackageId;
    return packages.some((item) => String(item.id) === initialPackage)
      ? initialPackage
      : String(packages[0]?.id ?? "");
  });
  const [amount, setAmount] = useState("50000");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const pkg = packages.find((item) => String(item.id) === selectedPackage);
  const minimumAmount = pkg?.minAmount ?? 0;
  const hasAmount = amount.trim() !== "";
  const parsedAmount = Number(amount);
  const isValidAmount =
    hasAmount &&
    Number.isFinite(parsedAmount) &&
    parsedAmount >= minimumAmount;
  const estimatedDailyReturn =
    pkg && isValidAmount ? parsedAmount * (pkg.dailyProfit / 100) : 0;
  const validationMessage =
    hasAmount && !Number.isFinite(parsedAmount)
      ? `Enter a valid ${TOKEN_SYMBOL} amount.`
      : hasAmount && parsedAmount < minimumAmount
        ? `Minimum for this package is ${formatBalance(minimumAmount)} ${TOKEN_SYMBOL}.`
        : null;

  function handleAmountChange(value: string) {
    setAmount(value);
    if (isSubmitted) setIsSubmitted(false);
  }

  function handlePackageChange(value: string) {
    setSelectedPackage(value);
    if (isSubmitted) setIsSubmitted(false);
  }

  function handleSubmit() {
    if (!isValidAmount) return;
    setIsSubmitted(true);
  }

  return (
    <div className="px-4 pt-4">
      {pkg ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4 rounded-xl border p-4"
          style={{
            background: "rgba(255,255,255,0.075)",
            borderColor: "rgba(126,194,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "rgba(249,115,22,0.16)",
              border: "1px solid rgba(249,115,22,0.24)",
            }}
          >
            <Fire className="h-5 w-5" style={{ color: "#fb923c" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#dbe5ff" }}>
              {pkg.name}
            </p>
            <p className="text-[11px]" style={{ color: "#98abd4" }}>
              Daily profit up to{" "}
              <span className="font-semibold" style={{ color: "#f5c451" }}>
                {pkg.dailyProfit}%
              </span>
            </p>
          </div>
        </motion.div>
      ) : null}

      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Add New Bonding
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5"
      >
        <div>
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Bonding Package
          </label>
          <select
            value={selectedPackage}
            onChange={(e) => handlePackageChange(e.target.value)}
            className="field-input w-full cursor-pointer appearance-none rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          >
            {packages.map((item) => (
              <option
                key={item.id}
                value={String(item.id)}
                className="bg-navy-light"
              >
                {item.days} Days
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Amount ({TOKEN_SYMBOL})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="Enter amount"
            className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          />
          <p className="mt-2 text-[10px] text-muted-foreground">
            Minimum: {formatBalance(minimumAmount)} {TOKEN_SYMBOL}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Estimated Daily Return
          </label>
          <div className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold">
            {estimatedDailyReturn > 0
              ? `${formatBalance(estimatedDailyReturn)} ${TOKEN_SYMBOL}`
              : `0 ${TOKEN_SYMBOL}`}
          </div>
        </div>

        {validationMessage ? (
          <FormFeedback variant="error">{validationMessage}</FormFeedback>
        ) : null}

        {isSubmitted ? (
          <FormFeedback variant="success">
            Bonding contract draft is ready. You can connect backend creation to
            this confirmation state later.
          </FormFeedback>
        ) : (
          <FormFeedback>
            Select a package and enter an amount to preview the minimum and
            estimated daily return.
          </FormFeedback>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          className="btn-gold mt-4 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleSubmit}
          disabled={!isValidAmount}
          style={{
            background:
              "linear-gradient(135deg, rgba(126,194,255,0.62) 0%, rgba(75,125,232,0.82) 100%)",
            boxShadow:
              "0 4px 20px rgba(126,194,255,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
            color: "#ffffff",
          }}
        >
          Create Contract
        </motion.button>
      </motion.div>
    </div>
  );
}

"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Fire } from "@phosphor-icons/react";
import { PageHeader } from "@/components/layout/page-header";
import { FormFeedback } from "@/components/ui/form-feedback";
import { bondingPackages, TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

function AddBondingForm() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("package");

  const [selectedPackage, setSelectedPackage] = useState(
    preselectedId || String(bondingPackages[1].id)
  );
  const [amount, setAmount] = useState("50000");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const pkg = bondingPackages.find((item) => String(item.id) === selectedPackage);
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
          className="mb-6 flex items-center gap-4 rounded-xl border border-white/5 bg-navy-lighter/50 p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/10">
            <Fire className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{pkg.name}</p>
            <p className="text-[11px] text-muted-foreground">
              Daily profit up to{" "}
              <span className="font-semibold text-gold">{pkg.dailyProfit}%</span>
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
            className="w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-sm text-foreground transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          >
            {bondingPackages.map((item) => (
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
            className="w-full rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
          <p className="mt-2 text-[10px] text-muted-foreground">
            Minimum: {formatBalance(minimumAmount)} {TOKEN_SYMBOL}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Estimated Daily Return
          </label>
          <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm font-semibold text-true-gold">
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
              "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
            boxShadow:
              "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            color: "#ffffff",
          }}
        >
          Create Contract
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function AddBondingPage() {
  return (
    <div className="flex min-h-screen flex-col pb-24">
      <PageHeader title="Bonding Package" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
            Loading...
          </div>
        }
      >
        <AddBondingForm />
      </Suspense>
    </div>
  );
}

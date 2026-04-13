"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Stack } from "@phosphor-icons/react";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function PurchaseForm() {
  const [amountUsdt, setAmountUsdt] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minAmount = 1;
  const price = TOKEN_PRICE_USDT;
  const hasAmount = amountUsdt.trim() !== "";
  const parsedAmount = Number(amountUsdt);
  const isValidAmount =
    hasAmount && Number.isFinite(parsedAmount) && parsedAmount >= minAmount;
  const receiveAmount = isValidAmount ? parsedAmount / price : 0;
  const validationMessage =
    hasAmount && !Number.isFinite(parsedAmount)
      ? "Enter a valid USDT amount."
      : hasAmount && parsedAmount < minAmount
        ? `Minimum deposit is ${minAmount} USDT.`
        : null;

  function handleAmountChange(value: string) {
    setAmountUsdt(value);
    if (isSubmitted) setIsSubmitted(false);
  }

  function handleSubmit() {
    if (!isValidAmount) return;
    setIsSubmitted(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Amount (USDT)
        </label>
        <input
          type="number"
          placeholder="Min. 1 USDT"
          value={amountUsdt}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Price (USDT)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm">
          {price}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Receive ({TOKEN_SYMBOL})
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold">
          {receiveAmount > 0
            ? `${formatBalance(receiveAmount)} ${TOKEN_SYMBOL}`
            : `0 ${TOKEN_SYMBOL}`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl border border-white/5 bg-navy-lighter/40 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Stack className="h-4 w-4 text-gold" />
            <span className="text-[11px] font-bold text-true-gold">
              {TOKEN_SYMBOL}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Distributed to BONDING
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-navy-lighter/40 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Gift className="h-4 w-4 text-gold" />
            <span className="text-[11px] font-bold text-true-gold">
              {TOKEN_SYMBOL}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Distributed to AIRDROP
          </p>
        </div>
      </div>

      {validationMessage ? (
        <FormFeedback variant="error">{validationMessage}</FormFeedback>
      ) : null}

      {isSubmitted ? (
        <FormFeedback variant="success">
          Deposit request prepared successfully. Backend confirmation can plug
          into this state next.
        </FormFeedback>
      ) : (
        <FormFeedback>
          Enter a deposit amount to preview how much {TOKEN_SYMBOL} you will
          receive.
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
        DEPOSIT
      </motion.button>
    </motion.div>
  );
}

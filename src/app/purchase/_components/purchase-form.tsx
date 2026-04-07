"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Layers } from "lucide-react";
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
        ? `Minimum purchase is ${minAmount} USDT.`
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
          className="w-full rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Price (USDT)
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm text-true-gold">
          {price}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Receive ({TOKEN_SYMBOL})
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm font-semibold text-true-gold">
          {receiveAmount > 0
            ? `${formatBalance(receiveAmount)} ${TOKEN_SYMBOL}`
            : `0 ${TOKEN_SYMBOL}`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-xl border border-white/5 bg-navy-lighter/40 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-gold" />
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
          Purchase request prepared successfully. Backend confirmation can plug
          into this state next.
        </FormFeedback>
      ) : (
        <FormFeedback>
          Enter a purchase amount to preview how much {TOKEN_SYMBOL} you will
          receive.
        </FormFeedback>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-gold mt-4 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleSubmit}
        disabled={!isValidAmount}
      >
        PURCHASE
      </motion.button>
    </motion.div>
  );
}

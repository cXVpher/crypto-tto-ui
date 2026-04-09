"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { FormFeedback } from "@/components/ui/form-feedback";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function SwapForm() {
  const { walletAddress, balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minAmount = 10;
  const feeRate = 0.01;
  const hasAmount = amount.trim() !== "";
  const numAmount = Number(amount);
  const isValidAmount =
    hasAmount &&
    Number.isFinite(numAmount) &&
    numAmount >= minAmount &&
    numAmount <= balance;
  const fee = isValidAmount ? numAmount * feeRate : 0;
  const receiveUsdt = isValidAmount ? (numAmount - fee) * TOKEN_PRICE_USDT : 0;
  const validationMessage =
    hasAmount && !Number.isFinite(numAmount)
      ? `Enter a valid ${TOKEN_SYMBOL} amount.`
      : hasAmount && numAmount < minAmount
        ? `Minimum swap is ${minAmount} ${TOKEN_SYMBOL}.`
        : hasAmount && numAmount > balance
          ? `Available balance is ${formatBalance(balance)} ${TOKEN_SYMBOL}.`
          : null;

  function handleAmountChange(value: string) {
    setAmount(value);
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
      className="space-y-4"
    >
      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Amount ({TOKEN_SYMBOL})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder={`Minimum ${minAmount} ${TOKEN_SYMBOL}`}
          className="w-full rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Available: {formatBalance(balance)} {TOKEN_SYMBOL}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-navy-lighter">
          <ArrowsDownUp className="h-4 w-4 text-gold" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Fee ({TOKEN_SYMBOL})
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm text-true-gold">
          {fee > 0 ? formatBalance(fee) : "0"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Receive (USDT)
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm font-semibold text-true-gold">
          {receiveUsdt > 0 ? `$${formatBalance(receiveUsdt)}` : "$0.00"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Recipient Address
        </label>
        <div className="w-full break-all rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 font-mono text-[11px] text-muted-foreground">
          {walletAddress}
        </div>
      </div>

      {validationMessage ? (
        <FormFeedback variant="error">{validationMessage}</FormFeedback>
      ) : null}

      {isSubmitted ? (
        <FormFeedback variant="success">
          Swap preview submitted. Backend execution can replace this confirmation
          state later.
        </FormFeedback>
      ) : (
        <FormFeedback>
          A {formatBalance(feeRate * 100)}% fee is applied before the USDT
          estimate is calculated.
        </FormFeedback>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-cash mt-2 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
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
        SWAP
      </motion.button>
    </motion.div>
  );
}

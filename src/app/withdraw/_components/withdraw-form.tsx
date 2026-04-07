"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet } from "lucide-react";
import { FormFeedback } from "@/components/ui/form-feedback";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_PRICE_USDT, TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function WithdrawForm() {
  const { walletAddress, balance } = useWallet();
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState(walletAddress);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const feeRate = 0.01;
  const hasAmount = amount.trim() !== "";
  const parsedAmount = Number(amount);
  const hasRecipient = recipient.trim().length >= 10;
  const isValidAmount =
    hasAmount &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= balance;
  const grossUsd = isValidAmount ? parsedAmount * TOKEN_PRICE_USDT : 0;
  const feeUsd = isValidAmount ? grossUsd * feeRate : 0;
  const receiveAmountUsd = isValidAmount
    ? grossUsd - feeUsd
    : 0;
  const validationMessage =
    !hasRecipient
      ? "Enter a valid recipient address."
      : hasAmount && !Number.isFinite(parsedAmount)
        ? `Enter a valid ${TOKEN_SYMBOL} amount.`
        : hasAmount && parsedAmount <= 0
          ? `Amount must be greater than 0 ${TOKEN_SYMBOL}.`
          : hasAmount && parsedAmount > balance
            ? `Available balance is ${formatBalance(balance)} ${TOKEN_SYMBOL}.`
            : null;

  function handleAmountChange(value: string) {
    setAmount(value);
    if (isSubmitted) setIsSubmitted(false);
  }

  function handleRecipientChange(value: string) {
    setRecipient(value);
    if (isSubmitted) setIsSubmitted(false);
  }

  function handleSubmit() {
    if (!isValidAmount || !hasRecipient) return;
    setIsSubmitted(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-5"
    >
      <FormFeedback>
        Withdrawal is currently a frontend-only request preview while backend
        processing is being built. A {formatBalance(feeRate * 100)}% network fee
        is deducted from the USD payout.
      </FormFeedback>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Amount ({TOKEN_SYMBOL})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          placeholder={`Max ${formatBalance(balance)} ${TOKEN_SYMBOL}`}
          className="w-full rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Available: {formatBalance(balance)} {TOKEN_SYMBOL}
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-navy-lighter">
          <ArrowRight className="h-4 w-4 text-gold" />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Recipient Address
        </label>
        <textarea
          value={recipient}
          onChange={(e) => handleRecipientChange(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-navy-lighter px-4 py-3 text-[11px] text-foreground transition-all focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Network Fee (USD)
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm text-true-gold">
          {feeUsd > 0 ? `$${formatBalance(feeUsd)}` : "$0.00"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          You Receive (USD)
        </label>
        <div className="w-full rounded-xl border border-white/5 bg-navy-lighter/50 px-4 py-3 text-sm font-semibold text-true-gold">
          {receiveAmountUsd > 0 ? `$${formatBalance(receiveAmountUsd)}` : "$0.00"}
        </div>
      </div>

      <div className="rounded-xl border border-white/5 bg-navy-lighter/40 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gold" />
          <span className="text-[11px] font-bold text-true-gold">
            Connected wallet
          </span>
        </div>
        <p className="break-all font-mono text-[10px] text-muted-foreground">
          {walletAddress}
        </p>
      </div>

      {validationMessage ? (
        <FormFeedback variant="error">{validationMessage}</FormFeedback>
      ) : null}

      {isSubmitted ? (
        <FormFeedback variant="success">
          Withdraw request prepared successfully. Backend processing can attach
          to this confirmation state when it is ready.
        </FormFeedback>
      ) : null}

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-gold w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleSubmit}
        disabled={!isValidAmount || !hasRecipient}
      >
        SUBMIT WITHDRAW
      </motion.button>
    </motion.div>
  );
}

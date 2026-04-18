"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gift, Stack } from "@phosphor-icons/react";

import {
  BROWSER_API_PROXY_BASE_URL,
  confirmDeposit,
  getDepositPriceData,
  getDepositQuote,
} from "@/lib/api-service";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export function PurchaseForm() {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const [amountUsdt, setAmountUsdt] = useState("");
  const [txHashPayment, setTxHashPayment] = useState("");
  const [priceUsdt, setPriceUsdt] = useState(TOKEN_PRICE_USDT);
  const [receiveAmount, setReceiveAmount] = useState(0);
  const [quoteError, setQuoteError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const minAmount = 1;
  const hasAmount = amountUsdt.trim() !== "";
  const parsedAmount = Number(amountUsdt);
  const isValidAmount =
    hasAmount && Number.isFinite(parsedAmount) && parsedAmount >= minAmount;
  const requiresTxHash = !USE_MOCK_API;
  const isValidTxHash = txHashPayment.trim().length >= 10;
  const validationMessage =
    hasAmount && !Number.isFinite(parsedAmount)
      ? "Enter a valid USDT amount."
      : hasAmount && parsedAmount < minAmount
        ? `Minimum deposit is ${minAmount} USDT.`
        : null;

  useEffect(() => {
    if (USE_MOCK_API) {
      return;
    }

    let isCancelled = false;

    getDepositPriceData({
      baseURL: BROWSER_API_PROXY_BASE_URL,
    })
      .then((price) => {
        if (!isCancelled) {
          setPriceUsdt(price.ttoPriceUsdt);
        }
      })
      .catch(() => {
        // Keep the last known price fallback in the form.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isValidAmount) {
      setQuoteError("");
      setReceiveAmount(0);
      return;
    }

    if (USE_MOCK_API) {
      setQuoteError("");
      setReceiveAmount(parsedAmount / TOKEN_PRICE_USDT);
      return;
    }

    let isCancelled = false;

    setIsQuoteLoading(true);
    getDepositQuote(parsedAmount, {
      baseURL: BROWSER_API_PROXY_BASE_URL,
    })
      .then((quote) => {
        if (isCancelled) {
          return;
        }

        setPriceUsdt(quote.ttoPriceUsdt);
        setReceiveAmount(quote.ttoReceive);
        setQuoteError("");
      })
      .catch((error) => {
        if (isCancelled) {
          return;
        }

        setReceiveAmount(0);
        setQuoteError(
          error instanceof Error ? error.message : "Unable to load deposit quote."
        );
      })
      .finally(() => {
        if (!isCancelled) {
          setIsQuoteLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isValidAmount, parsedAmount]);

  function resetMessages() {
    if (isSubmitted) {
      setIsSubmitted(false);
    }

    if (submitError) {
      setSubmitError("");
    }
  }

  function handleAmountChange(value: string) {
    setAmountUsdt(value);
    resetMessages();
  }

  function handleTxHashChange(value: string) {
    setTxHashPayment(value);
    resetMessages();
  }

  async function handleSubmit() {
    if (!isValidAmount || (requiresTxHash && !isValidTxHash)) {
      return;
    }

    if (USE_MOCK_API) {
      setSubmitError("");
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await confirmDeposit(txHashPayment.trim(), walletAddress, parsedAmount, {
        baseURL: BROWSER_API_PROXY_BASE_URL,
      });
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit the deposit confirmation."
      );
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  const canSubmit =
    isValidAmount &&
    (!requiresTxHash || isValidTxHash) &&
    !isSubmitting &&
    !isQuoteLoading &&
    !quoteError &&
    receiveAmount > 0;

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
          onChange={(event) => handleAmountChange(event.target.value)}
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Price (USDT)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm">
          ${formatBalance(priceUsdt, 4)}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Receive ({TOKEN_SYMBOL})
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold">
          {isQuoteLoading
            ? "Loading quote..."
            : receiveAmount > 0
              ? `${formatBalance(receiveAmount)} ${TOKEN_SYMBOL}`
              : `0 ${TOKEN_SYMBOL}`}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Payment Tx Hash
        </label>
        <input
          type="text"
          value={txHashPayment}
          onChange={(event) => handleTxHashChange(event.target.value)}
          placeholder="Paste your USDT payment transaction hash"
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Connected wallet: {walletAddress}
        </p>
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
            Added after deposit verification
          </p>
        </div>
        <div className="rounded-xl border border-white/5 bg-navy-lighter/40 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Gift className="h-4 w-4 text-gold" />
            <span className="text-[11px] font-bold text-true-gold">USDT</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Submitted transaction stays pending until verified
          </p>
        </div>
      </div>

      {validationMessage ? (
        <FormFeedback variant="error">{validationMessage}</FormFeedback>
      ) : null}

      {quoteError ? <FormFeedback variant="error">{quoteError}</FormFeedback> : null}

      {submitError ? (
        <FormFeedback variant="error">{submitError}</FormFeedback>
      ) : isSubmitted ? (
        <FormFeedback variant="success">
          {USE_MOCK_API
            ? `Deposit request prepared successfully. Backend confirmation can plug into this state next.`
            : "Deposit confirmation submitted. The backend will verify the payment and credit TTO after validation."}
        </FormFeedback>
      ) : (
        <FormFeedback>
          {USE_MOCK_API
            ? `Enter a deposit amount to preview how much ${TOKEN_SYMBOL} you will receive.`
            : "Enter the USDT amount and payment transaction hash to confirm your deposit with the backend."}
        </FormFeedback>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-gold mt-4 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        onClick={() => void handleSubmit()}
        disabled={!canSubmit}
        style={{
          background:
            "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
          boxShadow:
            "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          color: "#ffffff",
        }}
      >
        {isSubmitting ? "SUBMITTING..." : "DEPOSIT"}
      </motion.button>
    </motion.div>
  );
}

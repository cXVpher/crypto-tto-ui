"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import {
  BROWSER_API_PROXY_BASE_URL,
  getWalletSessionData,
  getWithdrawQuote,
  submitWithdraw,
} from "@/lib/api-service";
import { FormFeedback } from "@/components/ui/form-feedback";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

function createWithdrawFormSchema(balance: number) {
  return z
    .object({
      amount: z
        .string()
        .trim()
        .min(1, "Enter a valid USDT amount.")
        .refine((value) => Number.isFinite(Number(value)), {
          message: "Enter a valid USDT amount.",
        })
        .refine((value) => Number(value) > 0, {
          message: "Amount must be greater than 0 USDT.",
        }),
      recipient: z
        .string()
        .trim()
        .min(10, "Enter a valid recipient address."),
    })
    .superRefine((values, context) => {
      if (Number(values.amount) > balance) {
        context.addIssue({
          code: "custom",
          path: ["amount"],
          message: `Available balance is ${formatBalance(balance)} USDT.`,
        });
      }
    });
}

type WithdrawFormValues = {
  amount: string;
  recipient: string;
};

export function WithdrawForm() {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const usdtBalance = useWalletStore((state) => state.usdtBalance);
  const setWalletSession = useWalletStore((state) => state.setWalletSession);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(createWithdrawFormSchema(usdtBalance) as never),
    mode: "onChange",
    defaultValues: {
      amount: "",
      recipient: walletAddress,
    },
  });
  const amount = useWatch({
    control,
    name: "amount",
    defaultValue: "",
  });
  const recipient = useWatch({
    control,
    name: "recipient",
    defaultValue: walletAddress,
  });
  const parsedAmount = Number(amount);
  const hasPreviewAmount =
    amount.trim() !== "" &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    parsedAmount <= usdtBalance;

  const withdrawQuoteQuery = useQuery({
    queryKey: ["withdrawQuote", parsedAmount],
    queryFn: () =>
      getWithdrawQuote(parsedAmount, {
        baseURL: BROWSER_API_PROXY_BASE_URL,
      }),
    enabled: hasPreviewAmount && !USE_MOCK_API,
    retry: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (!recipient && walletAddress) {
      setValue("recipient", walletAddress, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [recipient, setValue, walletAddress]);

  const activeQuoteFeeUsdt = hasPreviewAmount
    ? USE_MOCK_API
      ? parsedAmount * 0.01
      : withdrawQuoteQuery.data?.networkFeeUsdt ?? 0
    : 0;
  const activeReceiveUsdt = hasPreviewAmount
    ? USE_MOCK_API
      ? parsedAmount - parsedAmount * 0.01
      : withdrawQuoteQuery.data?.youReceiveUsdt ?? 0
    : 0;
  const activeQuoteError =
    hasPreviewAmount && !USE_MOCK_API && withdrawQuoteQuery.error instanceof Error
      ? withdrawQuoteQuery.error.message
      : "";

  function handleFieldChange() {
    if (isSubmitted) {
      setIsSubmitted(false);
    }

    if (submitError) {
      setSubmitError("");
    }
  }

  async function handleValidSubmit(values: WithdrawFormValues) {
    const amountUsdt = Number(values.amount);

    if (USE_MOCK_API) {
      setSubmitError("");
      setIsSubmitted(true);
      return;
    }

    setSubmitError("");

    try {
      await submitWithdraw(amountUsdt, values.recipient.trim(), {
        baseURL: BROWSER_API_PROXY_BASE_URL,
      });
      const session = await getWalletSessionData();

      setWalletSession(session);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit the withdraw request."
      );
      setIsSubmitted(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-5"
      onSubmit={handleSubmit(handleValidSubmit, () => setIsSubmitted(false))}
      noValidate
    >
      <FormFeedback>
        {USE_MOCK_API
          ? "Withdrawal is currently a frontend-only request preview while backend processing is being built."
          : "Withdrawals use your internal USDT balance. The backend applies the live network fee quote before the request is queued."}
      </FormFeedback>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Amount (USDT)
        </label>
        <input
          type="number"
          step="any"
          placeholder={`Max ${formatBalance(usdtBalance)} USDT`}
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          aria-invalid={Boolean(errors.amount)}
          {...register("amount", {
            onChange: handleFieldChange,
          })}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Available: {formatBalance(usdtBalance)} USDT
        </p>
        {errors.amount ? (
          <p className="mt-1 text-[11px] text-red-500">{errors.amount.message}</p>
        ) : null}
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
          rows={3}
          className="field-input w-full resize-none rounded-xl px-4 py-3 text-[11px] transition-all focus:outline-none"
          aria-invalid={Boolean(errors.recipient)}
          {...register("recipient", {
            onChange: handleFieldChange,
          })}
        />
        {errors.recipient ? (
          <p className="mt-1 text-[11px] text-red-500">
            {errors.recipient.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Network Fee (USDT)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm">
          {withdrawQuoteQuery.isLoading
            ? "Loading quote..."
            : activeQuoteFeeUsdt > 0
              ? formatBalance(activeQuoteFeeUsdt)
              : "0.00"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          You Receive (USDT)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold">
          {withdrawQuoteQuery.isLoading
            ? "Loading quote..."
            : activeReceiveUsdt > 0
              ? formatBalance(activeReceiveUsdt)
              : "0.00"}
        </div>
      </div>

      <div className="field-output w-full rounded-xl p-3">
        <div className="mb-2 flex items-center gap-2">
          <Wallet className="h-4 w-4 text-gold" />
          <span className="text-[11px] font-bold text-true-gold">
            Connected wallet
          </span>
        </div>
        <p className="field-output-muted break-all font-mono text-[10px]">
          {walletAddress}
        </p>
      </div>

      {activeQuoteError ? (
        <FormFeedback variant="error">{activeQuoteError}</FormFeedback>
      ) : null}

      {submitError ? (
        <FormFeedback variant="error">{submitError}</FormFeedback>
      ) : isSubmitted ? (
        <FormFeedback variant="success">
          {USE_MOCK_API
            ? "Withdraw request prepared successfully. Backend processing can attach to this confirmation state when it is ready."
            : "Withdraw request submitted successfully. The backend has queued the payout for processing."}
        </FormFeedback>
      ) : null}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="btn-gold w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        disabled={
          !isValid ||
          isSubmitting ||
          withdrawQuoteQuery.isLoading ||
          activeReceiveUsdt <= 0
        }
        style={{
          background:
            "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
          boxShadow:
            "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          color: "#ffffff",
        }}
      >
        {isSubmitting ? "SUBMITTING..." : "SUBMIT WITHDRAW"}
      </motion.button>
    </motion.form>
  );
}

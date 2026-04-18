"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";

import {
  BROWSER_API_PROXY_BASE_URL,
  executeSwap,
  getSwapQuote,
  getWalletSessionData,
} from "@/lib/api-service";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

interface SwapFormProps {
  feePercentage: number;
  minimumTto: number;
  tokenPriceUsdt: number;
}

function createSwapFormSchema(balance: number, minimumTto: number) {
  return z
    .object({
      fromAmount: z
        .string()
        .trim()
        .min(1, `Enter a valid ${TOKEN_SYMBOL} amount.`)
        .refine((value) => Number.isFinite(Number(value)), {
          message: `Enter a valid ${TOKEN_SYMBOL} amount.`,
        })
        .refine((value) => Number(value) >= minimumTto, {
          message: `Minimum swap is ${formatBalance(minimumTto)} ${TOKEN_SYMBOL}.`,
        }),
      toAmount: z.string(),
    })
    .superRefine((values, context) => {
      const fromAmount = Number(values.fromAmount);

      if (fromAmount > balance) {
        context.addIssue({
          code: "custom",
          path: ["fromAmount"],
          message: `Available balance is ${formatBalance(balance)} ${TOKEN_SYMBOL}.`,
        });
      }
    });
}

type SwapFormValues = {
  fromAmount: string;
  toAmount: string;
};

export function SwapForm({
  feePercentage,
  minimumTto,
  tokenPriceUsdt,
}: SwapFormProps) {
  const router = useRouter();
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const balance = useWalletStore((state) => state.balance);
  const setWalletSession = useWalletStore((state) => state.setWalletSession);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SwapFormValues>({
    resolver: zodResolver(
      createSwapFormSchema(balance, minimumTto) as never
    ),
    mode: "onChange",
    defaultValues: {
      fromAmount: "",
      toAmount: "",
    },
  });
  const fromAmount = useWatch({
    control,
    name: "fromAmount",
    defaultValue: "",
  });
  const parsedFromAmount = Number(fromAmount);
  const hasPreviewAmount =
    fromAmount.trim() !== "" &&
    Number.isFinite(parsedFromAmount) &&
    parsedFromAmount >= minimumTto &&
    parsedFromAmount <= balance;

  const swapQuoteQuery = useQuery({
    queryKey: ["swapQuote", parsedFromAmount],
    queryFn: () =>
      getSwapQuote(parsedFromAmount, {
        baseURL: BROWSER_API_PROXY_BASE_URL,
      }),
    enabled: hasPreviewAmount,
    retry: false,
    staleTime: 0,
  });

  const previewFeeTto = hasPreviewAmount
    ? swapQuoteQuery.data?.feeTto ?? 0
    : 0;
  const previewNetUsdt = hasPreviewAmount
    ? swapQuoteQuery.data?.netUsdt ?? 0
    : 0;
  const activeQuoteError =
    hasPreviewAmount && swapQuoteQuery.error instanceof Error
      ? swapQuoteQuery.error.message
      : "";

  useEffect(() => {
    setValue("toAmount", previewNetUsdt > 0 ? String(previewNetUsdt) : "", {
      shouldDirty: false,
      shouldValidate: fromAmount.trim() !== "",
    });
  }, [fromAmount, previewNetUsdt, setValue]);

  function handleFieldChange() {
    if (isSubmitted) {
      setIsSubmitted(false);
      setSubmitMessage("");
    }

    if (submitError) {
      setSubmitError("");
    }
  }

  async function handleValidSubmit(values: SwapFormValues) {
    const amount = Number(values.fromAmount);

    setSubmitError("");

    try {
      const result = await executeSwap(amount, {
        baseURL: BROWSER_API_PROXY_BASE_URL,
      });
      const session = await getWalletSessionData();

      setWalletSession(session);
      setIsSubmitted(true);
      setSubmitMessage(
        `Swap completed. ${formatBalance(result.netUsdt)} USDT was credited to your wallet.`
      );
      router.refresh();
    } catch (error) {
      setIsSubmitted(false);
      setSubmitMessage("");
      setSubmitError(
        error instanceof Error ? error.message : "Unable to execute the swap."
      );
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
      onSubmit={handleSubmit(handleValidSubmit, () => setIsSubmitted(false))}
      noValidate
    >
      <input type="hidden" {...register("toAmount")} />

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Amount ({TOKEN_SYMBOL})
        </label>
        <input
          type="number"
          step="any"
          placeholder={`Minimum ${formatBalance(minimumTto)} ${TOKEN_SYMBOL}`}
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(126, 194, 255, 0.2) 0%, rgba(126, 194, 255, 0.1) 100%)",
            borderColor: "rgba(126, 194, 255, 0.28)",
            boxShadow:
              "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 0 1px rgba(126, 194, 255, 0.04)",
          }}
          aria-invalid={Boolean(errors.fromAmount)}
          {...register("fromAmount", {
            onChange: handleFieldChange,
          })}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Available: {formatBalance(balance)} {TOKEN_SYMBOL}
        </p>
        {errors.fromAmount ? (
          <p className="mt-1 text-[11px] text-red-500">
            {errors.fromAmount.message}
          </p>
        ) : null}
      </div>

      <div className="flex justify-center">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          style={{
            background: "rgba(126,194,255,0.14)",
            borderColor: "rgba(126,194,255,0.18)",
          }}
        >
          <ArrowsDownUp className="h-4 w-4" style={{ color: "#86cbff" }} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Fee ({TOKEN_SYMBOL})
        </label>
        <div
          className="field-output w-full rounded-xl px-4 py-3 text-sm"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.045) 100%)",
          }}
        >
          {swapQuoteQuery.isLoading
            ? "Loading quote..."
            : previewFeeTto > 0
              ? formatBalance(previewFeeTto)
              : "0"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Receive (USDT)
        </label>
        <div
          className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.045) 100%)",
          }}
        >
          {swapQuoteQuery.isLoading
            ? "Loading quote..."
            : previewNetUsdt > 0
              ? `$${formatBalance(previewNetUsdt)}`
              : "$0.00"}
        </div>
        {errors.toAmount ? (
          <p className="mt-1 text-[11px] text-red-500">{errors.toAmount.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Recipient Address
        </label>
        <div
          className="field-output field-output-muted w-full break-all rounded-xl px-4 py-3 font-mono text-[11px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.045) 100%)",
          }}
        >
          {walletAddress}
        </div>
      </div>

      {submitError ? (
        <FormFeedback variant="error">{submitError}</FormFeedback>
      ) : activeQuoteError ? (
        <FormFeedback variant="error">{activeQuoteError}</FormFeedback>
      ) : isSubmitted ? (
        <FormFeedback variant="success">{submitMessage}</FormFeedback>
      ) : (
        <FormFeedback>
          Current TTO price is ${formatBalance(tokenPriceUsdt, 4)} with a{" "}
          {formatBalance(feePercentage, 2)}% swap fee.
        </FormFeedback>
      )}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="btn-cash mt-2 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        disabled={
          !isValid ||
          isSubmitting ||
          swapQuoteQuery.isLoading ||
          previewNetUsdt <= 0
        }
        style={{
          background:
            "linear-gradient(135deg, rgba(126,194,255,0.62) 0%, rgba(75,125,232,0.82) 100%)",
          boxShadow:
            "0 4px 20px rgba(126,194,255,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
          color: "#ffffff",
        }}
      >
        {isSubmitting ? "SWAPPING..." : "SWAP"}
      </motion.button>
    </motion.form>
  );
}

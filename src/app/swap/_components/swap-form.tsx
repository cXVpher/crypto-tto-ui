"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowsDownUp } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

const MIN_SWAP_AMOUNT = 10;

const swapFormSchema = z.object({
  fromAmount: z
    .string()
    .trim()
    .min(1, `Enter a valid ${TOKEN_SYMBOL} amount.`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `Enter a valid ${TOKEN_SYMBOL} amount.`,
    })
    .refine((value) => Number(value) >= MIN_SWAP_AMOUNT, {
      message: `Minimum swap is ${MIN_SWAP_AMOUNT} ${TOKEN_SYMBOL}.`,
    }),
  toAmount: z.string(),
});

function createSwapFormSchema(balance: number) {
  return swapFormSchema.superRefine((values, context) => {
    const fromAmount = Number(values.fromAmount);

    if (fromAmount > balance) {
      context.addIssue({
        code: "custom",
        path: ["fromAmount"],
        message: `Available balance is ${formatBalance(balance)} ${TOKEN_SYMBOL}.`,
      });
    }

    if (
      values.fromAmount.trim() !== "" &&
      Number.isFinite(fromAmount) &&
      fromAmount >= MIN_SWAP_AMOUNT &&
      fromAmount <= balance
    ) {
      const toAmount = Number(values.toAmount);

      if (!Number.isFinite(toAmount) || toAmount <= 0) {
        context.addIssue({
          code: "custom",
          path: ["toAmount"],
          message: "Calculated receive amount must be greater than 0.",
        });
      }
    }
  });
}

type SwapFormValues = z.input<typeof swapFormSchema>;

export function SwapForm() {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const balance = useWalletStore((state) => state.balance);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const feeRate = 0.01;
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SwapFormValues>({
    // Resolver runtime supports this schema; the cast avoids a Zod v4 typing mismatch.
    resolver: zodResolver(createSwapFormSchema(balance) as never),
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
    parsedFromAmount >= MIN_SWAP_AMOUNT &&
    parsedFromAmount <= balance;
  const fee = hasPreviewAmount ? parsedFromAmount * feeRate : 0;
  const receiveUsdt =
    hasPreviewAmount ? (parsedFromAmount - fee) * TOKEN_PRICE_USDT : 0;

  useEffect(() => {
    setValue("toAmount", receiveUsdt > 0 ? String(receiveUsdt) : "", {
      shouldDirty: false,
      shouldValidate: fromAmount.trim() !== "",
    });
  }, [fromAmount, receiveUsdt, setValue]);

  function handleFieldChange() {
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  }

  function handleValidSubmit() {
    setIsSubmitted(true);
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
          placeholder={`Minimum ${MIN_SWAP_AMOUNT} ${TOKEN_SYMBOL}`}
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
          {fee > 0 ? formatBalance(fee) : "0"}
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
          {receiveUsdt > 0 ? `$${formatBalance(receiveUsdt)}` : "$0.00"}
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
        type="submit"
        className="btn-cash mt-2 w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!isValid || isSubmitting}
        style={{
          background:
            "linear-gradient(135deg, rgba(126,194,255,0.62) 0%, rgba(75,125,232,0.82) 100%)",
          boxShadow:
            "0 4px 20px rgba(126,194,255,0.28), inset 0 1px 0 rgba(255,255,255,0.22)",
          color: "#ffffff",
        }}
      >
        SWAP
      </motion.button>
    </motion.form>
  );
}

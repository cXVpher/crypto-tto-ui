"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Wallet } from "@phosphor-icons/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { FormFeedback } from "@/components/ui/form-feedback";
import { TOKEN_PRICE_USDT, TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

const withdrawFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, `Enter a valid ${TOKEN_SYMBOL} amount.`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `Enter a valid ${TOKEN_SYMBOL} amount.`,
    })
    .refine((value) => Number(value) > 0, {
      message: `Amount must be greater than 0 ${TOKEN_SYMBOL}.`,
    }),
  recipient: z.string().trim().min(10, "Enter a valid recipient address."),
});

function createWithdrawFormSchema(balance: number) {
  return withdrawFormSchema.superRefine((values, context) => {
    if (Number(values.amount) > balance) {
      context.addIssue({
        code: "custom",
        path: ["amount"],
        message: `Available balance is ${formatBalance(balance)} ${TOKEN_SYMBOL}.`,
      });
    }
  });
}

type WithdrawFormValues = z.input<typeof withdrawFormSchema>;

export function WithdrawForm() {
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
  } = useForm<WithdrawFormValues>({
    // Resolver runtime supports this schema; the cast avoids a Zod v4 typing mismatch.
    resolver: zodResolver(createWithdrawFormSchema(balance) as never),
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
    parsedAmount <= balance;
  const grossUsd = hasPreviewAmount ? parsedAmount * TOKEN_PRICE_USDT : 0;
  const feeUsd = hasPreviewAmount ? grossUsd * feeRate : 0;
  const receiveAmountUsd = hasPreviewAmount ? grossUsd - feeUsd : 0;

  useEffect(() => {
    if (!recipient && walletAddress) {
      setValue("recipient", walletAddress, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  }, [recipient, setValue, walletAddress]);

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
      className="space-y-5"
      onSubmit={handleSubmit(handleValidSubmit, () => setIsSubmitted(false))}
      noValidate
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
          step="any"
          placeholder={`Max ${formatBalance(balance)} ${TOKEN_SYMBOL}`}
          className="field-input w-full rounded-xl px-4 py-3 text-sm transition-all focus:outline-none"
          aria-invalid={Boolean(errors.amount)}
          {...register("amount", {
            onChange: handleFieldChange,
          })}
        />
        <p className="mt-2 text-[10px] text-muted-foreground">
          Available: {formatBalance(balance)} {TOKEN_SYMBOL}
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
          Network Fee (USD)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm">
          {feeUsd > 0 ? `$${formatBalance(feeUsd)}` : "$0.00"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          You Receive (USD)
        </label>
        <div className="field-output w-full rounded-xl px-4 py-3 text-sm font-semibold">
          {receiveAmountUsd > 0 ? `$${formatBalance(receiveAmountUsd)}` : "$0.00"}
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

      {isSubmitted ? (
        <FormFeedback variant="success">
          Withdraw request prepared successfully. Backend processing can attach
          to this confirmation state when it is ready.
        </FormFeedback>
      ) : null}

      <motion.button
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="btn-gold w-full rounded-xl py-3.5 text-sm font-bold tracking-wide disabled:cursor-not-allowed disabled:opacity-60"
        disabled={!isValid || isSubmitting}
        style={{
          background:
            "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
          boxShadow:
            "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          color: "#ffffff",
        }}
      >
        SUBMIT WITHDRAW
      </motion.button>
    </motion.form>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFeedbackProps {
  children: ReactNode;
  variant?: "info" | "success" | "error";
}

const feedbackVariants: Record<NonNullable<FormFeedbackProps["variant"]>, string> = {
  info: "border-white/10 bg-navy-lighter/50 text-muted-foreground",
  success: "border-cash/20 bg-cash/10 text-cash",
  error: "border-red-500/20 bg-red-500/10 text-red-300",
};

export function FormFeedback({
  children,
  variant = "info",
}: FormFeedbackProps) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 text-[11px] leading-relaxed",
        feedbackVariants[variant]
      )}
    >
      {children}
    </div>
  );
}

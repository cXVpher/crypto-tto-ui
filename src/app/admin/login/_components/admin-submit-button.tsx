"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

interface AdminSubmitButtonProps {
  label: string;
  pendingLabel: string;
  className?: string;
}

export function AdminSubmitButton({
  label,
  pendingLabel,
  className,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className={className}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

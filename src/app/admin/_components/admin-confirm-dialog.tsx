"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdminConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  tone?: "default" | "destructive";
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  tone = "default",
}: AdminConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[1.75rem] border border-white/8 bg-[#07101d] p-0 text-white">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-white">{title}</DialogTitle>
          <DialogDescription className="leading-6 text-slate-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="rounded-b-[1.75rem] border-white/8 bg-white/4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant={tone === "destructive" ? "destructive" : "default"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={
              tone === "destructive"
                ? "h-11 rounded-2xl bg-rose-400/15 text-rose-100 hover:bg-rose-400/25"
                : "h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            }
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

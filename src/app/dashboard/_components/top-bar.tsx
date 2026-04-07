"use client";

import { Check, Copy } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { useCopyFeedback } from "@/lib/use-copy-feedback";

export function TopBar() {
  const { username, walletAddress } = useWallet();
  const { copiedKey, copyToClipboard } = useCopyFeedback();
  const copyAddress = () => copyToClipboard("wallet-address", walletAddress);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-between border-b border-white/5 bg-navy/90 px-4 py-3 backdrop-blur-lg">
        <button onClick={copyAddress} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gold">
              {username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-medium text-foreground">
            {username}
          </span>
          {copiedKey === "wallet-address" ? (
            <Check className="w-3 h-3 text-gold transition-colors" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground group-hover:text-gold transition-colors" />
          )}
        </button>
      </div>
    </div>
  );
}

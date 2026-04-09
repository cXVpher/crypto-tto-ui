"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "@phosphor-icons/react";
import { useWallet } from "@/lib/wallet-context";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { truncateAddress } from "@/lib/utils";

export function UserWallet() {
  const { walletAddress } = useWallet();
  const { copiedKey, copyToClipboard } = useCopyFeedback();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gold">U</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground truncate">
          {truncateAddress(walletAddress)}
        </p>
        <p className="text-[10px] text-muted-foreground font-mono truncate">
          {walletAddress}
        </p>
      </div>
      <button
        onClick={() => copyToClipboard("wallet-address", walletAddress)}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5"
      >
        {copiedKey === "wallet-address" ? (
          <Check className="w-3.5 h-3.5 text-gold" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>
    </motion.div>
  );
}

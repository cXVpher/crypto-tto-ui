"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "@phosphor-icons/react";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { useWalletStore } from "@/store/use-wallet-store";
import { truncateAddress } from "@/lib/utils";

export function UserWallet() {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const { copiedKey, copyToClipboard } = useCopyFeedback();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4 flex items-center gap-3 rounded-xl border p-3"
      style={{
        background: "rgba(255,255,255,0.075)",
        borderColor: "rgba(126,194,255,0.09)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
      }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full"
        style={{
          background: "rgba(126,194,255,0.18)",
          border: "1px solid rgba(126,194,255,0.24)",
        }}
      >
        <span className="text-[10px] font-bold" style={{ color: "#86cbff" }}>
          U
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-xs font-bold" style={{ color: "#dbe5ff" }}>
          {truncateAddress(walletAddress)}
        </p>
        <p className="truncate font-mono text-[10px]" style={{ color: "#98abd4" }}>
          {walletAddress}
        </p>
      </div>
      <button
        onClick={() => copyToClipboard("wallet-address", walletAddress)}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
      >
        {copiedKey === "wallet-address" ? (
          <Check className="h-3.5 w-3.5" style={{ color: "#f5c451" }} />
        ) : (
          <Copy className="h-3.5 w-3.5" style={{ color: "#98abd4" }} />
        )}
      </button>
    </motion.div>
  );
}

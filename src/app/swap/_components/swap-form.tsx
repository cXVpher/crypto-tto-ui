"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function SwapForm() {
  const { walletAddress } = useWallet();
  const [amount, setAmount] = useState("");
  const feeRate = 0.01;

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * feeRate;
  const receiveUsdt = (numAmount - fee) * TOKEN_PRICE_USDT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-4"
    >
      {/* Amount */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Amount ({TOKEN_SYMBOL})
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="No. 10 TTO"
          className="w-full bg-navy-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
        />
      </div>

      {/* Arrow icon */}
      <div className="flex justify-center">
        <div className="w-8 h-8 rounded-full bg-navy-lighter border border-white/10 flex items-center justify-center">
          <ArrowDownUp className="w-4 h-4 text-gold" />
        </div>
      </div>

      {/* Fee */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Fee ({TOKEN_SYMBOL})
        </label>
        <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-true-gold">
          {numAmount > 0 ? formatBalance(fee) : "0"}
        </div>
      </div>

      {/* Receive USDT */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Receive (USDT)
        </label>
        <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-true-gold font-semibold">
          {numAmount > 0 ? `$${formatBalance(receiveUsdt)}` : "$0.00"}
        </div>
      </div>

      {/* Recipient Address */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Recipient Address
        </label>
        <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-muted-foreground font-mono break-all">
          {walletAddress}
        </div>
      </div>

      {/* Swap button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-cash w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-2"
        onClick={() => alert("Swap simulated!")}
      >
        SWAP
      </motion.button>
    </motion.div>
  );
}

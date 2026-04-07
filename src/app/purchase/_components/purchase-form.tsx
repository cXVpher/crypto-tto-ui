"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";

export function PurchaseForm() {
  const [amountUsdt, setAmountUsdt] = useState("");
  const price = TOKEN_PRICE_USDT;
  const receiveAmount = amountUsdt ? parseFloat(amountUsdt) / price : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-5"
    >
      {/* Amount USDT */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Amount (USDT)
        </label>
        <input
          type="number"
          placeholder="Min. 1 USDT"
          value={amountUsdt}
          onChange={(e) => setAmountUsdt(e.target.value)}
          className="w-full bg-navy-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
        />
      </div>

      {/* Price */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Price (USDT)
        </label>
        <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-true-gold">
          {price}
        </div>
      </div>

      {/* Receive */}
      <div>
        <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Receive ({TOKEN_SYMBOL})
        </label>
        <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-true-gold font-semibold">
          {receiveAmount > 0 ? receiveAmount.toFixed(2) : `0 ${TOKEN_SYMBOL}`}
        </div>
      </div>

      {/* Distribution info */}
      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🪙</span>
            <span className="text-[11px] font-bold text-true-gold">{TOKEN_SYMBOL}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Distributed to BONDING
          </p>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-lg">🪙</span>
            <span className="text-[11px] font-bold text-true-gold">{TOKEN_SYMBOL}</span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            Distributed to AIRDROP
          </p>
        </div>
      </div>

      {/* Purchase button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-4"
        onClick={() => alert("Purchase simulated!")}
      >
        PURCHASE
      </motion.button>
    </motion.div>
  );
}

// src/app/swap/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT, swapHistory } from "@/lib/mock-data";
import { formatBalance, truncateAddress } from "@/lib/utils";

export default function SwapPage() {
  const { balance, walletAddress } = useWallet();
  const [amount, setAmount] = useState("");
  const feeRate = 0.01;

  const numAmount = parseFloat(amount) || 0;
  const fee = numAmount * feeRate;
  const receiveUsdt = (numAmount - fee) * TOKEN_PRICE_USDT;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Swap" />

      <div className="px-4 pt-4">
        {/* Balance header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Account Balance
              </p>
              <p className="text-lg font-bold text-foreground">
                {formatBalance(balance)}{" "}
                <span className="text-gold text-sm">{TOKEN_SYMBOL}</span>
              </p>
            </div>
            <p className="text-xs text-cash font-semibold">
              ~${formatBalance(balance * TOKEN_PRICE_USDT)}
            </p>
          </div>
        </motion.div>

        {/* Swap form */}
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
            <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-muted-foreground">
              {numAmount > 0 ? formatBalance(fee) : "0"}
            </div>
          </div>

          {/* Receive USDT */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Receive (USDT)
            </label>
            <div className="w-full bg-navy-lighter/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-cash font-semibold">
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

        {/* Swap History */}
        <div className="mt-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Swap History
          </h2>
          <div className="space-y-3">
            {swapHistory.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-foreground">
                    {formatBalance(item.fromAmount)} {item.fromToken} →{" "}
                    <span className="text-cash">
                      ${formatBalance(item.toAmount)} {item.toToken}
                    </span>
                  </span>
                  <StatusBadge status={item.status} />
                </div>
                <p className="text-[10px] text-muted-foreground">{item.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

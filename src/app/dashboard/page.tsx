// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Copy, Users, ChevronRight } from "lucide-react";
import { CoinLogo } from "@/components/ui/coin-logo";
import { useWallet } from "@/lib/wallet-context";
import { truncateAddress, formatBalance } from "@/lib/utils";
import { TOKEN_SYMBOL, TOKEN_NAME } from "@/lib/mock-data";

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, walletAddress, username, balance, privateBonding } =
    useWallet();

  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  if (!isConnected) return null;

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={copyAddress} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gold">
              {username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-medium text-foreground">
            {username}
          </span>
          <Copy className="w-3 h-3 text-muted-foreground group-hover:text-gold transition-colors" />
        </button>
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-4 px-3 py-2 bg-gold/10 border border-gold/20 rounded-lg"
      >
        <p className="text-[11px] text-gold">
          <span className="font-bold">INFO:</span> maximum swap is only 30% of
          your total daily withdrawal
        </p>
      </motion.div>

      {/* Private Bonding */}
      <div className="mx-4 mb-2 flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Private Bonding
          </p>
          <p className="text-sm font-bold text-gold">
            {formatBalance(privateBonding)} {TOKEN_SYMBOL}
          </p>
        </div>
        <button
          onClick={() => router.push("/bonding/add")}
          className="text-[10px] font-bold text-navy bg-gold px-3 py-1.5 rounded-lg hover:bg-gold-dark transition-colors"
        >
          ADD NEW BONDING
        </button>
      </div>

      {/* Main balance card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mt-4 mb-6 bg-gradient-to-br from-navy-lighter/80 to-navy-light/50 border border-white/5 rounded-2xl p-6 text-center relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <CoinLogo size={80} animate={false} className="mx-auto mb-4" />
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
            Account Balance
          </p>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-extrabold text-foreground"
            >
              {formatBalance(balance)}
            </motion.span>
            <span className="text-sm font-bold text-gold">{TOKEN_SYMBOL}</span>
          </div>
        </div>
      </motion.div>

      {/* Purchase / Withdraw buttons */}
      <div className="mx-4 flex gap-3 mb-2">
        <button
          onClick={() => router.push("/purchase")}
          className="btn-cash flex-1 py-3 rounded-xl text-sm font-bold tracking-wide"
        >
          PURCHASE
        </button>
        <button
          onClick={() => {}}
          className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide bg-navy-lighter border border-white/10 text-foreground hover:bg-navy-lighter/80 transition-colors"
        >
          WITHDRAW
        </button>
      </div>

      {/* Show History links */}
      <div className="mx-4 flex gap-3 mb-6">
        <button
          onClick={() => router.push("/history")}
          className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground hover:text-gold transition-colors"
        >
          <Eye className="w-3 h-3" /> SHOW HISTORY
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] text-muted-foreground hover:text-gold transition-colors">
          <Eye className="w-3 h-3" /> SHOW HISTORY
        </button>
      </div>

      {/* Invite Friend section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-4"
      >
        <div className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-foreground">
                Invite Your Friend
              </p>
              <p className="text-[10px] text-muted-foreground">
                Earn direct affiliate bonus up to <span className="text-gold font-bold">3%</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/network")}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-navy/50 border border-white/5 rounded-lg hover:border-gold/20 transition-colors"
          >
            <span className="text-[11px] text-muted-foreground truncate mr-2">
              {truncateAddress(walletAddress)}
            </span>
            <ChevronRight className="w-4 h-4 text-gold shrink-0" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

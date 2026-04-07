"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Users, ChevronRight } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { truncateAddress } from "@/lib/utils";

export function InviteFriend() {
  const router = useRouter();
  const { walletAddress } = useWallet();

  return (
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
  );
}

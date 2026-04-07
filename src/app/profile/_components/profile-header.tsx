"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet-context";
import { userProfile } from "@/lib/mock-data";

export function ProfileHeader() {
  const { username } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/30 to-gold/5 border-2 border-gold/30 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-gold">
          {username.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <p className="text-sm font-bold text-foreground mb-2">{username}</p>

      {/* Rank badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-xl">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Rank Level
        </span>
        <span className="text-sm font-extrabold text-gold tracking-wide">
          {userProfile.rankLevel}
        </span>
      </div>
    </motion.div>
  );
}

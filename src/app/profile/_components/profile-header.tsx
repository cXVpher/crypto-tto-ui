"use client";

import { motion } from "framer-motion";
import type { ProfileData } from "@/lib/api-service";
import { useWalletStore } from "@/store/use-wallet-store";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const username = useWalletStore((state) => state.username) || profile.username;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      {/* Avatar */}
      <div
        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2"
        style={{
          background:
            "linear-gradient(135deg, rgba(126,194,255,0.3) 0%, rgba(126,194,255,0.08) 100%)",
          borderColor: "rgba(126,194,255,0.26)",
          boxShadow: "0 12px 30px rgba(126,194,255,0.12)",
        }}
      >
        <span className="text-2xl font-bold" style={{ color: "#86cbff" }}>
          {username.slice(0, 2).toUpperCase()}
        </span>
      </div>

      <p className="mb-2 text-sm font-bold" style={{ color: "#dbe5ff" }}>
        {username}
      </p>

      {/* Rank badge */}
      <div
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2"
        style={{
          background: "rgba(59,130,246,0.1)",
          borderColor: "rgba(59,130,246,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "#98abd4" }}>
          Rank Level
        </span>
        <span className="text-sm font-extrabold tracking-wide" style={{ color: "#3b82f6" }}>
          {profile.rankLevel}
        </span>
      </div>
    </motion.div>
  );
}

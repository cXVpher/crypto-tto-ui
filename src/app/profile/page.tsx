// src/app/profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Copy, LogOut, Shield, Calendar, Link2, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useWallet } from "@/lib/wallet-context";
import { userProfile } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { walletAddress, username, disconnect } = useWallet();

  const handleLogout = () => {
    disconnect();
    router.replace("/");
  };

  const infoFields = [
    {
      icon: Shield,
      label: "Wallet Address",
      value: truncateAddress(walletAddress),
      fullValue: walletAddress,
      copyable: true,
    },
    {
      icon: Calendar,
      label: "Registered Since",
      value: userProfile.registeredSince,
    },
    {
      icon: UserCheck,
      label: "Invited by Address",
      value: truncateAddress(userProfile.invitedBy),
      fullValue: userProfile.invitedBy,
      copyable: true,
    },
    {
      icon: Link2,
      label: "User Affiliate Link",
      value: `${userProfile.affiliateLink}${truncateAddress(walletAddress)}`,
      fullValue: `${userProfile.affiliateLink}${walletAddress}`,
      copyable: true,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Profile" />

      <div className="px-4 pt-6">
        {/* Profile header */}
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

        {/* Info Fields */}
        <div className="space-y-3">
          {infoFields.map((field, i) => (
            <motion.div
              key={field.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-navy/50 flex items-center justify-center shrink-0 mt-0.5">
                  <field.icon className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    {field.label}
                  </p>
                  <p className="text-xs font-medium text-foreground break-all">
                    {field.value}
                  </p>
                </div>
                {field.copyable && (
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        field.fullValue || field.value
                      )
                    }
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-gold transition-colors" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full mt-8 py-3.5 rounded-xl text-sm font-bold tracking-wide bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          LOG OUT
        </motion.button>

        {/* Version */}
        <p className="text-center text-[10px] text-muted-foreground/50 mt-6">
          {userProfile.version}
        </p>
      </div>
    </div>
  );
}

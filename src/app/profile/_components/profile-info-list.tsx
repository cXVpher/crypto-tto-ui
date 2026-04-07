"use client";

import { motion } from "framer-motion";
import { Copy, Check, Shield, Calendar, Link2, UserCheck } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { userProfile } from "@/lib/mock-data";
import { truncateAddress } from "@/lib/utils";

export function ProfileInfoList() {
  const { walletAddress } = useWallet();
  const { copiedKey, copyToClipboard } = useCopyFeedback();

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
                  copyToClipboard(field.label, field.fullValue || field.value)
                }
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 shrink-0"
              >
                {copiedKey === field.label ? (
                  <Check className="w-3.5 h-3.5 text-gold transition-colors" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-gold transition-colors" />
                )}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

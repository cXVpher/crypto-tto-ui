"use client";

import { motion } from "framer-motion";
import { Calendar, Check, Copy, Link, Shield, UserCheck } from "@phosphor-icons/react";
import type { ProfileData } from "@/lib/api-service";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { useWalletStore } from "@/store/use-wallet-store";
import { truncateAddress } from "@/lib/utils";

interface ProfileInfoListProps {
  profile: ProfileData;
}

export function ProfileInfoList({ profile }: ProfileInfoListProps) {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const { copiedKey, copyToClipboard } = useCopyFeedback();
  const resolvedWalletAddress = walletAddress || "Not connected";
  const invitedByAddress = profile.invitedBy || "No inviter";
  const affiliateLink = profile.affiliateLink || "Unavailable";

  const infoFields = [
    {
      icon: Shield,
      label: "Wallet Address",
      value: truncateAddress(resolvedWalletAddress),
      fullValue: resolvedWalletAddress,
      copyable: true,
      iconColor: "#86cbff",
      iconBackground: "rgba(126,194,255,0.14)",
      iconBorder: "rgba(126,194,255,0.18)",
    },
    {
      icon: Calendar,
      label: "Registered Since",
      value: profile.registeredSince,
      iconColor: "#f5c451",
      iconBackground: "rgba(245,196,81,0.12)",
      iconBorder: "rgba(245,196,81,0.18)",
    },
    {
      icon: UserCheck,
      label: "Invited by Address",
      value: truncateAddress(invitedByAddress),
      fullValue: invitedByAddress,
      copyable: Boolean(profile.invitedBy),
      iconColor: "#6ee7b7",
      iconBackground: "rgba(110,231,183,0.12)",
      iconBorder: "rgba(110,231,183,0.18)",
    },
    {
      icon: Link,
      label: "User Affiliate Link",
      value: affiliateLink,
      fullValue: affiliateLink,
      copyable: true,
      iconColor: "#c4b5fd",
      iconBackground: "rgba(196,181,253,0.12)",
      iconBorder: "rgba(196,181,253,0.18)",
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
          className="rounded-xl border p-4"
          style={{
            background: "rgba(255,255,255,0.075)",
            borderColor: "rgba(126,194,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: field.iconBackground,
                border: `1px solid ${field.iconBorder}`,
              }}
            >
              <field.icon className="h-4 w-4" style={{ color: field.iconColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="mb-1 text-[10px] uppercase tracking-wider" style={{ color: "#98abd4" }}>
                {field.label}
              </p>
              <p className="break-all text-xs font-medium" style={{ color: "#dbe5ff" }}>
                {field.value}
              </p>
            </div>
            {field.copyable && (
              <button
                onClick={() =>
                  copyToClipboard(field.label, field.fullValue || field.value)
                }
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-white/5"
              >
                {copiedKey === field.label ? (
                  <Check
                    className="h-3.5 w-3.5 transition-colors"
                    style={{ color: "#f5c451" }}
                  />
                ) : (
                  <Copy
                    className="h-3.5 w-3.5 transition-colors"
                    style={{ color: "#98abd4" }}
                  />
                )}
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

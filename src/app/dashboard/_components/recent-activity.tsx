"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";
import { truncateAddress } from "@/lib/utils";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CaretRight,
  UserPlus,
} from "@phosphor-icons/react";

const items = [
  {
    id: "invite",
    icon: UserPlus,
    iconBg: "rgba(99,158,253,0.2)",
    iconColor: "#639efd",
    title: "Invite Your Friend",
    subtitle: null,
    isInvite: true,
    rightLabel: null,
  },
  {
    id: "received",
    icon: ArrowDownLeft,
    iconBg: "rgba(74,222,128,0.15)",
    iconColor: "#4ade80",
    title: "Received Payment",
    subtitle: "From: 0x4f...92e1",
    amount: "+120.00",
    amountColor: "#4ade80",
    time: "2 hours ago",
  },
  {
    id: "swap",
    icon: ArrowUpRight,
    iconBg: "rgba(248,113,113,0.15)",
    iconColor: "#f87171",
    title: "Asset Swap",
    subtitle: `TTO to USD`,
    amount: "-45.50",
    amountColor: "#dbe5ff",
    time: "Yesterday",
  },
];

export function RecentActivity() {
  const router = useRouter();
  const { walletAddress } = useWallet();

  return (
    <section className="mb-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: "#dbe5ff" }}>
          History
        </h3>
        <button
          onClick={() => router.push("/history")}
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: "#6ab2ff" }}
        >
          Show all
        </button>
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {/* Invite tile */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3, ease: [0.2, 0, 0, 1] }}
          onClick={() => router.push("/network")}
          className="w-full flex items-center justify-between p-4 rounded-xl transition-all active:scale-[0.98]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(99,158,253,0.2)" }}
            >
              <UserPlus className="w-5 h-5" style={{ color: "#639efd" }} />
            </div>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: "#dbe5ff" }}>
                Invite Your Friend
              </p>
              <p className="text-xs" style={{ color: "#98abd4" }}>
                {truncateAddress(walletAddress)}
              </p>
            </div>
          </div>
          <CaretRight className="w-5 h-5 shrink-0" style={{ color: "#98abd4" }} />
        </motion.button>

        {/* Received */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(74,222,128,0.15)" }}
            >
              <ArrowDownLeft className="w-5 h-5" style={{ color: "#4ade80" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#dbe5ff" }}>Received Payment</p>
              <p className="text-xs" style={{ color: "#98abd4" }}>From: 0x4f...92e1</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm" style={{ color: "#4ade80" }}>
              +120.00 {TOKEN_SYMBOL}
            </p>
            <p className="text-[10px]" style={{ color: "#62769c" }}>2 hours ago</p>
          </div>
        </motion.div>

        {/* Swap */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="flex items-center justify-between p-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(248,113,113,0.15)" }}
            >
              <ArrowUpRight className="w-5 h-5" style={{ color: "#f87171" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "#dbe5ff" }}>Asset Swap</p>
              <p className="text-xs" style={{ color: "#98abd4" }}>TTO to USD</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm" style={{ color: "#dbe5ff" }}>-45.50 {TOKEN_SYMBOL}</p>
            <p className="text-[10px]" style={{ color: "#62769c" }}>Yesterday</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

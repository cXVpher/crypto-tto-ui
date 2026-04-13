"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { NetworkAffiliateLevel } from "@/lib/api-service";
import { PageHeader } from "@/components/layout/page-header";
import { UserWallet } from "./user-wallet";
import { NetworkTabs } from "./network-tabs";
import { NetworkContent } from "./network-content";

interface NetworkPageClientProps {
  affiliates: NetworkAffiliateLevel[];
}

export function NetworkPageClient({ affiliates }: NetworkPageClientProps) {
  const [activeTab, setActiveTab] = useState<"affiliate" | "matching">("affiliate");

  return (
    <div
      className="relative flex min-h-screen w-full flex-col pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Network" />
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <UserWallet />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <NetworkTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <NetworkContent activeTab={activeTab} affiliates={affiliates} />
        </motion.div>
      </div>
    </div>
  );
}

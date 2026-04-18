// src/app/purchase/page.tsx
"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { CoinLogo } from "@/components/ui/coin-logo";
import { TOKEN_SYMBOL } from "@/app/_lib/mock-data";
import { PurchaseForm } from "./_components/purchase-form";

export default function PurchasePage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title={`Deposit ${TOKEN_SYMBOL}`} />

      <div className="px-4 pt-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-8"
        >
          <CoinLogo size={80} animate={false} />
        </motion.div>

        <PurchaseForm />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { CoinLogo } from "@/components/ui/coin-logo";
import { WithdrawForm } from "./_components/withdraw-form";

export default function WithdrawPage() {
  return (
    <div className="flex min-h-screen flex-col pb-24">
      <PageHeader title="Withdraw USDT" />

      <div className="px-4 pt-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex justify-center"
        >
          <CoinLogo size={80} animate={false} />
        </motion.div>

        <WithdrawForm />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";

export function LogoutButton() {
  const router = useRouter();
  const { disconnect } = useWallet();

  const handleLogout = () => {
    disconnect();
    router.replace("/");
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleLogout}
      className="w-full mt-8 py-3.5 rounded-xl text-sm font-bold tracking-wide bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2"
    >
      <SignOut className="w-4 h-4" />
      LOG OUT
    </motion.button>
  );
}

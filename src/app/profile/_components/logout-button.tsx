"use client";

import { motion } from "framer-motion";
import { SignOut } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/fetcher";
import { useWalletStore } from "@/store/use-wallet-store";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export function LogoutButton() {
  const router = useRouter();
  const disconnectWallet = useWalletStore((state) => state.disconnectWallet);

  const handleLogout = async () => {
    if (!USE_MOCK_API) {
      try {
        await fetchApi("/api/auth/logout", {
          baseURL: "",
          method: "POST",
          unwrapData: false,
        });
      } catch {
        // Clear the local wallet state even if the cookie endpoint fails.
      }
    }

    disconnectWallet();
    router.replace("/");
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => void handleLogout()}
      className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-bold tracking-wide transition-colors"
      style={{
        background: "rgba(248,113,113,0.1)",
        borderColor: "rgba(248,113,113,0.2)",
        color: "#f87171",
      }}
    >
      <SignOut className="w-4 h-4" />
      LOG OUT
    </motion.button>
  );
}

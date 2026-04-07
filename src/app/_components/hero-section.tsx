"use client";

import { motion } from "framer-motion";
import { CoinLogo } from "@/components/ui/coin-logo";
import { TOKEN_NAME, TOKEN_SYMBOL } from "@/lib/mock-data";

export function HeroSection() {
  return (
    <>
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Area - Expands to push bottom content down */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <CoinLogo size={160} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">
            {TOKEN_NAME}{" "}
            <span className="text-gold">({TOKEN_SYMBOL})</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            New Possibility in the TitanToon Community
          </p>
        </motion.div>
      </div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";

export function InfoBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 px-3 py-2 bg-gold/10 border border-gold/20 rounded-lg"
    >
      <p className="text-[11px] text-gold">
        <span className="font-bold">INFO:</span> maximum swap is only 30% of
        your total daily withdrawal
      </p>
    </motion.div>
  );
}

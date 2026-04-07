"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Flame } from "lucide-react";
import { bondingPackages } from "@/lib/mock-data";

export function BondingPackageList() {
  const router = useRouter();

  return (
    <div className="px-4 pt-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Bonding Package
      </h2>
      <div className="space-y-3">
        {bondingPackages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4 flex items-center gap-4"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{pkg.name}</p>
              <p className="text-[11px] text-muted-foreground">
                Daily profit up to{" "}
                <span className="text-true-gold font-semibold">
                  {pkg.dailyProfit}%
                </span>
              </p>
            </div>

            {/* Add button */}
            <button
              onClick={() => router.push(`/bonding/add?package=${pkg.id}`)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-lg text-[10px] font-bold text-gold hover:bg-gold/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              ADD NEW
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

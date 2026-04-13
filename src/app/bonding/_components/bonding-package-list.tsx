"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Fire, Plus } from "@phosphor-icons/react";
import type { BondingPackage } from "@/lib/api-service";

interface BondingPackageListProps {
  packages: BondingPackage[];
}

export function BondingPackageList({ packages }: BondingPackageListProps) {
  const router = useRouter();

  return (
    <div className="px-4 pt-4">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Bonding Package
      </h2>
      <div className="space-y-3">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-4 rounded-xl border p-4"
            style={{
              background: "rgba(255,255,255,0.075)",
              borderColor: "rgba(126,194,255,0.09)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
            }}
          >
            {/* Icon */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "rgba(249,115,22,0.16)",
                border: "1px solid rgba(249,115,22,0.24)",
              }}
            >
              <Fire className="w-5 h-5" style={{ color: "#fb923c" }} />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: "#dbe5ff" }}>
                {pkg.name}
              </p>
              <p className="text-[11px]" style={{ color: "#98abd4" }}>
                Daily profit up to{" "}
                <span className="font-semibold" style={{ color: "#f5c451" }}>
                  {pkg.dailyProfit}%
                </span>
              </p>
            </div>

            {/* Add button */}
            <button
              onClick={() => router.push(`/bonding/add?package=${pkg.id}`)}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-[10px] font-bold transition-colors"
              style={{
                background: "rgba(126,194,255,0.14)",
                borderColor: "rgba(126,194,255,0.22)",
                color: "#86cbff",
              }}
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

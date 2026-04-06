// src/app/bonding/add/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { bondingPackages, TOKEN_SYMBOL } from "@/lib/mock-data";

function AddBondingForm() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("package");

  const [selectedPackage, setSelectedPackage] = useState(
    preselectedId || String(bondingPackages[1].id)
  );
  const [amount, setAmount] = useState("50000");

  const pkg = bondingPackages.find((p) => String(p.id) === selectedPackage);

  return (
    <div className="px-4 pt-4">
      {/* Selected Package Info */}
      {pkg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4 mb-6 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{pkg.name}</p>
            <p className="text-[11px] text-muted-foreground">
              Daily profit up to{" "}
              <span className="text-gold font-semibold">
                {pkg.dailyProfit}%
              </span>
            </p>
          </div>
        </motion.div>
      )}

      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        ADD NEW BONDING
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-5"
      >
        {/* Bonding Package Select */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Bonding Package
          </label>
          <select
            value={selectedPackage}
            onChange={(e) => setSelectedPackage(e.target.value)}
            className="w-full bg-navy-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all appearance-none cursor-pointer"
          >
            {bondingPackages.map((p) => (
              <option key={p.id} value={String(p.id)} className="bg-navy-light">
                {p.days} Days
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
            Amount ({TOKEN_SYMBOL})
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full bg-navy-lighter border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all"
          />
        </div>

        {/* Create Contract button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="btn-gold w-full py-3.5 rounded-xl text-sm font-bold tracking-wide mt-4"
          onClick={() => alert("Contract created (simulated)")}
        >
          CREATE CONTRACT
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function AddBondingPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Bonding Package" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
            Loading...
          </div>
        }
      >
        <AddBondingForm />
      </Suspense>
    </div>
  );
}

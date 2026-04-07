"use client";

import { motion } from "framer-motion";
import { Flame, Droplets, Zap } from "lucide-react";

export function FeaturesList() {
  const features = [
    { icon: Flame, label: "Staking", color: "text-orange-400" },
    { icon: Droplets, label: "Pooling", color: "text-blue-400" },
    { icon: Zap, label: "Burning", color: "text-red-400" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="flex items-center gap-8 mb-14"
    >
      {features.map((feat, i) => (
        <motion.div
          key={feat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-14 h-14 rounded-2xl bg-navy-lighter/80 border border-white/5 flex items-center justify-center">
            <feat.icon className={`w-6 h-6 ${feat.color}`} />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">
            {feat.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// src/components/ui/coin-logo.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CoinLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
}

export function CoinLogo({ size = 120, animate = true, className }: CoinLogoProps) {
  const content = (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div
        className="absolute rounded-full animate-pulse-glow pointer-events-none"
        style={{
          width: size + 40,
          height: size + 40,
          top: -20,
          left: "50%",
          marginLeft: -(size + 40) / 2,
          background:
            "radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)",
        }}
      />
      <div className="relative rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <Image
          src="/coin-logo.png?v=7"
          alt="TitanToon Token"
          width={size}
          height={size}
          className="object-contain animate-shimmer"
          unoptimized={true}
          priority
        />
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        className={className || ""}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return <div className={className || ""}>{content}</div>;
}

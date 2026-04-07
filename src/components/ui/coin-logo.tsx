// src/components/ui/coin-logo.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CoinLogoProps {
  size?: number;
  animate?: boolean;
  className?: string;
  glow?: boolean;
}

export function CoinLogo({
  size = 120,
  animate = true,
  className,
  glow = true,
}: CoinLogoProps) {
  const content = (
    <div className="relative flex items-center justify-center">
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          filter: glow
            ? "drop-shadow(0 0 12px rgba(245, 166, 35, 0.55)) drop-shadow(0 0 28px rgba(245, 166, 35, 0.42)) drop-shadow(0 0 44px rgba(245, 166, 35, 0.24))"
            : undefined,
        }}
      >
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

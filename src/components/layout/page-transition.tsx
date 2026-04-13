"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useNavigationTransition } from "./navigation-transition-context";

const slideVariants = {
  enter: (direction: -1 | 0 | 1) => ({
    x: direction === 0 ? 0 : direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: -1 | 0 | 1) => ({
    x: direction === 0 ? 0 : direction > 0 ? "-35%" : "35%",
    opacity: 0.7,
  }),
};

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { direction, targetPathname, clearTransition } = useNavigationTransition();
  const appliedDirection = direction;

  useEffect(() => {
    if (targetPathname === pathname) {
      clearTransition();
    }
  }, [clearTransition, pathname, targetPathname]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AnimatePresence initial={false} mode="sync" custom={appliedDirection}>
        <motion.div
          key={pathname}
          custom={appliedDirection}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: {
              duration: 0.34,
              ease: [0.22, 1, 0.36, 1],
            },
            opacity: {
              duration: 0.26,
              ease: "linear",
            },
          }}
          className="absolute inset-0 min-h-screen w-full will-change-transform"
          style={{
            pointerEvents: "auto",
          }}
        >
          <div
            className="min-h-screen w-full"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {children}
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="min-h-screen opacity-0 pointer-events-none" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}

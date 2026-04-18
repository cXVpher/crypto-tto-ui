"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "@phosphor-icons/react";
import type { PurchaseHistoryItem, WithdrawHistoryItem } from "@/lib/api-service";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatBalance } from "@/lib/utils";

interface HistoryContentProps {
  activeTab: "purchase" | "withdraw";
  direction: 1 | -1;
  purchaseHistory: PurchaseHistoryItem[];
  withdrawHistory: WithdrawHistoryItem[];
}

const slideVariants = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 1,
  }),
};

function PurchasePanel({ purchaseHistory }: { purchaseHistory: PurchaseHistoryItem[] }) {
  return (
    <div className="space-y-3">
      {purchaseHistory.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border p-4"
          style={{
            background: "rgba(255,255,255,0.075)",
            borderColor: "rgba(126,194,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: "#f5c451" }}>
              {formatBalance(item.amount)} {item.token}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px]" style={{ color: "#98abd4" }}>
              Received:{" "}
              <span className="font-semibold" style={{ color: "#f5c451" }}>
                {formatBalance(item.received)} {item.receivedToken}
              </span>
            </span>
            <span className="text-[10px]" style={{ color: "#98abd4" }}>
              {item.date}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WithdrawPanel({ withdrawHistory }: { withdrawHistory: WithdrawHistoryItem[] }) {
  return (
    <div className="space-y-3">
      {withdrawHistory.map((item) => (
        <div
          key={item.id}
          className="rounded-xl border p-4"
          style={{
            background: "rgba(255,255,255,0.075)",
            borderColor: "rgba(126,194,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
          }}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold" style={{ color: "#f5c451" }}>
              {formatBalance(item.amount)} {item.token}
            </span>
            <StatusBadge status={item.status} />
          </div>
          <div className="space-y-1.5">
            <span className="block text-[11px]" style={{ color: "#98abd4" }}>
              Wallet:{" "}
              <span className="font-semibold" style={{ color: "#f5c451" }}>
                {item.wallet}
              </span>
            </span>
            <div
              className="flex items-center justify-between gap-3 text-[10px]"
              style={{ color: "#98abd4" }}
            >
              <span>
                Fee:{" "}
                <span style={{ color: "#dbe5ff" }}>
                  {formatBalance(item.fee)} {item.token}
                </span>
              </span>
              <span>{item.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyHistoryState({ label }: { label: "purchase" | "withdraw" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border"
        style={{
          background: "rgba(255,255,255,0.075)",
          borderColor: "rgba(126,194,255,0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Clock className="h-7 w-7" style={{ color: "#86cbff" }} />
      </div>
      <p className="text-sm" style={{ color: "#98abd4" }}>
        No {label} history yet
      </p>
    </div>
  );
}

export function HistoryContent({
  activeTab,
  direction,
  purchaseHistory,
  withdrawHistory,
}: HistoryContentProps) {
  const isPurchase = activeTab === "purchase";
  const hasHistory = isPurchase ? purchaseHistory.length > 0 : withdrawHistory.length > 0;

  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-x-hidden">
        <AnimatePresence initial={false} mode="sync" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.18,
                ease: "linear",
              },
            }}
            className="absolute inset-0 w-full will-change-transform"
          >
            {hasHistory ? (
              isPurchase ? (
                <PurchasePanel purchaseHistory={purchaseHistory} />
              ) : (
                <WithdrawPanel withdrawHistory={withdrawHistory} />
              )
            ) : (
              <EmptyHistoryState label={activeTab} />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none opacity-0" aria-hidden="true">
          {hasHistory ? (
            isPurchase ? (
              <PurchasePanel purchaseHistory={purchaseHistory} />
            ) : (
              <WithdrawPanel withdrawHistory={withdrawHistory} />
            )
          ) : (
            <EmptyHistoryState label={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
}

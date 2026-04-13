"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, SpinnerGap, Wallet } from "@phosphor-icons/react";
import { useWalletStore } from "@/store/use-wallet-store";

type ModalStep = "idle" | "connecting" | "approving" | "success";

interface ConnectModalProps {
  modalOpen: boolean;
  step: ModalStep;
}

export function ConnectModal({ modalOpen, step }: ConnectModalProps) {
  const isConnected = useWalletStore((state) => state.isConnected);
  const resolvedStep =
    isConnected && step !== "idle"
      ? "success"
      : step;

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-navy-light border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center"
          >
            {/* Steps */}
            <div className="flex flex-col items-center gap-5">
              {resolvedStep === "connecting" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                    <SpinnerGap className="w-8 h-8 text-gold animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Detecting Wallet...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Searching for compatible wallets
                    </p>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gold"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}

              {resolvedStep === "approving" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center animate-pulse-glow">
                    <Wallet className="w-8 h-8 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Approve Connection
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please approve the connection in your wallet
                    </p>
                  </div>
                  <SpinnerGap className="w-5 h-5 text-gold/60 animate-spin mt-2" />
                </>
              )}

              {resolvedStep === "success" && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full bg-cash/10 flex items-center justify-center"
                  >
                    <CheckCircle className="w-8 h-8 text-cash" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Connected!
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-cash" aria-hidden="true" />
                      <span>
                        Wallet connected. Redirecting to dashboard...
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

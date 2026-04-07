"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Wallet } from "lucide-react";

type ModalStep = "idle" | "connecting" | "approving" | "success";

interface ConnectModalProps {
  modalOpen: boolean;
  step: ModalStep;
}

export function ConnectModal({ modalOpen, step }: ConnectModalProps) {
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
              {step === "connecting" && (
                <>
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
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

              {step === "approving" && (
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
                  <Loader2 className="w-5 h-5 text-gold/60 animate-spin mt-2" />
                </>
              )}

              {step === "success" && (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-full bg-cash/10 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-cash" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">
                      Connected!
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Redirecting to dashboard...
                    </p>
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

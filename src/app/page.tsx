// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Droplets, Zap, Loader2, CheckCircle2, Wallet } from "lucide-react";
import { CoinLogo } from "@/components/ui/coin-logo";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_NAME, TOKEN_SYMBOL } from "@/lib/mock-data";

type ModalStep = "idle" | "connecting" | "approving" | "success";

export default function ConnectPage() {
  const router = useRouter();
  const { isConnected, connect } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("idle");

  // If already connected, redirect
  useEffect(() => {
    if (isConnected) {
      router.replace("/dashboard");
    }
  }, [isConnected, router]);

  if (isConnected) {
    return null;
  }

  const handleConnect = async () => {
    setModalOpen(true);
    setStep("connecting");

    // Simulate wallet detection
    await new Promise((r) => setTimeout(r, 1200));
    setStep("approving");

    // Simulate approval + actual connect
    await connect();
    setStep("success");

    // Redirect after brief success state
    await new Promise((r) => setTimeout(r, 800));
    router.push("/dashboard");
  };

  const features = [
    { icon: Flame, label: "Staking", color: "text-orange-400" },
    { icon: Droplets, label: "Pooling", color: "text-blue-400" },
    { icon: Zap, label: "Burning", color: "text-red-400" },
  ];

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Area - Expands to push bottom content down */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <CoinLogo size={160} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-2">
            {TOKEN_NAME}{" "}
            <span className="text-gold">({TOKEN_SYMBOL})</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            New Possibility in the TitanToon Community
          </p>
        </motion.div>
      </div>

      {/* Bottom Actions Content */}
      <div className="w-full flex flex-col items-center mt-auto">
        {/* Feature icons */}
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

        {/* Connect Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onClick={handleConnect}
          className="btn-gold w-full max-w-xs py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 animate-pulse-glow"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </motion.button>
      </div>

      {/* Wallet Connect Modal */}
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
    </div>
  );
}

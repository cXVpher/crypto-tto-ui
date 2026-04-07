// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet-context";
import { HeroSection } from "./_components/hero-section";
import { FeaturesList } from "./_components/features-list";
import { ConnectModal } from "./_components/connect-modal";

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

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 relative overflow-hidden">
      <HeroSection />

      {/* Bottom Actions Content */}
      <div className="w-full flex flex-col items-center mt-auto relative z-10">
        <FeaturesList />

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
      <ConnectModal modalOpen={modalOpen} step={step} />
    </div>
  );
}

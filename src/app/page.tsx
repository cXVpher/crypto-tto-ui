// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet } from "@phosphor-icons/react";
import { BROWSER_API_PROXY_BASE_URL } from "@/app/_services/api-helpers";
import {
  getAuthChallenge,
  verifyAuthSignature,
} from "@/app/_services/auth-service";
import { getWalletSessionData } from "@/app/_services/session-service";
import { useWalletStore } from "@/store/use-wallet-store";
import { encodeBase58 } from "@/lib/base58";
import {
  getProviderSignature,
  getProviderWalletAddress,
  getSolanaProvider,
} from "@/lib/solana-provider";
import { HeroSection } from "./_components/hero-section";
import { FeaturesList } from "./_components/features-list";
import { ConnectModal } from "./_components/connect-modal";

type ModalStep = "idle" | "connecting" | "approving" | "success";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const textEncoder = new TextEncoder();

export default function ConnectPage() {
  const router = useRouter();
  const hasHydrated = useWalletStore((state) => state.hasHydrated);
  const hasResolvedSession = useWalletStore((state) => state.hasResolvedSession);
  const isConnected = useWalletStore((state) => state.isConnected);
  const connectWallet = useWalletStore((state) => state.connectWallet);
  const setWalletSession = useWalletStore((state) => state.setWalletSession);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<ModalStep>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [referralCode, setReferralCode] = useState<string>();

  // If already connected, redirect
  useEffect(() => {
    if (hasHydrated && hasResolvedSession && isConnected) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, hasResolvedSession, isConnected, router]);

  useEffect(() => {
    const referralParam = new URLSearchParams(window.location.search)
      .get("ref")
      ?.trim();

    setReferralCode(referralParam || undefined);
  }, []);

  if (!hasHydrated || !hasResolvedSession || isConnected) {
    return null;
  }

  const handleConnect = async () => {
    setErrorMessage("");
    setModalOpen(true);
    setStep("connecting");

    try {
      if (USE_MOCK_API) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setStep("approving");
        await connectWallet();
      } else {
        const provider = getSolanaProvider();

        if (!provider) {
          throw new Error("No compatible Solana wallet found. Install Phantom and try again.");
        }

        const connection = await provider.connect();
        const walletAddress =
          getProviderWalletAddress(provider) ?? connection.publicKey?.toBase58();

        if (!walletAddress) {
          throw new Error("Unable to read the connected wallet address.");
        }

        const challenge = await getAuthChallenge(walletAddress, {
          baseURL: BROWSER_API_PROXY_BASE_URL,
        });

        setStep("approving");

        const signatureResult = await provider.signMessage(
          textEncoder.encode(challenge.challenge),
          "utf8"
        );
        const signature = encodeBase58(getProviderSignature(signatureResult));

        await verifyAuthSignature(
          {
            wallet: walletAddress,
            challenge: challenge.challenge,
            signature,
            referralCode,
          },
          {
            baseURL: BROWSER_API_PROXY_BASE_URL,
          }
        );

        const session = await getWalletSessionData();
        setWalletSession(session);
      }

      setStep("success");
      await new Promise((resolve) => setTimeout(resolve, 800));
      router.push("/dashboard");
    } catch (error) {
      setModalOpen(false);
      setStep("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Wallet connection failed. Please try again."
      );
    }
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
          style={{
            background:
              "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
            boxShadow:
              "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            color: "#ffffff",
          }}
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </motion.button>

        {errorMessage ? (
          <p className="mt-3 max-w-xs text-center text-xs text-red-300">
            {errorMessage}
          </p>
        ) : null}
      </div>

      {/* Wallet Connect Modal */}
      <ConnectModal modalOpen={modalOpen} step={step} />
    </div>
  );
}

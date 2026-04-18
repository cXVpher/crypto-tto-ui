"use client";

import { useEffect } from "react";

import { getWalletSessionData } from "@/app/_services/session-service";
import { useWalletStore } from "@/store/use-wallet-store";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export function WalletSessionBootstrap() {
  const hasHydrated = useWalletStore((state) => state.hasHydrated);
  const hasResolvedSession = useWalletStore((state) => state.hasResolvedSession);
  const setWalletSession = useWalletStore((state) => state.setWalletSession);
  const disconnectWallet = useWalletStore((state) => state.disconnectWallet);
  const setHasResolvedSession = useWalletStore((state) => state.setHasResolvedSession);

  useEffect(() => {
    if (!hasHydrated || hasResolvedSession) {
      return;
    }

    if (USE_MOCK_API) {
      setHasResolvedSession(true);
      return;
    }

    let isActive = true;

    async function syncSession() {
      try {
        const session = await getWalletSessionData();

        if (!isActive) {
          return;
        }

        setWalletSession(session);
      } catch {
        if (!isActive) {
          return;
        }

        disconnectWallet();
      } finally {
        if (isActive) {
          setHasResolvedSession(true);
        }
      }
    }

    void syncSession();

    return () => {
      isActive = false;
    };
  }, [
    disconnectWallet,
    hasHydrated,
    hasResolvedSession,
    setHasResolvedSession,
    setWalletSession,
  ]);

  return null;
}

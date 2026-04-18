"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateMockAddress, generateUsername } from "@/lib/utils";

const WALLET_STORAGE_KEY = "wallet_state";

export interface WalletStoreState {
  isConnected: boolean;
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  usdtBalance: number;
  hasHydrated: boolean;
}

export interface WalletSessionState {
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  usdtBalance: number;
}

interface WalletStoreActions {
  connectWallet: () => Promise<void>;
  setWalletSession: (session: WalletSessionState) => void;
  disconnectWallet: () => void;
  updateBalance: (balance: number) => void;
  updatePrivateBonding: (privateBonding: number) => void;
  updateUsdtBalance: (usdtBalance: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

type PersistedWalletState = Omit<WalletStoreState, "hasHydrated">;

export type WalletStore = WalletStoreState & WalletStoreActions;

const defaultWalletState: WalletStoreState = {
  isConnected: false,
  walletAddress: "",
  username: "",
  balance: 0,
  privateBonding: 0,
  usdtBalance: 0,
  hasHydrated: false,
};

function getPersistedWalletState(
  state: WalletStore
): PersistedWalletState {
  return {
    isConnected: state.isConnected,
    walletAddress: state.walletAddress,
    username: state.username,
    balance: state.balance,
    privateBonding: state.privateBonding,
    usdtBalance: state.usdtBalance,
  };
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      ...defaultWalletState,
      async connectWallet() {
        await new Promise((resolve) => setTimeout(resolve, 2500));

        set({
          isConnected: true,
          walletAddress: generateMockAddress(),
          username: generateUsername(),
          balance: 18859.8,
          privateBonding: 79070.8,
          usdtBalance: 845.25,
        });
      },
      setWalletSession(session) {
        set({
          isConnected: true,
          ...session,
        });
      },
      disconnectWallet() {
        set({
          ...defaultWalletState,
          hasHydrated: true,
        });
      },
      updateBalance(balance) {
        set({ balance });
      },
      updatePrivateBonding(privateBonding) {
        set({ privateBonding });
      },
      updateUsdtBalance(usdtBalance) {
        set({ usdtBalance });
      },
      setHasHydrated(hasHydrated) {
        set({ hasHydrated });
      },
    }),
    {
      name: WALLET_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: getPersistedWalletState,
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate wallet store", error);
        }

        state?.setHasHydrated(true);
      },
    }
  )
);

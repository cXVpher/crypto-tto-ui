"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";
import { generateMockAddress, generateUsername } from "@/lib/utils";

interface WalletState {
  isConnected: boolean;
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  connect: () => Promise<void>;
  disconnect: () => void;
}

type PersistedWalletState = Omit<WalletState, "connect" | "disconnect">;

const WalletContext = createContext<WalletState | undefined>(undefined);
const WALLET_STORAGE_KEY = "wallet_state";

const defaultWalletState: PersistedWalletState = {
  isConnected: false,
  walletAddress: "",
  username: "",
  balance: 0,
  privateBonding: 0,
};

const walletListeners = new Set<() => void>();
let currentWalletSnapshot: PersistedWalletState = defaultWalletState;

function isSameWalletState(
  left: PersistedWalletState,
  right: PersistedWalletState
) {
  return (
    left.isConnected === right.isConnected &&
    left.walletAddress === right.walletAddress &&
    left.username === right.username &&
    left.balance === right.balance &&
    left.privateBonding === right.privateBonding
  );
}

function sanitizeWalletState(
  value: Partial<PersistedWalletState> | null | undefined
): PersistedWalletState {
  return {
    isConnected: Boolean(value?.isConnected),
    walletAddress:
      typeof value?.walletAddress === "string" ? value.walletAddress : "",
    username: typeof value?.username === "string" ? value.username : "",
    balance: typeof value?.balance === "number" ? value.balance : 0,
    privateBonding:
      typeof value?.privateBonding === "number" ? value.privateBonding : 0,
  };
}

function readWalletState(): PersistedWalletState {
  if (typeof window === "undefined") return defaultWalletState;

  const saved = window.localStorage.getItem(WALLET_STORAGE_KEY);

  if (!saved) {
    currentWalletSnapshot = defaultWalletState;
    return currentWalletSnapshot;
  }

  try {
    const nextSnapshot = sanitizeWalletState(JSON.parse(saved));

    if (!isSameWalletState(currentWalletSnapshot, nextSnapshot)) {
      currentWalletSnapshot = nextSnapshot;
    }

    return currentWalletSnapshot;
  } catch {
    currentWalletSnapshot = defaultWalletState;
    return currentWalletSnapshot;
  }
}

function subscribeToWalletState(listener: () => void) {
  walletListeners.add(listener);

  if (typeof window === "undefined") {
    return () => walletListeners.delete(listener);
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === WALLET_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    walletListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function notifyWalletListeners() {
  walletListeners.forEach((listener) => listener());
}

function persistWalletState(nextState: PersistedWalletState) {
  if (typeof window === "undefined") return;

  currentWalletSnapshot = nextState;
  window.localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(nextState));
  notifyWalletListeners();
}

function clearWalletState() {
  if (typeof window === "undefined") return;

  currentWalletSnapshot = defaultWalletState;
  window.localStorage.removeItem(WALLET_STORAGE_KEY);
  notifyWalletListeners();
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const walletState = useSyncExternalStore(
    subscribeToWalletState,
    readWalletState,
    () => defaultWalletState
  );

  const connect = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    persistWalletState({
      isConnected: true,
      walletAddress: generateMockAddress(),
      username: generateUsername(),
      balance: 18859.8,
      privateBonding: 79070.8,
    });
  }, []);

  const disconnect = useCallback(() => {
    clearWalletState();
  }, []);

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

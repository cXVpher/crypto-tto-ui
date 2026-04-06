// src/lib/wallet-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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

const WalletContext = createContext<WalletState | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [privateBonding, setPrivateBonding] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("wallet_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsConnected(parsed.isConnected || false);
        setWalletAddress(parsed.walletAddress || "");
        setUsername(parsed.username || "");
        setBalance(parsed.balance || 0);
        setPrivateBonding(parsed.privateBonding || 0);
      } catch {
        // skip
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(
      "wallet_state",
      JSON.stringify({ isConnected, walletAddress, username, balance, privateBonding })
    );
  }, [isConnected, walletAddress, username, balance, privateBonding, isHydrated]);

  const connect = useCallback(async () => {
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 2500));
    const addr = generateMockAddress();
    const user = generateUsername();
    setWalletAddress(addr);
    setUsername(user);
    setBalance(18859.8);
    setPrivateBonding(79070.8);
    setIsConnected(true);
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setWalletAddress("");
    setUsername("");
    setBalance(0);
    setPrivateBonding(0);
    localStorage.removeItem("wallet_state");
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        username,
        balance,
        privateBonding,
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

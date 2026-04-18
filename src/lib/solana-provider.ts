export interface SolanaProvider {
  isPhantom?: boolean;
  publicKey?: {
    toBase58(): string;
  };
  connect(options?: { onlyIfTrusted?: boolean }): Promise<{
    publicKey?: {
      toBase58(): string;
    };
  }>;
  disconnect?(): Promise<void>;
  signMessage(
    message: Uint8Array,
    display?: "utf8" | "hex"
  ): Promise<Uint8Array | { signature: Uint8Array }>;
}

declare global {
  interface Window {
    phantom?: {
      solana?: SolanaProvider;
    };
    solana?: SolanaProvider;
  }
}

export function getSolanaProvider() {
  if (typeof window === "undefined") {
    return undefined;
  }

  const phantomProvider = window.phantom?.solana;
  if (phantomProvider) {
    return phantomProvider;
  }

  return window.solana;
}

export function getProviderWalletAddress(provider: SolanaProvider) {
  return provider.publicKey?.toBase58();
}

export function getProviderSignature(
  signatureResult: Uint8Array | { signature: Uint8Array }
) {
  return signatureResult instanceof Uint8Array
    ? signatureResult
    : signatureResult.signature;
}

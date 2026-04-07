"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useCopyFeedback(resetAfterMs = 1500) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const copyToClipboard = useCallback(
    async (key: string, value: string) => {
      await navigator.clipboard.writeText(value);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setCopiedKey(key);
      timeoutRef.current = window.setTimeout(() => {
        setCopiedKey(null);
        timeoutRef.current = null;
      }, resetAfterMs);
    },
    [resetAfterMs]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copiedKey, copyToClipboard };
}

"use client";

import { useEffect, useState } from "react";

export function useAdaptiveSheetSide() {
  const [side, setSide] = useState<"bottom" | "right">("right");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateSide = () => {
      setSide(mediaQuery.matches ? "bottom" : "right");
    };

    updateSide();
    mediaQuery.addEventListener("change", updateSide);

    return () => {
      mediaQuery.removeEventListener("change", updateSide);
    };
  }, []);

  return side;
}

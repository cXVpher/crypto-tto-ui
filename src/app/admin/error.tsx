"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-[2rem] border border-rose-300/16 bg-[#081224]/85 p-6">
      <p className="text-[11px] uppercase tracking-[0.24em] text-rose-200/70">
        Admin route error
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-white">
        The admin segment failed to render.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
        Retry the segment render. If the issue persists, inspect the server log
        using the error digest{error.digest ? ` ${error.digest}` : ""}.
      </p>
      <Button
        type="button"
        onClick={() => unstable_retry()}
        className="mt-6 h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
      >
        Retry render
      </Button>
    </div>
  );
}

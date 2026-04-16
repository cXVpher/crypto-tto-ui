"use client";

import { useActionState } from "react";
import { LockKeyOpen } from "@phosphor-icons/react";

import { initialAdminLoginState } from "@/app/admin/action-types";
import {
  loginAdminAction,
} from "@/app/admin/actions";
import { AdminSubmitButton } from "@/components/admin/admin-submit-button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const [state, formAction] = useActionState(
    loginAdminAction,
    initialAdminLoginState
  );

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="passphrase"
          className="text-sm font-medium text-slate-200"
        >
          Admin passphrase
        </label>
        <div className="relative">
          <LockKeyOpen className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-cyan-200/80" />
          <Input
            id="passphrase"
            name="passphrase"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Enter the private admin passphrase"
            className="h-13 rounded-2xl border-white/10 bg-white/6 pl-12 text-slate-50 placeholder:text-slate-500 focus-visible:border-cyan-300/40 focus-visible:ring-cyan-300/20"
          />
        </div>
        {state.error ? (
          <p className="text-sm text-rose-300">{state.error}</p>
        ) : (
          <p className="text-sm text-slate-400">
            The passphrase is validated on the server and stored in an HTTP-only
            signed cookie.
          </p>
        )}
      </div>

      <AdminSubmitButton
        label="Unlock admin"
        pendingLabel="Verifying..."
        className="h-12 w-full rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
      />
    </form>
  );
}

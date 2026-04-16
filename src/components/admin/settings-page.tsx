"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPercent, formatUsd } from "@/lib/admin-format";
import type { AdminSettingsData } from "@/lib/admin-types";

interface SettingsPageProps {
  settingsData: AdminSettingsData;
}

export function SettingsPage({ settingsData }: SettingsPageProps) {
  const [feePercent, setFeePercent] = useState(String(settingsData.withdrawalFeePercent));
  const [flatFee, setFlatFee] = useState(String(settingsData.flatFeeUsdt));
  const [announcement, setAnnouncement] = useState(settingsData.announcement);
  const [maintenanceMode, setMaintenanceMode] = useState(settingsData.maintenanceMode);
  const [previewFeePercent, setPreviewFeePercent] = useState(
    settingsData.withdrawalFeePercent
  );
  const [previewFlatFee, setPreviewFlatFee] = useState(settingsData.flatFeeUsdt);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(settingsData.announcement);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Withdrawal fee
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatPercent(previewFeePercent)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Flat fee
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatUsd(previewFlatFee)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Maintenance mode
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {maintenanceMode ? "Enabled" : "Off"}
          </p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            System controls
          </p>
          <div className="mt-5 grid gap-4">
            <div>
              <label htmlFor="fee-percent" className="text-sm text-slate-300">
                Withdrawal fee percent
              </label>
              <Input
                id="fee-percent"
                value={feePercent}
                onChange={(event) => setFeePercent(event.target.value)}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <div>
              <label htmlFor="flat-fee" className="text-sm text-slate-300">
                Flat fee in USD
              </label>
              <Input
                id="flat-fee"
                value={flatFee}
                onChange={(event) => setFlatFee(event.target.value)}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <label className="flex items-center gap-3 rounded-[1.5rem] border border-white/8 bg-white/5 px-4 py-3">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(event) => setMaintenanceMode(event.target.checked)}
                className="size-4 rounded border-white/10 bg-transparent"
              />
              <span className="text-sm text-slate-100">
                Enable maintenance mode for the wallet UI
              </span>
            </label>
            <div>
              <label htmlFor="announcement" className="text-sm text-slate-300">
                Announcement banner
              </label>
              <textarea
                id="announcement"
                value={announcement}
                onChange={(event) => setAnnouncement(event.target.value)}
                rows={5}
                className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none"
              />
            </div>
            <Button
              type="button"
              onClick={() =>
                startTransition(() => {
                  const nextFeePercent = Number(feePercent);
                  const nextFlatFee = Number(flatFee);

                  if (Number.isFinite(nextFeePercent)) {
                    setPreviewFeePercent(nextFeePercent);
                  }

                  if (Number.isFinite(nextFlatFee)) {
                    setPreviewFlatFee(nextFlatFee);
                  }

                  setPreviewAnnouncement(announcement);
                })
              }
              className="h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              {isPending ? "Applying..." : "Apply local preview"}
            </Button>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Announcement preview
          </p>
          <div className="mt-5 rounded-[1.75rem] border border-cyan-300/16 bg-cyan-300/10 p-5">
            <p className="text-sm leading-7 text-cyan-50">{previewAnnouncement}</p>
          </div>

          <div className="mt-6 rounded-[1.75rem] border border-white/8 bg-white/4 p-5">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Passphrase rotation
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Admin authentication is environment-backed. Rotate the passphrase
              by updating `ADMIN_PASSPHRASE` and `ADMIN_SECRET` in `.env.local`
              or your deployment secret store.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Activity log
            </p>
            <div className="mt-4 space-y-3">
              {settingsData.activityLog.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{item.action}</p>
                    <span className="text-xs text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{item.actor}</p>
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

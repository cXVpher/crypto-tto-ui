"use client";

import { useState } from "react";

import { updateAdminFeesAction } from "@/app/admin/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPercent, formatUsd } from "@/lib/admin-format";
import type { AdminSettingsData } from "@/lib/admin-types";

interface SettingsPageProps {
  settingsData: AdminSettingsData;
}

export function SettingsPage({ settingsData }: SettingsPageProps) {
  const [feePercent, setFeePercent] = useState(String(settingsData.swapFeePercent));
  const [flatFee, setFlatFee] = useState(String(settingsData.flatFeeUsdt));
  const [announcement, setAnnouncement] = useState(settingsData.announcement);
  const [maintenanceMode, setMaintenanceMode] = useState(settingsData.maintenanceMode);
  const [previewFeePercent, setPreviewFeePercent] = useState(settingsData.swapFeePercent);
  const [previewFlatFee, setPreviewFlatFee] = useState(settingsData.flatFeeUsdt);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(settingsData.announcement);
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isMockMode = settingsData.meta.source === "mock";

  const handleSaveSettings = async () => {
    const nextFeePercent = Number(feePercent);
    const nextFlatFee = Number(flatFee);

    if (!Number.isFinite(nextFeePercent) || !Number.isFinite(nextFlatFee)) {
      setNotice("Enter valid numeric fee values.");
      return;
    }

    if (isMockMode) {
      setPreviewFeePercent(nextFeePercent);
      setPreviewFlatFee(nextFlatFee);
      setPreviewAnnouncement(announcement);
      setNotice("Settings preview updated locally.");
      return;
    }

    try {
      setIsSaving(true);
      await updateAdminFeesAction({
        swapFeePercent: nextFeePercent,
        flatFeeUsdt: nextFlatFee,
      });
      setPreviewFeePercent(nextFeePercent);
      setPreviewFlatFee(nextFlatFee);
      setPreviewAnnouncement(announcement);
      setNotice("Live fee settings updated via the admin API.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to update live fee settings."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Swap fee
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
            {settingsData.meta.notice ? (
              <div className="rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
                {settingsData.meta.notice}
              </div>
            ) : null}
            <div>
              <label htmlFor="fee-percent" className="text-sm text-slate-300">
                Swap fee percent
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
                Withdraw network fee in USDT
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
                disabled={!settingsData.capabilities.maintenanceMode}
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
                disabled={!settingsData.capabilities.announcement}
                className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none"
              />
            </div>
            {!isMockMode ? (
              <p className="text-sm leading-6 text-slate-400">
                Maintenance mode and announcement copy remain read-only in live mode because
                the current admin API does not expose those settings yet.
              </p>
            ) : null}
            <Button
              type="button"
              onClick={() => {
                void handleSaveSettings();
              }}
              disabled={isSaving}
              className="h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              {isSaving
                ? "Applying..."
                : isMockMode
                  ? "Apply local preview"
                  : "Save live fees"}
            </Button>
            {notice ? <p className="text-sm text-cyan-100">{notice}</p> : null}
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

"use client";

import { useState } from "react";

import { DataTable } from "@/app/admin/_components/data-table";
import { MiniLineChart } from "@/app/admin/_components/mini-line-chart";
import { formatPrice } from "@/app/admin/_lib/admin-format";
import type { AdminTokenData } from "@/app/admin/_types/admin-types";
import { updateAdminTokenPriceAction } from "@/app/admin/_services/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TokenPageProps {
  tokenData: AdminTokenData;
}

export function TokenPage({ tokenData }: TokenPageProps) {
  const [name, setName] = useState(tokenData.tokenName);
  const [symbol, setSymbol] = useState(tokenData.symbol);
  const [description, setDescription] = useState(tokenData.description);
  const [priceInput, setPriceInput] = useState(
    String(tokenData.manualOverride ?? tokenData.currentPrice)
  );
  const [previewPrice, setPreviewPrice] = useState(
    tokenData.manualOverride ?? tokenData.currentPrice
  );
  const [notice, setNotice] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isMockMode = tokenData.meta.source === "mock";

  const handleSavePrice = async () => {
    const parsed = Number(priceInput);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setNotice("Enter a valid positive price.");
      return;
    }

    if (isMockMode) {
      setPreviewPrice(parsed);
      setNotice("Price preview updated locally.");
      return;
    }

    try {
      setIsSaving(true);
      await updateAdminTokenPriceAction({ priceUsdt: parsed });
      setPreviewPrice(parsed);
      setNotice("Live token price updated via the admin API.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Unable to update the live token price."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Current token price
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            {isMockMode ? "Mock price control panel" : "Live price config"}
          </h2>
          {tokenData.meta.notice ? (
            <div className="mt-4 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
              {tokenData.meta.notice}
            </div>
          ) : null}
          <div className="mt-6 rounded-[1.75rem] border border-cyan-300/16 bg-cyan-300/10 p-5">
            <p className="text-sm text-slate-300">Displayed price</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
              {formatPrice(previewPrice)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {isMockMode
                ? "Manual overrides are previewed locally in mock mode so the admin screen behavior is testable without backend mutations."
                : "This control updates the live TTO price config exposed by the admin API."}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            <div>
              <label htmlFor="manual-price" className="text-sm text-slate-300">
                Manual price override
              </label>
              <Input
                id="manual-price"
                value={priceInput}
                onChange={(event) => setPriceInput(event.target.value)}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <Button
              type="button"
              onClick={() => {
                void handleSavePrice();
              }}
              disabled={isSaving}
              className="h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              {isSaving
                ? "Updating..."
                : isMockMode
                  ? "Preview override"
                  : "Save live price"}
            </Button>
            {notice ? (
              <p className="text-sm text-cyan-100">{notice}</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Price history
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Recent TTO / USDT movement
          </h2>
          <div className="mt-5">
            <MiniLineChart
              data={tokenData.priceHistory}
              stroke="#38bdf8"
              fill="rgba(56, 189, 248, 0.18)"
            />
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Token information
          </p>
          <div className="mt-5 grid gap-4">
            <div>
              <label htmlFor="token-name" className="text-sm text-slate-300">
                Token name
              </label>
              <Input
                id="token-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={!tokenData.capabilities.editMetadata}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <div>
              <label htmlFor="token-symbol" className="text-sm text-slate-300">
                Symbol
              </label>
              <Input
                id="token-symbol"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value.toUpperCase())}
                disabled={!tokenData.capabilities.editMetadata}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <div>
              <label htmlFor="token-description" className="text-sm text-slate-300">
                Description
              </label>
              <textarea
                id="token-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                disabled={!tokenData.capabilities.editMetadata}
                className="mt-2 w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none"
              />
            </div>
            <p className="text-sm leading-6 text-slate-400">
              {tokenData.capabilities.editMetadata
                ? "Mock mode keeps these edits local to the current session so the UI flow can be validated before wiring backend endpoints."
                : "Token metadata fields are read-only in live mode because the current admin API only exposes the TTO price config."}
            </p>
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Historical changes
          </p>
          <div className="mt-5">
            <DataTable
              data={tokenData.history}
              columns={[
                {
                  key: "timestamp",
                  header: "Timestamp",
                  cell: (item) => <span className="text-slate-200">{item.timestamp}</span>,
                },
                {
                  key: "price",
                  header: "Price",
                  cell: (item) => <span className="text-slate-100">{formatPrice(item.price)}</span>,
                },
                {
                  key: "source",
                  header: "Source",
                  cell: (item) => (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200">
                      {item.source}
                    </span>
                  ),
                },
              ]}
              getRowId={(item) => item.id}
              emptyMessage="No token history is available."
              renderCard={(item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
                >
                  <p className="font-medium text-white">{formatPrice(item.price)}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.timestamp}</p>
                  <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-200">
                    {item.source}
                  </span>
                </article>
              )}
            />
          </div>
        </article>
      </section>
    </div>
  );
}

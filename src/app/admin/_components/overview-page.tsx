"use client";

import { getToneClasses } from "@/app/admin/_lib/admin-format";
import type { AdminOverviewData } from "@/app/admin/_types/admin-types";

import { MiniLineChart } from "./mini-line-chart";
import { StatCard } from "./stat-card";

interface OverviewPageProps {
  overview: AdminOverviewData;
}

export function OverviewPage({ overview }: OverviewPageProps) {
  const heroActivity = overview.recentActivity[0];
  const modeLabel =
    overview.meta.source === "mock"
      ? "Mock-backed analytics"
      : overview.meta.source === "live"
        ? "Live admin API"
        : "Hybrid live + prototype";

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-4 shadow-[0_30px_90px_-48px_rgba(14,116,144,0.8)] sm:rounded-[2rem] sm:p-6">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Live control room
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {modeLabel}
            </div>
          </div>

          {overview.meta.notice ? (
            <div className="mt-4 rounded-[1.25rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
              {overview.meta.notice}
            </div>
          ) : null}

          <div className="mt-5 rounded-[1.5rem] border border-cyan-300/12 bg-cyan-300/6 p-3.5 sm:hidden">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/80">
                  Latest priority
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {heroActivity?.title}
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-1 text-[11px] font-medium text-slate-300">
                {heroActivity?.category}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {heroActivity?.detail}
            </p>
          </div>

          <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Platform health at a glance.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:leading-7">
                This admin dashboard runs outside the wallet mobile frame and
                gives a single operational view of users, bonding volume, price
                activity, and transaction pressure.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:hidden">
                {overview.stats.slice(0, 2).map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-[1.25rem] border border-white/8 bg-white/4 p-3"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      {metric.change}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {overview.spotlight.map((item, index) => (
                <div
                  key={item.label}
                  className={`rounded-[1.5rem] border border-white/8 bg-white/4 p-4 ${index === 0 ? "col-span-2 sm:col-span-1" : ""}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-slate-400 sm:leading-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-4 sm:rounded-[2rem] sm:p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Activity stack
          </p>
          <div className="mt-4 space-y-3 sm:space-y-4">
            {overview.recentActivity.slice(0, 3).map((item) => {
              const tone = getToneClasses(item.tone);

              return (
                <div
                  key={item.id}
                  className={`rounded-[1.5rem] border p-4 ${tone.border} bg-white/4`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${tone.background} ${tone.text}`}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.timestamp}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-5">
        {overview.stats.map((metric) => (
          <StatCard
            key={metric.label}
            metric={metric}
            className="min-w-[240px] snap-start sm:min-w-0"
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-4 sm:rounded-[2rem] sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5 sm:gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Revenue trend
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Daily transaction volume
              </h3>
            </div>
            <span className="rounded-full border border-cyan-300/16 bg-cyan-300/10 px-3 py-1 text-xs font-medium text-cyan-100">
              30-day line
            </span>
          </div>
          <MiniLineChart data={overview.revenueSeries} />
        </article>

        <article className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-4 sm:rounded-[2rem] sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5 sm:gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                User growth
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                New wallet registrations
              </h3>
            </div>
            <span className="rounded-full border border-emerald-300/16 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-100">
              steady climb
            </span>
          </div>
          <MiniLineChart
            data={overview.userGrowthSeries}
            stroke="#34d399"
            fill="rgba(52, 211, 153, 0.18)"
          />
        </article>
      </section>

      <section className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-4 sm:rounded-[2rem] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Recent activity
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Cross-platform operational feed
            </h3>
          </div>
          <div className="text-sm text-slate-400">
            Last {overview.recentActivity.length} platform events
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:mt-5">
          {overview.recentActivity.map((item) => {
            const tone = getToneClasses(item.tone);

            return (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`size-2.5 rounded-full ${tone.accent}`} />
                    <span className="text-sm font-medium text-white">{item.title}</span>
                  </div>
                  <span className="text-xs text-slate-500">{item.timestamp}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

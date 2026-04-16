"use client";

import { getToneClasses } from "@/lib/admin-format";
import type { AdminOverviewData } from "@/lib/admin-types";

import { MiniLineChart } from "./mini-line-chart";
import { StatCard } from "./stat-card";

interface OverviewPageProps {
  overview: AdminOverviewData;
}

export function OverviewPage({ overview }: OverviewPageProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-6 shadow-[0_30px_90px_-48px_rgba(14,116,144,0.8)]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Live control room
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Mock-backed analytics
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-white">
                Platform health at a glance.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                This admin dashboard runs outside the wallet mobile frame and
                gives a single operational view of users, bonding volume, price
                activity, and transaction pressure.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {overview.spotlight.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Activity stack
          </p>
          <div className="mt-4 space-y-4">
            {overview.recentActivity.slice(0, 3).map((item) => {
              const tone = getToneClasses(item.tone);

              return (
                <div
                  key={item.id}
                  className={`rounded-[1.5rem] border p-4 ${tone.border} bg-white/4`}
                >
                  <div className="flex items-center justify-between gap-3">
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overview.stats.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
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

        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
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

      <section className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
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

        <div className="mt-5 grid gap-3">
          {overview.recentActivity.map((item) => {
            const tone = getToneClasses(item.tone);

            return (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
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

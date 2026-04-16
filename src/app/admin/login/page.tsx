import { redirect } from "next/navigation";
import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { ADMIN_HOME_PATH } from "@/lib/admin-auth";
import { readAdminSession } from "@/lib/admin-session";

export default async function AdminLoginPage() {
  const session = await readAdminSession();

  if (session) {
    redirect(ADMIN_HOME_PATH);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050810] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_26%),linear-gradient(180deg,_rgba(2,6,23,0.74)_0%,_rgba(2,6,23,1)_100%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden rounded-[2rem] border border-white/8 bg-white/4 p-8 backdrop-blur-xl lg:block">
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <ShieldCheck className="size-5" />
              TitanToon admin access
            </div>
            <div className="mt-8 max-w-xl space-y-5">
              <h1 className="text-4xl font-semibold leading-tight text-white">
                Separate operations space for the TitanToon wallet.
              </h1>
              <p className="text-base leading-7 text-slate-300">
                This route skips the mobile wallet frame and uses its own
                protected shell for platform operations, monitoring, and manual
                controls.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["Auth", "Signed HTTP-only admin cookie"],
                ["Routes", "Proxy-protected /admin space"],
                ["Mode", "Mock-backed management views"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/8 bg-[#081224]/80 p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="w-full rounded-[2rem] border border-white/8 bg-[#07101d]/90 p-5 shadow-[0_40px_120px_-48px_rgba(8,145,178,0.7)] backdrop-blur-xl sm:p-6 lg:p-8">
            <div className="mb-8 space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 lg:hidden">
                <ShieldCheck className="size-5 text-cyan-100" />
                Admin access
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Unlock the dashboard
              </h2>
              <p className="text-sm leading-6 text-slate-400 sm:text-base">
                Enter the server-side passphrase from `.env.local` to open the
                admin workspace.
              </p>
            </div>

            <AdminLoginForm />
          </section>
        </div>
      </div>
    </div>
  );
}

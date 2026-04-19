# Project Optimization Advice

Checked on 2026-04-19 against:

- UI: `crypto-tto-ui` — Next.js 16, React 19, Tailwind 4, Zustand, React Query, Framer Motion
- Service: `crypto-tto-service` — NestJS 11, TypeORM, MySQL, Redis/BullMQ, Solana web3.js

Scope:

- Full read of both codebases.
- Backend inspected only — no backend files changed.
- Recommendations ordered by impact.

---

## 1. Security — Critical

### 1.1 Deposit verification is still a placeholder

`DepositProcessor.verifyDeposit()` only checks `Boolean(transaction.txHashPayment)`. Any non-empty string passes. This is already documented in `IMPORTANT-TODOS.md` item 2, but it remains the single highest-risk gap across both projects. Until a real on-chain verifier is wired up, the deposit flow can credit TTO without a valid payment.

**Next step on the service side:** implement a `DepositVerifier` that calls Helius or the Solana RPC to confirm the actual on-chain transfer matches the expected token, amount, sender, recipient, and finality level. Wire it into the processor before this module is exposed to users.

### 1.2 Webhook handler does not process events

`WebhookService.handleHeliusWebhook()` counts events and returns. It never actually parses a transfer or credits a user. The README describes an architecture where deposits are detected via Helius webhooks, but the code path does nothing with the payload.

**Next step on the service side:** decide whether inbound deposit detection should come from the webhook listener or from the processor polling. If webhook, the handler needs to extract transfer details, match them against pending transactions, and trigger the credit flow. If processor, the webhook can remain an audit endpoint, but this should be documented.

### 1.3 Several scaffold modules are publicly accessible

The `tahap-01` endpoint summary lists modules — `deposit`, `presale`, `referral`, `staking`, `titan`, `transaction` — whose CRUD routes are still public and accept empty DTOs. These are NestJS generator stubs. In production, every route should be either behind `JwtAuthGuard` or explicitly designed as public.

**Next step on the service side:** add `JwtAuthGuard` to all non-public controller classes, remove or comment out scaffold routes that do not represent real business flows, and delete the empty DTOs. This prevents accidental data mutation through unprotected endpoints.

### 1.4 `synchronize: true` in non-production

`DatabaseModule` uses `synchronize: configService.get('NODE_ENV') !== 'production'`. TypeORM's `synchronize` can drop columns and data when entities change. This is risky in any shared or staging environment.

**Next step on the service side:** remove `synchronize: true` entirely and rely on migrations for all environments. The `migration:run` script already exists.

### 1.5 Admin passphrase in `.env.local` is still the default

`ADMIN_PASSPHRASE=change-me-admin`. This is fine for local development, but there is no runtime check that warns if the default value is still being used. A simple startup guard could prevent an accidental deployment with the default passphrase.

---

## 2. Data Correctness — High

### 2.1 User history endpoint is incomplete

`UserService.getHistory()` queries `bonding_profits`, `referral_bonuses`, `referral_matching_logs`, and `titan_daily_bonus_logs` but omits `swap` and `withdraw`. Users will not see their swap and withdraw activity in the unified history. This is already tracked in `IMPORTANT-TODOS.md` item 1.

**Next step on the service side:** add `UNION ALL` blocks for the `swaps` and `withdrawals` tables and update the `COUNT(*)` sub-query.

### 2.2 Bonding packages do not return the minimum amount

`BondingService.getPackages()` does not include `minAmount` in its response, yet `startBonding()` enforces a hard minimum of 100 TTO. The frontend works around this with a fallback value of `100` in the UI mapping code, but the API contract is incomplete.

**Next step on the service side:** add `minAmount` to the `getPackages()` response shape so the frontend can show the real, backend-owned constraint. This is already documented in `API-PROBLEM.md` item 1.

### 2.3 `findOrCreateTtoBalance` / `findOrCreateUsdtBalance` race condition

Both `SwapService` and `BondingService` use a find-then-create pattern with no locking. Under concurrent requests, two threads could create duplicate balance rows. `WithdrawService.submitWithdraw` reads and writes the balance without a transaction-level lock, which can cause negative balances under concurrent withdraws.

**Next step on the service side:** wrap the critical balance mutation paths in a TypeORM transaction with a `SELECT ... FOR UPDATE` or use `QueryRunner` to ensure atomicity.

---

## 3. Frontend Architecture — High

### 3.1 Move remaining inline `process.env` checks into shared constants

`USE_MOCK_API` is evaluated independently in at least five files (`page.tsx`, `purchase-form.tsx`, `wallet-session-bootstrap.tsx`, `api-helpers.ts`, etc.) via `process.env.NEXT_PUBLIC_USE_MOCK_API === "true"`. The `api-helpers.ts` already exports a constant. All other files should import from there to avoid drift and simplify flipping the flag.

### 3.2 Quote fetching does not debounce

`PurchaseForm` fires a backend `getDepositQuote` call on every input change via useEffect on `parsedAmount`. Typing `1`, `10`, `100` triggers three requests. The same pattern exists in the swap form.

**Next step on the UI side:** debounce the amount input (300–500 ms) before firing the quote request. This reduces backend load and prevents stale intermediate quotes from flashing.

### 3.3 The empty `hooks` directory

`src/hooks/` is empty. The project already colocates hooks under route-local `_hooks` directories (e.g. `dashboard/_hooks`, `admin/_hooks`). The empty top-level directory is dead weight. Remove it or add a README if it is intentionally reserved.

### 3.4 `next.config.ts` is not configured

The Next.js config is completely empty. Consider adding:

- `poweredByHeader: false` — removes the `X-Powered-By: Next.js` header
- `reactStrictMode: true` — catches common React issues during development
- image optimization config if coin logos or token icons are ever served from external domains
- headers for security (CSP, HSTS, etc.) once the app is deployed publicly

### 3.5 No error boundaries on public app routes

The admin dashboard has `error.tsx`, but the public app routes (dashboard, bonding, swap, purchase, withdraw, etc.) do not. If React Query fails silently or a component throws, the user sees a blank screen or the Next.js default error page. Add per-route `error.tsx` files with a retry button, matching the pattern already established in the admin.

### 3.6 Consider React Query for all data-fetching pages

Some pages (e.g. the dashboard) use React Query properly, but others like `PurchaseForm` manage their own `isLoading` / `error` / `data` state manually via `useEffect`. Consolidating on React Query for all server-derived data would give you consistent caching, retries, deduplication, and devtools visibility.

---

## 4. Frontend–Backend Contract — Medium

### 4.1 Session bootstrap still disconnects on any fetch failure

`WalletSessionBootstrap` calls `getWalletSessionData()` and if it throws for any reason — including a transient network error — it calls `disconnectWallet()`, wiping the persisted state. This means a brief network hiccup on page load can log the user out.

**Next step on the UI side:** distinguish between a `401`/`403` (session is actually invalid → disconnect) and a network error or `5xx` (session might still be valid → keep the persisted state and retry later). This is the remaining half of `API-PROBLEM.md` item 2.

### 4.2 Admin auth models diverge between UI and service

The frontend admin uses a passphrase-based login with an HTTP-only cookie. The backend admin uses wallet-based JWT auth with an `isAdmin` database flag. These are two entirely separate auth systems. When the UI admin is connected to the real backend, you will need either a passphrase-to-JWT bridge on the frontend API layer, or a decision to consolidate on one model.

---

## 5. Performance — Medium

### 5.1 Service-side `ensureBondingConfigs()` is called on every package read

Every call to `getPackages()`, `getHistory()`, `getDetail()`, and `getTodayProfit()` runs `ensureBondingConfigs()`, which does a full `find()` then a potential `save()` then another `find()`. In production under load, this is a guaranteed triple-query per bonding read.

**Next step on the service side:** seed the default configs in a migration or application startup hook, then cache the configs in memory (or Redis) with a short TTL. The `ensureBondingConfigs()` check can become a startup-only operation.

### 5.2 Admin `getStats()` likely runs heavy aggregate queries

The admin service file is 36 KB. If the stats endpoint runs multiple full-table counts or aggregations on every dashboard load, this will become slow as data grows.

**Next step on the service side:** profile the admin stats query, add database indexes on the filtered/aggregated columns, and consider materializing the counts in a periodic cron or Redis cache if they do not need to be real-time.

### 5.3 Frontend bundle includes `framer-motion` on every page

`framer-motion` is imported in many page components for simple fade/slide animations. The library is ~30 KB gzipped. For pages that only need a simple opacity transition, consider using CSS animations or the lighter `motion` package (the `"framer-motion/m"` mini import) to reduce the client bundle.

---

## 6. Code Quality — Medium

### 6.1 Duplicate `roundTto` / `roundUsdt` helpers

`SwapService`, `BondingService`, and `WithdrawService` each define private `roundTto()` and/or `roundUsdt()` methods with identical implementations. These should live in a shared utility (e.g. `src/common/utils/currency.util.ts`) to avoid silent precision divergence.

### 6.2 Service response shape inconsistency

Some endpoints return `{ message, data }` (e.g. `submitWithdraw`, `startBonding`) which is then double-wrapped by the `ResponseInterceptor` into `{ statusCode, message, data: { message, data } }`. Other endpoints return raw data that the interceptor wraps cleanly. This causes the frontend to need both `unwrapData: true` and manual nested unwrapping in different places.

**Next step on the service side:** audit all controller return values. If using the global interceptor, controllers should return the raw domain data and let the interceptor add the envelope. Explicit `{ message, data }` returns should be reserved for cases where the interceptor is bypassed.

### 6.3 `proxy.ts` naming conflicts with Next.js middleware convention

The file is used as Next.js middleware but is called `proxy.ts` instead of `middleware.ts`. This works because the project does not use the conventional `middleware.ts` file, but it is non-obvious. Consider renaming it to `middleware.ts` and re-exporting the function as `middleware` per the Next.js convention. Check the docs at `node_modules/next/dist/docs/` for the version 16 middleware API.

### 6.4 Test coverage is concentrated on the service

The backend has spec files for auth, bonding, swap, withdraw, and admin. The frontend has zero test files. For a financial application, at least the critical paths — session bootstrap, balance display, swap/bonding form validation, and the API normalization layer — should have unit tests.

---

## 7. DevOps / Deployment — Lower

### 7.1 No health-check endpoint beyond the root hello

`AppController` returns a simple string. For container orchestration (Docker, Kubernetes), a `/health` endpoint that checks database and Redis connectivity is essential.

### 7.2 Both `bull` and `bullmq` are in `package.json`

The service depends on both `bull` (v4) and `bullmq` (v5). The withdraw module uses `bullmq` directly. `@nestjs/bull` depends on `bull`. Pick one queue library and remove the other to avoid confusion and reduce the install size.

### 7.3 No Docker environment for the frontend

The backend has a `docker-compose.yml` for MySQL and Redis. The frontend has no Docker or container setup. For production parity, consider adding a Dockerfile for the Next.js build and adding it to the compose file or a separate frontend compose.

### 7.4 CORS is not configured on the backend

`main.ts` does not call `app.enableCors()`. The frontend works around this by proxying all API calls through its own API routes, but if any direct browser-to-backend call is ever needed, it will fail. Even with the proxy architecture, explicitly setting CORS on the backend protects against future misconfiguration.

---

## Suggested Priority Order

| Priority | Item | Effort |
|---|---|---|
| 🔴 Critical | 1.1 Real deposit verification | Large (service) |
| 🔴 Critical | 1.2 Webhook handler implementation | Medium (service) |
| 🔴 Critical | 1.3 Lock down scaffold routes | Small (service) |
| 🟠 High | 2.3 Balance mutation atomicity | Medium (service) |
| 🟠 High | 4.1 Session bootstrap resilience | Small (UI) |
| 🟠 High | 2.1 Complete user history query | Medium (service) |
| 🟠 High | 3.5 Error boundaries for public routes | Small (UI) |
| 🟡 Medium | 4.2 Reconcile admin auth models | Medium (both) |
| 🟡 Medium | 3.2 Debounce quote inputs | Small (UI) |
| 🟡 Medium | 5.1 Cache bonding configs | Small (service) |
| 🟡 Medium | 6.2 Fix response envelope double-wrap | Medium (service) |
| 🟡 Medium | 6.4 Add frontend tests | Large (UI) |
| 🟢 Lower | 1.4 Remove synchronize: true | Small (service) |
| 🟢 Lower | 2.2 Expose bonding minAmount | Small (service) |
| 🟢 Lower | 3.1 Consolidate env checks | Small (UI) |
| 🟢 Lower | 3.4 Configure next.config.ts | Small (UI) |
| 🟢 Lower | 6.1 Shared rounding utilities | Small (service) |
| 🟢 Lower | 6.3 Rename proxy to middleware | Small (UI) |
| 🟢 Lower | 7.1 Health-check endpoint | Small (service) |
| 🟢 Lower | 7.2 Remove duplicate queue lib | Small (service) |

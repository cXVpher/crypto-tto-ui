# Change Log

## feat
- Added a persisted Zustand wallet store in `src/store/use-wallet-store.ts` to manage connection state, address, username, balances, private bonding, and hydration.
- Added a shared API layer with `src/lib/fetcher.ts`, `src/lib/api-service.ts`, and `src/lib/server-auth.ts` to support mock data, live API requests, and server-side access-token lookup.
- Added client page wrappers for server/data boundaries in history and network flows with `history-page-client.tsx` and `network-page-client.tsx`.
- Added animated navigation infrastructure with `bottom-nav-config.ts`, `navigation-transition-context.tsx`, and `page-transition.tsx`.
- Added Zod and React Hook Form based validation for withdraw and swap flows with inline field-level errors and guarded submission.
- Added TanStack Query integration with a shared `QueryProvider`, a `useDashboardData` hook, and dashboard loading/error states backed by the API service.

## fix
- Prevented authenticated pages from failing when live auth data is unavailable by falling back safely for bonding, history, network, profile, and swap views.
- Fixed withdraw form recipient initialization so the field picks up the hydrated wallet address without regressing user edits.
- Added empty states for bonding, network, and swap history sections when no user data is available.
- Corrected header back-navigation so top-level routes return to `/dashboard` only when the wallet is hydrated and connected, otherwise `/`.
- Hardened the connect modal so the success state also reflects the Zustand `isConnected` flag.

## refactor
- Migrated wallet state usage away from `src/lib/wallet-context.tsx` across connect, dashboard, network, profile, swap, and withdraw UI into scoped `useWalletStore` selectors.
- Refactored history, network, profile, bonding, and swap routes to fetch data through the shared API layer and pass serializable data into client components.
- Split the bonding add screen into a server page plus `add-bonding-form.tsx` so package data and async `searchParams` are handled in a Next.js 16 compatible way.
- Reworked transaction forms to derive preview values from validated form state instead of local ad hoc validation branches.
- Consolidated bottom navigation behavior and route ordering into shared layout utilities.

## docs

## style
- Refined the wallet-facing mobile UI with glassmorphism panels, stronger gradient treatments, animated tab/page transitions, and updated feedback states across dashboard, network, history, profile, swap, withdraw, and bonding screens.

## chore
- Added `react-hook-form`, `@hookform/resolvers`, and `zod` as project dependencies.
- Added `@tanstack/react-query` and `@tanstack/react-query-devtools` as project dependencies.
- Kept the project aligned with Next.js 16 client/server patterns, async `searchParams`, and server-rendering boundaries while the migration was in progress.

## test

## perf
- Reduced unnecessary rerenders in wallet-driven UI by using narrow Zustand selectors instead of broad context subscriptions.

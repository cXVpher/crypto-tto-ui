# Change Log

## feat
- Added a full mock-backed admin dashboard under `/admin` with passphrase auth and signed HTTP-only session cookies, route protection via `src/proxy.ts`, a separate responsive admin shell, overview/users/bonding/transactions/token/settings pages, reusable admin UI primitives (tables, charts, sheets, confirm dialogs, loading skeletons), and local mock interaction flows for user suspension, package management, and withdrawal review.
- Added the real frontend API integration layer for the public app by introducing same-origin backend proxy/session routes, wiring wallet challenge-signature login and logout, and connecting the bonding, swap, deposit, and withdraw flows to the live backend submit endpoints with post-action session refreshes.
- Added a hybrid admin data layer for non-mock mode in `src/lib/admin-api-service.ts` and `src/lib/admin-backend-api.ts`, so the admin overview, users, bonding, transactions, token, and settings pages can switch from fully local mock data to backend-backed reads while preserving prototype-only sections when the current API does not yet expose those datasets.
- Added frontend-only live admin mutation support in `src/app/admin/dashboard-actions.ts` for user suspension, bonding rate updates, withdrawal retry, TTO price updates, and fee updates, with the admin UI now exposing or hiding controls based on backend capability flags instead of assuming every mock action exists in live mode.

## fix
- Fixed the admin login runtime error caused by exporting a non-async value from a `"use server"` module by moving the login action state into `src/app/admin/action-types.ts` and keeping `src/app/admin/actions.ts` limited to async server functions.
- Fixed admin navigation state handling so `/admin` only highlights the overview route itself while nested admin pages correctly mark the matching sidebar item, and the mobile `More` action now shows an active state when one of its hidden routes is open.
- Fixed the frontend/backend contract mismatches across bonding, referral, swap, history, and profile screens by remapping the real service payloads, switching purchase history to deposit history, reading withdraw network fees correctly, consuming backend affiliate links as-is, and aligning status/rank labels with the API response shape.
- Fixed the fragile `/api/v1` path assumption and browser-side backend access by routing real API traffic through frontend-owned same-origin handlers instead of depending on direct backend CORS compatibility.
- Fixed transaction UX gaps in real mode by using internal USDT balance semantics for withdraw, adding payment transaction-hash confirmation to deposit, and refreshing dashboard wallet balances after successful swap, bonding, purchase, and withdraw actions.
- Fixed the remaining frontend live-mode session drift by adding a root-level wallet session bootstrap in `src/app/_components/wallet-session-bootstrap.tsx` and extending the persisted wallet store to resolve auth state from `/api/auth/session` before connect-page redirects, dashboard redirects, page header back-target logic, and bottom navigation visibility are decided.
- Fixed the admin live-mode UX so transaction details no longer invent mock transaction hashes when the backend does not return one, and token/settings save buttons now track the actual async request state instead of relying on transition-only UI state.
- Fixed the admin mock and live status mapping/types to cover backend-specific cases such as `VERIFIED`, `PROCESSING`, and `CANCELLED`, and aligned the mock datasets with the newer public-app naming and pricing conventions used elsewhere in the UI.

## refactor
- Refactored admin route matching into a shared `isAdminNavItemActive` helper and updated the shell/top bar/bottom navigation/stat cards to accept shared layout props for the compact overview frame.
- Refactored the frontend API client and wallet state management to normalize backend payload variants in `src/lib/api-service.ts`, centralize backend URL/cookie/session helpers, add Solana wallet provider and base58 utilities, and extend the persisted wallet store with backend session data such as USDT balance.
- Refactored admin data contracts in `src/lib/admin-types.ts` to include per-page metadata and capability flags, then updated the admin pages to render from those contracts and operate in explicit mock or hybrid-live modes instead of assuming a single mock-only feature set.

## docs

## style
- Restyled the admin shell and overview for a tighter mobile-first layout by centering the overview inside a compact frame, improving card/chart spacing and horizontal metric scrolling on small screens, and replacing the users page native dropdown filters with the existing custom select components.
- Updated the public app UI copy and presentation to match the live backend behavior, including bonding/network/history status rendering, withdraw page wording, profile field mapping, and swap/purchase form states for the real API flow.

## chore

## test
- Re-ran `npm run lint` and `npm run build` after the hybrid admin integration, the frontend-only live admin fixes, and the wallet session bootstrap changes; all checks passed on April 18, 2026.

## perf

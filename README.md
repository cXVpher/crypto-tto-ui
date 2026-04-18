# Change Log

## feat
- Added a full mock-backed admin dashboard under `/admin` with passphrase auth and signed HTTP-only session cookies, route protection via `src/proxy.ts`, a separate responsive admin shell, overview/users/bonding/transactions/token/settings pages, reusable admin UI primitives (tables, charts, sheets, confirm dialogs, loading skeletons), and local mock interaction flows for user suspension, package management, and withdrawal review.
- Added the real frontend API integration layer for the public app by introducing same-origin backend proxy/session routes, wiring wallet challenge-signature login and logout, and connecting the bonding, swap, deposit, and withdraw flows to the live backend submit endpoints with post-action session refreshes.

## fix
- Fixed the admin login runtime error caused by exporting a non-async value from a `"use server"` module by moving the login action state into `src/app/admin/action-types.ts` and keeping `src/app/admin/actions.ts` limited to async server functions.
- Fixed admin navigation state handling so `/admin` only highlights the overview route itself while nested admin pages correctly mark the matching sidebar item, and the mobile `More` action now shows an active state when one of its hidden routes is open.
- Fixed the frontend/backend contract mismatches across bonding, referral, swap, history, and profile screens by remapping the real service payloads, switching purchase history to deposit history, reading withdraw network fees correctly, consuming backend affiliate links as-is, and aligning status/rank labels with the API response shape.
- Fixed the fragile `/api/v1` path assumption and browser-side backend access by routing real API traffic through frontend-owned same-origin handlers instead of depending on direct backend CORS compatibility.
- Fixed transaction UX gaps in real mode by using internal USDT balance semantics for withdraw, adding payment transaction-hash confirmation to deposit, and refreshing dashboard wallet balances after successful swap, bonding, purchase, and withdraw actions.

## refactor
- Refactored admin route matching into a shared `isAdminNavItemActive` helper and updated the shell/top bar/bottom navigation/stat cards to accept shared layout props for the compact overview frame.
- Refactored the frontend API client and wallet state management to normalize backend payload variants in `src/lib/api-service.ts`, centralize backend URL/cookie/session helpers, add Solana wallet provider and base58 utilities, and extend the persisted wallet store with backend session data such as USDT balance.

## docs

## style
- Restyled the admin shell and overview for a tighter mobile-first layout by centering the overview inside a compact frame, improving card/chart spacing and horizontal metric scrolling on small screens, and replacing the users page native dropdown filters with the existing custom select components.
- Updated the public app UI copy and presentation to match the live backend behavior, including bonding/network/history status rendering, withdraw page wording, profile field mapping, and swap/purchase form states for the real API flow.

## chore

## test

## perf

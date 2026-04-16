# Change Log

## feat
- Added a full mock-backed admin dashboard under `/admin` with passphrase auth and signed HTTP-only session cookies, route protection via `src/proxy.ts`, a separate responsive admin shell, overview/users/bonding/transactions/token/settings pages, reusable admin UI primitives (tables, charts, sheets, confirm dialogs, loading skeletons), and local mock interaction flows for user suspension, package management, and withdrawal review.

## fix
- Fixed the admin login runtime error caused by exporting a non-async value from a `"use server"` module by moving the login action state into `src/app/admin/action-types.ts` and keeping `src/app/admin/actions.ts` limited to async server functions.

## refactor

## docs

## style

## chore

## test

## perf

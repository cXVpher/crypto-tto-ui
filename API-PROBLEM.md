# API Problem Report

Checked on 2026-04-18 against:

- UI: `src/lib/api-service.ts`, `src/app/api/...`, `src/app/page.tsx`, `src/store/use-wallet-store.ts`
- Service: `../crypto-tto-service/src/...`

Scope:

- Frontend integration work has already been applied.
- Backend code was inspected only.
- No backend files were changed.

## Summary

Most of the original UI and service contract mismatches have been resolved on the frontend. Route handling, response mapping, real auth submission, and the transaction submit flows are now wired to the backend contract.

The remaining problems are narrow:

- the backend bonding package payload still does not expose the minimum amount the UI should display
- the frontend still does not fully restore authenticated session state from the backend cookie on a cold app start

## Confirmed Problems

### 1. Bonding package payload still does not expose the minimum amount

- Frontend package mapping in `src/lib/api-service.ts` now reads:
  - `label` or `name`
  - `durationDays` or `days`
  - `dailyRate` or `dailyProfit`
  - `minAmount` or `minTtoAmount`
- Backend `getPackages()` in `../crypto-tto-service/src/bonding/bonding.service.ts` still does not return a minimum field.
- Backend `startBonding()` still enforces a hard minimum of `100 TTO`.

Impact:

- The UI cannot display the true backend-owned minimum from the package endpoint.
- The frontend currently falls back to `100` in `src/lib/api-service.ts` so the form remains usable.
- This works as a compatibility patch, but the contract is still incomplete because the package resource does not describe the constraint it enforces at submit time.

### 2. Frontend session bootstrap can still drift from the backend session cookie

- Real login is now implemented in `src/app/page.tsx` using:
  - `GET /api/v1/auth/challenge`
  - `POST /api/v1/auth/verify`
- The verified token is stored through the frontend session route and reused by the same-origin proxy.
- The client store in `src/store/use-wallet-store.ts` still persists `isConnected`, wallet identity, and balances in local storage.
- The app does not currently perform a general session re-sync from `/api/auth/session` on initial app boot.

Impact:

- If the browser has a valid backend session cookie but stale or empty persisted frontend state, the UI can start in the wrong auth state until a later action refreshes it.
- If the persisted frontend state says connected but the backend cookie is gone or expired, the client can also appear connected before the next authenticated request corrects it.
- This is now a frontend state-management gap, not a backend API shape problem.

## Resolved From The Previous Report

These items should no longer be treated as open API problems in the UI:

- route prefix fragility
- bonding active data mismatch
- referral tree shape mismatch
- swap rate and swap history mapping mismatch
- purchase history using the wrong endpoint
- withdraw history fee mapping mismatch
- `/auth/me` profile mapping mismatch
- affiliate link handling mismatch
- titan label mapping mismatch
- missing real auth submission flow
- missing real transaction submit wiring

## Bottom Line

The integration is no longer blocked by the broad contract mismatches listed in the previous version of this document. The two issues that still exist are:

- backend bonding packages still omit the minimum amount they enforce
- frontend auth state is still not fully restored from the backend session on cold start

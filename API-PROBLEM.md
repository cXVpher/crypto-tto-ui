# API Problem Report

Checked on 2026-04-13 against:

- UI: `src/lib/api-service.ts`, `src/lib/fetcher.ts`
- Service: `../crypto-tto-service/src/...`

Scope:

- Backend code was inspected only.
- No backend files were changed.
- UI is still in mock mode, so this is a contract review, not a live integration test.

## Summary

There is no obvious single backend crash-level problem from static inspection. The main issue is that the UI and `crypto-tto-service` do not currently share the same response contract on several endpoints. If mock mode is turned off without fixing those mismatches, multiple pages will render incomplete or incorrect data even if the backend itself is working.

## Confirmed Problems

### 1. Route prefix is fragile

- Backend prefix is `api/v1` in `../crypto-tto-service/src/main.ts`.
- UI calls paths like `/v1/...` from `src/lib/api-service.ts`.
- This only works because the current UI env uses `NEXT_PUBLIC_API_URL=http://localhost:3000/api`.
- If `NEXT_PUBLIC_API_URL` is changed to the backend root, for example `http://localhost:3000`, the UI will call `/v1/...` instead of `/api/v1/...` and hit 404s.

This is not a backend bug, but it is a real integration trap.

### 2. `GET /bonding/active` does not return what the UI expects

- UI expects an array of active bonding items from `/v1/bonding/active`.
- Backend `getActiveSummary()` in `../crypto-tto-service/src/bonding/bonding.service.ts` returns only:
  - `totalLockedTto`
  - `activeBondingCount`
  - `estimatedDailyProfitTto`

Impact:

- The UI expects rows with package name, amount, token, status, start date, and end date.
- Real API mode would not be able to populate `myBondingList` correctly from this endpoint.

### 3. Bonding package shape does not match

- UI expects package items like:
  - `name`
  - `days` or `durationDays`
  - `dailyProfit` or `dailyRate`
  - `minAmount` or `minTtoAmount`
- Backend `getPackages()` returns:
  - `id`
  - `label`
  - `durationDays`
  - `dailyRate`
  - `dailyRateLabel`
  - `totalReturn`

Impact:

- The UI can derive days and daily profit, but `name` is not provided and `minAmount` is missing entirely.
- `minAmount` falls back to `0` in the UI, which is wrong for a real purchase/bonding flow.
- Backend `startBonding()` enforces a hard minimum of `100 TTO`, but the package endpoint does not expose that minimum to the UI.

### 4. Referral tree response shape is different

- UI expects `/v1/referral/tree` to return an array of levels directly.
- Backend `getTree()` returns:
  - `data.walletAddress`
  - `data.totalDownline`
  - `data.levels`
  - `meta`
- Inside each level, backend uses `members`.
- Each member uses `walletAddress`, `inviteDate`, `ttoBonus`, and `status`.

Impact:

- The current UI mapping treats the response as an array, so it will not read the real backend payload correctly.
- The UI also expects `bonding` or `totalBonding`, but the backend exposes `ttoBonus` instead, which is a different metric.

### 5. Swap rate shape does not match

- UI expects `/v1/swap/rate` to provide a token-like object using `symbol` and `price`.
- Backend `getRate()` returns:
  - `ttoPriceUsdt`
  - `priceSource`
  - `feePercentage`
  - `minimumTto`

Impact:

- The current UI mapper will not read the real price fields correctly.
- Real pricing, fee, and minimum swap values are available in the backend, but the UI is not consuming them in their real shape.

### 6. Swap history shape does not match

- UI expects swap history items like:
  - `fromAmount`
  - `fromToken`
  - `toAmount`
  - `toToken`
  - `date`
  - `status`
- Backend `getHistory()` returns:
  - `ttoAmount`
  - `ttoPriceUsdt`
  - `grossUsdt`
  - `feePercentage`
  - `feeTto`
  - `netUsdt`
  - `status`
  - `createdAt`

Impact:

- The UI maps `toAmount` from `toAmount` or `usdtAmount`, but backend returns `netUsdt`.
- Real swap history would likely show `0` or incomplete values for the received side.

### 7. Purchase history is wired to the wrong endpoint

- UI purchase history currently uses `/v1/user/history`.
- Backend has a dedicated deposit history endpoint at `/api/v1/deposit/history`.
- Backend `user/history` is a combined activity feed, not deposit/purchase history.

Impact:

- The purchase page is reading the wrong resource for real API mode.
- Even if `/user/history` succeeds, the shape is not a purchase-history shape.

### 8. `GET /user/history` shape does not match purchase history

- UI expects purchase history rows like:
  - `amount`
  - `token`
  - `received` or `receivedAmount`
  - `receivedToken`
  - `status`
  - `createdAt` or `date`
- Backend `getHistory()` returns combined activity rows with:
  - `type`
  - `label`
  - `fromAddress`
  - `ttoAmount`
  - `usdtAmount`
  - `createdAt`

Impact:

- The UI will not be able to render real purchase history correctly from this endpoint.
- This is a contract mismatch, not just a naming issue.

### 9. Withdraw history shape does not fully match

- UI expects:
  - `amount` or `usdtAmount`
  - `token`
  - `wallet` or `recipientAddress`
  - `fee` or `feeAmount`
  - `date`
  - `status`
- Backend returns:
  - `usdtAmount`
  - `networkFeeUsdt`
  - `netUsdt`
  - `recipientAddress`
  - `txHash`
  - `status`
  - `createdAt`
  - `completedAt`

Impact:

- Amount and wallet can be partially recovered by the UI.
- Fee cannot, because the UI looks for `fee` or `feeAmount` while the backend returns `networkFeeUsdt`.
- Real withdraw history would under-report or zero out the fee column.

### 10. `/auth/me` shape does not match profile expectations

- UI expects `/v1/auth/me` to provide fields like:
  - `username`
  - `wallet`
  - `createdAt`
  - `referredBy`
  - `referredByWallet`
- Backend `getMe()` returns:
  - `userId`
  - `username`
  - `walletAddress`
  - `walletAddressFull`
  - `titanLevel`
  - `titanLevelLabel`
  - `registeredSince`
  - `invitedByAddress`
  - `referralCode`
  - `affiliateLink`

Impact:

- Profile fields like registration date and inviter will not map correctly.
- The UI currently looks for keys that do not exist in the real backend response.

### 11. Referral link handling is inconsistent

- Backend `getCode()` returns a complete `affiliateLink`.
- Backend `getMe()` also returns an `affiliateLink`.
- The UI profile layer currently treats referral-code data as if it only needs to read a single field and does not align with the full backend contract.

Impact:

- The UI should consume the backend-provided link as-is.
- Any UI-side reconstruction of the affiliate link is risky because backend already owns that format.

### 12. Titan status label key does not match

- UI looks for:
  - `levelName`
  - `currentLevelName`
  - `currentLevel`
- Backend returns:
  - `currentLevel`
  - `currentLevelLabel`
  - `nextLevel`
  - `nextLevelLabel`
  - `progress`
  - `dailyBonus`
  - `isEligibleForNextLevel`

Impact:

- The UI may fall back to generic rank text instead of using the backend’s real label.

## Integration Gaps That Still Block Real API Usage

These are not necessarily backend problems, but they are real blockers.

### 13. Real auth flow is not integrated end-to-end in the UI

- Backend auth flow is challenge + signature verification + JWT.
- Relevant backend endpoints exist:
  - `GET /api/v1/auth/challenge`
  - `POST /api/v1/auth/verify`
  - `GET /api/v1/auth/me`
- The UI currently has request-time token plumbing and safe fallbacks, but it is not fully wired to the backend auth flow in a production-complete way.

Impact:

- Even if every response shape matched, real API mode would still depend on completing the wallet-signature login flow and token persistence/transport correctly.

### 14. Transaction forms are still not connected to real submit endpoints

- Backend exposes real transactional endpoints such as:
  - `POST /api/v1/swap/execute`
  - `POST /api/v1/withdraw/submit`
  - `POST /api/v1/bonding/start`
  - `POST /api/v1/deposit/confirm`
- The current UI work has focused on state migration, validation, and read paths.

Impact:

- The UI is not yet exercising the backend’s real write paths.
- Real integration is incomplete even if read-only pages are fixed.

## Bottom Line

The main problem is not that `crypto-tto-service` obviously lacks the required routes. Most required routes do exist. The actual problem is that the UI currently assumes response shapes and resource meanings that do not match the backend contract.

If mock mode is turned off today without further work, the most likely failures are:

- bonding data showing partial or empty values
- referral/network data not rendering correctly
- swap price and swap history rendering wrong values
- purchase history reading the wrong endpoint
- profile fields showing fallbacks instead of real backend data
- real auth and real transaction submission still being incomplete

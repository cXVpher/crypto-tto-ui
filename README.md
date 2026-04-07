# Change Log

## feat
- Added a frontend-only `/withdraw` page and withdraw form.
- Wired the dashboard `WITHDRAW` action to navigate to `/withdraw`.
- Added inline submit confirmation states for purchase, swap, bonding add, and withdraw flows.
- Added a reusable `FormFeedback` component for info, error, and success messages.
- Updated the withdraw flow to preview USD payout instead of returning `TTO` again.

## fix
- Removed placeholder `alert()` submit behavior from purchase, swap, and bonding add flows.
- Replaced the dead dashboard withdraw button handler with a real route.
- Added validation for invalid, minimum, and over-balance inputs in the updated forms.
- Fixed withdraw calculations so `Network Fee` is shown in USD and deducted from the final USD receive amount.

## refactor
- Refactored wallet persistence in `wallet-context.tsx` to use a storage-backed `useSyncExternalStore` pattern.
- Unified inline form status messaging through the shared `FormFeedback` component.
- Simplified the updated form flows so all submit states are handled in-component instead of with browser alerts.

## style
- Replaced purchase distribution emoji usage with Lucide icons.
- Improved the visual presentation of purchase, swap, bonding add, and withdraw feedback states for consistency.
- Changed the browser tab icon to use the coin logo via `src/app/icon.png`.
- Renamed user-facing purchase labels to deposit across the dashboard, deposit page, form, and history tab.

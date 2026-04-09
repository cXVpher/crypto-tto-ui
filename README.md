# Change Log

## feat
- Added a dashboard-style radial gradient background to the `Bonding`, `Swap`, `Network`, and `Profile` pages, with the highlight shifted to the left side.

## fix
- Removed the duplicate `src/app/icon.png` app icon route and kept the existing public icon asset path through metadata.
- Replaced the remaining emoji in `Network > Matching History` with a Phosphor icon.

## refactor
- Migrated all app icons from `lucide-react` to `@phosphor-icons/react`.
- Removed the dashboard search button from the top bar.

## docs

## style
- Updated the `Connect Wallet`, `Deposit`, `Swap`, `Submit Withdraw`, and `Create Contract` primary action buttons to use the same blue gradient/glow as the dashboard `Deposit` button.
- Updated the shared page header and dashboard top bar to use a translucent blurred background so page gradients remain visible while the header stays fixed on scroll.
- Adjusted the dashboard `Withdraw` quick action button to use a more glass-like appearance.
- Updated the active `Network` tab color to match the dashboard `Deposit` button styling.

## chore

## test

## perf

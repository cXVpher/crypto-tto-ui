import {
  ArrowsLeftRight,
  Coins,
  GearSix,
  House,
  Stack,
  UsersThree,
} from "@phosphor-icons/react";

export const adminNavItems = [
  {
    href: "/admin",
    label: "Overview",
    shortLabel: "Home",
    description: "Platform health and analytics",
    icon: House,
  },
  {
    href: "/admin/users",
    label: "Users",
    shortLabel: "Users",
    description: "Wallets, ranks, and status",
    icon: UsersThree,
  },
  {
    href: "/admin/bonding",
    label: "Bonding",
    shortLabel: "Bonding",
    description: "Packages and active bondings",
    icon: Stack,
  },
  {
    href: "/admin/transactions",
    label: "Transactions",
    shortLabel: "Tx",
    description: "Purchases, swaps, and withdrawals",
    icon: ArrowsLeftRight,
  },
  {
    href: "/admin/token",
    label: "Token",
    shortLabel: "Token",
    description: "Price controls and history",
    icon: Coins,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    shortLabel: "Settings",
    description: "Operational controls",
    icon: GearSix,
  },
] as const;

export const adminBottomNavItems = adminNavItems.slice(0, 4);

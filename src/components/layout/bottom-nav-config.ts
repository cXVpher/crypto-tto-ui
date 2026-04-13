import {
  ArrowsLeftRight,
  House,
  Network,
  Stack,
  User,
} from "@phosphor-icons/react";

export const bottomNavItems = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/bonding", label: "Bonding", icon: Stack },
  { href: "/swap", label: "Swap", icon: ArrowsLeftRight },
  { href: "/network", label: "Network", icon: Network },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export const bottomNavRouteOrder = bottomNavItems.map((item) => item.href);

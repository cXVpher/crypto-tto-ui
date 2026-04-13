// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MobileFrame } from "@/components/layout/mobile-frame";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { NavigationTransitionProvider } from "@/components/layout/navigation-transition-context";
import { QueryProvider } from "@/components/providers/query-provider";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0e1a",
};

export const metadata: Metadata = {
  title: "TitanToon Wallet",
  description:
    "TitanToon (TTO) — One-tap crypto wallet. Stake, bond, swap, and earn with the TitanToon community.",
  icons: {
    icon: "/coin-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#050810]">
        <NavigationTransitionProvider>
          <MobileFrame>
            <div id="page-header-root" />
            <QueryProvider>
              <PageTransition>{children}</PageTransition>
            </QueryProvider>
            <BottomNav />
          </MobileFrame>
        </NavigationTransitionProvider>
      </body>
    </html>
  );
}

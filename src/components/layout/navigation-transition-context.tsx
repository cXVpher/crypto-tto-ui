"use client";

import { createContext, useContext, useState } from "react";
import { bottomNavRouteOrder } from "./bottom-nav-config";

type TransitionDirection = -1 | 0 | 1;

type NavigationTransitionContextValue = {
  direction: TransitionDirection;
  targetPathname: string | null;
  setRouteTransition: (currentPathname: string, nextPathname: string) => void;
  clearTransition: () => void;
};

const NavigationTransitionContext =
  createContext<NavigationTransitionContextValue | null>(null);

function getNavIndex(pathname: string) {
  return bottomNavRouteOrder.findIndex(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function getDirection(
  currentPathname: string,
  nextPathname: string
): TransitionDirection {
  const currentIndex = getNavIndex(currentPathname);
  const nextIndex = getNavIndex(nextPathname);

  if (currentIndex === -1 || nextIndex === -1 || currentIndex === nextIndex) {
    return 0;
  }

  return nextIndex > currentIndex ? 1 : -1;
}

export function NavigationTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [direction, setDirection] = useState<TransitionDirection>(0);
  const [targetPathname, setTargetPathname] = useState<string | null>(null);

  const value: NavigationTransitionContextValue = {
    direction,
    targetPathname,
    setRouteTransition(currentPathname, nextPathname) {
      setDirection(getDirection(currentPathname, nextPathname));
      setTargetPathname(nextPathname);
    },
    clearTransition() {
      setDirection(0);
      setTargetPathname(null);
    },
  };

  return (
    <NavigationTransitionContext.Provider value={value}>
      {children}
    </NavigationTransitionContext.Provider>
  );
}

export function useNavigationTransition() {
  const context = useContext(NavigationTransitionContext);

  if (!context) {
    throw new Error(
      "useNavigationTransition must be used within NavigationTransitionProvider"
    );
  }

  return context;
}

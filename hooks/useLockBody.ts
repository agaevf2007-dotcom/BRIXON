"use client";

import { useUI } from "@/context/UIContext";
import { useEffect } from "react";

export function useLockBody(locked: boolean) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = locked ? "hidden" : previous;
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function useEscape(handler: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

export function BodyLock() {
  const { cartOpen, menuOpen, searchOpen, filtersOpen, wishlistOpen } = useUI();
  useLockBody(cartOpen || menuOpen || searchOpen || filtersOpen || wishlistOpen);
  return null;
}

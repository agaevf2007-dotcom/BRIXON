"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type UIContextValue = {
  cartOpen: boolean;
  menuOpen: boolean;
  searchOpen: boolean;
  filtersOpen: boolean;
  wishlistOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  openFilters: () => void;
  closeFilters: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const closeOthers = useCallback((keep?: keyof Pick<UIContextValue, "cartOpen" | "menuOpen" | "searchOpen" | "filtersOpen" | "wishlistOpen">) => {
    if (keep !== "cartOpen") setCartOpen(false);
    if (keep !== "menuOpen") setMenuOpen(false);
    if (keep !== "searchOpen") setSearchOpen(false);
    if (keep !== "filtersOpen") setFiltersOpen(false);
    if (keep !== "wishlistOpen") setWishlistOpen(false);
  }, []);

  const value = useMemo<UIContextValue>(
    () => ({
      cartOpen,
      menuOpen,
      searchOpen,
      filtersOpen,
      wishlistOpen,
      openCart: () => {
        closeOthers("cartOpen");
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      toggleCart: () => {
        setCartOpen((open) => {
          if (!open) closeOthers("cartOpen");
          return !open;
        });
      },
      openMenu: () => {
        closeOthers("menuOpen");
        setMenuOpen(true);
      },
      closeMenu: () => setMenuOpen(false),
      toggleMenu: () => {
        setMenuOpen((open) => {
          if (!open) closeOthers("menuOpen");
          return !open;
        });
      },
      openSearch: () => {
        closeOthers("searchOpen");
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
      toggleSearch: () => {
        setSearchOpen((open) => {
          if (!open) closeOthers("searchOpen");
          return !open;
        });
      },
      openFilters: () => {
        closeOthers("filtersOpen");
        setFiltersOpen(true);
      },
      closeFilters: () => setFiltersOpen(false),
      openWishlist: () => {
        closeOthers("wishlistOpen");
        setWishlistOpen(true);
      },
      closeWishlist: () => setWishlistOpen(false),
      toggleWishlist: () => {
        setWishlistOpen((open) => {
          if (!open) closeOthers("wishlistOpen");
          return !open;
        });
      },
    }),
    [cartOpen, menuOpen, searchOpen, filtersOpen, wishlistOpen, closeOthers],
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within UIProvider");
  return context;
}

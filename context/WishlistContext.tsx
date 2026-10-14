"use client";

import { useLocale } from "@/context/LocaleContext";
import { getProductById } from "@/data/products";
import { loc } from "@/lib/i18n";
import type { Product } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useToast } from "@/context/ToastContext";

type WishlistContextValue = {
  ids: string[];
  products: Product[];
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "brixon-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const { pushToast } = useToast();
  const { locale, t } = useLocale();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setIds(JSON.parse(stored) as string[]);
    } catch {
      setIds([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids, ready]);

  const has = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (product: Product) => {
      setIds((current) => {
        const exists = current.includes(product.id);
        pushToast({
          title: exists ? t("wishlist.removed") : t("wishlist.added"),
          description: loc(product.name, locale),
        });
        return exists ? current.filter((id) => id !== product.id) : [...current, product.id];
      });
    },
    [pushToast, locale, t],
  );

  const products = useMemo(
    () => ids.map((id) => getProductById(id)).filter((item): item is Product => Boolean(item)),
    [ids],
  );

  const value = useMemo(
    () => ({ ids, products, has, toggle }),
    [ids, products, has, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}

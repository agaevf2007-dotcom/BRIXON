"use client";

import { useLocale } from "@/context/LocaleContext";
import { getProductById } from "@/data/products";
import { loc } from "@/lib/i18n";
import { getDeliveryFeeEUR } from "@/lib/price";
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
import { useUI } from "@/context/UIContext";

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  total: number;
  lastAddedId: string | null;
  addItem: (product: Product, quantity?: number, options?: { openDrawer?: boolean }) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  lines: Array<{ product: Product; quantity: number }>;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "brixon-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const { pushToast } = useToast();
  const { openCart } = useUI();
  const { locale, t } = useLocale();

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      setItems([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback(
    (product: Product, quantity = 1, options?: { openDrawer?: boolean }) => {
      setItems((current) => {
        const existing = current.find((item) => item.productId === product.id);
        if (existing) {
          return current.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...current, { productId: product.id, quantity }];
      });
      setLastAddedId(product.id);
      window.setTimeout(() => setLastAddedId(null), 900);
      if (options?.openDrawer !== false) openCart();
      pushToast({
        title: t("cart.added"),
        description: loc(product.name, locale),
        tone: "success",
      });
    },
    [openCart, pushToast, locale, t],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) => {
      if (quantity < 1) return current.filter((item) => item.productId !== productId);
      return current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return { product, quantity: item.quantity };
        })
        .filter((line): line is { product: Product; quantity: number } => Boolean(line)),
    [items],
  );

  const subtotal = lines.reduce((sum, line) => sum + line.product.basePriceEUR * line.quantity, 0);
  const delivery = getDeliveryFeeEUR(subtotal);
  const total = subtotal + delivery;
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      delivery,
      total,
      lastAddedId,
      addItem,
      removeItem,
      setQuantity,
      clear,
      lines,
    }),
    [items, itemCount, subtotal, delivery, total, lastAddedId, addItem, removeItem, setQuantity, clear, lines],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

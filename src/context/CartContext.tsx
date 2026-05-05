import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { findProduct } from "@/data/products";

export type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "anunatural_cart_v1";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, it) => {
      const p = findProduct(it.productId);
      return p ? sum + p.price * it.quantity : sum;
    }, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);

    return {
      items,
      count,
      subtotal,
      add: (productId, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((p) => p.productId === productId);
          if (existing) {
            return prev.map((p) =>
              p.productId === productId ? { ...p, quantity: p.quantity + qty } : p,
            );
          }
          return [...prev, { productId, quantity: qty }];
        }),
      remove: (productId) =>
        setItems((prev) => prev.filter((p) => p.productId !== productId)),
      setQty: (productId, qty) =>
        setItems((prev) =>
          qty <= 0
            ? prev.filter((p) => p.productId !== productId)
            : prev.map((p) => (p.productId === productId ? { ...p, quantity: qty } : p)),
        ),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

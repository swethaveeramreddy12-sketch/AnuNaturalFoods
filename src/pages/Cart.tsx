import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart, formatINR } from "@/context/CartContext";
import { findProduct } from "@/data/products";

const Cart = () => {
  const { items, setQty, remove, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = items.length === 0 ? 0 : 59;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <h1 className="font-display text-4xl font-bold text-primary sm:text-5xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border/60 bg-card p-16 text-center shadow-soft">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/#shop"
              className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform"
            >
              Browse mangoes
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
            <ul className="space-y-4">
              {items.map((it) => {
                const p = findProduct(it.productId);
                if (!p) return null;
                return (
                  <li
                    key={it.productId}
                    className="flex gap-4 rounded-2xl bg-card p-4 shadow-soft sm:gap-6 sm:p-6"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      width={120}
                      height={120}
                      loading="lazy"
                      className="h-24 w-24 flex-shrink-0 rounded-xl object-cover sm:h-28 sm:w-28"
                    />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-bold text-primary">{p.name}</h3>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground">{p.weight}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(p.id)}
                          aria-label={`Remove ${p.name}`}
                          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(p.id, it.quantity - 1)}
                            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQty(p.id, it.quantity + 1)}
                            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="font-display text-lg font-bold text-foreground">
                          {formatINR(p.price * it.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit rounded-2xl bg-card p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-bold text-primary">Order summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatINR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-semibold">{formatINR(shipping)}</dd>
                </div>
                <div className="my-3 h-px bg-border" />
                <div className="flex justify-between text-base">
                  <dt className="font-semibold text-primary">Total</dt>
                  <dd className="font-display text-2xl font-bold text-primary">{formatINR(total)}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.02]"
              >
                Proceed to checkout
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Flat shipping of {formatINR(59)} across India.
              </p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Product } from "@/data/products";
import { useCart, formatINR } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product }: { product: Product }) => {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const soldOut = product.outOfStock;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl bg-card shadow-soft transition-all duration-500 ${
        soldOut ? "opacity-95" : "hover:-translate-y-1 hover:shadow-card"
      }`}
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
        aria-disabled={soldOut}
      >
        <img
          src={product.image}
          alt={`${product.name} from ${product.origin}`}
          loading="lazy"
          width={768}
          height={768}
          className={`h-full w-full object-cover transition-transform duration-700 ${
            soldOut ? "grayscale" : "group-hover:scale-105"
          }`}
        />
        {product.badge && !soldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary-foreground shadow-soft">
            {product.badge}
          </span>
        )}
        {soldOut && (
          <>
            <div className="absolute inset-0 bg-foreground/40" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive px-5 py-2 text-sm font-bold uppercase tracking-wider text-destructive-foreground shadow-card">
              Out of stock
            </span>
          </>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-primary">{product.name}</h3>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{product.origin}</p>
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 font-semibold text-foreground">{product.weight}</span>
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-semibold text-accent">{product.calories}</span>
          {soldOut && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-1 font-semibold text-destructive">
              Out of stock
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-bold text-foreground">{formatINR(product.price)}</span>
            <div className="inline-flex items-center rounded-full border border-border bg-background">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                disabled={qty <= 1 || soldOut}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(50, q + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-40"
                disabled={soldOut}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              if (soldOut) return;
              add(product.id, qty);
              toast.success(`${qty} × ${product.name} added to cart`);
            }}
            className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition-all ${
              soldOut
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-mango text-secondary-foreground hover:scale-[1.02] hover:shadow-glow"
            }`}
          >
            {soldOut ? "Out of stock" : (<><Plus className="h-4 w-4" /> Add to cart</>)}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;

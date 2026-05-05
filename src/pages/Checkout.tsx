import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Lock, Wallet } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart, formatINR } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { findProduct } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const schema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone").max(20),
  address: z.string().min(6, "Enter your address").max(200),
  city: z.string().min(2).max(80),
  pincode: z.string().min(4).max(10),
});

type Method = "cod";

type Prefill = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
};

const Checkout = () => {
  const { items, subtotal } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<Method>("cod");
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [prefillReady, setPrefillReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setPrefillReady(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, phone, address, city, pincode")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      setPrefill({
        name: data?.full_name ?? "",
        email: user.email ?? "",
        phone: data?.phone ?? "",
        address: data?.address ?? "",
        city: data?.city ?? "",
        pincode: data?.pincode ?? "",
      });
      setPrefillReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading) return null;
  if (items.length === 0) return <Navigate to="/cart" replace />;
  if (!user)
    return <Navigate to="/auth" replace state={{ from: "/checkout" }} />;
  if (!prefillReady) return null;

  const shipping = 59;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("create-order", {
        body: {
          customer: parsed.data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          method,
        },
      });
      if (error) throw error;
      if (!data?.merchantOrderId) throw new Error("Order could not be placed");

      const phoneNumber = "8688408943"; // your WhatsApp number (no +)

      const orderDetails = items
        .map((i) => {
          const p = findProduct(i.productId);
          return `${p?.name} x${i.quantity}`;
        })
        .join(", ");

      const message = `
🛒 *New Order Received*
Order ID: ${data.merchantOrderId}

👤 Name: ${parsed.data.name}
📞 Phone: ${parsed.data.phone}
📍 Address: ${parsed.data.address}, ${parsed.data.city} - ${parsed.data.pincode}

📦 Items:
${orderDetails}

💰 Total: ${formatINR(total)}
`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      sessionStorage.setItem("anunatural_pending_clear", "1");
      window.open(whatsappURL, "_blank");
      navigate(
        `/order-success?order=${encodeURIComponent(data.merchantOrderId)}`,
      );
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error
          ? err.message
          : "Could not place order. Please try again.";
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <h1 className="font-display text-4xl font-bold text-primary sm:text-5xl">
          Checkout
        </h1>
        <p className="mt-2 text-muted-foreground">
          Place your order with Cash on Delivery — pay when it arrives.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-card p-6 shadow-soft sm:p-8"
          >
            <h2 className="font-display text-xl font-bold text-primary">
              Delivery details
            </h2>

            {(
              [
                {
                  name: "name",
                  label: "Full name",
                  type: "text",
                  placeholder: "Your name",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "you@example.com",
                },
                {
                  name: "phone",
                  label: "Phone",
                  type: "tel",
                  placeholder: "10-digit mobile",
                },
                {
                  name: "address",
                  label: "Address",
                  type: "text",
                  placeholder: "Street, area",
                },
              ] as const
            ).map((f) => (
              <div key={f.name}>
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor={f.name}
                >
                  {f.label}
                </label>
                <input
                  id={f.name}
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  required
                  defaultValue={prefill?.[f.name] ?? ""}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {errors[f.name] && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors[f.name]}
                  </p>
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor="city"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  defaultValue={prefill?.city ?? ""}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                )}
              </div>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  htmlFor="pincode"
                >
                  Pincode
                </label>
                <input
                  id="pincode"
                  name="pincode"
                  defaultValue={prefill?.pincode ?? ""}
                  required
                  className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.pincode}
                  </p>
                )}
              </div>
            </div>

            <fieldset className="pt-2">
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Payment method
              </legend>
              <div className="mt-3 grid gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all ${method === "cod" ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40"}`}
                >
                  <input
                    type="radio"
                    name="method"
                    value="cod"
                    checked={method === "cod"}
                    onChange={() => setMethod("cod")}
                    className="sr-only"
                  />
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      Cash on Delivery
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Pay in cash when your order arrives
                    </p>
                  </div>
                </label>
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              {loading ? "Placing order…" : `Place order · ${formatINR(total)}`}
            </button>
          </form>

          <aside className="h-fit rounded-2xl bg-card p-6 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-bold text-primary">
              Your order
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {items.map((it) => {
                const p = findProduct(it.productId);
                if (!p) return null;
                return (
                  <li
                    key={it.productId}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      width={48}
                      height={48}
                      loading="lazy"
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">
                        {p.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty {it.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatINR(p.price * it.quantity)}
                    </span>
                  </li>
                );
              })}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatINR(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{formatINR(shipping)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold text-primary pt-2 border-t border-border">
                <dt>Total</dt>
                <dd className="font-display text-xl">{formatINR(total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

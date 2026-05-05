import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2, LogOut, Package, User as UserIcon } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/context/CartContext";
import { toast } from "sonner";

const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(20),
  address: z.string().trim().min(6).max(200),
  city: z.string().trim().min(2).max(80),
  pincode: z.string().trim().min(4).max(10),
});

type Profile = z.infer<typeof profileSchema>;

type OrderRow = {
  id: string;
  merchant_order_id: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  items: Array<{ name: string; quantity: number; price: number }>;
};

const statusLabel: Record<string, { label: string; cls: string }> = {
  paid: { label: "Paid", cls: "bg-primary/10 text-primary" },
  placed: { label: "Placed", cls: "bg-mango/30 text-secondary-foreground" },
  pending: { label: "Pending", cls: "bg-muted text-muted-foreground" },
  failed: { label: "Failed", cls: "bg-destructive/10 text-destructive" },
};

const Account = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);

      const [{ data: p }, { data: o }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, address, city, pincode")
          .eq("user_id", user.id)
          .maybeSingle(),

        supabase
          .from("orders")
          .select(
            "id, merchant_order_id, total, status, payment_method, created_at, items",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (p) {
        setProfile({
          full_name: p.full_name ?? "",
          phone: p.phone ?? "",
          address: p.address ?? "",
          city: p.city ?? "",
          pincode: p.pincode ?? "",
        });
      }

      setOrders((o ?? []) as OrderRow[]);
      setLoading(false);
    };

    // 🔥 ALWAYS load fresh data
    loadData();

    // 🔥 ALSO reload on page focus (backup)
    const handleFocus = () => loadData();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user]);

  if (authLoading) return null;
  if (!user)
    return <Navigate to="/auth" replace state={{ from: "/account" }} />;

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries());
    const parsed = profileSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update(parsed.data)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setProfile(parsed.data);
    toast.success("Profile saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary sm:text-5xl">
              My Account
            </h1>
            <p className="mt-1 text-muted-foreground">
              Signed in as {user.email}
            </p>
          </div>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            {/* Profile */}
            <section className="rounded-2xl bg-card p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <UserIcon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-primary">
                  Delivery details
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Saved here so checkout is one tap.
              </p>

              <form onSubmit={handleSave} className="mt-6 space-y-4">
                {(
                  [
                    { name: "full_name", label: "Full name", type: "text" },
                    { name: "phone", label: "Phone", type: "tel" },
                    { name: "address", label: "Address", type: "text" },
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
                      defaultValue={profile[f.name]}
                      required
                      className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
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
                      defaultValue={profile.city}
                      required
                      className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
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
                      defaultValue={profile.pincode}
                      required
                      className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:scale-[1.01] transition disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
                  details
                </button>
              </form>
            </section>

            {/* Orders */}
            <section className="rounded-2xl bg-card p-6 shadow-soft sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-mango text-secondary-foreground">
                  <Package className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-primary">
                  Order history
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="mt-8 rounded-xl bg-cream p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    to="/#shop"
                    className="mt-3 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Shop mangoes
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-border max-h-[400px] overflow-y-auto pr-2">
                  {orders.map((o) => {
                    const s = statusLabel[o.status] ?? statusLabel.pending;
                    return (
                      <li key={o.id} className="py-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <Link
                              to={`/order/${o.id}`}
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              {o.merchant_order_id}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {new Date(o.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                              {" · "}
                              {o.payment_method === "cod"
                                ? "Cash on Delivery"
                                : "PhonePe"}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              o.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : s.cls
                            }`}
                          >
                            {o.status === "cancelled" ? "Cancelled" : s.label}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {o.items
                            .map((i) => `${i.name} ×${i.quantity}`)
                            .join(", ")}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary">
                          {formatINR(o.total)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Account;

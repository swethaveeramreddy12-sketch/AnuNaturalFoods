import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2, Package, Wallet, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart, formatINR } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";

type Result = {
  email?: string;
  total?: number;
  merchantOrderId?: string;
};

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const merchantOrderId = params.get("order");
  const { clear } = useCart();
  const [result, setResult] = useState<Result | null>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!merchantOrderId) { setErrored(true); return; }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("customer_email, total, merchant_order_id")
          .eq("merchant_order_id", merchantOrderId)
          .maybeSingle();
        if (cancelled) return;
        if (error) throw error;
        setResult({
          email: data?.customer_email,
          total: data?.total ?? undefined,
          merchantOrderId: data?.merchant_order_id ?? merchantOrderId,
        });
        if (sessionStorage.getItem("anunatural_pending_clear") === "1") {
          clear();
          sessionStorage.removeItem("anunatural_pending_clear");
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          // Even if fetch fails (e.g. RLS), the order was placed — show success.
          setResult({ merchantOrderId });
          if (sessionStorage.getItem("anunatural_pending_clear") === "1") {
            clear();
            sessionStorage.removeItem("anunatural_pending_clear");
          }
        }
      }
    })();
    return () => { cancelled = true; };
  }, [merchantOrderId, clear]);

  if (errored) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container flex min-h-[60vh] items-center justify-center py-16">
          <div className="w-full max-w-xl rounded-3xl bg-card p-10 text-center shadow-card sm:p-14">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-destructive/10">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-bold text-destructive">Order not found</h1>
            <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Back to shop</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex min-h-[60vh] items-center justify-center py-16">
        <div className="w-full max-w-xl rounded-3xl bg-card p-10 text-center shadow-card sm:p-14">
          {!result ? (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />
              <h1 className="mt-6 font-display text-3xl font-bold text-primary">Confirming your order…</h1>
            </>
          ) : (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mango shadow-glow">
                <Wallet className="h-10 w-10 text-secondary-foreground" />
              </div>
              <h1 className="mt-6 font-display text-4xl font-bold text-primary">Order placed!</h1>
              <p className="mt-3 text-muted-foreground">
                Your order is on the way. Please keep the exact cash ready at delivery.
              </p>
              {result.email && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Confirmation sent to <span className="font-semibold text-foreground">{result.email}</span>.
                </p>
              )}
              {result.total != null && (
                <p className="mt-4 inline-block rounded-full bg-cream px-4 py-1.5 text-sm font-semibold text-primary">
                  Pay on delivery: {formatINR(result.total)}
                </p>
              )}
              {result.merchantOrderId && (
                <p className="mt-2 text-xs text-muted-foreground">Order ID: {result.merchantOrderId}</p>
              )}
              <div className="mt-8 rounded-2xl bg-cream p-5 text-left">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-primary">What happens next?</p>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• We'll pack your order with care.</li>
                  <li>• You'll receive a tracking update within 24 hours.</li>
                  <li>• Delivery typically takes 2–4 days pan-India.</li>
                </ul>
              </div>
              <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:scale-105 transition-transform">
                Back to shop
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;

import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  merchant_order_id: string;
  total: number;
  status: string;
  created_at: string;
  payment_method: string;
  items: OrderItem[];
};

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH ORDER
  const fetchOrder = async () => {
    if (!id) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error(error);
      setLoading(false);
      return;
    }

    const items: OrderItem[] = Array.isArray(data.items)
      ? (data.items as any[]).map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        }))
      : [];

    setOrder({
      id: data.id,
      merchant_order_id: data.merchant_order_id,
      total: data.total,
      status: data.status,
      created_at: data.created_at,
      payment_method: data.payment_method,
      items,
    });

    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;

    fetchOrder();

    const handleFocus = () => fetchOrder();
    window.addEventListener("focus", handleFocus);

    return () => window.removeEventListener("focus", handleFocus);
  }, [id, user]);

  if (!user) return <Navigate to="/auth" />;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="p-10 text-center">Loading order...</div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="p-10 text-center text-red-500">Order not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-16">
        <h1 className="text-3xl font-bold text-primary">
          Order #{order.merchant_order_id}
        </h1>

        {/* 📦 ITEMS */}
        <div className="mt-10 rounded-xl bg-card p-6 shadow">
          <h2 className="text-lg font-semibold text-primary">Items</h2>

          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-3 border-b last:border-none"
            >
              <p className="text-sm">
                {item.name} × {item.quantity}
              </p>
              <p className="text-sm font-semibold">
                {formatINR(item.price * item.quantity)}
              </p>
            </div>
          ))}

          <div className="flex justify-between mt-4 font-bold text-primary border-t pt-4">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>

        {/* 📄 ORDER INFO */}
        <div className="mt-6 text-sm text-muted-foreground space-y-1">
          <p>
            <span className="font-semibold text-foreground">Payment:</span>{" "}
            {order.payment_method === "cod"
              ? "Cash on Delivery"
              : order.payment_method}
          </p>

          <p>
            <span className="font-semibold text-foreground">Ordered on:</span>{" "}
            {new Date(order.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>

          <p>
            <span className="font-semibold text-foreground">Status:</span>{" "}
            <span
              className={`capitalize ${
                order.status === "cancelled" ? "text-red-500 font-semibold" : ""
              }`}
            >
              {order.status}
            </span>
          </p>
        </div>

        {/* ⚠️ IMPORTANT NOTE */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-700">
            ⚠️ Important Note
          </p>

          <p className="mt-2 text-sm text-amber-800">
            Cancellation is allowed only within 3 days from the date of order
            placement.
          </p>

          <p className="mt-1 text-sm text-amber-800">
            If cancellation is required, please contact us directly or reach out
            via WhatsApp for assistance.
          </p>

          {/* OPTIONAL WhatsApp Link */}
          <a
            href="https://wa.me/9642333337"
            target="_blank"
            className="mt-2 inline-block text-primary font-semibold underline"
          >
            Contact on WhatsApp
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;

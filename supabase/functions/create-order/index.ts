import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Server-side product catalogue (mirrors src/data/products.ts).
// Pricing MUST come from server, never trust client.
const PRODUCTS: Record<string, { name: string; price: number }> = {
  "himam-pasand":         { name: "Himam Pasand",                 price: 1000 },
  "banginapalli":         { name: "Banginapalli",                 price: 500 },
  "medjool-dates-jumbo":  { name: "Medjool Dates — Jumbo",        price: 950 },
  "medjool-dates-large":  { name: "Medjool Dates — Large",        price: 1000 },
  "kaju":                 { name: "Kaju (Cashews)",               price: 1300 },
  "groundnuts":           { name: "Groundnuts",                   price: 190 },
  "groundnut-oil":        { name: "Cold-pressed Groundnut Oil",   price: 350 },
};

type Item = { productId: string; quantity: number };
type Customer = {
  name: string; email: string; phone: string;
  address: string; city: string; pincode: string;
};

function validate(body: any): { customer: Customer; items: Item[] } | string {
  if (!body || typeof body !== "object") return "Invalid body";
  const { customer, items } = body;
  if (!customer || typeof customer !== "object") return "Missing customer";
  for (const f of ["name", "email", "phone", "address", "city", "pincode"]) {
    if (typeof customer[f] !== "string" || customer[f].length < 2) return `Invalid ${f}`;
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return "Invalid email";
  if (!Array.isArray(items) || items.length === 0) return "Cart is empty";
  for (const it of items) {
    if (!PRODUCTS[it.productId]) return `Unknown product ${it.productId}`;
    if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 50) return "Invalid quantity";
  }
  return { customer, items };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const parsed = validate(await req.json());
    if (typeof parsed === "string") {
      return new Response(JSON.stringify({ error: parsed }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { customer, items } = parsed;

    // Recompute totals server-side
    const subtotal = items.reduce((s, it) => s + PRODUCTS[it.productId].price * it.quantity, 0);
    const shipping = 59;
    const total = subtotal + shipping;
    const merchantOrderId = `ANU-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let userId: string | null = null;
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : "";
    if (token) {
      const { data: u } = await supabase.auth.getUser(token);
      userId = u.user?.id ?? null;
    }

    const { data: order, error: insErr } = await supabase
      .from("orders")
      .insert({
        merchant_order_id: merchantOrderId,
        user_id: userId,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
        items: items.map((i) => ({
          productId: i.productId,
          name: PRODUCTS[i.productId].name,
          quantity: i.quantity,
          price: PRODUCTS[i.productId].price,
        })),
        subtotal,
        shipping,
        total,
        payment_method: "cod",
        status: "placed",
      })
      .select()
      .single();

    if (insErr || !order) {
      console.error("Insert error", insErr);
      return new Response(JSON.stringify({ error: "Could not create order" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ method: "cod", merchantOrderId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

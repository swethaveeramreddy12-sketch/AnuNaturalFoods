create table public.orders (
  id uuid primary key default gen_random_uuid(),
  merchant_order_id text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address text not null,
  city text not null,
  pincode text not null,
  items jsonb not null,
  subtotal integer not null,
  shipping integer not null,
  total integer not null,
  payment_method text not null check (payment_method in ('phonepe','cod')),
  status text not null default 'pending' check (status in ('pending','paid','failed','placed')),
  phonepe_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

-- Anyone can place an order from the public storefront.
create policy "Anyone can create orders"
on public.orders for insert
to anon, authenticated
with check (true);

-- No public read access. Orders are read server-side only (service role bypasses RLS).
-- Intentionally no SELECT/UPDATE/DELETE policies for clients.

create index orders_merchant_order_id_idx on public.orders (merchant_order_id);
create index orders_created_at_idx on public.orders (created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();
-- Profiles
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  city text,
  pincode text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile"
on public.profiles for select to authenticated
using (auth.uid() = user_id);

create policy "Users update own profile"
on public.profiles for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = user_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Link orders to a user (nullable so guests still work)
alter table public.orders add column user_id uuid references auth.users(id) on delete set null;
create index orders_user_id_idx on public.orders (user_id);

-- Logged-in users see their own orders
create policy "Users view own orders"
on public.orders for select to authenticated
using (auth.uid() = user_id);

-- Replace insert policy to allow user_id to match the caller (or be null for guests)
drop policy if exists "Public can create valid orders" on public.orders;

create policy "Public can create valid orders"
on public.orders for insert
to anon, authenticated
with check (
  (user_id is null or user_id = auth.uid())
  and length(customer_name)  between 2 and 80
  and length(customer_email) between 5 and 120
  and customer_email like '%_@_%._%'
  and length(customer_phone) between 7 and 20
  and length(address) between 6 and 200
  and length(city) between 2 and 80
  and length(pincode) between 4 and 10
  and subtotal >= 0
  and shipping >= 0
  and total > 0
  and total = subtotal + shipping
  and payment_method in ('phonepe','cod')
  and status in ('pending','placed')
  and jsonb_typeof(items) = 'array'
);
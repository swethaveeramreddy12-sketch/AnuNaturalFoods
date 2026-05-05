alter function public.set_updated_at() set search_path = public;

drop policy if exists "Anyone can create orders" on public.orders;

create policy "Public can create valid orders"
on public.orders for insert
to anon, authenticated
with check (
  length(customer_name)  between 2 and 80
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
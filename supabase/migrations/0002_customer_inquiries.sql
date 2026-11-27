-- Customer inquiries tracked per authenticated customer (email OTP sign-in).
-- Run after 0001_init.sql. Customers see ONLY their own rows; the owner (is_admin) sees and updates all.
-- An inquiry never confirms a booking: status changes are owner-only.
create type public.inquiry_status as enum
  ('pending_review','awaiting_owner','awaiting_payment','confirmed','completed','cancelled');

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete cascade default auth.uid(),
  dress_id uuid references public.dresses (id) on delete set null,
  dress_code text not null,
  dress_name text not null,
  pickup_date date not null,
  event_date date not null,
  return_date date not null,
  customer_name text not null check (length(btrim(customer_name)) between 1 and 120),
  customer_email text not null,
  customer_phone text,
  fitting text not null check (fitting in ('fitting','none','undecided')),
  message text check (length(message) <= 1000),
  terms_accepted boolean not null check (terms_accepted),
  status public.inquiry_status not null default 'pending_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (return_date >= pickup_date)
);
create index inquiries_customer_idx on public.inquiries (customer_id, created_at desc);

alter table public.inquiries enable row level security;

create policy "customer reads own inquiries" on public.inquiries for select to authenticated
  using (customer_id = (select auth.uid()) or (select public.is_admin()));
create policy "customer creates own inquiry" on public.inquiries for insert to authenticated
  with check (customer_id = (select auth.uid()) and status = 'pending_review');
create policy "owner updates inquiries" on public.inquiries for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

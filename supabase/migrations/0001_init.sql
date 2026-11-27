-- Missche Dress Rentals: schema, security and storage.
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to read top to bottom.
-- Contains NO customer data: inquiries stay in the customer's email app (mailto).

create extension if not exists btree_gist;

-- ---------------------------------------------------------------- owner accounts
-- Owners are added by hand (see docs/DEPLOYMENT.md). There is no public sign-up path.
create table public.admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_profiles where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------- dresses
create table public.dresses (
  id uuid primary key default gen_random_uuid(),
  code text not null check (length(btrim(code)) between 1 and 40),
  name text not null check (length(btrim(name)) between 1 and 120),
  description text not null default '' check (length(description) <= 4000),
  price integer not null check (price between 1 and 100000),
  color text not null default '' check (length(color) <= 60),
  sizes text[] not null default '{}' check (cardinality(sizes) <= 12),
  categories text[] not null default '{}' check (cardinality(categories) <= 12),
  measurements jsonb check (measurements is null or jsonb_typeof(measurements) = 'object'),
  featured boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index dresses_code_unique on public.dresses (lower(code));

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger dresses_touch before update on public.dresses
  for each row execute function public.touch_updated_at();

create table public.dress_images (
  id uuid primary key default gen_random_uuid(),
  dress_id uuid not null references public.dresses (id) on delete cascade,
  path text not null,               -- object path inside the dress-images bucket
  position integer not null default 0 check (position between 0 and 5),
  unique (dress_id, position)
);
create index dress_images_dress on public.dress_images (dress_id);

-- ---------------------------------------------------------------- availability
-- type: reserved = confirmed rental, blocked = owner block, unavailable = temporarily out
-- (open-ended: end_date null = until the owner restores it).
create table public.availability_blocks (
  id uuid primary key default gen_random_uuid(),
  dress_id uuid not null references public.dresses (id) on delete cascade,
  type text not null check (type in ('reserved', 'blocked', 'unavailable')),
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date),
  check (type = 'unavailable' or end_date is not null)
);
-- A dress cannot have two overlapping rentals/blocks. Enforced by the database.
alter table public.availability_blocks add constraint availability_no_overlap
  exclude using gist (
    dress_id with =,
    daterange(start_date, coalesce(end_date, 'infinity'::date), '[]') with &&
  ) where (type in ('reserved', 'blocked'));
-- At most one open-ended "temporarily unavailable" marker per dress.
create unique index availability_one_unavailable on public.availability_blocks (dress_id) where (type = 'unavailable');
create index availability_dress_dates on public.availability_blocks (dress_id, start_date);

-- Frees start..end for one dress, trimming or splitting periods (single transaction).
create or replace function public.restore_availability(p_dress uuid, p_start date, p_end date)
returns void
language plpgsql
security invoker           -- runs with the caller's rights, so Row Level Security still applies
set search_path = ''
as $$
declare
  r public.availability_blocks;
begin
  if p_end < p_start then raise exception 'The end date is before the start date.'; end if;
  for r in
    select * from public.availability_blocks
    where dress_id = p_dress
      and start_date <= p_end
      and (end_date is null or end_date >= p_start)
    for update
  loop
    delete from public.availability_blocks where id = r.id;
    if r.start_date < p_start then
      insert into public.availability_blocks (dress_id, type, start_date, end_date)
      values (r.dress_id, r.type, r.start_date, p_start - 1);
    end if;
    if r.end_date is null or r.end_date > p_end then
      insert into public.availability_blocks (dress_id, type, start_date, end_date)
      values (r.dress_id, r.type, p_end + 1, r.end_date);
    end if;
  end loop;
end;
$$;
grant execute on function public.restore_availability(uuid, date, date) to authenticated;

-- ---------------------------------------------------------------- Row Level Security
alter table public.admin_profiles     enable row level security;
alter table public.dresses            enable row level security;
alter table public.dress_images       enable row level security;
alter table public.availability_blocks enable row level security;

-- admin_profiles: a signed-in user may only see their own row. Nobody writes via the API.
create policy "own admin row" on public.admin_profiles for select to authenticated
  using (user_id = (select auth.uid()));

-- dresses: public sees active dresses; the owner sees and changes everything.
create policy "public reads active dresses" on public.dresses for select to anon, authenticated
  using (archived = false);
create policy "owner reads all dresses" on public.dresses for select to authenticated
  using ((select public.is_admin()));
create policy "owner inserts dresses" on public.dresses for insert to authenticated
  with check ((select public.is_admin()));
create policy "owner updates dresses" on public.dresses for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "owner deletes dresses" on public.dresses for delete to authenticated
  using ((select public.is_admin()));

-- dress_images: public sees images of active dresses.
create policy "public reads images of active dresses" on public.dress_images for select to anon, authenticated
  using (exists (select 1 from public.dresses d where d.id = dress_id and d.archived = false));
create policy "owner reads all images" on public.dress_images for select to authenticated
  using ((select public.is_admin()));
create policy "owner writes images" on public.dress_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- availability: dates are public (customers must see them); only the owner writes.
-- The table holds no customer names or contact details, by design.
create policy "public reads availability" on public.availability_blocks for select to anon, authenticated
  using (true);
create policy "owner writes availability" on public.availability_blocks for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Belt and braces: remove default table rights, grant only what the policies need.
revoke all on public.admin_profiles, public.dresses, public.dress_images, public.availability_blocks from anon, authenticated;
grant select on public.dresses, public.dress_images, public.availability_blocks to anon;
grant select on public.admin_profiles to authenticated;
grant select, insert, update, delete on public.dresses, public.dress_images, public.availability_blocks to authenticated;

-- ---------------------------------------------------------------- Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dress-images', 'dress-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Public bucket: anyone may VIEW a file by its URL; only the owner may add/change/delete.
create policy "owner uploads dress images" on storage.objects for insert to authenticated
  with check (bucket_id = 'dress-images' and (select public.is_admin()));
create policy "owner updates dress images" on storage.objects for update to authenticated
  using (bucket_id = 'dress-images' and (select public.is_admin()));
create policy "owner deletes dress images" on storage.objects for delete to authenticated
  using (bucket_id = 'dress-images' and (select public.is_admin()));

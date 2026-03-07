create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  role text not null check (role in ('organizer', 'admin')) default 'organizer',
  display_name text,
  preferred_locale text not null check (preferred_locale in ('da', 'en')) default 'da',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_series (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null,
  language text not null check (language in ('da', 'en')) default 'da',
  category text not null check (category in ('mixed', 'vintage', 'clothing', 'kids', 'design', 'furniture')) default 'mixed',
  status text not null check (status in ('draft', 'pending_review', 'changes_requested', 'published', 'archived')) default 'draft',
  vibe text not null default '',
  venue_name text,
  address_line text not null,
  postal_code text,
  city text not null default 'København',
  latitude double precision not null default 55.6761,
  longitude double precision not null default 12.5683,
  contact_email text not null,
  cover_image_url text,
  cover_tint text not null default 'sand',
  tags text[] not null default '{}',
  featured boolean not null default false,
  admin_notes text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.market_occurrences (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.market_series (id) on delete cascade,
  start_at timestamptz not null,
  end_at timestamptz not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.market_revisions (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.market_series (id) on delete cascade,
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('pending_review', 'changes_requested', 'approved')) default 'pending_review',
  payload jsonb not null,
  admin_notes text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seed_import_batches (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  imported_by uuid references public.profiles (id),
  imported_count integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.market_series enable row level security;
alter table public.market_occurrences enable row level security;
alter table public.market_revisions enable row level security;
alter table public.seed_import_batches enable row level security;

create policy "public can read published series"
on public.market_series
for select
using (status = 'published');

create policy "public can read published occurrences"
on public.market_occurrences
for select
using (
  exists (
    select 1
    from public.market_series
    where public.market_series.id = market_occurrences.series_id
      and public.market_series.status = 'published'
  )
);

create policy "users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "organizers read own series"
on public.market_series
for select
using (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "organizers create own series"
on public.market_series
for insert
with check (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "organizers update own series"
on public.market_series
for update
using (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
)
with check (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "organizers manage own occurrences"
on public.market_occurrences
for all
using (
  exists (
    select 1
    from public.market_series
    where public.market_series.id = market_occurrences.series_id
      and (
        public.market_series.organizer_id = auth.uid()
        or exists (
          select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
        )
      )
  )
)
with check (
  exists (
    select 1
    from public.market_series
    where public.market_series.id = market_occurrences.series_id
      and (
        public.market_series.organizer_id = auth.uid()
        or exists (
          select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
        )
      )
  )
);

create policy "organizers read own revisions"
on public.market_revisions
for select
using (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "organizers create own revisions"
on public.market_revisions
for insert
with check (
  auth.uid() = organizer_id
  or exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "admins update revisions"
on public.market_revisions
for update
using (
  exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

create policy "admins manage seed imports"
on public.seed_import_batches
for all
using (
  exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles where public.profiles.id = auth.uid() and public.profiles.role = 'admin'
  )
);

insert into storage.buckets (id, name, public)
values ('market-images', 'market-images', true)
on conflict (id) do nothing;

create policy "public read market images"
on storage.objects
for select
using (bucket_id = 'market-images');

create policy "authenticated upload market images"
on storage.objects
for insert
with check (bucket_id = 'market-images' and auth.role() = 'authenticated');

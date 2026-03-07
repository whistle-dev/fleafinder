alter table public.profiles
add column if not exists username text;

update public.profiles
set username = lower(
  regexp_replace(
    coalesce(
      nullif(username, ''),
      nullif(display_name, ''),
      nullif(split_part(coalesce(email, ''), '@', 1), ''),
      'user-' || substr(id::text, 1, 8)
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  )
)
where username is null or username = '';

create unique index if not exists profiles_username_key
on public.profiles (lower(username));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
begin
  base_username := lower(
    regexp_replace(
      coalesce(
        nullif(new.raw_user_meta_data ->> 'username', ''),
        nullif(new.raw_user_meta_data ->> 'display_name', ''),
        nullif(split_part(new.email, '@', 1), ''),
        'user-' || substr(new.id::text, 1, 8)
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    )
  );

  insert into public.profiles (id, email, username, display_name)
  values (
    new.id,
    new.email,
    base_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set
    email = excluded.email,
    username = coalesce(public.profiles.username, excluded.username),
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    updated_at = now();

  return new;
end;
$$;

create or replace function public.resolve_login_email(login_identifier text)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select p.email
  from public.profiles p
  where lower(p.email) = lower(login_identifier)
     or lower(p.username) = lower(login_identifier)
  limit 1;
$$;

grant execute on function public.resolve_login_email(text) to anon, authenticated;

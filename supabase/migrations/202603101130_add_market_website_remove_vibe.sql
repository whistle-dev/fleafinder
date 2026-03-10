alter table public.market_series
add column if not exists website text;

alter table public.market_series
drop column if exists vibe;

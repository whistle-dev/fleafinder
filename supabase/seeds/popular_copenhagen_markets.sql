do $$
declare
  seed_owner uuid;
begin
  select p.id
  into seed_owner
  from public.profiles p
  where p.role in ('admin', 'organizer')
  order by case when p.role = 'admin' then 0 else 1 end, p.created_at asc
  limit 1;

  if seed_owner is null then
    raise exception 'No organizer/admin profile found. Create at least one user first, then run this seed.';
  end if;

  insert into public.market_series (
    id,
    organizer_id,
    slug,
    title,
    description,
    language,
    category,
    status,
    vibe,
    featured,
    venue_name,
    address_line,
    postal_code,
    city,
    latitude,
    longitude,
    contact_email,
    cover_tint,
    tags,
    published_at,
    created_at,
    updated_at
  )
  values
    (
      '2d150f73-f2f6-4c77-94dc-e0f7f6800001',
      seed_owner,
      'kobenhavns-loppetorv',
      'Kobenhavns Loppetorv',
      'Det faste lordagsloppemarked pa Israels Plads samler klassiske loppefund, toj, sma mobler og masser af centralt byliv midt i Kobenhavn.',
      'da',
      'mixed',
      'published',
      'Byliv, klassiske lopper og central storbystemning',
      true,
      'Israels Plads',
      'Israels Plads',
      '1363',
      'Kobenhavn K',
      55.6836,
      12.5614,
      'kbhloppetorv@gmail.com',
      'sun',
      array['israels plads', 'lordag', 'klassiske lopper'],
      '2026-02-12T10:00:00.000Z',
      '2026-02-10T09:00:00.000Z',
      '2026-03-03T18:00:00.000Z'
    ),
    (
      '2d150f73-f2f6-4c77-94dc-e0f7f6800002',
      seed_owner,
      'veras-market-under-buen',
      'Veras Market under Buen',
      'Veras samler secondhand toj, sko og accessories under Buen og er et af byens mest populaere vintage- og genbrugsmarkeder.',
      'da',
      'clothing',
      'published',
      'Vintage, musik og staerke garderobefund',
      true,
      'Under Buen',
      'Bispeengen 12',
      '2000',
      'Frederiksberg',
      55.6864,
      12.5318,
      'contact@verasvintage.dk',
      'mint',
      array['under buen', 'secondhand', 'sondag'],
      '2026-02-10T10:00:00.000Z',
      '2026-02-08T09:00:00.000Z',
      '2026-03-04T13:00:00.000Z'
    ),
    (
      '2d150f73-f2f6-4c77-94dc-e0f7f6800003',
      seed_owner,
      'kobenhavnstrup-loppemarked',
      'Kobenhavnstrup Loppemarked',
      'Det gronne sondagmarked ved Emdrup samler loppefund, food trucks og familievenlige omgivelser i Nordvest.',
      'da',
      'mixed',
      'published',
      'Gron oase, sondag og lokale fund',
      true,
      'Kobenhavnstrup',
      'Lundebakken 1',
      '2400',
      'Kobenhavn NV',
      55.7281,
      12.5416,
      'rolf@kobenhavnstrup.dk',
      'clay',
      array['nordvest', 'food trucks', 'sondag'],
      '2026-02-15T08:00:00.000Z',
      '2026-02-14T09:00:00.000Z',
      '2026-03-01T13:00:00.000Z'
    ),
    (
      '2d150f73-f2f6-4c77-94dc-e0f7f6800004',
      seed_owner,
      'loppemarked-i-bella',
      'Loppemarked i Bella',
      'Bella Center samler hundredvis af stande med antik, nips, brugskunst og secondhand i store indendors haller.',
      'da',
      'design',
      'published',
      'Store haller, mange stande og indendors loppejagt',
      false,
      'Bella Center',
      'Center Boulevard 5',
      '2300',
      'Kobenhavn S',
      55.6381,
      12.5780,
      'loppemarked@bellacenter.dk',
      'sand',
      array['bella center', 'indendors', 'antik'],
      '2026-01-29T10:00:00.000Z',
      '2026-01-28T09:00:00.000Z',
      '2026-02-26T13:00:00.000Z'
    )
  on conflict (slug) do update
  set
    organizer_id = excluded.organizer_id,
    title = excluded.title,
    description = excluded.description,
    language = excluded.language,
    category = excluded.category,
    status = excluded.status,
    vibe = excluded.vibe,
    featured = excluded.featured,
    venue_name = excluded.venue_name,
    address_line = excluded.address_line,
    postal_code = excluded.postal_code,
    city = excluded.city,
    latitude = excluded.latitude,
    longitude = excluded.longitude,
    contact_email = excluded.contact_email,
    cover_tint = excluded.cover_tint,
    tags = excluded.tags,
    published_at = excluded.published_at,
    updated_at = excluded.updated_at;

  delete from public.market_occurrences
  where series_id in (
    select id
    from public.market_series
    where slug in (
      'kobenhavns-loppetorv',
      'veras-market-under-buen',
      'kobenhavnstrup-loppemarked',
      'loppemarked-i-bella'
    )
  );

  insert into public.market_occurrences (
    id,
    series_id,
    start_at,
    end_at
  )
  values
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800101',
      (select id from public.market_series where slug = 'kobenhavns-loppetorv'),
      '2026-03-14T10:00:00.000Z',
      '2026-03-14T15:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800102',
      (select id from public.market_series where slug = 'kobenhavns-loppetorv'),
      '2026-03-21T10:00:00.000Z',
      '2026-03-21T15:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800201',
      (select id from public.market_series where slug = 'veras-market-under-buen'),
      '2026-04-05T08:00:00.000Z',
      '2026-04-05T13:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800202',
      (select id from public.market_series where slug = 'veras-market-under-buen'),
      '2026-04-12T08:00:00.000Z',
      '2026-04-12T13:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800301',
      (select id from public.market_series where slug = 'kobenhavnstrup-loppemarked'),
      '2026-04-26T08:00:00.000Z',
      '2026-04-26T14:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800302',
      (select id from public.market_series where slug = 'kobenhavnstrup-loppemarked'),
      '2026-05-03T08:00:00.000Z',
      '2026-05-03T14:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800401',
      (select id from public.market_series where slug = 'loppemarked-i-bella'),
      '2026-02-21T09:00:00.000Z',
      '2026-02-21T16:00:00.000Z'
    ),
    (
      '8f1b9b7e-1f76-4d4d-87c7-e0f7f6800402',
      (select id from public.market_series where slug = 'loppemarked-i-bella'),
      '2026-02-22T09:00:00.000Z',
      '2026-02-22T15:00:00.000Z'
    );

  insert into public.seed_import_batches (
    source,
    imported_by,
    imported_count
  )
  values (
    'official-copenhagen-flea-markets',
    seed_owner,
    4
  );
end $$;

# Flea Finder

Mobile-first Copenhagen flea market guide built with Next.js App Router, Supabase, Mapbox, and PWA support.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in Supabase and Mapbox keys.
3. Install dependencies with `npm install`.
4. Run the Supabase SQL migration from [`supabase/migrations/202603061800_fleafinder.sql`](/Users/rasmus/Documents/Coding/loppemarked/supabase/migrations/202603061800_fleafinder.sql).
5. Start the app with `npm run dev`.

## Supabase CLI commands

Set `SUPABASE_PROJECT_REF` in your shell or `.env.local`, then use:

- `npm run supabase:login`
- `npm run supabase:link`
- `npm run supabase:migration:new -- add_some_change`
- `npm run supabase:db:push`
- `npm run supabase:db:push:dry`
- `npm run supabase:db:pull`
- `npm run supabase:db:reset`
- `npm run supabase:types`

Typical remote migration flow:

1. `npm run supabase:login`
2. `export SUPABASE_PROJECT_REF=your-project-ref`
3. `npm run supabase:link`
4. `npm run supabase:db:push`

## Included

- Locale-prefixed routes for Danish and English
- Public explorer with list, map, and calendar views
- Market detail pages with calendar export
- Email + password auth for organizers/admins
- Organizer dashboard with recurring occurrence generation
- Admin moderation queue for new listings and revisions
- Installable PWA with offline shell + cached explorer/detail responses

## Notes

- The app falls back to local sample data for public browsing if Supabase is not reachable yet.
- Organizer/admin mutations require the Supabase schema and storage bucket to exist.

## Documentation

- Full project documentation: [docs/PROJECT_DOCUMENTATION.md](/Users/rasmus/Documents/Coding/loppemarked/docs/PROJECT_DOCUMENTATION.md)

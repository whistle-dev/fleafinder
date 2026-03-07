# Flea Finder Project Documentation

## 1. Project Overview

Flea Finder is a mobile-first web app for discovering flea markets in Copenhagen. The product goal is to make smaller local markets visible, not just the big recurring ones that are already easy to find through Instagram and existing guides.

The current implementation is a Next.js App Router application with:

- public anonymous browsing
- bilingual UI in Danish and English
- organizer sign-in via email and password
- organizer market creation and editing
- admin moderation for listings and revisions
- PWA install support
- offline caching for the public shell and recent public content

The app is intentionally web-first and mobile-first. It is not a native app and does not include payments, stand booking, push notifications, or public user accounts in the current scope.

## 2. Product Direction

### Core product idea

The app acts as a city guide for flea markets:

- public users should immediately see live markets
- browsing should be fast and touch-friendly
- organizers should be able to create and submit a market from their phone
- admins should be able to review submissions without needing a desktop-only workflow

### Current design direction

The UI was recently reset to a simpler visual system. The earlier more decorative, editorial-heavy design was replaced with a quieter interface focused on:

- fewer sections per page
- flatter cards and inputs
- less visual noise
- faster market visibility
- stronger mobile scanning

This simpler direction is now the baseline for the app.

## 3. Tech Stack

### Framework

- Next.js 16.1.6
- React 19.2.4
- TypeScript

### Styling and UI

- Tailwind CSS 4
- shadcn-style local component setup
- custom themed UI primitives in `components/ui`
- Lucide icons

### Backend and data

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Supabase RLS policies

### Maps and location

- Mapbox for map rendering
- Mapbox Geocoding API for address lookup when saving listings

### PWA

- Web app manifest
- service worker in `public/sw.js`
- standalone display mode
- cached offline shell and cached recent public content

## 4. Current Route Structure

### Root and locale handling

Locale routing is enforced by [proxy.ts](/Users/rasmus/Documents/Coding/loppemarked/proxy.ts).

- non-localized paths are redirected to `/{locale}/...`
- locale is resolved from cookie first, then `Accept-Language`
- supported locales are `da` and `en`

### Public routes

- [app/[locale]/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/page.tsx)
  - simplified home page
  - markets visible immediately
  - minimal intro + live market grid + organizer CTA

- [app/[locale]/markets/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/markets/page.tsx)
  - main explorer page
  - uses `ExplorerClient`

- [app/[locale]/markets/[slug]/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/markets/[slug]/page.tsx)
  - market detail page
  - shows practical info, dates, contact, map
  - supports ICS and Google Calendar actions

### Auth and operator routes

- [app/[locale]/sign-in/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/sign-in/page.tsx)
  - credentials sign-in and account creation page for organizers/admins

- [app/[locale]/dashboard/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/dashboard/page.tsx)
  - organizer workspace
  - lists organizer markets and revisions
  - contains the market editor

- [app/[locale]/admin/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/admin/page.tsx)
  - admin moderation queue
  - handles new listings and revisions

### API and utility routes

- [app/api/explorer/route.ts](/Users/rasmus/Documents/Coding/loppemarked/app/api/explorer/route.ts)
  - returns filtered explorer snapshot data for the client explorer

- [app/api/ics/route.ts](/Users/rasmus/Documents/Coding/loppemarked/app/api/ics/route.ts)
  - calendar export support

- [app/api/health/route.ts](/Users/rasmus/Documents/Coding/loppemarked/app/api/health/route.ts)
  - basic health endpoint

- [app/auth/callback/route.ts](/Users/rasmus/Documents/Coding/loppemarked/app/auth/callback/route.ts)
  - Supabase auth callback route

## 5. UI Architecture

### Shared layout

- [app/layout.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/layout.tsx)
  - global metadata
  - imports Mapbox CSS
  - registers service worker

- [app/[locale]/layout.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/layout.tsx)
  - locale-level shell
  - wraps pages in the localized app chrome

- [components/site-chrome.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/site-chrome.tsx)
  - top navigation
  - locale switcher
  - footer

### Shared UI primitives

These are the current base layer for the app:

- [components/ui/button.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/button.tsx)
- [components/ui/card.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/card.tsx)
- [components/ui/badge.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/badge.tsx)
- [components/ui/input.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/input.tsx)
- [components/ui/textarea.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/textarea.tsx)
- [components/ui/select.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/select.tsx)
- [components/ui/checkbox.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/ui/checkbox.tsx)

These are inspired by shadcn structure but customized to the app’s warmer and simpler visual language.

### Main page components

- [components/explorer-client.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/explorer-client.tsx)
  - public list/map/calendar explorer
  - query param sync
  - network refresh
  - offline messaging

- [components/market-card.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-card.tsx)
  - simplified public market cards

- [components/market-map.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-map.tsx)
  - interactive map view
  - offline and missing-token fallback states

- [components/calendar-view.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/calendar-view.tsx)
  - public calendar view
  - desktop month grid and simpler mobile list

- [components/market-form.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-form.tsx)
  - organizer market editor
  - simpler form sections
  - schedule preview

- [components/credentials-form.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/credentials-form.tsx)
  - organizer/admin sign-in and sign-up form

- [components/status-pill.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/status-pill.tsx)
  - status display for listing and revision states

## 6. Styling System

The current styling system is centered in [app/globals.css](/Users/rasmus/Documents/Coding/loppemarked/app/globals.css).

The simplified theme uses a small set of core variables:

- `--paper`
- `--surface`
- `--surface-muted`
- `--line`
- `--ink`
- `--accent`
- `--shadow`

The important design intent is:

- light background
- soft surface layering
- readable contrast
- restrained accent color
- no heavy decorative patterns as the primary identity

Unused decorative components from earlier experiments still exist in the codebase, for example `grid-pattern` and `marquee`, but they are no longer central to the UI direction.

## 7. Data Model

The database schema lives in [supabase/migrations/202603061800_fleafinder.sql](/Users/rasmus/Documents/Coding/loppemarked/supabase/migrations/202603061800_fleafinder.sql).

### `profiles`

Stores app users tied to `auth.users`.

Fields include:

- `id`
- `email`
- `role`
- `display_name`
- `preferred_locale`

Roles:

- `organizer`
- `admin`

### `market_series`

Represents the main listing container for a market.

Fields include:

- organizer ownership
- slug
- title and description
- category
- language
- status
- venue and address data
- coordinates
- contact email
- cover image
- color tint
- tags
- featured flag

Statuses:

- `draft`
- `pending_review`
- `changes_requested`
- `published`
- `archived`

### `market_occurrences`

Stores individual dated instances for a series.

This is how recurring markets are represented. The app does not store only a recurrence rule string. It stores actual occurrence rows.

### `market_revisions`

Stores edits for already-published markets.

This lets organizers submit changes for moderation without directly replacing the live listing.

Statuses:

- `pending_review`
- `changes_requested`
- `approved`

### `seed_import_batches`

Admin-facing import bookkeeping table for seed or import workflows.

## 8. Auth and Permissions

### Auth model

The app uses Supabase email/password auth.

Sign-in supports:

- email + password

Account creation uses:

- email
- password

Entry point:

- [lib/actions.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/actions.ts)
  - `signInWithPassword`
  - `signUpWithPassword`

Session/profile lookup:

- [lib/session.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/session.ts)

### Profile creation

The migration defines `handle_new_user()`, which creates a `profiles` row whenever a new Supabase auth user is created.

### RLS model

The migration enables RLS and applies policies so that:

- the public can read published listings and their occurrences
- users can read/update their own profile
- organizers can manage their own series and occurrences
- organizers can read and create their own revisions
- admins can review and update revisions
- admins can manage seed import records

### Storage permissions

The migration also creates the public `market-images` bucket with:

- public read access
- authenticated upload access

## 9. Data Access and Fallback Strategy

Most server-side data access lives in [lib/data.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/data.ts).

Important behavior:

- if Supabase is not configured, the app falls back to local sample data for public browsing
- this means the public side can still render before production infra is fully connected
- organizer/admin mutations still depend on a working Supabase setup

Key functions:

- `getExplorerSnapshot`
- `getMarketBySlug`
- `getOrganizerWorkspace`
- `getAdminWorkspace`
- `buildMarketDraft`

This fallback behavior is useful during early UI work and demos, but it should not be mistaken for a production persistence layer.

## 10. Organizer Workflow

The organizer flow currently works like this:

1. Organizer signs in with email and password.
2. Organizer opens dashboard.
3. Organizer creates a new listing or edits an existing one.
4. Organizer enters:
   - market content
   - location/contact info
   - date/time
   - optional weekly repetition
   - optional cover image
5. Form generates occurrences client-side and submits them as `occurrencesPayload`.
6. Server action geocodes the address if possible.
7. Server action uploads image if present.
8. Listing is either:
   - saved as `draft`, or
   - submitted as `pending_review`
9. If the series is already published, changes are stored as a revision instead of directly replacing the live content.

Core implementation:

- [components/market-form.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-form.tsx)
- [lib/actions.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/actions.ts)

## 11. Admin Workflow

The admin flow currently works like this:

1. Admin opens moderation queue.
2. Admin reviews pending market series submissions.
3. Admin can:
   - approve and publish
   - request changes
   - archive
4. Admin reviews pending revisions separately.
5. Admin can approve or request changes on revisions.

The moderation UI is intentionally now simpler and card-based rather than using dense admin tables.

Core implementation:

- [app/[locale]/admin/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/admin/page.tsx)
- [lib/actions.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/actions.ts)

## 12. Public Discovery Experience

### Home page

The home page was simplified to focus on immediate content:

- short intro
- quick stats
- visible market cards right away
- one organizer call-to-action

### Explorer

The explorer supports:

- search
- category filtering
- date filtering
- three views:
  - list
  - map
  - calendar

The explorer updates query params and fetches refreshed results from `/api/explorer`.

### Detail page

Each market detail page supports:

- key info and description
- next dates
- contact info
- map
- add-to-calendar via ICS
- Google Calendar link
- open in Google Maps

## 13. Internationalization

Locale handling is defined in [lib/i18n.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/i18n.ts).

Current app behavior:

- UI copy is available in Danish and English
- routes are locale-prefixed
- organizer-entered market content remains in the language submitted

The dictionary file currently contains copy for:

- navigation
- home
- explorer
- detail
- auth
- dashboard
- admin
- forms
- shared labels

## 14. PWA and Offline Support

### Registration

- [components/service-worker-registration.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/service-worker-registration.tsx)

### Metadata

- [app/manifest.ts](/Users/rasmus/Documents/Coding/loppemarked/app/manifest.ts)
- [app/layout.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/layout.tsx)

Current manifest behavior:

- standalone display mode
- portrait orientation
- icon and apple icon
- `start_url` set to `/da`

### Service worker behavior

Defined in [public/sw.js](/Users/rasmus/Documents/Coding/loppemarked/public/sw.js).

Caching strategy:

- shell cache for `/da`, `/en`, and manifest
- network-first cache for explorer API requests
- stale-while-revalidate for market detail pages
- cache-first for images

Current offline behavior:

- previously visited public shell can reopen offline
- recent explorer responses can be reused
- recently opened market detail pages can be reused
- map degrades gracefully to a fallback when offline or missing token

Not included:

- push notifications
- background sync
- offline organizer form submission

## 15. Environment Variables

Defined in [.env.example](/Users/rasmus/Documents/Coding/loppemarked/.env.example):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_PROJECT_REF`

## 16. Local Development and Scripts

### Install and run

1. Copy `.env.example` to `.env.local`
2. Fill in Supabase and Mapbox values
3. Run `npm install`
4. Run the SQL migration in Supabase
5. Start with `npm run dev`

### Core scripts

Defined in [package.json](/Users/rasmus/Documents/Coding/loppemarked/package.json):

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run typecheck`

### Supabase scripts

- `npm run supabase:login`
- `npm run supabase:link`
- `npm run supabase:migration:new`
- `npm run supabase:db:push`
- `npm run supabase:db:push:dry`
- `npm run supabase:db:pull`
- `npm run supabase:db:reset`
- `npm run supabase:types`

## 17. Verification Status

After the recent simplification pass, the project was verified with:

- `npm run build`
- `npm run typecheck`

One important implementation detail:

- the project currently uses `next build --webpack`

Reason:

- the default Next 16 build path caused an issue with the Mapbox CSS import in this environment
- the Webpack build path is currently the stable working option

## 18. Known Limitations and Gaps

### Product limitations

- Copenhagen-only launch assumption
- no monetization flow yet
- no booking or stand purchases
- no public accounts or saved favorites
- no notifications
- no advanced organizer onboarding beyond the built-in credentials flow

### Technical limitations

- public sample-data fallback is useful but can mask missing infra during development
- service worker cache versioning is manual
- no automated test suite yet beyond build/typecheck validation
- no dedicated seed/import admin UI yet, only schema support
- no analytics integration yet

### UX limitations

- the app is much simpler now, but still needs a final dedicated typography and spacing polish pass
- some leftover experimental UI files remain in the codebase even though they are no longer central

## 19. Recommended Next Steps

### Highest priority

1. Do a final UI polish pass focused only on:
   - typography scale
   - spacing rhythm
   - touch target consistency
   - card density
2. Run a real mobile browser QA pass on:
   - iPhone Safari
   - Android Chrome
3. Connect and validate Supabase in a real project if not already done.

### Product next steps

1. Seed the first real Copenhagen markets.
2. Add a basic admin import flow.
3. Add analytics to see:
   - which pages are used most
   - whether users prefer list/map/calendar
   - how many organizer sign-ins convert to submissions

### Engineering next steps

1. Generate and commit Supabase DB types with `npm run supabase:types`.
2. Add automated tests for:
   - explorer filtering
   - organizer submission
   - admin moderation
   - locale routing
3. Add a browser-based QA checklist or Playwright flow for major screens.

## 20. File Map

### Product shell

- [app/layout.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/layout.tsx)
- [app/[locale]/layout.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/layout.tsx)
- [components/site-chrome.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/site-chrome.tsx)

### Public experience

- [app/[locale]/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/page.tsx)
- [app/[locale]/markets/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/markets/page.tsx)
- [components/explorer-client.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/explorer-client.tsx)
- [components/market-card.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-card.tsx)
- [components/market-map.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-map.tsx)
- [components/calendar-view.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/calendar-view.tsx)
- [app/[locale]/markets/[slug]/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/markets/[slug]/page.tsx)

### Organizer and admin

- [app/[locale]/sign-in/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/sign-in/page.tsx)
- [app/[locale]/dashboard/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/dashboard/page.tsx)
- [components/market-form.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/market-form.tsx)
- [app/[locale]/admin/page.tsx](/Users/rasmus/Documents/Coding/loppemarked/app/[locale]/admin/page.tsx)
- [components/status-pill.tsx](/Users/rasmus/Documents/Coding/loppemarked/components/status-pill.tsx)

### Backend logic

- [lib/actions.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/actions.ts)
- [lib/data.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/data.ts)
- [lib/session.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/session.ts)
- [lib/supabase/server.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/supabase/server.ts)
- [lib/supabase/browser.ts](/Users/rasmus/Documents/Coding/loppemarked/lib/supabase/browser.ts)

### Infra and config

- [supabase/migrations/202603061800_fleafinder.sql](/Users/rasmus/Documents/Coding/loppemarked/supabase/migrations/202603061800_fleafinder.sql)
- [public/sw.js](/Users/rasmus/Documents/Coding/loppemarked/public/sw.js)
- [app/manifest.ts](/Users/rasmus/Documents/Coding/loppemarked/app/manifest.ts)
- [proxy.ts](/Users/rasmus/Documents/Coding/loppemarked/proxy.ts)
- [package.json](/Users/rasmus/Documents/Coding/loppemarked/package.json)

## 21. Summary

Flea Finder is currently a working MVP foundation for a Copenhagen flea market guide with:

- a simplified mobile-first public browsing experience
- organizer creation and editing flows
- admin moderation
- Supabase-backed data model and permissions
- PWA install and offline support

The most important recent product decision was simplifying the interface. The next best move is not another redesign from scratch. It is a controlled polish pass on the now-simpler system, plus real mobile QA and real seeded content.

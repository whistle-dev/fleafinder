import { createClient } from "@supabase/supabase-js";

import { DEFAULT_FILTERS, isCopenhagenMarketLocation } from "@/lib/constants";
import { sampleMarkets, sampleRevisions } from "@/lib/sample-data";
import { hasSupabaseConfig, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/config";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import type {
  ExplorerFilters,
  ExplorerSnapshot,
  MarketOccurrence,
  MarketRevision,
  MarketSeries,
  Profile
} from "@/lib/types";
import { ensureUniqueSlug, getNextOccurrence, getTodayOccurrences, slugify } from "@/lib/utils";

function getPublicClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

function mapRowToSeries(row: Record<string, unknown>, occurrences: MarketOccurrence[]): MarketSeries {
  return {
    id: String(row.id),
    organizerId: String(row.organizer_id),
    slug: String(row.slug),
    title: String(row.title),
    description: String(row.description),
    language: (row.language as MarketSeries["language"]) ?? "da",
    category: (row.category as MarketSeries["category"]) ?? "mixed",
    status: (row.status as MarketSeries["status"]) ?? "draft",
    vibe: String(row.vibe ?? ""),
    featured: Boolean(row.featured),
    venueName: (row.venue_name as string | null) ?? null,
    addressLine: String(row.address_line ?? ""),
    postalCode: (row.postal_code as string | null) ?? null,
    city: String(row.city ?? "Copenhagen"),
    latitude: Number(row.latitude ?? 55.6761),
    longitude: Number(row.longitude ?? 12.5683),
    contactEmail: String(row.contact_email ?? ""),
    coverImageUrl: (row.cover_image_url as string | null) ?? null,
    coverTint: String(row.cover_tint ?? "sand"),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    publishedAt: (row.published_at as string | null) ?? null,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    occurrences
  };
}

function filterMarkets(markets: MarketSeries[], filters: ExplorerFilters) {
  const normalizedQuery = filters.q.trim().toLowerCase();
  const now = Date.now();

  return markets.filter((market) => {
    if (market.status !== "published") {
      return false;
    }

    if (filters.category !== "all" && market.category !== filters.category) {
      return false;
    }

    const searchable = [market.title, market.description, market.addressLine, market.city, market.vibe, ...market.tags]
      .join(" ")
      .toLowerCase();

    if (normalizedQuery) {
      const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);
      const matchesAllTerms = searchTerms.every(term => searchable.includes(term));
      if (!matchesAllTerms) {
        return false;
      }
    }

    if (filters.date === "today") {
      return getTodayOccurrences(market.occurrences).length > 0;
    }

    if (filters.date === "upcoming") {
      return market.occurrences.some((occurrence) => new Date(occurrence.endAt).getTime() >= now);
    }

    return true;
  });
}

function buildSnapshot(markets: MarketSeries[], filters: ExplorerFilters): ExplorerSnapshot {
  const publicMarkets = markets.filter((market) =>
    isCopenhagenMarketLocation({
      city: market.city,
      latitude: market.latitude,
      longitude: market.longitude
    })
  );

  const filtered = filterMarkets(publicMarkets, filters)
    .slice()
    .sort((left, right) => {
      const leftNext = getNextOccurrence(left.occurrences)?.startAt ?? left.createdAt;
      const rightNext = getNextOccurrence(right.occurrences)?.startAt ?? right.createdAt;
      return leftNext.localeCompare(rightNext);
    });

  return {
    markets: filtered,
    featured: filtered.filter((market) => market.featured).slice(0, 3),
    filters,
    counts: {
      total: publicMarkets.filter((market) => market.status === "published").length,
      today: publicMarkets.filter(
        (market) => market.status === "published" && getTodayOccurrences(market.occurrences).length > 0
      ).length,
      upcoming: publicMarkets.filter(
        (market) =>
          market.status === "published" &&
          market.occurrences.some((occurrence) => new Date(occurrence.endAt).getTime() >= Date.now())
      ).length
    }
  };
}

async function fetchAllMarkets(): Promise<MarketSeries[]> {
  if (!hasSupabaseConfig()) {
    return sampleMarkets;
  }

  try {
    const supabase = getPublicClient();

    if (!supabase) {
      return sampleMarkets;
    }

    const { data: seriesRows, error: seriesError } = await supabase
      .from("market_series")
      .select("*")
      .in("status", ["draft", "pending_review", "changes_requested", "published", "archived"])
      .order("featured", { ascending: false })
      .order("updated_at", { ascending: false });

    if (seriesError || !seriesRows) {
      return sampleMarkets;
    }

    const ids = seriesRows.map((row) => row.id);
    const { data: occurrenceRows } = await supabase
      .from("market_occurrences")
      .select("*")
      .in("series_id", ids)
      .order("start_at", { ascending: true });

    const occurrencesBySeries = new Map<string, MarketOccurrence[]>();

    (occurrenceRows ?? []).forEach((row) => {
      const list = occurrencesBySeries.get(row.series_id) ?? [];
      list.push({
        id: row.id,
        seriesId: row.series_id,
        startAt: row.start_at,
        endAt: row.end_at,
        note: row.note
      });
      occurrencesBySeries.set(row.series_id, list);
    });

    return seriesRows.map((row) => mapRowToSeries(row, occurrencesBySeries.get(row.id) ?? []));
  } catch {
    return sampleMarkets;
  }
}

async function fetchVisibleRevisions(): Promise<MarketRevision[]> {
  if (!hasSupabaseConfig()) {
    return sampleRevisions;
  }

  try {
    const supabase = await getServerSupabaseClient();

    if (!supabase) {
      return sampleRevisions;
    }

    const { data, error } = await supabase
      .from("market_revisions")
      .select("*")
      .in("status", ["pending_review", "changes_requested"])
      .order("created_at", { ascending: false });

    if (error || !data) {
      return sampleRevisions;
    }

    return data.map((row) => ({
      id: row.id,
      seriesId: row.series_id,
      organizerId: row.organizer_id,
      status: row.status,
      payload: row.payload,
      adminNotes: row.admin_notes,
      createdAt: row.created_at,
      reviewedAt: row.reviewed_at,
      reviewedBy: row.reviewed_by
    }));
  } catch {
    return sampleRevisions;
  }
}

export async function getExplorerSnapshot(filters: ExplorerFilters = DEFAULT_FILTERS) {
  const markets = await fetchAllMarkets();
  return buildSnapshot(markets, filters);
}

export async function getMarketBySlug(slug: string) {
  const markets = await fetchAllMarkets();
  return (
    markets.find(
      (market) =>
        market.slug === slug &&
        market.status === "published" &&
        isCopenhagenMarketLocation({
          city: market.city,
          latitude: market.latitude,
          longitude: market.longitude
        })
    ) ?? null
  );
}

export async function getSeedHighlights() {
  const markets = await fetchAllMarkets();
  return markets
    .filter(
      (market) =>
        market.status === "published" &&
        isCopenhagenMarketLocation({
          city: market.city,
          latitude: market.latitude,
          longitude: market.longitude
        })
    )
    .slice(0, 4);
}

export async function getOrganizerWorkspace(profile: Profile) {
  if (!hasSupabaseConfig()) {
    return {
      markets: sampleMarkets.filter((market) => market.organizerId === profile.id),
      revisions: sampleRevisions.filter((revision) => revision.organizerId === profile.id)
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      markets: sampleMarkets.filter((market) => market.organizerId === profile.id),
      revisions: sampleRevisions.filter((revision) => revision.organizerId === profile.id)
    };
  }

  const { data: seriesRows } = await supabase
    .from("market_series")
    .select("*")
    .eq("organizer_id", profile.id)
    .order("updated_at", { ascending: false });

  const ids = (seriesRows ?? []).map((row) => row.id);
  const { data: occurrenceRows } = ids.length
    ? await supabase.from("market_occurrences").select("*").in("series_id", ids).order("start_at", { ascending: true })
    : { data: [] };
  const revisions = await fetchVisibleRevisions();

  const occurrencesBySeries = new Map<string, MarketOccurrence[]>();

  (occurrenceRows ?? []).forEach((row) => {
    const list = occurrencesBySeries.get(row.series_id) ?? [];
    list.push({
      id: row.id,
      seriesId: row.series_id,
      startAt: row.start_at,
      endAt: row.end_at,
      note: row.note
    });
    occurrencesBySeries.set(row.series_id, list);
  });

  return {
    markets: (seriesRows ?? []).map((row) => mapRowToSeries(row, occurrencesBySeries.get(row.id) ?? [])),
    revisions: revisions.filter((revision) => revision.organizerId === profile.id)
  };
}

export async function getAdminWorkspace() {
  if (!hasSupabaseConfig()) {
    return {
      pendingSeries: sampleMarkets.filter(
        (market) => market.status === "pending_review" || market.status === "changes_requested"
      ),
      pendingRevisions: sampleRevisions.filter((revision) => revision.status === "pending_review")
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      pendingSeries: sampleMarkets.filter(
        (market) => market.status === "pending_review" || market.status === "changes_requested"
      ),
      pendingRevisions: sampleRevisions.filter((revision) => revision.status === "pending_review")
    };
  }

  const { data: seriesRows } = await supabase
    .from("market_series")
    .select("*")
    .in("status", ["pending_review", "changes_requested"])
    .order("updated_at", { ascending: false });

  const ids = (seriesRows ?? []).map((row) => row.id);
  const { data: occurrenceRows } = ids.length
    ? await supabase.from("market_occurrences").select("*").in("series_id", ids).order("start_at", { ascending: true })
    : { data: [] };
  const revisions = await fetchVisibleRevisions();

  const occurrencesBySeries = new Map<string, MarketOccurrence[]>();

  (occurrenceRows ?? []).forEach((row) => {
    const list = occurrencesBySeries.get(row.series_id) ?? [];
    list.push({
      id: row.id,
      seriesId: row.series_id,
      startAt: row.start_at,
      endAt: row.end_at,
      note: row.note
    });
    occurrencesBySeries.set(row.series_id, list);
  });

  return {
    pendingSeries: (seriesRows ?? []).map((row) => mapRowToSeries(row, occurrencesBySeries.get(row.id) ?? [])),
    pendingRevisions: revisions.filter((revision) => revision.status === "pending_review")
  };
}

export async function getSitemapEntries() {
  const snapshot = await getExplorerSnapshot();
  return snapshot.markets.map((market) => market.slug);
}

export async function getExistingSlugs() {
  if (!hasSupabaseConfig()) {
    return sampleMarkets;
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return sampleMarkets;
  }

  const { data } = await supabase.from("market_series").select("id, organizer_id, slug, title, description, language, category, status, vibe, featured, venue_name, address_line, postal_code, city, latitude, longitude, contact_email, cover_image_url, cover_tint, created_at, updated_at, published_at, tags");

  return (data ?? []).map((row) => mapRowToSeries(row, []));
}

export function buildMarketDraft(overrides?: Partial<MarketSeries>): MarketSeries {
  const reference = sampleMarkets[0];
  const draftId = overrides?.id ?? crypto.randomUUID();
  const title = overrides?.title ?? "";

  return {
    ...reference,
    id: draftId,
    organizerId: overrides?.organizerId ?? reference.organizerId,
    slug: ensureUniqueSlug(overrides?.slug ?? slugify(title || "new-market"), sampleMarkets, draftId),
    title,
    description: overrides?.description ?? "",
    category: overrides?.category ?? "mixed",
    status: overrides?.status ?? "draft",
    vibe: overrides?.vibe ?? "",
    venueName: overrides?.venueName ?? "",
    addressLine: overrides?.addressLine ?? "",
    postalCode: overrides?.postalCode ?? "",
    city: overrides?.city ?? "København",
    latitude: overrides?.latitude ?? 55.6761,
    longitude: overrides?.longitude ?? 12.5683,
    contactEmail: overrides?.contactEmail ?? "",
    coverImageUrl: overrides?.coverImageUrl ?? null,
    coverTint: overrides?.coverTint ?? "sand",
    createdAt: overrides?.createdAt ?? new Date().toISOString(),
    updatedAt: overrides?.updatedAt ?? new Date().toISOString(),
    publishedAt: overrides?.publishedAt ?? null,
    tags: overrides?.tags ?? [],
    occurrences: overrides?.occurrences ?? []
  };
}

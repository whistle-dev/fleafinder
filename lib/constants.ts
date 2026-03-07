import type { ExplorerFilters, Locale, MarketCategory } from "@/lib/types";

export const APP_NAME = "Flea Finder";
export const APP_DESCRIPTION =
  "A mobile-first Copenhagen flea market guide with map, calendar, organizer tools, and admin moderation.";

export const DEFAULT_LOCALE: Locale = "da";
export const COPENHAGEN_CENTER = {
  latitude: 55.6761,
  longitude: 12.5683,
  zoom: 10.1
};

export const COPENHAGEN_BOUNDS = {
  west: 12.3,
  south: 55.5,
  east: 12.82,
  north: 55.82
} as const;

export const COPENHAGEN_MAX_BOUNDS: [[number, number], [number, number]] = [
  [COPENHAGEN_BOUNDS.west, COPENHAGEN_BOUNDS.south],
  [COPENHAGEN_BOUNDS.east, COPENHAGEN_BOUNDS.north]
];

export function isCopenhagenCity(city: string) {
  const normalized = city.trim().toLowerCase();
  return normalized.includes("københavn") || normalized.includes("copenhagen");
}

export function isWithinCopenhagenBounds(latitude: number, longitude: number) {
  return (
    latitude >= COPENHAGEN_BOUNDS.south &&
    latitude <= COPENHAGEN_BOUNDS.north &&
    longitude >= COPENHAGEN_BOUNDS.west &&
    longitude <= COPENHAGEN_BOUNDS.east
  );
}

export function isCopenhagenMarketLocation({
  city,
  latitude,
  longitude
}: {
  city?: string | null;
  latitude: number;
  longitude: number;
}) {
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return isWithinCopenhagenBounds(latitude, longitude);
  }

  if (city?.trim()) {
    return isCopenhagenCity(city);
  }

  return false;
}

export const DEFAULT_FILTERS: ExplorerFilters = {
  q: "",
  category: "all",
  date: "upcoming",
  view: "list"
};

export const CATEGORY_LABELS: Record<MarketCategory, { da: string; en: string }> = {
  mixed: { da: "Blandet", en: "Mixed" },
  vintage: { da: "Vintage", en: "Vintage" },
  clothing: { da: "Tøj", en: "Clothing" },
  kids: { da: "Børn", en: "Kids" },
  design: { da: "Design", en: "Design" },
  furniture: { da: "Møbler", en: "Furniture" }
};

export const STATUS_LABELS = {
  draft: { da: "Kladde", en: "Draft" },
  pending_review: { da: "Til godkendelse", en: "Pending review" },
  changes_requested: { da: "Rettelser ønskes", en: "Changes requested" },
  published: { da: "Live", en: "Published" },
  archived: { da: "Arkiveret", en: "Archived" }
};

export const REVISION_LABELS = {
  pending_review: { da: "Afventer", en: "Pending" },
  changes_requested: { da: "Rettelser ønskes", en: "Changes requested" },
  approved: { da: "Godkendt", en: "Approved" }
};

export const marketCategories = [
  "mixed",
  "vintage",
  "clothing",
  "kids",
  "design",
  "furniture"
] as const;

export const listingStatuses = [
  "draft",
  "pending_review",
  "changes_requested",
  "published",
  "archived"
] as const;

export const revisionStatuses = ["pending_review", "changes_requested", "approved"] as const;
export const roles = ["organizer", "admin"] as const;
export const locales = ["da", "en"] as const;

export type Locale = (typeof locales)[number];
export type MarketCategory = (typeof marketCategories)[number];
export type ListingStatus = (typeof listingStatuses)[number];
export type RevisionStatus = (typeof revisionStatuses)[number];
export type Role = (typeof roles)[number];

export type DateFilter = "today" | "upcoming" | "all";
export type ExplorerView = "list" | "map" | "calendar";

export type MarketOccurrence = {
  id: string;
  seriesId: string;
  startAt: string;
  endAt: string;
  note?: string | null;
};

export type MarketSeries = {
  id: string;
  organizerId: string;
  slug: string;
  title: string;
  description: string;
  language: Locale;
  category: MarketCategory;
  status: ListingStatus;
  vibe: string;
  featured: boolean;
  venueName?: string | null;
  addressLine: string;
  postalCode?: string | null;
  city: string;
  latitude: number;
  longitude: number;
  contactEmail: string;
  coverImageUrl?: string | null;
  coverTint: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  tags: string[];
  occurrences: MarketOccurrence[];
};

export type SeriesPayload = Omit<
  MarketSeries,
  "id" | "slug" | "status" | "createdAt" | "updatedAt" | "publishedAt" | "featured" | "coverTint"
> & {
  slug?: string;
  coverTint?: string;
};

export type MarketRevision = {
  id: string;
  seriesId: string;
  organizerId: string;
  status: RevisionStatus;
  payload: SeriesPayload;
  adminNotes?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
};

export type Profile = {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  preferredLocale: Locale;
};

export type ExplorerFilters = {
  q: string;
  category: MarketCategory | "all";
  date: DateFilter;
  view: ExplorerView;
};

export type ExplorerSnapshot = {
  markets: MarketSeries[];
  featured: MarketSeries[];
  filters: ExplorerFilters;
  counts: {
    total: number;
    today: number;
    upcoming: number;
  };
};

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { DateFilter, ExplorerFilters, Locale, MarketOccurrence, MarketSeries } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import { DEFAULT_FILTERS } from "@/lib/constants";

export function isLocale(value: string): value is Locale {
  return value === "da" || value === "en";
}

export function formatDate(date: string, locale: Locale, options?: Intl.DateTimeFormatOptions) {
  const hasExplicitParts =
    options &&
    ["weekday", "year", "month", "day", "hour", "minute", "second"].some((key) => key in options && options[key as keyof Intl.DateTimeFormatOptions]);

  return new Intl.DateTimeFormat(
    locale === "da" ? "da-DK" : "en-GB",
    hasExplicitParts
      ? options
      : {
          dateStyle: "medium",
          ...options
        }
  ).format(new Date(date)).replace(/\.\./g, '.');
}

export function formatTimeRange(startAt: string, endAt: string, locale: Locale) {
  const formatter = new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return `${formatter.format(new Date(startAt))} - ${formatter.format(new Date(endAt))}`;
}

export function getCoverTintGradient(coverTint: string) {
  switch (coverTint) {
    case "sun":
      return "linear-gradient(145deg, #d86d38 0%, #f2ba82 48%, #20453e 100%)"
    case "mint":
      return "linear-gradient(145deg, #65998e 0%, #cbe2db 48%, #21463f 100%)"
    case "clay":
      return "linear-gradient(145deg, #b96b50 0%, #ecc6b9 48%, #244038 100%)"
    case "berry":
      return "linear-gradient(145deg, #7b4d67 0%, #d8b8c6 48%, #203f39 100%)"
    default:
      return "linear-gradient(145deg, #cfa773 0%, #f0ddbf 48%, #27483f 100%)"
  }
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

export function getNextOccurrence(occurrences: MarketOccurrence[]) {
  const now = Date.now();
  return occurrences
    .filter((occurrence) => new Date(occurrence.endAt).getTime() >= now)
    .slice()
    .sort((left, right) => left.startAt.localeCompare(right.startAt))[0];
}

export function getTodayOccurrences(occurrences: MarketOccurrence[]) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const end = start + 86400000;
  return occurrences.filter((occurrence) => {
    const occurrenceStart = new Date(occurrence.startAt).getTime();
    return occurrenceStart >= start && occurrenceStart < end;
  });
}

export function serializeFilters(searchParams?: Record<string, string | string[] | undefined>): ExplorerFilters {
  const q = typeof searchParams?.q === "string" ? searchParams.q : DEFAULT_FILTERS.q;
  const category =
    typeof searchParams?.category === "string" &&
    ["all", "mixed", "vintage", "clothing", "kids", "design", "furniture"].includes(searchParams.category)
      ? (searchParams.category as ExplorerFilters["category"])
      : DEFAULT_FILTERS.category;
  const date =
    typeof searchParams?.date === "string" && ["today", "upcoming", "all"].includes(searchParams.date)
      ? (searchParams.date as DateFilter)
      : DEFAULT_FILTERS.date;
  const view =
    typeof searchParams?.view === "string" && ["list", "map", "calendar"].includes(searchParams.view)
      ? (searchParams.view as ExplorerFilters["view"])
      : DEFAULT_FILTERS.view;

  return { q, category, date, view };
}

export function buildQueryString(filters: ExplorerFilters) {
  const params = new URLSearchParams();

  if (filters.q) {
    params.set("q", filters.q);
  }

  if (filters.category !== DEFAULT_FILTERS.category) {
    params.set("category", filters.category);
  }

  if (filters.date !== DEFAULT_FILTERS.date) {
    params.set("date", filters.date);
  }

  if (filters.view !== DEFAULT_FILTERS.view) {
    params.set("view", filters.view);
  }

  return params.toString();
}

export function ensureUniqueSlug(desiredSlug: string, markets: MarketSeries[], currentId?: string) {
  const baseSlug = slugify(desiredSlug) || "market";
  let nextSlug = baseSlug;
  let attempt = 2;

  while (markets.some((market) => market.slug === nextSlug && market.id !== currentId)) {
    nextSlug = `${baseSlug}-${attempt}`;
    attempt += 1;
  }

  return nextSlug;
}

export function createIcsFile(series: MarketSeries, occurrence: MarketOccurrence) {
  const format = (value: string) => value.replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const location = [series.venueName, series.addressLine, series.city].filter(Boolean).join(", ");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flea Finder//EN",
    "BEGIN:VEVENT",
    `UID:${occurrence.id}@fleafinder.app`,
    `DTSTAMP:${format(new Date().toISOString())}`,
    `DTSTART:${format(new Date(occurrence.startAt).toISOString())}`,
    `DTEND:${format(new Date(occurrence.endAt).toISOString())}`,
    `SUMMARY:${series.title}`,
    `DESCRIPTION:${series.description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");
}

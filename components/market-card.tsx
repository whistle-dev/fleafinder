import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/constants";
import type { Locale, MarketSeries } from "@/lib/types";
import {
  formatTimeRange,
  getCoverTintGradient,
  getNextOccurrence,
} from "@/lib/utils";

export function MarketCard({
  locale,
  market,
  featured = false,
}: {
  locale: Locale;
  market: MarketSeries;
  featured?: boolean;
}) {
  const nextOccurrence = getNextOccurrence(market.occurrences);

  let dateLeaf = null;
  if (nextOccurrence) {
    const d = new Date(nextOccurrence.startAt);
    const month = d.toLocaleDateString(locale, { month: "short" });
    const day = d.toLocaleDateString(locale, { day: "numeric" });
    dateLeaf = { month, day };
  }

  return (
    <Link
      href={`/${locale}/markets/${market.slug}`}
      className="group block h-full outline-none"
    >
      <article className="flex flex-col gap-4 h-full relative">
        {/* Borderless Square Image Container */}
        <div
          className={`relative w-full aspect-square overflow-hidden rounded-[2rem] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:shadow-[var(--shadow-xl)] group-hover:-translate-y-1 ${
            featured
              ? "ring-2 ring-[var(--ink)] ring-offset-4 ring-offset-[var(--paper)]"
              : ""
          }`}
          style={
            !market.coverImageUrl
              ? { background: getCoverTintGradient(market.coverTint) }
              : undefined
          }
        >
          {market.coverImageUrl && (
            <Image
              src={market.coverImageUrl}
              alt={market.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
            />
          )}
          {/* Subtle vignette for bottom badges readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-60 transition-opacity duration-700 group-hover:opacity-40" />

          {/* Top Left: Floating Date Leaf */}
          {dateLeaf && (
            <div className="absolute top-4 left-4 flex flex-col items-center justify-center bg-[var(--surface-elevated)] text-[var(--accent)] shadow-lg rounded-2xl min-w-[4rem] p-2 text-center transition-transform duration-500 ease-out group-hover:scale-105">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] opacity-80 leading-none mb-1">
                {dateLeaf.month}
              </span>
              <span className="text-2xl font-display font-medium text-[var(--accent)] leading-none">
                {dateLeaf.day}
              </span>
            </div>
          )}

          {/* Top Right: Featured Badge (if any) */}
          {featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[var(--accent)] text-[#335405] shadow-md">
                {locale === "da" ? "Udvalgt" : "Featured"}
              </span>
            </div>
          )}

          {/* Bottom Left: Category Pill */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-[var(--surface)] text-[var(--accent)] shadow-md border border-[var(--line)]">
              {CATEGORY_LABELS[market.category][locale]}
            </span>
          </div>
        </div>

        {/* Minimal Content Section Below Image */}
        <div className="flex flex-col flex-grow px-1">
          <h3 className="font-display text-2xl leading-tight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors duration-300 line-clamp-2 mb-2">
            {market.title}
          </h3>

          <div className="flex flex-col gap-1 mt-auto">
            {nextOccurrence ? (
              <div className="flex items-center gap-2 text-[14px] text-[var(--ink-soft)] font-medium">
                <span>
                  {formatTimeRange(
                    nextOccurrence.startAt,
                    nextOccurrence.endAt,
                    locale,
                  )}
                </span>
                {market.occurrences.length > 1 && (
                  <span className="text-[var(--ink-muted)]">
                    &bull; +{market.occurrences.length - 1}{" "}
                    {locale === "da" ? "mere" : "more"}
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[14px] text-[var(--ink-muted)] font-medium">
                {locale === "da" ? "Ingen datoer" : "No dates"}
              </div>
            )}

            <div className="flex items-center justify-between text-[14px] text-[var(--ink-soft)] mt-1">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="size-3.5 opacity-70 shrink-0 text-[var(--accent)]" />
                <span className="truncate">{market.city}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-[var(--ink)] opacity-0 -translate-x-3 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--accent)]">
                {locale === "da" ? "Læs mere" : "Details"}
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

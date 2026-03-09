import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      className="group block h-[340px] sm:h-[320px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] rounded-2xl"
    >
      <article className="relative h-full flex flex-col w-full overflow-hidden rounded-2xl transition-transform duration-500 ease-out sm:hover:shadow-xl sm:hover:-translate-y-1 isolate">
        
        {/* Background Base (If no image) */}
        <div 
          className="absolute inset-0 z-0"
          style={!market.coverImageUrl ? { background: getCoverTintGradient(market.coverTint) } : { background: 'var(--surface-elevated)' }}
        />

        {/* Image */}
        {market.coverImageUrl && (
          <Image
            src={market.coverImageUrl}
            alt={market.title}
            fill
            unoptimized
            className="absolute inset-0 z-0 object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] sm:group-hover:scale-105"
          />
        )}
        
        {/* Dark tint only at bottom for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-10 pointer-events-none" />
        
        {/* Top Section: Badges & Date */}
        <div className="flex justify-between items-start p-3 sm:p-4 z-20 w-full">
          {/* Left Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-white text-zinc-900 shadow-sm">
              {CATEGORY_LABELS[market.category][locale]}
            </span>

            {featured && (
              <span className="inline-flex px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[var(--accent)] text-zinc-900 shadow-sm">
                {locale === "da" ? "Udvalgt" : "Featured"}
              </span>
            )}
          </div>

          {/* Right Date Leaf */}
          {dateLeaf && (
            <div className="flex flex-col items-center justify-center bg-white/95 backdrop-blur-md text-zinc-900 rounded-lg min-w-[3rem] px-2.5 py-1.5 shadow-sm shrink-0 ml-2">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 leading-none mb-0.5">
                {dateLeaf.month}
              </span>
              <span className="text-lg font-display font-bold leading-none">
                {dateLeaf.day}
              </span>
            </div>
          )}
        </div>

        {/* Content Section Overlay */}
        <div className="mt-auto flex items-end justify-between gap-3 p-3 sm:p-4 text-white w-full z-20 min-h-0">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <h3 className="font-display text-xl font-semibold leading-tight drop-shadow-md line-clamp-2 transition-colors duration-300 text-white sm:group-hover:text-[var(--accent)]">
              {market.title}
            </h3>

            <div className="flex flex-col gap-0.5 text-[14px] drop-shadow-sm">
              <span className="truncate text-white/95 font-medium" title={market.city}>
                {market.city}
              </span>
              {nextOccurrence ? (
                <span className="text-white/75 font-medium">
                  {formatTimeRange(nextOccurrence.startAt, nextOccurrence.endAt, locale)}
                  {market.occurrences.length > 1 && (
                    <span className="text-white/60 ml-1">
                      {locale === "da"
                        ? (market.occurrences.length - 1 === 1
                            ? "og 1 anden dato"
                            : `og ${market.occurrences.length - 1} andre datoer`)
                        : (market.occurrences.length - 1 === 1
                            ? "and 1 other date"
                            : `and ${market.occurrences.length - 1} other dates`)}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-white/60 font-medium">{locale === "da" ? "Ingen datoer" : "No dates"}</span>
              )}
            </div>
          </div>

          {/* Compact arrow: visible on mobile / on hover desktop */}
          <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white/25 backdrop-blur-sm text-white transition-all duration-300 opacity-100 translate-x-0 sm:opacity-0 sm:-translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0">
            <ArrowRight className="w-3 h-3 -rotate-45 sm:group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </article>
    </Link>
  );
}

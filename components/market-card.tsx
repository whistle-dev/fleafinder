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
    let month = d.toLocaleDateString(locale, { month: "short" });
    if (locale === "da" && month.endsWith(".")) month = month.slice(0, -1);
    let day = d.toLocaleDateString(locale, { day: "numeric" });
    if (locale === "da" && day.endsWith(".")) day = day.slice(0, -1);
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
        
        {/* Top Section: Badges */}
        <div className="flex items-start p-3 sm:p-4 z-20 w-full">
          {/* Left Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-white/95 border border-white/10">
              {CATEGORY_LABELS[market.category][locale]}
            </span>

            {featured && (
              <span className="inline-flex px-2.5 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[var(--accent)]/90 backdrop-blur-md text-white border border-white/20">
                {locale === "da" ? "Udvalgt" : "Featured"}
              </span>
            )}
          </div>
        </div>

        {/* Content Section Overlay */}
        <div className="mt-auto flex items-end justify-between gap-3 p-3 sm:p-4 text-white w-full z-20 min-h-0">
          <div className="flex flex-col min-w-0 flex-1 gap-1">
            <h3 className="font-display text-xl font-semibold leading-tight drop-shadow-md line-clamp-2 transition-colors duration-300 text-white sm:group-hover:text-[var(--accent)]">
              {market.title}
            </h3>

            <div className="flex flex-col gap-1.5 text-[13px] drop-shadow-sm min-w-0 mt-0.5">
              <span className="truncate text-white/95 font-medium" title={market.city}>
                {market.city}
              </span>
              {nextOccurrence ? (
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-1.5">
                    {dateLeaf && (
                      <>
                        <span className="text-white/95 font-semibold">
                          {locale === "da" ? `${dateLeaf.day}. ${dateLeaf.month}` : `${dateLeaf.month} ${dateLeaf.day}`}
                        </span>
                        <span className="text-white/40" aria-hidden>·</span>
                      </>
                    )}
                    <span className="text-white/90 font-medium">
                      {formatTimeRange(nextOccurrence.startAt, nextOccurrence.endAt, locale)}
                    </span>
                  </div>
                  {market.occurrences.length > 1 && (
                    <span className="text-white/60 text-[12px] font-medium">
                      {locale === "da"
                        ? (market.occurrences.length - 1 === 1
                            ? "+ 1 anden dato"
                            : `+ ${market.occurrences.length - 1} andre datoer`)
                        : (market.occurrences.length - 1 === 1
                            ? "+ 1 other date"
                            : `+ ${market.occurrences.length - 1} other dates`)}
                    </span>
                  )}
                </div>
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

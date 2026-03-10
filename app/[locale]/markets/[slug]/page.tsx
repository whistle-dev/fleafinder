import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CATEGORY_LABELS } from "@/lib/constants";
import { getMarketBySlug } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import {
  createIcsFile,
  formatDate,
  formatTimeRange,
  getNextOccurrence,
  getWebsiteLabel,
  isLocale,
} from "@/lib/utils";

import { MarketCoverImage } from "@/components/market-cover-image";
import { MarketMap } from "@/components/market-map";
import { BackButton } from "@/components/ui/back-button";
import { InteractiveRow } from "@/components/ui/interactive-row";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const market = await getMarketBySlug(slug);

  if (!market) {
    return {};
  }

  return {
    title: market.title,
    description: market.description,
  };
}

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const dictionary = getDictionary(locale);
  const market = await getMarketBySlug(slug);

  if (!market) {
    notFound();
  }

  const nextOccurrence = getNextOccurrence(market.occurrences);
  const locationLabel = [market.venueName, market.addressLine, market.city]
    .filter(Boolean)
    .join(", ");
  const websiteLabel = getWebsiteLabel(market.website);
  const googleCalendarUrl = nextOccurrence
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        market.title,
      )}&details=${encodeURIComponent(market.description)}&location=${encodeURIComponent(
        locationLabel,
      )}&dates=${new Date(nextOccurrence.startAt)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z")}/${new Date(nextOccurrence.endAt)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z")}`
    : "";

  const calendarData = nextOccurrence
    ? `data:text/calendar;charset=utf-8,${encodeURIComponent(createIcsFile(market, nextOccurrence))}`
    : "";

  return (
    <article className="min-h-screen pb-24 md:pb-32">
      {/* Minimal Header */}
      <nav className="w-full max-w-[1000px] mx-auto px-5 md:px-8 pt-6 md:pt-10 flex justify-start">
        <BackButton fallbackHref={`/${locale}/markets`} className="text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors bg-transparent border-0 shadow-none pl-0 hover:bg-transparent">
          {locale === "da" ? "Tilbage" : "Back"}
        </BackButton>
      </nav>

      {/* Editorial Hero */}
      <header className="w-full max-w-[1000px] mx-auto px-5 md:px-8 pt-4 pb-12 md:pt-8 md:pb-16">
        <div className="space-y-4 mb-8 md:mb-12">
          <div className="animate-fade-in stagger-1">
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              {CATEGORY_LABELS[market.category][locale]}
            </span>
          </div>
          <h1 className="font-display text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.9] tracking-[-0.03em] text-[var(--ink)] animate-fade-in stagger-2">
            {market.title}
          </h1>
        </div>

        <div className="w-full animate-fade-in stagger-3">
          <div 
            className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden"
          >
            <MarketCoverImage
              title={market.title}
              coverImageUrl={market.coverImageUrl}
              coverTint={market.coverTint}
              priority
              imageClassName="object-cover"
            />
            
            {/* Subtle grain overlay for texture */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          </div>
        </div>
      </header>

      {/* Main Content - Single Column */}
      <main className="w-full max-w-[1000px] mx-auto px-5 md:px-8 space-y-12 md:space-y-20">
        
        {/* Story */}
        <div className="animate-fade-in stagger-4">
          <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.4] text-[var(--ink-soft)] tracking-tight">
            {market.description}
          </p>
        </div>

        {/* Interactive Meta Data */}
        <div className="animate-fade-in stagger-5">
          
          {/* Interactive Location */}
          <InteractiveRow
            href={`https://maps.apple.com/?q=${encodeURIComponent(locationLabel)}`}
            target="_blank"
            rel="noreferrer"
            icon="arrow"
            label={locale === "da" ? "Åbn kort" : "Open map"}
            ariaLabel={locale === "da" ? "Åbn i Apple Maps" : "Open in Apple Maps"}
            className="py-8 md:py-12 border-t border-[var(--line-strong)]"
            iconAlign="top"
          >
            <div className="pr-6">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4 md:mb-6">
                {locale === "da" ? "Sted" : "Venue"}
              </h2>
              <p className="font-display text-3xl md:text-5xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-2 md:mb-3">
                {market.venueName || market.addressLine}
              </p>
              {market.venueName && (
                <p className="text-xl md:text-2xl text-[var(--ink-soft)] group-hover:text-[var(--ink)] transition-colors">
                  {market.addressLine}
                </p>
              )}
              <p className="text-xl md:text-2xl text-[var(--ink-soft)] group-hover:text-[var(--ink)] transition-colors">
                {market.city}
              </p>
            </div>
          </InteractiveRow>

          {/* Interactive Contact */}
          <InteractiveRow
            href={`mailto:${market.contactEmail}`}
            icon="arrow"
            label={locale === "da" ? "Send e-mail" : "Send email"}
            ariaLabel={locale === "da" ? "Send e-mail" : "Send email"}
            className="py-8 md:py-12 border-t border-[var(--line-strong)]"
            iconAlign="top"
          >
            <div className="min-w-0 pr-6">
              <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4 md:mb-6">
                {locale === "da" ? "Kontakt" : "Contact"}
              </h2>
              <p className="text-base sm:text-xl md:text-4xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors break-all min-w-0">
                {market.contactEmail}
              </p>
            </div>
          </InteractiveRow>

          {market.website ? (
            <InteractiveRow
              href={market.website}
              target="_blank"
              rel="noreferrer"
              icon="arrow"
              label={locale === "da" ? "Besøg website" : "Visit website"}
              ariaLabel={locale === "da" ? "Besøg markedets website" : "Visit market website"}
              className="py-8 md:py-12 border-t border-[var(--line-strong)]"
              iconAlign="top"
            >
              <div className="min-w-0 pr-6">
                <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-4 md:mb-6">
                  {dictionary.detail.website}
                </h2>
                <p className="text-base sm:text-xl md:text-4xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors break-all min-w-0">
                  {websiteLabel}
                </p>
              </div>
            </InteractiveRow>
          ) : null}

          {/* Interactive Dates */}
          <div className="py-8 md:py-12 border-t border-[var(--line-strong)]">
            <h2 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink-muted)] mb-6 md:mb-8">
              {dictionary.detail.nextDates}
            </h2>
            <div className="flex flex-col">
              {market.occurrences.slice(0, 6).map((occurrence) => {
                const occurrenceCalendarData = `data:text/calendar;charset=utf-8,${encodeURIComponent(createIcsFile(market, occurrence))}`;
                
                return (
                  <InteractiveRow
                    key={occurrence.id}
                    href={occurrenceCalendarData}
                    download={`${market.slug}-${occurrence.startAt.split('T')[0]}.ics`}
                    icon="plus"
                    label={locale === "da" ? "Tilføj kalender" : "Add calendar"}
                    title={locale === "da" ? "Tilføj til kalender" : "Add to calendar"}
                    ariaLabel={locale === "da" ? "Tilføj til kalender" : "Add to calendar"}
                    className="py-6 md:py-8 border-b border-[var(--line-subtle)] last:border-0"
                    iconAlign="center"
                  >
                    <div>
                      <p className="font-display text-2xl md:text-4xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors mb-1 md:mb-2">
                        {formatDate(occurrence.startAt, locale)}
                      </p>
                      <p className="text-[var(--ink-soft)] font-medium text-lg md:text-xl">
                        {formatTimeRange(occurrence.startAt, occurrence.endAt, locale)}
                      </p>
                    </div>
                  </InteractiveRow>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <section className="pt-8 md:pt-12 border-t border-[var(--line-strong)]">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h2 className="font-display text-4xl md:text-5xl text-[var(--accent)]">
              {locale === "da" ? "Find vej" : "Location"}
            </h2>
          </div>
          <div className="h-[400px] md:h-[600px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden relative border border-[var(--line-subtle)]">
            <MarketMap locale={locale} markets={[market]} interactiveMode="external" />
          </div>
        </section>
      </main>
    </article>
  );
}

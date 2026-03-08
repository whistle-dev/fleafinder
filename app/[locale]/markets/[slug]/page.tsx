import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, CalendarDays, Clock3, Mail, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

import { CATEGORY_LABELS } from "@/lib/constants";
import { getMarketBySlug } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { createIcsFile, formatDate, formatTimeRange, getCoverTintGradient, getNextOccurrence, isLocale } from "@/lib/utils";

import { BackLink } from "@/components/back-link";
import { MarketMap } from "@/components/market-map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export async function generateMetadata({
  params
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
    description: market.description
  };
}

export default async function MarketDetailPage({
  params
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
  const locationLabel = [market.venueName, market.addressLine, market.city].filter(Boolean).join(", ");
  const googleCalendarUrl = nextOccurrence
    ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        market.title
      )}&details=${encodeURIComponent(market.description)}&location=${encodeURIComponent(
        locationLabel
      )}&dates=${new Date(nextOccurrence.startAt).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}/${new Date(
        nextOccurrence.endAt
      )
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z")}`
    : "";

  const calendarData = nextOccurrence
    ? `data:text/calendar;charset=utf-8,${encodeURIComponent(createIcsFile(market, nextOccurrence))}`
    : "";

  return (
    <article className="max-w-5xl mx-auto space-y-12">
      {/* Navigation */}
      <BackLink
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--accent)]"
        fallbackHref={`/${locale}/markets`}
      >
        <ArrowLeft className="size-4" />
        {dictionary.detail.back}
      </BackLink>

      {/* Hero Header */}
      <header className="space-y-8">
        <div 
          className="relative w-full h-[40vh] min-h-[300px] max-h-[500px] rounded-[32px] overflow-hidden shadow-sm border border-[var(--line-subtle)]"
          style={!market.coverImageUrl ? { background: getCoverTintGradient(market.coverTint) } : undefined}
        >
          {market.coverImageUrl && (
            <Image
              src={market.coverImageUrl}
              alt={market.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          )}
        </div>

        <div className="space-y-6 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge variant="solid">{CATEGORY_LABELS[market.category][locale]}</Badge>
            <Badge variant="subtle">{market.city}</Badge>
          </div>
          
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] tracking-[-0.02em] text-[var(--accent)]">
            {market.title}
          </h1>
          <p className="text-xl leading-relaxed text-[var(--ink-soft)]">
            {market.description}
          </p>
        </div>
      </header>

      {/* Main Content Grid */}
      <section className="grid gap-12 lg:grid-cols-[1fr_340px]">
        {/* Left Column - Details */}
        <div className="space-y-12">
          {/* Quick Facts */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-8 border-y border-[var(--line)]">
            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                {dictionary.detail.vibe}
              </div>
              <div className="font-display text-lg text-[var(--accent)]">{market.vibe}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                {dictionary.detail.address}
              </div>
              <div className="text-lg text-[var(--accent)]">{market.addressLine}</div>
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                {locale === "da" ? "Datoer" : "Dates"}
              </div>
              <div className="text-lg text-[var(--accent)]">
                {locale === "da"
                  ? `${market.occurrences.length} planlagte`
                  : `${market.occurrences.length} scheduled`}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-[var(--accent)]">{dictionary.detail.nextDates}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {market.occurrences.slice(0, 6).map((occurrence) => (
              <div 
                className="group flex flex-col justify-center rounded-xl bg-[var(--surface)] border border-[var(--line)] p-5 hover:border-[var(--accent)] transition-colors" 
                key={occurrence.id}
              >
                <div className="font-display text-xl text-[var(--accent)] mb-1 group-hover:text-[var(--accent-dark)] transition-colors">
                  {formatDate(occurrence.startAt, locale)}
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                  <Clock3 className="size-3.5 text-[var(--accent)]" />
                  <span>{formatTimeRange(occurrence.startAt, occurrence.endAt, locale)}</span>
                </div>
              </div>
            ))}
          </div>
          </div>
          
          {/* Map Section */}
          <div className="space-y-6">
            <h2 className="font-display text-2xl text-[var(--accent)]">
              {locale === "da" ? "Find vej" : "Location"}
            </h2>
            <div className="h-[400px] w-full rounded-[16px] overflow-hidden">
              <MarketMap locale={locale} markets={[market]} />
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Sidebar */}
        <div>
          <div className="sticky top-8 space-y-6 bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-xl text-[var(--accent)]">
              {locale === "da" ? "Praktisk info" : "Practical info"}
            </h3>
            
            <div className="space-y-6">
              {/* Next Occurrence Focus */}
              {nextOccurrence ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                    {locale === "da" ? "Næste gang" : "Next up"}
                  </div>
                  <div className="flex items-center gap-3 text-[var(--accent)]">
                    <CalendarDays className="size-5 text-[var(--accent)]" />
                    <span className="font-medium">{formatDate(nextOccurrence.startAt, locale)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--ink-soft)] pl-8">
                    <span>{formatTimeRange(nextOccurrence.startAt, nextOccurrence.endAt, locale)}</span>
                  </div>
                </div>
              ) : null}

              {/* Location Focus */}
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                  {locale === "da" ? "Sted" : "Venue"}
                </div>
                <div className="flex items-start gap-3 text-[var(--accent)]">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-[var(--accent)]" />
                  <div>
                    <div className="font-medium">{market.venueName || market.addressLine}</div>
                    {market.venueName && <div className="text-sm text-[var(--ink-soft)]">{market.addressLine}</div>}
                    <div className="text-sm text-[var(--ink-soft)]">{market.city}</div>
                  </div>
                </div>
              </div>

              {/* Contact Focus */}
              <div className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                  {locale === "da" ? "Kontakt" : "Contact"}
                </div>
                <div className="flex items-center gap-3 text-[var(--accent)]">
                  <Mail className="size-5 shrink-0 text-[var(--accent)]" />
                  <a href={`mailto:${market.contactEmail}`} className="text-sm hover:text-[var(--accent)] hover:underline transition-colors">{market.contactEmail}</a>
                </div>
              </div>

              <hr className="border-[var(--line-subtle)]" />

              {/* Actions */}
              <div className="space-y-3 pt-2">
                {nextOccurrence && (
                  <>
                    <Button asChild className="w-full h-12 font-semibold rounded-2xl text-[15px]">
                      <a download={`${market.slug}.ics`} href={calendarData}>
                        <CalendarDays className="size-4 mr-1.5" />
                        {dictionary.detail.addToCalendar}
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full h-12 font-semibold rounded-2xl text-[15px]">
                      <a href={googleCalendarUrl} rel="noreferrer" target="_blank">
                        {dictionary.detail.googleCalendar}
                      </a>
                    </Button>
                  </>
                )}
                <Button asChild variant="secondary" className="w-full h-12 font-semibold rounded-2xl text-[15px] border border-[var(--line-strong)] hover:border-[var(--accent)]">
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(locationLabel)}`} rel="noreferrer" target="_blank">
                    <MapPin className="size-4 mr-1.5" />
                    {dictionary.common.openMap}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

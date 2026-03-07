import Link from "next/link";

import { getExplorerSnapshot } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { isLocale } from "@/lib/utils";

import { MarketCard } from "@/components/market-card";
import { Button } from "@/components/ui/button";

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const snapshot = await getExplorerSnapshot();
  const liveMarkets = snapshot.markets.slice(0, 8);
  const featuredMarkets = liveMarkets.filter(m => m.featured);
  const otherMarkets = liveMarkets.filter(m => !m.featured).slice(0, 6);

  return (
    <div className="space-y-24 pt-8 md:pt-16">
      {/* Editorial Hero */}
      <section className="mx-auto max-w-3xl text-center space-y-6">
        <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] tracking-[-0.02em] text-[var(--ink)]">
          {locale === "da" 
            ? "Byens loppemarkeder" 
            : "The city's flea markets"}
        </h1>
        <p className="mx-auto max-w-xl text-lg md:text-xl leading-relaxed text-[var(--ink-soft)]">
          {locale === "da"
            ? "Fra intime gårdmarkeder til store torvesalg. En kurateret guide til Københavns bedste genbrugsfund."
            : "From intimate yard sales to bustling square markets. A curated guide to Copenhagen's best secondhand finds."}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button asChild size="lg">
            <Link href={`/${locale}/markets`}>
              {locale === "da" ? "Udforsk markeder" : "Explore markets"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="soft">
            <Link href={`/${locale}/dashboard?series=new`}>
              {locale === "da" ? "Tilføj et marked" : "Add a market"}
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Markets */}
      {featuredMarkets.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="font-display text-2xl text-[var(--ink)]">
              {locale === "da" ? "Udvalgte" : "Featured"}
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredMarkets.map((market, i) => (
              <div key={market.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <MarketCard locale={locale} market={market} featured />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Markets */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
          <h2 className="font-display text-2xl text-[var(--ink)]">
            {locale === "da" ? "Kommende" : "Upcoming"}
          </h2>
          <Link href={`/${locale}/markets`} className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--ink)] transition-colors">
            {locale === "da" ? "Se alle →" : "View all →"}
          </Link>
        </div>
        
        {otherMarkets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherMarkets.map((market, i) => (
              <div key={market.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <MarketCard locale={locale} market={market} />
              </div>
            ))}
          </div>
        ) : liveMarkets.length === 0 ? (
          <div className="py-20 text-center border border-[var(--line-subtle)] rounded-2xl bg-[var(--surface)]">
            <p className="text-[var(--ink-soft)]">
              {locale === "da"
                ? "Der er ingen publicerede markeder endnu."
                : "There are no published markets yet."}
            </p>
          </div>
        ) : null}
      </section>

      {/* Minimal Footer CTA */}
      <section className="py-20 text-center">
        <div className="inline-flex flex-col items-center space-y-4 rounded-3xl bg-[var(--paper-cream)] px-8 py-12 md:px-16 md:py-16">
          <h2 className="font-display text-3xl tracking-tight text-[var(--ink)]">
            {locale === "da" ? "Arrangerer du et marked?" : "Organizing a market?"}
          </h2>
          <p className="max-w-md text-[var(--ink-soft)]">
            {locale === "da"
              ? "Gør det nemt for folk at finde dig. Tilføj dit loppemarked gratis."
              : "Make it easy for people to find you. Add your flea market for free."}
          </p>
          <div className="pt-2">
            <Button asChild variant="outline">
              <Link href={`/${locale}/dashboard?series=new`}>
                {locale === "da" ? "Opret opslag" : "Create listing"}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

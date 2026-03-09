import Link from "next/link";

import { getExplorerSnapshot } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { isLocale } from "@/lib/utils";

import { MarketCard } from "@/components/market-card";
import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { PixelTrailWrapper } from "@/components/pixel-trail-wrapper";
import { Typewriter } from "@/components/ui/typewriter";
import { OrganizeMarketCTA } from "@/components/organize-market-cta";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const snapshot = await getExplorerSnapshot();
  const liveMarkets = snapshot.markets.slice(0, 9);

  return (
    <div className="space-y-24">
      {/* Editorial Hero */}
      <section className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-20 md:py-32 mb-12 overflow-hidden flex items-center justify-center">
        <PixelTrailWrapper />

        {/* Soft radial mask to hide the trail behind text without a visible rectangle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] max-w-[100vw] h-[500px] bg-[radial-gradient(ellipse_at_center,var(--paper)_30%,transparent_70%)] z-[5] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-3xl text-center space-y-6 pointer-events-none px-5 md:px-8">
          <h1 className="font-display text-[clamp(2.75rem,11vw,4.5rem)] md:text-[clamp(3.25rem,5vw,4.9rem)] leading-[1.02] tracking-tight text-white pointer-events-auto">
            <span className="flex flex-col items-center gap-y-2">
              <span className="whitespace-nowrap text-white">
                {locale === "da" ? "Find 🩷" : "Find 🩷"}
              </span>
              <span className="inline-flex min-h-[1.1em] items-center justify-center text-[#feb9f2]">
                <Typewriter
                  text={
                    locale === "da"
                      ? [
                          "unikke møbler",
                          "dit næste outfit",
                          "skjulte skatte",
                          "vintage fund",
                          "gamle vinyler",
                        ]
                      : [
                          "unique furniture",
                          "your next outfit",
                          "hidden treasures",
                          "vintage finds",
                          "old vinyls",
                        ]
                  }
                  speed={70}
                  className="justify-center whitespace-nowrap text-center text-[#feb9f2]"
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar={"_"}
                />
              </span>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[var(--ink-soft)] pointer-events-auto">
            {locale === "da"
              ? "Se hurtigt, hvor og hvornår lokale loppemarkeder sker, og gå direkte efter byens bedste fund."
              : "See at a glance where and when local flea markets happen, then head straight for the city's best finds."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 pointer-events-auto">
            <GetStartedButton href={`/${locale}/markets`}>
              {locale === "da" ? "Udforsk markeder" : "Explore markets"}
            </GetStartedButton>
            <Button asChild size="lg" variant="soft">
              <Link href={`/${locale}/dashboard?series=new`}>
                {locale === "da" ? "Tilføj et marked" : "Add a market"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mixed Markets Grid */}
      <section className="space-y-8">
        <div className="flex items-end justify-between border-b border-[var(--line)] pb-4">
          <h2 className="font-display text-2xl text-[var(--accent)]">
            {locale === "da" ? "Kommende markeder" : "Upcoming markets"}
          </h2>
          <Link
            href={`/${locale}/markets`}
            className="group inline-flex items-center gap-1 text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors"
          >
            {locale === "da" ? "Se alle" : "View all"}
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1" aria-hidden>
              →
            </span>
          </Link>
        </div>

        {liveMarkets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {liveMarkets.map((market, i) => (
              <div
                key={market.id}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <MarketCard
                  locale={locale}
                  market={market}
                  featured={market.featured}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-[var(--line-subtle)] rounded-2xl bg-[var(--surface)]">
            <p className="text-[var(--ink-soft)]">
              {locale === "da"
                ? "Der er ingen publicerede markeder endnu."
                : "There are no published markets yet."}
            </p>
          </div>
        )}
      </section>

      {/* Minimal Footer CTA */}
      <section className="py-20 flex justify-center">
        <OrganizeMarketCTA locale={locale} />
      </section>
    </div>
  );
}

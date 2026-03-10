import Link from "next/link";

import { getExplorerSnapshot } from "@/lib/data";
import type { Locale } from "@/lib/types";
import { isLocale } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4";
import { GetStartedButton } from "@/components/ui/get-started-button";
import { MarketCard } from "@/components/market-card";
import {
  HomepageReveal,
  HomepageWordReveal,
} from "@/components/ui/homepage-reveal";
import { PixelTrailWrapper } from "@/components/pixel-trail-wrapper";
import { Typewriter } from "@/components/ui/typewriter";
import { OrganizeMarketCTA } from "@/components/organize-market-cta";

const HERO_LEAD_DELAY = 0.04;
const HERO_DYNAMIC_DELAY = 0.24;
const HERO_SUBTITLE_DELAY = 0.34;
const HERO_SUBTITLE_WORD_DELAY = 0.026;
const HERO_CTA_DELAY = 0.74;
const MARKETS_HEADING_DELAY = 0.06;
const MARKETS_GALLERY_DELAY = 0.06;
const FOOTER_CTA_DELAY = 0.08;

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const snapshot = await getExplorerSnapshot();
  const liveMarkets = snapshot.markets.slice(0, 6);
  const galleryItems: Gallery4Item[] = liveMarkets.map((market) => ({
    id: market.id,
    card: (
      <MarketCard
        locale={locale}
        market={market}
        featured={market.featured}
      />
    ),
  }));

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
                <HomepageWordReveal
                  delay={HERO_LEAD_DELAY}
                  text={locale === "da" ? "Find 🩷" : "Find 🩷"}
                  wordDelay={0.08}
                  amount={0.65}
                />
              </span>
              <HomepageReveal
                className="inline-flex min-h-[1.1em] items-center justify-center text-[#feb9f2]"
                delay={HERO_DYNAMIC_DELAY}
                y={16}
              >
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
                  initialDelay={520}
                  speed={70}
                  className="justify-center whitespace-nowrap text-center text-[#feb9f2]"
                  waitTime={1500}
                  deleteSpeed={40}
                  cursorChar={"_"}
                />
              </HomepageReveal>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-[var(--ink-soft)] pointer-events-auto">
            <HomepageWordReveal
              className="text-balance"
              delay={HERO_SUBTITLE_DELAY}
              text={
                locale === "da"
                  ? "Se hurtigt, hvor og hvornår lokale loppemarkeder sker, og gå direkte efter byens bedste fund."
                  : "See at a glance where and when local flea markets happen, then head straight for the city's best finds."
              }
              wordDelay={HERO_SUBTITLE_WORD_DELAY}
              amount={0.45}
            />
          </p>

          <HomepageReveal
            className="flex flex-wrap items-center justify-center gap-4 pt-4 pointer-events-auto"
            delay={HERO_CTA_DELAY}
            y={20}
          >
            <GetStartedButton href={`/${locale}/markets`}>
              {locale === "da" ? "Udforsk markeder" : "Explore markets"}
            </GetStartedButton>
            <Button asChild size="lg" variant="soft">
              <Link href={`/${locale}/dashboard?series=new`}>
                {locale === "da" ? "Tilføj et marked" : "Add a market"}
              </Link>
            </Button>
          </HomepageReveal>
        </div>
      </section>

      {/* Curated Markets Gallery */}
      {galleryItems.length > 0 ? (
        <Gallery4
          title={locale === "da" ? "Kommende markeder" : "Upcoming markets"}
          items={galleryItems}
          viewAllHref={`/${locale}/markets`}
          viewAllLabel={locale === "da" ? "Se alle" : "View all"}
          baseDelay={MARKETS_GALLERY_DELAY}
        />
      ) : (
        <HomepageReveal
          className="rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface)] py-20 text-center"
          delay={MARKETS_HEADING_DELAY}
        >
          <p className="text-[var(--ink-soft)]">
            {locale === "da"
              ? "Der er ingen publicerede markeder endnu."
              : "There are no published markets yet."}
          </p>
        </HomepageReveal>
      )}

      {/* Minimal Footer CTA */}
      <section className="py-20 flex justify-center">
        <HomepageReveal delay={FOOTER_CTA_DELAY} y={24}>
          <OrganizeMarketCTA locale={locale} />
        </HomepageReveal>
      </section>
    </div>
  );
}

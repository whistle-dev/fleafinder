import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import { saveMarketSeriesAction } from "@/lib/actions";
import { buildMarketDraft, getOrganizerWorkspace } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/session";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, getNextOccurrence, isLocale } from "@/lib/utils";

import { MarketForm } from "@/components/market-form";
import { StatusPill } from "@/components/status-pill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: localeParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const dictionary = getDictionary(locale);
  const profile = await getCurrentProfile();
  const notice = typeof resolvedSearchParams.notice === "string" ? resolvedSearchParams.notice : "";

  if (!profile) {
    return (
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="gap-4">
          <Badge>{dictionary.dashboard.title}</Badge>
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-[0.95] tracking-[-0.06em] text-[var(--ink)]">
              {dictionary.dashboard.title}
            </h1>
            <p className="text-base leading-7 text-[var(--ink-soft)]">{dictionary.dashboard.noSession}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href={`/${locale}/sign-in`}>{dictionary.navigation.signIn}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const workspace = await getOrganizerWorkspace(profile);
  const selectedSlug = typeof resolvedSearchParams.series === "string" ? resolvedSearchParams.series : "";
  const selectedMarket =
    workspace.markets.find((market) => market.slug === selectedSlug) ??
    (workspace.markets[0] as MarketSeries | undefined) ??
    buildMarketDraft({ organizerId: profile.id, contactEmail: profile.email });

  const publishedCount = workspace.markets.filter((market) => market.status === "published").length;
  const pendingCount = workspace.markets.filter((market) => market.status === "pending_review").length;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="gap-4">
          <Badge>{profile.displayName}</Badge>
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-[0.95] tracking-[-0.06em] text-[var(--ink)]">
              {dictionary.dashboard.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)]">{dictionary.dashboard.intro}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{locale === "da" ? "Markeder" : "Markets"}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{workspace.markets.length}</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{locale === "da" ? "Live" : "Live"}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{publishedCount}</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{locale === "da" ? "Afventer" : "Pending"}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{pendingCount}</div>
          </div>
        </CardContent>
      </Card>

      {notice ? (
        <div className="rounded-2xl border border-[rgba(228,116,57,0.22)] bg-[rgba(228,116,57,0.08)] px-4 py-3 text-sm text-[#8e4c29]">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card>
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-2">
                  <Badge>{dictionary.dashboard.yourMarkets}</Badge>
                  <CardTitle>{dictionary.dashboard.yourMarkets}</CardTitle>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/${locale}/dashboard`}>
                    <Plus />
                    {dictionary.dashboard.newMarket}
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.markets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--line)] px-4 py-5 text-sm leading-6 text-[var(--ink-soft)]">
                  {dictionary.dashboard.noMarkets}
                </div>
              ) : null}

              {workspace.markets.map((market) => {
                const nextOccurrence = getNextOccurrence(market.occurrences);
                const isSelected = selectedMarket.slug === market.slug;

                return (
                  <Link
                    className={`block rounded-2xl border px-4 py-4 transition-colors ${
                      isSelected ? "border-[rgba(31,93,85,0.22)] bg-[rgba(31,93,85,0.08)]" : "border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-muted)]"
                    }`}
                    href={`/${locale}/dashboard?series=${market.slug}`}
                    key={market.id}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-display text-[1.25rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
                          {market.title || dictionary.dashboard.newMarket}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                          <CalendarDays className="size-4" />
                          <span>{nextOccurrence ? formatDate(nextOccurrence.startAt, locale) : locale === "da" ? "Ingen datoer" : "No dates"}</span>
                        </div>
                      </div>
                      <StatusPill locale={locale} status={market.status} />
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-3">
              <Badge>{dictionary.dashboard.latestRevision}</Badge>
              <CardTitle>{dictionary.dashboard.latestRevision}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workspace.revisions.length > 0 ? (
                workspace.revisions.map((revision) => (
                  <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4" key={revision.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-display text-[1.1rem] leading-none tracking-[-0.04em] text-[var(--ink)]">
                          {revision.payload.title}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{revision.payload.addressLine}</p>
                      </div>
                      <StatusPill locale={locale} status={revision.status} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--ink-soft)]">
                  {locale === "da"
                    ? "Når du sender ændringer til et live marked, vises de her."
                    : "When you submit changes to a live market, they will appear here."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-2">
                <Badge>{locale === "da" ? "Editor" : "Editor"}</Badge>
                <CardTitle>{selectedMarket.title || dictionary.dashboard.newMarket}</CardTitle>
              </div>
              <StatusPill locale={locale} status={selectedMarket.status} />
            </div>
          </CardHeader>
          <CardContent>
            <MarketForm
              action={saveMarketSeriesAction}
              dictionary={dictionary.form}
              locale={locale}
              market={selectedMarket}
              returnTo={`/${locale}/dashboard`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

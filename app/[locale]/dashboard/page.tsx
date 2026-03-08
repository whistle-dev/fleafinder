import Link from "next/link";
import { ArrowLeft, CalendarDays, Edit2, Plus, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const selectedSlug = typeof resolvedSearchParams.series === "string" ? resolvedSearchParams.series : null;

  if (!profile) {
    if (selectedSlug) {
      redirect(`/${locale}/sign-in`);
    }

    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <h1 className="font-display text-4xl text-[var(--ink)] mb-4">{dictionary.dashboard.title}</h1>
        <p className="text-[var(--ink-soft)] mb-8">{dictionary.dashboard.noSession}</p>
        <Button asChild size="lg">
          <Link href={`/${locale}/sign-in`}>{dictionary.navigation.signIn}</Link>
        </Button>
      </div>
    );
  }

  const workspace = await getOrganizerWorkspace(profile);
  
  // Master-detail routing logic
  const isEditing = selectedSlug !== null;

  if (isEditing) {
    const selectedMarket =
      workspace.markets.find((market) => market.slug === selectedSlug) ??
      buildMarketDraft({ organizerId: profile.id, contactEmail: profile.email });

    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="-ml-4">
            <Link href={`/${locale}/dashboard`}>
              <ArrowLeft className="size-4" />
              {locale === "da" ? "Tilbage til oversigt" : "Back to overview"}
            </Link>
          </Button>
          <StatusPill locale={locale} status={selectedMarket.status} />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-display text-3xl text-[var(--ink)]">
            {selectedMarket.title || dictionary.dashboard.newMarket}
          </h1>
          <p className="text-[var(--ink-soft)]">
            {locale === "da" 
              ? "Udfyld detaljerne for dit marked nedenfor." 
              : "Fill in the details for your market below."}
          </p>
        </div>

        <MarketForm
          action={saveMarketSeriesAction}
          dictionary={dictionary.form}
          locale={locale}
          market={selectedMarket}
          returnTo={`/${locale}/dashboard`}
        />
      </div>
    );
  }

  const publishedCount = workspace.markets.filter((market) => market.status === "published").length;
  const pendingCount = workspace.markets.filter((market) => market.status === "pending_review").length;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header and Stats Combined */}
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="subtle" className="font-mono mb-2">{profile.email}</Badge>
            <h1 className="font-display text-4xl text-[var(--ink)] tracking-tight">
              {dictionary.dashboard.title}
            </h1>
            <p className="text-lg text-[var(--ink-soft)] max-w-xl">
              {locale === "da" ? "Administrer dine markeder og hold styr på ændringer." : "Manage your markets and keep track of changes."}
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0 mt-2 md:mt-0">
            <Link href={`/${locale}/dashboard?series=new`}>
              <Plus className="size-5" />
              {dictionary.dashboard.newMarket}
            </Link>
          </Button>
        </div>
        
        {/* Streamlined Stats Overview */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 py-6 border-y border-[var(--line-subtle)]">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4 py-6 border-y border-[var(--line-subtle)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-muted)]">{locale === "da" ? "Totalt" : "Total"}</div>
              <div className="font-display text-2xl text-[var(--ink)]">{workspace.markets.length}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-emerald-500/20 text-emerald-300">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-muted)]">{locale === "da" ? "Live" : "Live"}</div>
              <div className="font-display text-2xl text-[var(--ink)]">{publishedCount}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-full bg-amber-500/20 text-amber-300">
              <Clock className="size-5" />
            </div>
            <div>
              <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-muted)]">{locale === "da" ? "Afventer" : "Pending"}</div>
              <div className="font-display text-2xl text-[var(--ink)]">{pendingCount}</div>
            </div>
          </div>
        </div>
        </div>
      </header>

      {notice ? (
        <div className="rounded-xl border border-[var(--terracotta-soft)] bg-[var(--terracotta-soft)] px-5 py-4 text-sm font-medium text-[var(--terracotta)]">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-12 xl:grid-cols-[1fr_340px]">
        {/* Markets Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="font-display text-2xl text-[var(--ink)]">
              {dictionary.dashboard.yourMarkets}
            </h2>
          </div>

          {workspace.markets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-12 text-center">
              <p className="text-[var(--ink-soft)] mb-4">{dictionary.dashboard.noMarkets}</p>
              <Button asChild variant="outline">
                <Link href={`/${locale}/dashboard?series=new`}>
                  <Plus className="size-4" />
                  {dictionary.dashboard.newMarket}
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspace.markets.map((market) => {
                  const nextOccurrence = getNextOccurrence(market.occurrences);
                  return (
                    <TableRow key={market.id} className="group cursor-pointer">
                      <TableCell>
                        <Link href={`/${locale}/dashboard?series=${market.slug}`} className="block">
                          <div className="font-medium text-[var(--ink)] group-hover:text-[var(--ink-soft)] transition-colors">
                            {market.title || dictionary.dashboard.newMarket}
                          </div>
                          <div className="text-xs text-[var(--ink-muted)] line-clamp-1">{market.city}</div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusPill locale={locale} status={market.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                          {nextOccurrence ? (
                            <>
                              <CalendarDays className="size-3.5" />
                              <span>{formatDate(nextOccurrence.startAt, locale)}</span>
                            </>
                          ) : (
                            <span className="text-[var(--ink-muted)]">-</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/${locale}/dashboard?series=${market.slug}`}>
                            <Edit2 className="size-4" />
                            {locale === "da" ? "Rediger" : "Edit"}
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <h2 className="font-display text-2xl text-[var(--ink)]">
              {dictionary.dashboard.latestRevision}
            </h2>
          </div>

          <div className="relative before:absolute before:inset-y-0 before:left-3 before:w-px before:bg-[var(--line-strong)] space-y-6 pt-2">
            {workspace.revisions.length > 0 ? (
              workspace.revisions.map((revision) => (
                <div className="relative pl-8" key={revision.id}>
                  {/* Timeline Dot */}
                  <div className="absolute left-[-2px] top-1.5 w-7 h-7 rounded-full border-[6px] border-[var(--paper)] bg-[var(--ink)]" />
                  
                  {/* Revision Card */}
                  <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 hover:border-[var(--ink-muted)] transition-colors">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="font-medium text-sm text-[var(--ink)] line-clamp-1 pr-2">
                          {revision.payload.title}
                        </div>
                        <StatusPill locale={locale} status={revision.status} />
                      </div>
                      <div className="text-xs text-[var(--ink-muted)] line-clamp-1 flex items-center gap-1">
                        <ChevronRight className="size-3" />
                        {revision.payload.addressLine}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative pl-8">
                <div className="absolute left-[2px] top-2 w-5 h-5 rounded-full border-4 border-[var(--paper)] bg-[var(--line-strong)]" />
                <div className="text-sm text-[var(--ink-soft)] pt-1.5">
                  {locale === "da"
                    ? "Ingen historik endnu."
                    : "No revision history yet."}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

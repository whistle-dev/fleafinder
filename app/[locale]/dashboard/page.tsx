import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { saveMarketSeriesAction } from "@/lib/actions";
import { buildMarketDraft, getOrganizerWorkspace } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/session";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, getNextOccurrence, isLocale } from "@/lib/utils";

import { MarketForm } from "@/components/market-form";
import { StatusPill } from "@/components/status-pill";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-2xl text-center py-32 px-4">
        <h1 className="font-display text-5xl md:text-6xl text-[var(--ink)] mb-6 tracking-tight leading-none">{dictionary.dashboard.title}</h1>
        <p className="text-xl text-[var(--ink-muted)] mb-10 max-w-md mx-auto">{dictionary.dashboard.noSession}</p>
        <Link 
          href={`/${locale}/sign-in`}
          className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[var(--accent)] text-[var(--paper)] hover:bg-[var(--accent-dark)] transition-colors font-medium text-lg"
        >
          {dictionary.navigation.signIn}
        </Link>
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
    const editorPath = `/${locale}/dashboard?series=${selectedSlug}`;

    return (
      <div className="space-y-12 max-w-3xl mx-auto py-12 md:py-20">
        {notice ? (
          <div className="px-6 py-4 text-center text-sm font-medium text-[var(--ink)] bg-[var(--surface-elevated)] rounded-full inline-block">
            {notice}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <BackButton fallbackHref={`/${locale}/dashboard`} className="text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors bg-transparent border-0 shadow-none pl-0 hover:bg-transparent -ml-2">
            {locale === "da" ? "Tilbage til oversigt" : "Back to overview"}
          </BackButton>
          <StatusPill locale={locale} status={selectedMarket.status} />
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-7xl text-[var(--ink)] tracking-tight leading-none">
            {selectedMarket.title || dictionary.dashboard.newMarket}
          </h1>
          <p className="text-xl text-[var(--ink-muted)]">
            {locale === "da" 
              ? "Udfyld detaljerne for dit marked nedenfor." 
              : "Fill in the details for your market below."}
          </p>
        </div>

        <div className="pt-8 border-t border-[var(--line-subtle)]">
          <MarketForm
            action={saveMarketSeriesAction}
            dictionary={dictionary.form}
            locale={locale}
            market={selectedMarket}
            returnTo={editorPath}
          />
        </div>
      </div>
    );
  }

  const publishedCount = workspace.markets.filter((market) => market.status === "published").length;
  const pendingCount = workspace.markets.filter((market) => market.status === "pending_review").length;

  return (
    <div className="max-w-5xl mx-auto py-12 md:py-20 px-4 space-y-24">
      {notice ? (
        <div className="px-6 py-4 text-center text-sm font-medium text-[var(--ink)] bg-[var(--surface-elevated)] rounded-full inline-block mx-auto">
          {notice}
        </div>
      ) : null}

      {/* Editorial Header */}
      <header className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-[var(--line-strong)] text-[var(--accent)] text-sm font-mono tracking-wider">
              {profile.email}
            </div>
            <h1 className="font-display text-6xl md:text-8xl text-[var(--ink)] tracking-tight leading-none">
              {dictionary.dashboard.title}
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            {profile.role === "admin" && (
              <Link 
                href={`/${locale}/admin`}
                className="inline-flex items-center justify-center h-14 px-8 rounded-full border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all font-medium"
              >
                {dictionary.navigation.admin}
              </Link>
            )}
            <Link 
              href={`/${locale}/dashboard?series=new`}
              className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-[var(--accent)] text-[var(--paper)] hover:bg-[var(--accent-dark)] transition-colors font-medium"
            >
              <Plus className="size-5 mr-2" />
              {dictionary.dashboard.newMarket}
            </Link>
          </div>
        </div>
        
        {/* Clean typographic stats */}
        <div className="flex gap-12 md:gap-24 pt-10 border-t border-[var(--line-subtle)]">
          <div className="space-y-1">
            <p className="text-[var(--ink-muted)] text-sm uppercase tracking-widest">{locale === "da" ? "Totalt" : "Total"}</p>
            <p className="font-display text-4xl md:text-5xl text-[var(--ink)]">{workspace.markets.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--ink-muted)] text-sm uppercase tracking-widest">{locale === "da" ? "Live" : "Live"}</p>
            <p className="font-display text-4xl md:text-5xl text-[var(--ink)]">{publishedCount}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[var(--ink-muted)] text-sm uppercase tracking-widest">{locale === "da" ? "Afventer" : "Pending"}</p>
            <p className="font-display text-4xl md:text-5xl text-[var(--ink)]">{pendingCount}</p>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-16 lg:gap-24">
        {/* Markets List - Editorial Style */}
        <section>
          <h2 className="font-display text-4xl text-[var(--ink)] mb-8">
            {dictionary.dashboard.yourMarkets}
          </h2>

          {workspace.markets.length === 0 ? (
            <div className="py-16 border-t border-[var(--line-subtle)]">
              <p className="text-2xl text-[var(--ink-muted)] font-display mb-8">{dictionary.dashboard.noMarkets}</p>
              <Link 
                href={`/${locale}/dashboard?series=new`}
                className="inline-flex items-center text-[var(--accent)] hover:text-[var(--accent-dark)] font-medium text-lg transition-colors group"
              >
                {dictionary.dashboard.newMarket}
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col">
              {workspace.markets.map((market) => {
                const nextOccurrence = getNextOccurrence(market.occurrences);
                return (
                  <li key={market.id} className="border-t border-[var(--line-subtle)] group first:border-t-0">
                    <Link 
                      href={`/${locale}/dashboard?series=${market.slug}`} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-8 gap-4"
                    >
                      <div className="space-y-3 group-hover:translate-x-4 transition-transform duration-500 ease-out">
                        <h3 className="font-display text-3xl md:text-4xl text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors leading-none">
                          {market.title || dictionary.dashboard.newMarket}
                        </h3>
                        <div className="flex items-center gap-3 text-[var(--ink-muted)] text-sm md:text-base">
                          <span>{market.city || "Ingen by"}</span>
                          <span className="w-1 h-1 rounded-full bg-[var(--line-strong)]" />
                          <StatusPill locale={locale} status={market.status} />
                        </div>
                      </div>
                      
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 text-right">
                        {nextOccurrence ? (
                          <div className="text-[var(--ink)] font-mono text-sm md:text-base">
                            {formatDate(nextOccurrence.startAt, locale)}
                          </div>
                        ) : (
                          <div className="text-[var(--ink-muted)] italic text-sm md:text-base">
                            Ingen datoer
                          </div>
                        )}
                        <ArrowRight className="size-6 text-[var(--accent)] opacity-0 sm:-translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out hidden sm:block" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Minimalist Sidebar */}
        <aside>
          <h2 className="font-display text-2xl text-[var(--ink)] mb-8">
            {dictionary.dashboard.latestRevision}
          </h2>

          <div className="space-y-10 border-l border-[var(--line-strong)] pl-8">
            {workspace.revisions.length > 0 ? (
              workspace.revisions.map((revision) => (
                <div className="relative group" key={revision.id}>
                  {/* Subtle timeline marker */}
                  <div className="absolute -left-[37px] top-2 w-2 h-2 rounded-full bg-[var(--accent)] opacity-50 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300" />
                  
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-[var(--ink)] leading-snug group-hover:text-[var(--accent)] transition-colors">
                        {revision.payload.title || "Uden titel"}
                      </h4>
                    </div>
                    <p className="text-sm text-[var(--ink-muted)] leading-relaxed">
                      {revision.payload.addressLine || 'Ingen adresse'}
                    </p>
                    <div className="pt-2">
                      <StatusPill locale={locale} status={revision.status} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="relative">
                <div className="absolute -left-[37px] top-2 w-2 h-2 rounded-full bg-[var(--line-strong)]" />
                <p className="text-[var(--ink-muted)] italic">
                  {locale === "da"
                    ? "Ingen historik endnu."
                    : "No revision history yet."}
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

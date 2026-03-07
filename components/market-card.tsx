import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/constants";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, formatTimeRange, getNextOccurrence } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MarketCard({ locale, market, featured = false }: { locale: Locale; market: MarketSeries; featured?: boolean }) {
  const nextOccurrence = getNextOccurrence(market.occurrences);

  return (
    <Link href={`/${locale}/markets/${market.slug}`} className="block group">
      <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:border-[var(--ink-muted)] ${featured ? 'bg-[var(--paper-warm)]' : 'bg-[var(--surface)]'}`}>
        <CardHeader className="gap-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {featured && <Badge variant="solid">{locale === "da" ? "Udvalgt" : "Featured"}</Badge>}
                <Badge variant="default">{CATEGORY_LABELS[market.category][locale]}</Badge>
              </div>
              <CardTitle className="leading-snug group-hover:text-[var(--accent)] transition-colors">{market.title}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {nextOccurrence && (
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-2 text-[var(--ink)]">
                <CalendarDays className="size-4 text-[var(--ink-muted)]" />
                <span className="font-medium">{formatDate(nextOccurrence.startAt, locale)}</span>
              </div>
              <div className="pl-6 text-[var(--ink-soft)]">
                {formatTimeRange(nextOccurrence.startAt, nextOccurrence.endAt, locale)}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[var(--line-subtle)] flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2 text-[13px] text-[var(--ink-soft)]">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{market.city}</span>
            </div>
            <div className="flex items-center gap-1 text-[13px] font-medium text-[var(--ink)] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
              {locale === "da" ? "Se detaljer" : "View"}
              <ArrowRight className="size-3.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

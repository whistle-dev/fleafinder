import Link from "next/link";
import { Clock3 } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, formatTimeRange } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function buildCalendarCells(markets: MarketSeries[]) {
  const dates = markets.flatMap((market) =>
    market.occurrences.map((occurrence) => ({
      date: occurrence.startAt,
      marketSlug: market.slug,
      marketTitle: market.title,
      timeRange: [occurrence.startAt, occurrence.endAt] as const
    }))
  );

  const first = dates
    .map((item) => new Date(item.date))
    .slice()
    .sort((left, right) => left.getTime() - right.getTime())[0];

  const reference = first ?? new Date();
  const monthStart = new Date(reference.getFullYear(), reference.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - ((monthStart.getDay() + 6) % 7));

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);

    return {
      isoDate,
      day: date.getDate(),
      inMonth: date.getMonth() === reference.getMonth(),
      items: dates.filter((item) => item.date.slice(0, 10) === isoDate).slice(0, 2)
    };
  });
}

function buildUpcomingRows(markets: MarketSeries[]) {
  return markets
    .flatMap((market) =>
      market.occurrences.map((occurrence) => ({
        id: `${market.id}-${occurrence.id}`,
        slug: market.slug,
        title: market.title,
        startAt: occurrence.startAt,
        endAt: occurrence.endAt,
        city: market.city
      }))
    )
    .slice()
    .sort((left, right) => left.startAt.localeCompare(right.startAt))
    .slice(0, 10);
}

export function CalendarView({ locale, markets }: { locale: Locale; markets: MarketSeries[] }) {
  const cells = buildCalendarCells(markets);
  const upcomingRows = buildUpcomingRows(markets);
  const monthLabel = new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
    month: "long",
    year: "numeric"
  }).format(new Date(cells[10]?.isoDate ?? new Date().toISOString()));

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
      <Card>
        <CardHeader className="gap-3">
          <Badge>{locale === "da" ? "Kalender" : "Calendar"}</Badge>
          <CardTitle className="capitalize">{monthLabel}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="hidden grid-cols-7 gap-2 md:grid">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <div className="px-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]" key={`${day}-${index}`}>
                {locale === "da" ? ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"][index] : day}
              </div>
            ))}

            {cells.map((cell) => (
              <div
                className={cn(
                  "min-h-[7.5rem] rounded-2xl border p-3",
                  cell.inMonth ? "border-[var(--line)] bg-[var(--surface)]" : "border-[var(--line)] bg-[var(--surface-muted)] text-[var(--ink-muted)]"
                )}
                key={cell.isoDate}
              >
                <div className="mb-2 font-display text-[1.1rem] tracking-[-0.04em]">{cell.day}</div>
                <div className="space-y-2">
                  {cell.items.map((item) => (
                    <Link
                      className="block rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm leading-5 text-[var(--ink)] transition-colors hover:bg-[rgba(31,93,85,0.08)]"
                      href={`/${locale}/markets/${item.marketSlug}`}
                      key={`${item.marketSlug}-${item.date}`}
                    >
                      <strong className="block font-medium">{item.marketTitle}</strong>
                      <span className="text-[var(--ink-soft)]">{formatTimeRange(item.timeRange[0], item.timeRange[1], locale)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 md:hidden">
            {upcomingRows.map((item) => (
              <Link
                className="block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-muted)]"
                href={`/${locale}/markets/${item.slug}`}
                key={item.id}
              >
                <div className="font-display text-[1.3rem] leading-none tracking-[-0.04em] text-[var(--ink)]">{item.title}</div>
                <div className="mt-2 text-sm text-[var(--ink)]">{formatDate(item.startAt, locale)}</div>
                <div className="mt-1 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                  <Clock3 className="size-4" />
                  <span>{formatTimeRange(item.startAt, item.endAt, locale)}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader className="gap-3">
          <Badge>{locale === "da" ? "Næste" : "Next"}</Badge>
          <CardTitle>{locale === "da" ? "Kommende datoer" : "Upcoming dates"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingRows.map((item) => (
            <Link
              className="block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:bg-[var(--surface-muted)]"
              href={`/${locale}/markets/${item.slug}`}
              key={`${item.id}-aside`}
            >
              <div className="font-display text-[1.2rem] leading-none tracking-[-0.04em] text-[var(--ink)]">{item.title}</div>
              <div className="mt-2 text-sm text-[var(--ink)]">{formatDate(item.startAt, locale)}</div>
              <div className="mt-1 text-sm text-[var(--ink-soft)]">{formatTimeRange(item.startAt, item.endAt, locale)}</div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

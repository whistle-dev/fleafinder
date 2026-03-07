"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, formatTimeRange } from "@/lib/utils";
import { cn } from "@/lib/cn";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

type CalendarEntry = {
  id: string;
  slug: string;
  title: string;
  startAt: string;
  endAt: string;
  city: string;
  dayKey: string;
  dayDate: Date;
};

function toDayKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildEntries(markets: MarketSeries[]) {
  return markets
    .flatMap((market) =>
      market.occurrences.map((occurrence) => {
        const dayDate = new Date(occurrence.startAt);

        return {
          id: `${market.id}-${occurrence.id}`,
          slug: market.slug,
          title: market.title,
          startAt: occurrence.startAt,
          endAt: occurrence.endAt,
          city: market.city,
          dayKey: toDayKey(dayDate),
          dayDate
        } satisfies CalendarEntry;
      })
    )
    .filter((entry) => !Number.isNaN(entry.dayDate.getTime()))
    .sort((left, right) => left.startAt.localeCompare(right.startAt));
}

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildMonthCells(month: Date, eventsByDay: Map<string, CalendarEntry[]>) {
  const monthStart = getMonthStart(month);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - ((monthStart.getDay() + 6) % 7));

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dayKey = toDayKey(date);

    return {
      dayKey,
      date,
      dayNumber: date.getDate(),
      inMonth: date.getMonth() === month.getMonth(),
      entries: eventsByDay.get(dayKey) ?? []
    };
  });
}

function MarketPopover({
  entry,
  locale,
  compact = false
}: {
  entry: CalendarEntry;
  locale: Locale;
  compact?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full text-left transition-[background-color,border-color,box-shadow,color] duration-200 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] block group",
            compact
              ? "py-1 px-2 hover:bg-[var(--paper-warm)]"
              : "p-2 bg-[var(--surface)] border border-[var(--line-subtle)] hover:border-[var(--accent-soft)] hover:shadow-[0_2px_8px_rgba(74,89,76,0.06)]"
          )}
          type="button"
        >
          <div className="flex-1 min-w-0">
            <div className="truncate text-xs font-medium text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
              {entry.title}
            </div>
            {!compact && (
              <div className="mt-0.5 truncate text-[0.65rem] text-[var(--ink-soft)] flex items-center gap-1">
                <Clock3 className="size-3" />
                {formatTimeRange(entry.startAt, entry.endAt, locale)}
              </div>
            )}
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        sideOffset={6}
        className="w-72 p-0 overflow-hidden shadow-[0_12px_32px_rgba(31,29,26,0.08)] rounded-xl border border-[var(--line)] bg-[var(--surface)]"
      >
        <div className="p-4 space-y-3">
          <Badge variant="subtle" className="w-fit text-[0.65rem] font-medium px-2 py-0.5 h-auto">
            {locale === "da" ? "Marked" : "Market"}
          </Badge>
          <h4 className="font-display text-xl leading-tight text-[var(--ink)] tracking-tight">
            {entry.title}
          </h4>

          <div className="space-y-2 text-sm text-[var(--ink-soft)] pt-1">
            <div className="flex items-center gap-2.5">
              <Clock3 className="size-4 shrink-0 text-[var(--ink-muted)]" />
              <span>
                <span className="font-medium text-[var(--ink)]">{formatDate(entry.startAt, locale)}</span>
                {" · "}
                {formatTimeRange(entry.startAt, entry.endAt, locale)}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="size-4 shrink-0 text-[var(--ink-muted)]" />
              <span className="font-medium text-[var(--ink)]">{entry.city}</span>
            </div>
          </div>
        </div>
        <div className="p-2 bg-[var(--paper-warm)] border-t border-[var(--line-subtle)]">
          <Button asChild variant="ghost" className="w-full justify-between hover:bg-[var(--surface)] bg-transparent h-9 text-sm">
            <Link href={`/${locale}/markets/${entry.slug}`}>
              {locale === "da" ? "Se detaljer" : "View details"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DayOverflowPopover({
  dayLabel,
  entries,
  hiddenCount,
  locale
}: {
  dayLabel: string;
  entries: CalendarEntry[];
  hiddenCount: number;
  locale: Locale;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full py-0.5 px-2 text-left rounded-md transition-colors hover:bg-[var(--paper-warm)] text-[0.65rem] font-medium text-[var(--ink-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] hover:text-[var(--ink)] flex items-center gap-1 mt-0.5"
          type="button"
        >
          <span className="w-3 h-px bg-[var(--line-strong)]" />
          +{hiddenCount} {locale === "da" ? "mere" : "more"}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        sideOffset={6}
        className="w-[300px] p-0 overflow-hidden shadow-[0_12px_32px_rgba(31,29,26,0.08)] rounded-xl border border-[var(--line)] bg-[var(--surface)] flex flex-col"
      >
        <div className="px-4 py-3 border-b border-[var(--line-subtle)] bg-[var(--paper-warm)] flex items-center justify-between shrink-0">
          <div>
            <h4 className="font-display text-lg text-[var(--ink)] leading-none mb-1">
              {dayLabel}
            </h4>
            <p className="text-[0.7rem] text-[var(--ink-soft)]">
              {entries.length} {locale === "da" ? "markeder denne dag" : "markets this day"}
            </p>
          </div>
          <Badge variant="subtle" className="text-xs">{entries.length}</Badge>
        </div>
        <ScrollArea className="h-[280px]">
          <div className="flex flex-col gap-1.5 p-2">
            {entries.map((entry) => (
              <MarketPopover compact={false} entry={entry} key={entry.id} locale={locale} />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function CalendarView({ locale, markets }: { locale: Locale; markets: MarketSeries[] }) {
  const entries = buildEntries(markets);
  const firstEntryDate = entries[0]?.dayDate;
  const [visibleMonth, setVisibleMonth] = useState<Date>(getMonthStart(firstEntryDate ?? new Date()));

  useEffect(() => {
    if (firstEntryDate) {
      setVisibleMonth((current) => current ?? getMonthStart(firstEntryDate));
    }
  }, [firstEntryDate]);

  const eventsByDay = new Map<string, CalendarEntry[]>();
  for (const entry of entries) {
    const bucket = eventsByDay.get(entry.dayKey);
    if (bucket) {
      bucket.push(entry);
    } else {
      eventsByDay.set(entry.dayKey, [entry]);
    }
  }

  const cells = buildMonthCells(visibleMonth, eventsByDay);
  
  // Calculate the required number of rows so the calendar size adapts (hiding trailing empty rows)
  const reversedIndex = [...cells].reverse().findIndex((cell) => cell.inMonth);
  const lastInMonthIndex = reversedIndex >= 0 ? cells.length - 1 - reversedIndex : cells.length - 1;
  const cellsToShow = Math.ceil((lastInMonthIndex + 1) / 7) * 7;
  const visibleCells = cells.slice(0, cellsToShow);

  const visibleMonthEntries = entries.filter(
    (entry) =>
      entry.dayDate.getMonth() === visibleMonth.getMonth() &&
      entry.dayDate.getFullYear() === visibleMonth.getFullYear()
  );
  
  const activeDayCount = cells.filter((cell) => cell.inMonth && cell.entries.length > 0).length;
  
  const monthFormatter = new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
    month: "long",
    year: "numeric"
  });
  const monthParts = monthFormatter.formatToParts(visibleMonth);
  const monthName = monthParts.find(p => p.type === "month")?.value ?? "";
  const yearName = monthParts.find(p => p.type === "year")?.value ?? "";

  const weekdayLabels = locale === "da" ? ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const visibleMonthEntriesByDay = new Map<string, CalendarEntry[]>();
  for (const entry of visibleMonthEntries) {
    const bucket = visibleMonthEntriesByDay.get(entry.dayKey);
    if (bucket) {
      bucket.push(entry);
    } else {
      visibleMonthEntriesByDay.set(entry.dayKey, [entry]);
    }
  }
  
  // Sort days for agenda view
  const mobileAgendaDays = Array.from(visibleMonthEntriesByDay.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return (
    <div className="relative isolate">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute -inset-x-10 -inset-y-10 z-[-1] bg-[radial-gradient(ellipse_at_top,var(--paper-cream),transparent_60%)] opacity-70" />

      <div className="relative flex flex-col gap-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={visibleMonth.toISOString()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-1"
            >
              <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[0.9] tracking-[-0.03em] text-[var(--ink)] capitalize">
                {monthName}
                <span className="block text-[clamp(1.25rem,3vw,1.75rem)] text-[var(--ink-muted)] mt-1 opacity-70">
                  {yearName}
                </span>
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Stats pill - Desktop only */}
            <div className="hidden sm:flex items-center gap-6 rounded-full bg-[rgba(255,255,255,0.6)] backdrop-blur-md px-6 py-2 border border-[var(--line-subtle)]">
              <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  {locale === "da" ? "Aktive dage" : "Active Days"}
                </span>
                <span className="font-display text-[1.4rem] leading-none text-[var(--ink)] mt-0.5">{activeDayCount}</span>
              </div>
              <div className="h-8 w-px bg-[var(--line-subtle)]" />
              <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[var(--ink-muted)]">
                  {locale === "da" ? "Markeder" : "Markets"}
                </span>
                <span className="font-display text-[1.4rem] leading-none text-[var(--ink)] mt-0.5">{visibleMonthEntries.length}</span>
              </div>
            </div>

            {/* Nav pill */}
            <div className="flex items-center gap-1 rounded-full bg-[rgba(255,255,255,0.7)] backdrop-blur-md p-1 border border-[var(--line-subtle)]">
              <Button
                onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                size="icon"
                variant="ghost"
                className="rounded-full"
                type="button"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                onClick={() => setVisibleMonth(getMonthStart(new Date()))}
                variant="ghost"
                className="rounded-full font-medium"
                type="button"
              >
                {locale === "da" ? "I dag" : "Today"}
              </Button>
              <Button
                onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                size="icon"
                variant="ghost"
                className="rounded-full"
                type="button"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* DESKTOP GRID */}
        <div className="hidden lg:block rounded-3xl bg-[rgba(255,255,255,0.6)] backdrop-blur-2xl border border-[var(--line-subtle)] p-6 shadow-sm">
          <div className="grid grid-cols-7 gap-x-3 gap-y-3">
            {/* Weekdays */}
            {weekdayLabels.map((label) => (
              <div
                className="pb-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--ink-muted)] border-b border-[var(--line-subtle)]"
                key={label}
              >
                {label}
              </div>
            ))}

            {/* Days */}
            {visibleCells.map((cell) => {
              const dayLabel = new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long"
              }).format(cell.date);

              const hasEntries = cell.entries.length > 0;
              const isCurrentMonth = cell.inMonth;

              if (!isCurrentMonth) {
                return <div key={cell.dayKey} className="min-h-[110px] p-2" />;
              }

              return (
                <div
                  className={cn(
                    "relative min-h-[110px] p-2 flex flex-col gap-1.5 rounded-2xl transition-[background-color] duration-200",
                    hasEntries 
                      ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-[var(--line-subtle)]" 
                      : "border border-transparent hover:bg-white/40"
                  )}
                  key={cell.dayKey}
                >
                  {/* Day Header */}
                  <div className="flex justify-between items-start px-1 pt-0.5 mb-1">
                    <span
                      className={cn(
                        "font-display text-lg leading-none",
                        hasEntries ? "text-[var(--ink)]" : "text-[var(--ink-muted)]"
                      )}
                    >
                      {cell.dayNumber}
                    </span>
                    {hasEntries && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1" />
                    )}
                  </div>

                  {/* Entries */}
                  {hasEntries ? (
                    <div className="flex-1 space-y-1">
                      {cell.entries.slice(0, 2).map((entry) => (
                        <MarketPopover compact entry={entry} key={entry.id} locale={locale} />
                      ))}
                      {cell.entries.length > 2 && (
                        <DayOverflowPopover
                          dayLabel={dayLabel}
                          entries={cell.entries}
                          hiddenCount={cell.entries.length - 2}
                          locale={locale}
                        />
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE AGENDA (Timeline View) */}
        <div className="lg:hidden relative pl-4 pb-8">
          {mobileAgendaDays.length > 0 ? (
            <>
              {/* Timeline Line */}
              <div className="absolute left-[23px] top-6 bottom-4 w-[2px] bg-gradient-to-b from-[var(--line-strong)] via-[var(--line-subtle)] to-transparent" />

              <div className="space-y-12">
                {mobileAgendaDays.map(([dayKey, dayEntries], index) => {
                  const dayDate = dayEntries[0].dayDate;
                  const dayLabel = new Intl.DateTimeFormat(locale === "da" ? "da-DK" : "en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                  }).format(dayDate);

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: index * 0.05, duration: 0.5 }}
                      key={dayKey}
                      className="relative"
                    >
                      {/* Timeline Node */}
                      <div className="absolute left-[18px] top-[10px] w-3 h-3 rounded-full bg-[var(--surface)] border-[3px] border-[var(--accent)] z-10 shadow-[0_0_0_4px_var(--paper)]" />

                      <div className="pl-10 pr-2">
                        <h3 className="font-display text-[1.6rem] mb-4 text-[var(--ink)] capitalize tracking-[-0.02em] leading-tight">
                          {dayLabel}
                        </h3>
                        <div className="flex flex-col gap-3">
                          {dayEntries.map((entry) => (
                            <Link
                              href={`/${locale}/markets/${entry.slug}`}
                              key={`mobile-${entry.id}`}
                              className="group block rounded-2xl bg-[var(--surface)] p-4 shadow-sm border border-[var(--line-subtle)] transition-[background-color,border-color,box-shadow,color,transform] duration-200 hover:border-[var(--line-strong)] hover:shadow-md hover:-translate-y-0.5"
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                  <div className="font-medium text-base text-[var(--ink)]">
                                    {entry.title}
                                  </div>
                                  <div className="mt-2 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                                    <Clock3 className="size-3.5" />
                                    {formatTimeRange(entry.startAt, entry.endAt, locale)}
                                  </div>
                                  <div className="mt-1 flex items-center gap-2 text-sm text-[var(--ink-soft)]">
                                    <MapPin className="size-3.5" />
                                    {entry.city}
                                  </div>
                                </div>
                                <div className="flex size-8 items-center justify-center rounded-full bg-[var(--paper-warm)] text-[var(--ink)] transition-colors group-hover:bg-[var(--accent)] group-hover:text-[var(--paper)] shrink-0">
                                  <ArrowRight className="size-3.5" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-[rgba(255,255,255,0.4)] p-10 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[var(--surface)] shadow-sm border border-[var(--line-subtle)] text-[var(--ink-muted)]">
                <CalendarDays className="size-5" />
              </div>
              <div className="mt-4 font-display text-xl text-[var(--ink)]">
                {locale === "da" ? "Ingen markeder i denne måned" : "No markets in this month"}
              </div>
              <p className="mt-2 text-[var(--ink-soft)] text-sm">
                {locale === "da" ? "Prøv at navigere til en anden måned for at finde flere markeder." : "Try navigating to another month to find more markets."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
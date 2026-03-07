"use client";

import { CalendarDays, List, MapPinned, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { ExplorerFilters, ExplorerSnapshot, Locale } from "@/lib/types";
import { buildQueryString } from "@/lib/utils";

import { CalendarView } from "@/components/calendar-view";
import { MarketCard } from "@/components/market-card";
import { MarketMap } from "@/components/market-map";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ExplorerClientProps = {
  locale: Locale;
  dictionary: {
    title: string;
    intro: string;
    searchLabel: string;
    searchPlaceholder: string;
    category: string;
    when: string;
    view: string;
    list: string;
    map: string;
    calendar: string;
    allCategories: string;
    today: string;
    upcoming: string;
    allDates: string;
    empty: string;
    mobileHint: string;
    offline: string;
  };
  initialSnapshot: ExplorerSnapshot;
};

function ViewButton({
  active,
  icon: Icon,
  label,
  onClick,
  id
}: {
  active: boolean;
  icon: typeof List;
  label: string;
  onClick: () => void;
  id: string;
}) {
  return (
    <button
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-colors z-10 cursor-pointer",
        active 
          ? "text-[var(--surface)]" 
          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
      )}
      onClick={onClick}
      type="button"
    >
      {active && (
        <motion.div
          layoutId="view-toggle"
          className="absolute inset-0 bg-[var(--ink)] rounded-full -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <Icon className="size-4" />
      <span>{label}</span>
    </button>
  );
}

export function ExplorerClient({ locale, dictionary, initialSnapshot }: ExplorerClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState<ExplorerFilters>(initialSnapshot.filters);
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(filters.q);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const onOffline = () => setIsOffline(true);
    const onOnline = () => setIsOffline(false);
    window.addEventListener("offline", onOffline);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("offline", onOffline);
      window.removeEventListener("online", onOnline);
    };
  }, []);

  useEffect(() => {
    const nextFilters = { ...filters, q: deferredQuery };
    const query = buildQueryString(nextFilters);
    const nextUrl = `${pathname}${query ? `?${query}` : ""}`;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/explorer?locale=${locale}&${query}`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as ExplorerSnapshot;
        setSnapshot(data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [deferredQuery, filters.category, filters.date, filters.view, locale, pathname, router]);

  return (
    <div className="space-y-10">
      {/* Elegant Header */}
      <div className="space-y-4 max-w-3xl">
        <h1 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-[-0.02em] text-[var(--ink)]">
          {dictionary.title}
        </h1>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">{dictionary.intro}</p>
      </div>
      
      {/* Minimalist Filters */}
      <div className="rounded-[var(--radius-xl)] bg-[var(--surface)] border border-[var(--line)] p-2 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--ink-muted)]" />
            <Input
              className="h-11 pl-10 border-0 shadow-none bg-transparent focus-visible:ring-0 placeholder:text-[var(--ink-muted)] text-[var(--ink)] font-medium"
              onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
              placeholder={dictionary.searchPlaceholder}
              type="search"
              value={filters.q}
            />
          </div>

          <div className="hidden md:block w-px h-6 bg-[var(--line)]" />

          {/* Selects */}
          <div className="flex items-center gap-2">
            <Select
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  category: value as ExplorerFilters["category"]
                }))
              }
              value={filters.category}
            >
              <SelectTrigger className="h-11 w-auto min-w-[140px] border-0 shadow-none bg-transparent hover:bg-[var(--paper-warm)] rounded-lg font-medium">
                <SelectValue placeholder={dictionary.category} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{dictionary.allCategories}</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                setFilters((current) => ({
                  ...current,
                  date: value as ExplorerFilters["date"]
                }))
              }
              value={filters.date}
            >
              <SelectTrigger className="h-11 w-auto min-w-[130px] border-0 shadow-none bg-transparent hover:bg-[var(--paper-warm)] rounded-lg font-medium">
                <SelectValue placeholder={dictionary.when} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{dictionary.today}</SelectItem>
                <SelectItem value="upcoming">{dictionary.upcoming}</SelectItem>
                <SelectItem value="all">{dictionary.allDates}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* View Toggle & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
        <div className="flex items-center gap-1 bg-[var(--paper-cream)] p-1 rounded-full border border-[var(--line-subtle)]">
          <ViewButton id="list" active={filters.view === "list"} icon={List} label={dictionary.list} onClick={() => setFilters((current) => ({ ...current, view: "list" }))} />
          <ViewButton id="map" active={filters.view === "map"} icon={MapPinned} label={dictionary.map} onClick={() => setFilters((current) => ({ ...current, view: "map" }))} />
          <ViewButton id="calendar" active={filters.view === "calendar"} icon={CalendarDays} label={dictionary.calendar} onClick={() => setFilters((current) => ({ ...current, view: "calendar" }))} />
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-[var(--ink-soft)]">
          {isLoading ? (
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]"></span>
          ) : (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--line-strong)]"></span>
          )}
          <span>{snapshot.markets.length} {locale === "da" ? "fundet" : "found"}</span>
        </div>
      </div>

      {/* Offline notice */}
      {isOffline ? (
        <div className="rounded-xl border border-[var(--terracotta-soft)] bg-[var(--terracotta-soft)] px-5 py-3.5 text-sm font-medium text-[var(--terracotta)]">
          {dictionary.offline}
        </div>
      ) : null}

      {/* Views */}
      <div className="min-h-[50vh]">
        {filters.view === "list" ? (
          snapshot.markets.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {snapshot.markets.map((market, i) => (
                <motion.div
                  key={market.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.4 }}
                >
                  <MarketCard locale={locale} market={market} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--paper-cream)] text-[var(--ink-muted)]">
                <Search className="size-5" />
              </div>
              <h3 className="font-display text-xl text-[var(--ink)] mb-2">
                {locale === "da" ? "Ingen markeder fundet" : "No markets found"}
              </h3>
              <p className="text-[var(--ink-soft)]">{dictionary.empty}</p>
            </div>
          )
        ) : null}

        {filters.view === "map" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[600px] rounded-[var(--radius-xl)] overflow-hidden border border-[var(--line)] shadow-sm"
          >
            <MarketMap locale={locale} markets={snapshot.markets} />
          </motion.div>
        ) : null}
        {filters.view === "calendar" ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CalendarView locale={locale} markets={snapshot.markets} />
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}

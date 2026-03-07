"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";
import { motion } from "framer-motion";

import { alternateLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function onSwitch(nextLocale: string) {
    if (nextLocale === locale) return;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const nextPath = `${segments.join("/")}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.replace(nextPath);
    });
  }

  return (
    <div className="flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)] p-1 shadow-sm">
      {(['da', 'en'] as const).map((l) => {
        const isActive = locale === l;
        return (
          <button
            key={l}
            onClick={() => onSwitch(l)}
            className={cn(
              "relative px-3 py-1 text-[11px] uppercase tracking-[0.1em] font-medium rounded-full transition-colors z-10 cursor-pointer",
              isActive ? "text-[var(--surface)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
            )}
            type="button"
          >
            {isActive && (
              <motion.div
                layoutId="locale-toggle"
                className="absolute inset-0 bg-[var(--ink)] rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {l}
          </button>
        )
      })}
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Locale } from "@/lib/types";
import { cn } from "@/lib/cn";

export function LocaleSwitcher({ locale, id = "default", size = "sm" }: { locale: Locale, id?: string, size?: "sm" | "lg" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState(locale);

  useEffect(() => {
    setActiveLocale(locale);
  }, [locale]);

  function onSwitch(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const nextPath = `${segments.join("/")}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

    setActiveLocale(nextLocale);
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.replace(nextPath);
    });
  }

  return (
    <div className="inline-flex items-center gap-1">
      {(['da', 'en'] as const).map((l) => {
        const isActive = activeLocale === l;
        return (
          <button
            key={l}
            onClick={(e) => {
              e.preventDefault();
              onSwitch(l);
            }}
            className={cn(
              "relative uppercase font-medium rounded-md transition-colors z-10 cursor-pointer touch-manipulation",
              size === "lg" ? "px-4 py-2 text-sm tracking-wider" : "px-3 py-1 text-[11px] tracking-[0.1em]",
              isActive ? "text-[#335405]" : "text-[var(--ink-soft)] hover:text-[var(--accent)]",
            )}
            type="button"
          >
            {isActive && (
              <motion.div
                layoutId={`locale-toggle-${id}`}
                className="absolute inset-0 bg-[var(--accent)] rounded-md -z-10"
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

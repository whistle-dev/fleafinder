import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { signOutAction } from "@/lib/actions";
import type { Locale, Profile } from "@/lib/types";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";

export function SiteChrome({
  locale,
  dictionary,
  profile,
  children
}: {
  locale: Locale;
  dictionary: {
    navigation: {
      explore: string;
      addMarket: string;
      admin: string;
      dashboard: string;
      signIn: string;
      signOut: string;
    };
    common: {
      poweredBy: string;
    };
  };
  profile: Profile | null;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 md:px-8 pb-10">
      <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col">
        <header className="py-8 mb-4">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <Link href={`/${locale}`} className="group inline-block">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 group-hover:scale-105 transition-transform duration-300">
                    <Image 
                      src="/flea-logo.png" 
                      alt="FleaFinder Logo" 
                      fill 
                      className="object-contain"
                    />
                  </div>
                  <span className="font-display font-bold text-[1.5rem] md:text-[2rem] leading-none tracking-[-0.02em] text-[var(--accent)] group-hover:opacity-80 transition-opacity">
                    FLEAFINDER
                  </span>
                </div>
              </Link>
            </div>

            <nav className="flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/markets`} className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors px-2 py-1">
                {dictionary.navigation.explore}
              </Link>
              
              {profile ? (
                <>
                  <Link href={`/${locale}/dashboard`} className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors px-2 py-1">
                    {dictionary.navigation.dashboard}
                  </Link>
                  {profile.role === "admin" && (
                    <Link href={`/${locale}/admin`} className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors px-2 py-1">
                      {dictionary.navigation.admin}
                    </Link>
                  )}
                  <form action={signOutAction} className="inline-block">
                    <input name="locale" type="hidden" value={locale} />
                    <button type="submit" className="text-sm font-medium text-[var(--ink-soft)] hover:text-[var(--accent)] transition-colors px-2 py-1 cursor-pointer">
                      {dictionary.navigation.signOut}
                    </button>
                  </form>
                </>
              ) : (
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <Link href={`/${locale}/dashboard?series=new`}>{dictionary.navigation.addMarket}</Link>
                </Button>
              )}
              
              <div className="pl-2 ml-2 border-l border-[var(--line)]">
                <Suspense
                  fallback={<div aria-hidden="true" className="h-8 w-[78px] rounded-full border border-[var(--line)] bg-[var(--surface)]" />}
                >
                  <LocaleSwitcher locale={locale} />
                </Suspense>
              </div>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-20 border-t border-[var(--line-subtle)] pt-8 pb-12">
          <div className="flex flex-col gap-4 text-sm text-[var(--ink-muted)] md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-[-0.02em] text-[var(--accent)]">FLEAFINDER</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
            <div className="flex gap-6">
              <Link className="hover:text-[var(--accent)] transition-colors" href={`/${locale}/markets`}>
                {dictionary.navigation.explore}
              </Link>
              <Link className="hover:text-[var(--accent)] transition-colors" href={`/${locale}/dashboard?series=new`}>
                {dictionary.navigation.addMarket}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

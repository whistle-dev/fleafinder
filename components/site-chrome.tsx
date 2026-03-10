import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { signOutAction } from "@/lib/actions";
import type { Locale, Profile } from "@/lib/types";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

import { Header } from "@/components/ui/header-2";

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
    <div className="pb-10">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        <Header
          logo={
            <Link href={`/${locale}`} className="group inline-block">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 md:w-10 md:h-10 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-[var(--accent)]" style={{ maskImage: "url('/flea-logo.png')", WebkitMaskImage: "url('/flea-logo.png')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} />
                </div>
                <span className="font-display font-bold text-[1.5rem] md:text-[2rem] leading-none tracking-[-0.02em] text-[var(--accent)] group-hover:opacity-80 transition-opacity">
                  FLEAFINDER
                </span>
              </div>
            </Link>
          }
          links={[
            { label: dictionary.navigation.explore, href: `/${locale}/markets` },
            ...(profile ? [
              { label: dictionary.navigation.dashboard, href: `/${locale}/dashboard` }
            ] : [])
          ]}
          actions={
            <div className="flex items-center gap-2">
              {profile ? (
                <form action={signOutAction} className="inline-block">
                  <input name="locale" type="hidden" value={locale} />
                  <Button type="submit" variant="ghost" className="text-sm font-medium">
                    {dictionary.navigation.signOut}
                  </Button>
                </form>
              ) : (
                <Button asChild variant="ghost">
                  <Link href={`/${locale}/dashboard?series=new`}>{dictionary.navigation.addMarket}</Link>
                </Button>
              )}
              <div className="pl-2 ml-2 border-l border-[var(--line)]">
                <Suspense
                  fallback={<div aria-hidden="true" className="h-8 w-[78px] rounded-full border border-[var(--line)] bg-[var(--surface)]" />}
                >
                  <LocaleSwitcher locale={locale} id="desktop" />
                </Suspense>
              </div>
            </div>
          }
          mobileActions={
            <div className="flex flex-col gap-y-3 w-full border-t border-[var(--line-strong)] pt-6 mt-2">
              {profile ? (
                <form action={signOutAction} className="w-full flex justify-end">
                  <input name="locale" type="hidden" value={locale} />
                  <button type="submit" className="inline-flex items-center justify-end text-3xl font-display tracking-tight h-auto py-3 px-4 hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)] transition-all duration-500 ease-out bg-transparent border-none text-[var(--ink)] cursor-pointer">
                    {dictionary.navigation.signOut}
                  </button>
                </form>
              ) : (
                <Link href={`/${locale}/dashboard?series=new`} className="inline-flex items-center justify-end text-3xl font-display tracking-tight h-auto py-3 px-4 hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)] transition-all duration-500 ease-out text-[var(--ink)]">
                  {dictionary.navigation.addMarket}
                </Link>
              )}
              <div className="mt-4 flex justify-end w-full px-4">
                <Suspense
                  fallback={<div aria-hidden="true" className="h-10 w-[100px] rounded-full border border-[var(--line)] bg-[var(--surface)]" />}
                >
                  <LocaleSwitcher locale={locale} id="mobile" size="lg" />
                </Suspense>
              </div>
            </div>
          }
        />

        <main className="flex-1 w-full max-w-[1200px] mx-auto px-5 md:px-8">{children}</main>

        <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
          <Footer locale={locale} dictionary={dictionary} />
        </div>
      </div>
    </div>
  );
}

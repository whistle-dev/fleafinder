import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { isLocale } from "@/lib/utils";

import { CredentialsForm } from "@/components/credentials-form";

export default async function SignInPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const dictionary = getDictionary(locale);

  return (
    <section className="mx-auto max-w-md pt-14 pb-16">
      <h1 className="sr-only">{dictionary.auth.title}</h1>

      <div className="relative">
        {/* Ambient accent shapes */}
        <div className="pointer-events-none absolute -left-10 -top-16 h-32 w-32 rounded-full bg-[var(--accent-soft)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-6 top-10 h-20 w-20 rounded-full border border-dashed border-[var(--line-subtle)] opacity-70" />

        {/* Header text with a bit more presence */}
        <div className="mb-8 text-center space-y-3">
          <p className="font-display text-xl sm:text-2xl tracking-tight text-[var(--accent)]">
            {locale === "da" ? "Arrangør-login" : "Organizer login"}
          </p>
          <p className="mx-auto max-w-sm text-xs sm:text-sm text-[var(--ink-soft)]">
            {locale === "da" ? "Log ind for at oprette og redigere markeder." : "Sign in to create and edit markets."}
          </p>
          <div className="mx-auto mt-2 h-px w-10 rounded-full bg-[var(--accent)]/60" />
        </div>

        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)]/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.20)] backdrop-blur-sm">
          <CredentialsForm dictionary={dictionary.auth} locale={locale} />
        </div>
      </div>
    </section>
  );
}

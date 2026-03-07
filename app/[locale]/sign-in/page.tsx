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
    <section className="mx-auto max-w-md space-y-10 pt-10">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl text-[var(--ink)]">
          {dictionary.auth.title}
        </h1>
        <p className="text-[var(--ink-soft)]">
          {dictionary.auth.intro}
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-sm">
        <CredentialsForm dictionary={dictionary.auth} locale={locale} />
      </div>
    </section>
  );
}

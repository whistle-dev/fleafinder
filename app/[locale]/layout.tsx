import { notFound } from "next/navigation";

import { getDictionary } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/session";
import { locales, type Locale } from "@/lib/types";
import { isLocale } from "@/lib/utils";

import { SiteChrome } from "@/components/site-chrome";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = getDictionary(locale);
  const profile = await getCurrentProfile();

  return (
    <SiteChrome dictionary={dictionary} locale={locale} profile={profile}>
      {children}
    </SiteChrome>
  );
}

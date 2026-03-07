import { getExplorerSnapshot } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { isLocale, serializeFilters } from "@/lib/utils";

import { ExplorerClient } from "@/components/explorer-client";

export default async function MarketsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: localeParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const dictionary = getDictionary(locale);
  const filters = serializeFilters(resolvedSearchParams);
  const snapshot = await getExplorerSnapshot(filters);

  return <ExplorerClient dictionary={dictionary.explorer} initialSnapshot={snapshot} locale={locale} />;
}

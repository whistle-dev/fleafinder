import type { MetadataRoute } from "next";

import { getSitemapEntries } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getSitemapEntries();
  const base = "https://fleafinder.app";
  const staticEntries: MetadataRoute.Sitemap = [
    "",
    "/da",
    "/en",
    "/da/markets",
    "/en/markets",
    "/da/sign-in",
    "/en/sign-in"
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date()
  }));

  return [
    ...staticEntries,
    ...slugs.flatMap((slug) => [
      {
        url: `${base}/da/markets/${slug}`,
        lastModified: new Date()
      },
      {
        url: `${base}/en/markets/${slug}`,
        lastModified: new Date()
      }
    ])
  ];
}

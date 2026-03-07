"use client";

import mapboxgl from "mapbox-gl";
import Link from "next/link";
import { MapPinned, WifiOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { COPENHAGEN_CENTER, COPENHAGEN_MAX_BOUNDS, isCopenhagenMarketLocation } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { mapboxToken } from "@/lib/supabase/config";
import type { Locale, MarketSeries } from "@/lib/types";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MarketMapProps = {
  locale: Locale;
  markets: MarketSeries[];
};

function MapFallback({
  locale,
  markets,
  reason
}: {
  locale: Locale;
  markets: MarketSeries[];
  reason: "offline" | "missing";
}) {
  const copy =
    locale === "da"
      ? {
          title: reason === "offline" ? "Kortet kræver netværk" : "Kortet mangler nøgle",
          body:
            reason === "offline"
              ? "Du kan stadig åbne markederne fra listen."
              : "Tilføj NEXT_PUBLIC_MAPBOX_TOKEN for at aktivere kortet.",
          badge: reason === "offline" ? "Offline" : "Setup"
        }
      : {
          title: reason === "offline" ? "The map needs a connection" : "The map needs a token",
          body:
            reason === "offline"
              ? "You can still open markets from the list."
              : "Add NEXT_PUBLIC_MAPBOX_TOKEN to enable the map.",
          badge: reason === "offline" ? "Offline" : "Setup"
        };

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge>{copy.badge}</Badge>
            <CardTitle>{copy.title}</CardTitle>
          </div>
          {reason === "offline" ? <WifiOff className="size-5 text-[var(--ink-muted)]" /> : <MapPinned className="size-5 text-[var(--ink-muted)]" />}
        </div>
        <p className="text-sm leading-6 text-[var(--ink-soft)]">{copy.body}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {markets.slice(0, 5).map((market) => (
          <Link
            className="block rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition-colors hover:bg-[var(--surface-muted)]"
            href={`/${locale}/markets/${market.slug}`}
            key={market.id}
          >
            <div className="font-display text-[1.2rem] leading-none tracking-[-0.04em] text-[var(--ink)]">{market.title}</div>
            <div className="mt-1 text-sm text-[var(--ink-soft)]">{market.addressLine}</div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export function MarketMap({ locale, markets }: MarketMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const visibleMarkets = markets.filter((market) =>
    isCopenhagenMarketLocation({
      city: market.city,
      latitude: market.latitude,
      longitude: market.longitude
    })
  );

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
    if (!mapRef.current || !mapboxToken || isOffline) {
      return;
    }

    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [COPENHAGEN_CENTER.longitude, COPENHAGEN_CENTER.latitude],
      zoom: COPENHAGEN_CENTER.zoom,
      minZoom: 10,
      maxZoom: 15.5,
      maxBounds: COPENHAGEN_MAX_BOUNDS,
      renderWorldCopies: false
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.touchZoomRotate.disableRotation();

    const bounds = new mapboxgl.LngLatBounds();

    const markers = visibleMarkets.map((market) => {
      const markerElement = document.createElement("button");
      markerElement.className = "map-marker";
      markerElement.type = "button";
      markerElement.innerHTML = `<span>${market.title.slice(0, 1)}</span>`;

      const popupNode = document.createElement("div");
      popupNode.className = "map-popup";

      const root = document.createElement("div");
      popupNode.appendChild(root);

      root.innerHTML = `
        <strong>${market.title}</strong>
        <span>${market.addressLine}</span>
        <span>${market.vibe}</span>
      `;

      const linkHolder = document.createElement("div");
      root.appendChild(linkHolder);

      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([market.longitude, market.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 18 }).setDOMContent(popupNode))
        .addTo(map);

      bounds.extend([market.longitude, market.latitude]);

      return { marker, linkHolder, slug: market.slug };
    });

    if (!bounds.isEmpty()) {
      if (visibleMarkets.length === 1) {
        map.setCenter([visibleMarkets[0].longitude, visibleMarkets[0].latitude]);
        map.setZoom(12.8);
      } else {
        map.fitBounds(bounds, {
          padding: 48,
          maxZoom: 12.8,
          duration: 0
        });
      }
    }

    markers.forEach(({ linkHolder, slug }) => {
      const anchor = document.createElement("a");
      anchor.href = `/${locale}/markets/${slug}`;
      anchor.className = "map-popup__link";
      anchor.innerText = locale === "da" ? "Se detaljer" : "View details";
      linkHolder.appendChild(anchor);
    });

    return () => {
      markers.forEach(({ marker }) => marker.remove());
      map.remove();
    };
  }, [isOffline, locale, markets]);

  if (!mapboxToken) {
    return <MapFallback locale={locale} markets={markets} reason="missing" />;
  }

  if (isOffline) {
    return <MapFallback locale={locale} markets={markets} reason="offline" />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-2">
            <Badge>{locale === "da" ? "Kort" : "Map"}</Badge>
            <CardTitle>{locale === "da" ? "København" : "Copenhagen"}</CardTitle>
          </div>
          <div className="text-sm text-[var(--ink-soft)]">
            {visibleMarkets.length} {locale === "da" ? "markeder" : "markets"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className={cn(
            "relative overflow-hidden rounded-b-[calc(var(--radius)+2px)] border-t border-[var(--line)] bg-[var(--surface-muted)]"
          )}
        >
          <div className="market-map" ref={mapRef} />
          {visibleMarkets.length === 0 ? (
            <div className="pointer-events-none absolute inset-x-6 bottom-6 rounded-2xl border border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-4 py-3 text-center text-sm leading-6 text-[var(--ink-soft)] backdrop-blur-sm">
              {locale === "da" ? "Ingen markeder matcher filtrene lige nu." : "No markets match the current filters."}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

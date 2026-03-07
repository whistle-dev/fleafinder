"use client";

import mapboxgl from "mapbox-gl";
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
  isActive?: boolean;
};

const MARKET_SOURCE_ID = "markets";
const MARKET_HALO_LAYER_ID = "markets-halo";
const MARKET_CIRCLE_LAYER_ID = "markets-circle";
const MARKET_LABEL_LAYER_ID = "markets-label";

function buildFeatureCollection(markets: MarketSeries[]) {
  return {
    type: "FeatureCollection" as const,
    features: markets.map((market) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [market.longitude, market.latitude] as [number, number]
      },
      properties: {
        id: market.id,
        title: market.title,
        letter: market.title.slice(0, 1).toUpperCase()
      }
    }))
  };
}

export function MarketMap({ locale, markets, isActive = true }: MarketMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const styleReadyRef = useRef(false);
  const visibleMarketsRef = useRef<MarketSeries[]>([]);
  const localeRef = useRef(locale);
  const [isOffline, setIsOffline] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
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
    visibleMarketsRef.current = visibleMarkets;
    localeRef.current = locale;
  }, [locale, visibleMarkets]);

  useEffect(() => {
    if (!mapRef.current || !mapboxToken || isOffline) {
      return;
    }

    if (mapInstanceRef.current) {
      return;
    }

    setIsMapReady(false);
    mapboxgl.accessToken = mapboxToken;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/standard",
      config: {
        basemap: {
          theme: "monochrome",
          lightPreset: "dawn",
          showPointOfInterestLabels: false,
          showRoadLabels: false,
          showTransitLabels: false
        }
      },
      center: [COPENHAGEN_CENTER.longitude, COPENHAGEN_CENTER.latitude],
      zoom: COPENHAGEN_CENTER.zoom,
      minZoom: 9.2,
      maxZoom: 15.5,
      maxBounds: COPENHAGEN_MAX_BOUNDS,
      renderWorldCopies: false
    });
    mapInstanceRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.touchZoomRotate.disableRotation();

    const popup = new mapboxgl.Popup({ closeButton: false, offset: 18 });
    popupRef.current = popup;

    const renderPopup = (market: MarketSeries, coordinates: [number, number]) => {
      const popupNode = document.createElement("div");
      popupNode.className = "map-popup";

      const root = document.createElement("div");
      root.className = "map-popup__inner";
      popupNode.appendChild(root);

      root.innerHTML = `
        <strong>${market.title}</strong>
        <span>${market.addressLine}</span>
        <span>${market.vibe}</span>
      `;

      const anchor = document.createElement("a");
      anchor.href = `/${localeRef.current}/markets/${market.slug}`;
      anchor.className = "map-popup__link";
      anchor.innerText = localeRef.current === "da" ? "Se detaljer" : "View details";
      root.appendChild(anchor);

      popup.setLngLat(coordinates).setDOMContent(popupNode).addTo(map);
    };

    const syncMapData = (shouldFitBounds: boolean) => {
      const source = map.getSource(MARKET_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;

      if (!source) {
        return;
      }

      source.setData(buildFeatureCollection(visibleMarketsRef.current));

      if (!shouldFitBounds) {
        return;
      }

      const bounds = new mapboxgl.LngLatBounds();
      visibleMarketsRef.current.forEach((market) => {
        bounds.extend([market.longitude, market.latitude]);
      });

      if (!bounds.isEmpty()) {
        if (visibleMarketsRef.current.length === 1) {
          map.setCenter([visibleMarketsRef.current[0].longitude, visibleMarketsRef.current[0].latitude]);
          map.setZoom(12.8);
        } else {
          map.fitBounds(bounds, {
            padding: 48,
            maxZoom: 12.8,
            duration: 0
          });
        }
      }
    };

    const handleLoad = () => {
      styleReadyRef.current = true;

      map.addSource(MARKET_SOURCE_ID, {
        type: "geojson",
        data: buildFeatureCollection(visibleMarketsRef.current)
      });

      map.addLayer({
        id: MARKET_HALO_LAYER_ID,
        type: "circle",
        source: MARKET_SOURCE_ID,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 12, 13, 16],
          "circle-color": "rgba(74, 89, 76, 0.12)",
          "circle-blur": 0.85
        }
      });

      map.addLayer({
        id: MARKET_CIRCLE_LAYER_ID,
        type: "circle",
        source: MARKET_SOURCE_ID,
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, 8, 13, 10],
          "circle-color": "#f8f4ec",
          "circle-stroke-color": "rgba(74, 89, 76, 0.24)",
          "circle-stroke-width": 1.5
        }
      });

      map.addLayer({
        id: MARKET_LABEL_LAYER_ID,
        type: "symbol",
        source: MARKET_SOURCE_ID,
        layout: {
          "text-field": ["get", "letter"],
          "text-size": ["interpolate", ["linear"], ["zoom"], 9, 10, 13, 12],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"]
        },
        paint: {
          "text-color": "#354237"
        }
      });
      syncMapData(true);

      map.on("click", MARKET_CIRCLE_LAYER_ID, handleMarkerClick);
      map.on("mouseenter", MARKET_CIRCLE_LAYER_ID, handlePointerEnter);
      map.on("mouseleave", MARKET_CIRCLE_LAYER_ID, handlePointerLeave);

      map.once("idle", () => {
        requestAnimationFrame(() => {
          map.resize();
          setIsMapReady(true);
        });
      });
    };

    const handleMarkerClick = (event: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      const feature = event.features?.[0];

      if (!feature || feature.geometry.type !== "Point") {
        return;
      }

      const market = visibleMarketsRef.current.find((entry) => entry.id === String(feature.properties?.id));

      if (!market) {
        return;
      }

      const coordinates = [...feature.geometry.coordinates] as [number, number];
      const targetZoom = Math.min(Math.max(map.getZoom() + 0.8, 13.2), 14.4);

      popup.remove();
      renderPopup(market, coordinates);
      map.easeTo({
        center: coordinates,
        zoom: targetZoom,
        duration: 550,
        essential: true
      });
    };

    const handlePointerEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };

    const handlePointerLeave = () => {
      map.getCanvas().style.cursor = "";
    };

    // Automatically resize map when its container resizes, fixing all render bugs
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    resizeObserverRef.current = resizeObserver;
    
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }

    map.on("load", handleLoad);

    return () => {
      popup.remove();
      resizeObserver.disconnect();
      setIsMapReady(false);
      styleReadyRef.current = false;
      popupRef.current = null;
      resizeObserverRef.current = null;
      mapInstanceRef.current = null;
      map.off("load", handleLoad);
      map.off("click", MARKET_CIRCLE_LAYER_ID, handleMarkerClick);
      map.off("mouseenter", MARKET_CIRCLE_LAYER_ID, handlePointerEnter);
      map.off("mouseleave", MARKET_CIRCLE_LAYER_ID, handlePointerLeave);
      map.remove();
    };
  }, [isOffline]);

  useEffect(() => {
    const map = mapInstanceRef.current;

    if (!map || !styleReadyRef.current) {
      return;
    }

    const source = map.getSource(MARKET_SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;

    if (!source) {
      return;
    }

    source.setData(buildFeatureCollection(visibleMarkets));

    if (popupRef.current?.isOpen()) {
      popupRef.current.remove();
    }

    const bounds = new mapboxgl.LngLatBounds();
    visibleMarkets.forEach((market) => {
      bounds.extend([market.longitude, market.latitude]);
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
  }, [visibleMarkets]);

  useEffect(() => {
    if (!isActive || !isMapReady) {
      return;
    }

    const map = mapInstanceRef.current;

    if (!map) {
      return;
    }

    requestAnimationFrame(() => {
      map.resize();
    });
  }, [isActive, isMapReady]);

  return (
    <div className={cn("relative w-full h-full min-h-[300px] bg-[var(--paper-warm)]", !mapboxToken && "p-6 flex flex-col items-center justify-center text-center border border-[var(--line)] rounded-2xl")}>
      {!mapboxToken || isOffline ? (
        <div className="max-w-md space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--ink-muted)] mb-2 shadow-sm border border-[var(--line-subtle)]">
            {isOffline ? <WifiOff className="size-5" /> : <MapPinned className="size-5" />}
          </div>
          <h3 className="font-display text-xl text-[var(--ink)]">
            {isOffline 
              ? (locale === "da" ? "Kortet kræver netværk" : "The map needs a connection")
              : (locale === "da" ? "Kortet mangler nøgle" : "The map needs a token")
            }
          </h3>
          <p className="text-[var(--ink-soft)] text-sm">
            {isOffline
              ? (locale === "da" ? "Du kan stadig åbne markederne fra listen." : "You can still open markets from the list.")
              : (locale === "da" ? "Tilføj NEXT_PUBLIC_MAPBOX_TOKEN for at aktivere kortet." : "Add NEXT_PUBLIC_MAPBOX_TOKEN to enable the map.")
            }
          </p>
        </div>
      ) : (
        <>
          <div
            className={cn(
              "absolute inset-0 z-0 h-full w-full transition-opacity duration-300",
              isMapReady ? "opacity-100" : "opacity-0"
            )}
            ref={mapRef}
          />
          {!isMapReady ? (
            <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(250,248,245,0.96),rgba(246,243,235,0.92))]">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[rgba(255,255,255,0.65)] to-transparent" />
              <div className="flex h-full items-center justify-center">
                <div className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)] shadow-sm">
                  {locale === "da" ? "Indlæser kort" : "Loading map"}
                </div>
              </div>
            </div>
          ) : null}
          {visibleMarkets.length === 0 ? (
            <div className="pointer-events-none absolute inset-x-6 bottom-6 z-10 rounded-xl border border-[var(--line-subtle)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-3 text-center text-sm font-medium text-[var(--ink-soft)] backdrop-blur-md shadow-sm">
              {locale === "da" ? "Ingen markeder fundet i området." : "No markets found in this area."}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

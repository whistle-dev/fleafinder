import { DEFAULT_LOCALE } from "@/lib/constants";
import type { Locale } from "@/lib/types";

export const LOCALES: Locale[] = ["da", "en"];
export { DEFAULT_LOCALE } from "@/lib/constants";

const dictionaries = {
  da: {
    navigation: {
      explore: "Udforsk",
      addMarket: "Tilføj marked",
      admin: "Admin",
      dashboard: "Dashboard",
      signIn: "Log ind",
      signOut: "Log ud"
    },
    home: {
      eyebrow: "Sommerens lommemarkeder i København",
      title: "En redigeret markeds-guide til byens små og store loppefund.",
      intro:
        "Flea Finder samler de markeder, der normalt går tabt i Instagram-stories og håndskrevne opslag. Brug kort, kalender og kuraterede anbefalinger på mobilen.",
      primaryCta: "Se markeder",
      secondaryCta: "Bliv arrangør",
      highlightTitle: "Denne uge i byen",
      highlightIntro: "Udvalgte markeder med stærk stemning, gode adresser og klare tidspunkter.",
      statsMarkets: "aktive markeder",
      statsToday: "i dag",
      statsUpcoming: "på vej",
      designLead: "City guide, ikke kedelig database",
      designBody:
        "Kortet, kalenderen og de små redaktionelle detaljer er lavet til hurtig browsing på telefonen, uden at føles generisk."
    },
    explorer: {
      title: "Markedskalender",
      intro: "Filtrér på stemning, dato og kvarter. Kort, liste og kalender bruger samme datasæt.",
      searchLabel: "Søg efter navn, adresse eller stemning",
      searchPlaceholder: "Nørrebro, vintage, skolegård…",
      category: "Kategori",
      when: "Hvornår",
      view: "Visning",
      list: "Liste",
      map: "Kort",
      calendar: "Kalender",
      allCategories: "Alle",
      today: "I dag",
      upcoming: "Kommende",
      allDates: "Alle datoer",
      empty: "Ingen markeder matcher filtrene lige nu.",
      mobileHint: "Installer appen for hurtig adgang på hjemskærmen.",
      offline: "Du er offline. Viser senest cachede markeder."
    },
    detail: {
      addToCalendar: "Tilføj til kalender",
      googleCalendar: "Google Kalender",
      address: "Adresse",
      nextDates: "Næste datoer",
      vibe: "Stemning",
      contact: "Kontakt",
      back: "Tilbage til markedskalender"
    },
    auth: {
      title: "Log ind",
      intro: "",
      email: "E-mail",
      password: "Password",
      signInButton: "Log ind",
      signUpButton: "Opret konto",
      signInNote: "",
      signUpNote: ""
    },
    dashboard: {
      title: "Arrangør-dashboard",
      intro: "Opret, redigér og send markeder til godkendelse direkte fra mobilen.",
      yourMarkets: "Dine markeder",
      newMarket: "Nyt marked",
      noMarkets: "Du har ingen markeder endnu.",
      noSession: "Log ind for at oprette og redigere dine markeder.",
      latestRevision: "Seneste revision"
    },
    admin: {
      title: "Moderationskø",
      intro: "Godkend nye markeder og ændringer, eller bed arrangøren om rettelser.",
      pendingSeries: "Nye markeder",
      pendingRevisions: "Ændringer på live markeder",
      noAccess: "Kun admins kan åbne denne side.",
      noItems: "Ingen elementer venter på handling."
    },
    form: {
      title: "Navn",
      description: "Beskrivelse",
      category: "Kategori",
      language: "Indholdssprog",
      contactEmail: "Kontakt e-mail",
      venueName: "Stednavn",
      addressLine: "Adresse",
      postalCode: "Postnummer",
      city: "By",
      vibe: "Kort stemningslinje",
      image: "Coverbillede",
      startDate: "Startdato",
      startTime: "Starttid",
      endTime: "Sluttid",
      repeatWeekly: "Gentag ugentligt",
      repeatCount: "Antal ekstra datoer",
      notes: "Admin-note",
      saveDraft: "Gem kladde",
      submit: "Send til godkendelse",
      update: "Gem ændringer",
      publish: "Godkend og publicér",
      requestChanges: "Bed om rettelser",
      archive: "Arkivér",
      helper:
        "Gentagne markeder oprettes som en serie med individuelle datoer. Du kan se preview, før du sender."
    },
    common: {
      install: "Installer app",
      unavailableOffline: "Kræver netværk",
      poweredBy: "Bygget til byens små loppemarkeder",
      openMap: "Åbn kort",
      viewDetails: "Se detaljer",
      published: "Live",
      pending: "Afventer",
      draft: "Kladde",
      archived: "Arkiveret"
    }
  },
  en: {
    navigation: {
      explore: "Explore",
      addMarket: "Add market",
      admin: "Admin",
      dashboard: "Dashboard",
      signIn: "Sign in",
      signOut: "Sign out"
    },
    home: {
      eyebrow: "Summer flea markets in Copenhagen",
      title: "An editorial market guide for the city's smallest and biggest vintage moments.",
      intro:
        "Flea Finder collects the markets that usually disappear into Instagram stories and handmade posters. Browse map, calendar, and curated recommendations on mobile.",
      primaryCta: "Browse markets",
      secondaryCta: "Become an organizer",
      highlightTitle: "This week in the city",
      highlightIntro: "Featured markets with strong atmosphere, exact addresses, and clear times.",
      statsMarkets: "active markets",
      statsToday: "today",
      statsUpcoming: "upcoming",
      designLead: "City guide, not a bland directory",
      designBody:
        "The map, calendar, and editorial details are built for quick mobile browsing without feeling generic."
    },
    explorer: {
      title: "Market calendar",
      intro: "Filter by mood, date, and neighborhood. List, map, and calendar stay in sync.",
      searchLabel: "Search by name, address, or vibe",
      searchPlaceholder: "Norrebro, vintage, school yard…",
      category: "Category",
      when: "When",
      view: "View",
      list: "List",
      map: "Map",
      calendar: "Calendar",
      allCategories: "All",
      today: "Today",
      upcoming: "Upcoming",
      allDates: "All dates",
      empty: "No markets match the current filters.",
      mobileHint: "Install the app for fast home-screen access.",
      offline: "You are offline. Showing the latest cached markets."
    },
    detail: {
      addToCalendar: "Add to calendar",
      googleCalendar: "Google Calendar",
      address: "Address",
      nextDates: "Upcoming dates",
      vibe: "Vibe",
      contact: "Contact",
      back: "Back to market calendar"
    },
    auth: {
      title: "Sign in",
      intro: "",
      email: "Email",
      password: "Password",
      signInButton: "Sign in",
      signUpButton: "Create account",
      signInNote: "",
      signUpNote: ""
    },
    dashboard: {
      title: "Organizer dashboard",
      intro: "Create, edit, and submit markets for review directly from your phone.",
      yourMarkets: "Your markets",
      newMarket: "New market",
      noMarkets: "You do not have any markets yet.",
      noSession: "Sign in to create and edit your markets.",
      latestRevision: "Latest revision"
    },
    admin: {
      title: "Moderation queue",
      intro: "Approve new markets and listing changes, or request edits from the organizer.",
      pendingSeries: "New listings",
      pendingRevisions: "Updates to live listings",
      noAccess: "Only admins can access this page.",
      noItems: "No items are waiting for review."
    },
    form: {
      title: "Title",
      description: "Description",
      category: "Category",
      language: "Content language",
      contactEmail: "Contact email",
      venueName: "Venue name",
      addressLine: "Address",
      postalCode: "Postal code",
      city: "City",
      vibe: "Short vibe line",
      image: "Cover image",
      startDate: "Start date",
      startTime: "Start time",
      endTime: "End time",
      repeatWeekly: "Repeat weekly",
      repeatCount: "Extra dates",
      notes: "Admin note",
      saveDraft: "Save draft",
      submit: "Submit for review",
      update: "Save changes",
      publish: "Approve and publish",
      requestChanges: "Request changes",
      archive: "Archive",
      helper:
        "Recurring markets are created as a series with individual dates. You can preview the generated schedule before sending."
    },
    common: {
      install: "Install app",
      unavailableOffline: "Needs network",
      poweredBy: "Built for the city's smaller flea markets",
      openMap: "Open map",
      viewDetails: "View details",
      published: "Live",
      pending: "Pending",
      draft: "Draft",
      archived: "Archived"
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}

export function localeFromHeader(acceptLanguage: string | null) {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const normalized = acceptLanguage.toLowerCase();

  if (normalized.includes("da")) {
    return "da";
  }

  if (normalized.includes("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "da" ? "en" : "da";
}

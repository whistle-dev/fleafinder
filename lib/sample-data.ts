import type { MarketRevision, MarketSeries, Profile } from "@/lib/types";

const now = new Date("2026-03-06T10:00:00+01:00");
const daysFromNow = (days: number, hour: number, minute: number, endHour: number, endMinute: number) => {
  const start = new Date(now);
  start.setDate(start.getDate() + days);
  start.setHours(hour, minute, 0, 0);

  const end = new Date(now);
  end.setDate(end.getDate() + days);
  end.setHours(endHour, endMinute, 0, 0);

  return {
    startAt: start.toISOString(),
    endAt: end.toISOString()
  };
};

export const sampleProfiles: Profile[] = [
  {
    id: "profile-admin-1",
    email: "studio@fleafinder.dk",
    displayName: "Flea Finder Team",
    role: "admin",
    preferredLocale: "da"
  },
  {
    id: "profile-organizer-1",
    email: "hello@broensmarked.dk",
    displayName: "Broens Yard",
    role: "organizer",
    preferredLocale: "da"
  }
];

export const sampleMarkets: MarketSeries[] = [
  {
    id: "series-1",
    organizerId: "profile-organizer-1",
    slug: "kobenhavns-loppetorv",
    title: "Københavns Loppetorv",
    description:
      "Det faste lørdagsloppemarked på Israels Plads samler klassiske loppefund, tøj, små møbler og masser af centralt byliv midt i København.",
    language: "da",
    category: "mixed",
    status: "published",
    vibe: "Havnelys, kaffe og velkuraterede fund",
    featured: true,
    venueName: "Israels Plads",
    addressLine: "Israels Plads",
    postalCode: "1363",
    city: "København K",
    latitude: 55.6836,
    longitude: 12.5614,
    contactEmail: "kbhloppetorv@gmail.com",
    coverImageUrl: null,
    coverTint: "sun",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-03-03T18:00:00.000Z",
    publishedAt: "2026-02-12T10:00:00.000Z",
    tags: ["israels plads", "byliv", "klassiske lopper"],
    occurrences: [
      {
        id: "occ-1",
        seriesId: "series-1",
        ...daysFromNow(8, 11, 0, 16, 0)
      },
      {
        id: "occ-2",
        seriesId: "series-1",
        ...daysFromNow(15, 11, 0, 16, 0)
      }
    ]
  },
  {
    id: "series-2",
    organizerId: "profile-organizer-1",
    slug: "veras-market-under-buen",
    title: "Veras Market under Buen",
    description:
      "Veras samler over 80 stande med secondhand tøj, sko og accessories under Buen. Det er et af byens mest populære vintage- og genbrugsmarkeder.",
    language: "da",
    category: "clothing",
    status: "published",
    vibe: "Stil, musik og stærke garderobefund",
    featured: true,
    venueName: "Under Buen",
    addressLine: "Bispeengen 12",
    postalCode: "2000",
    city: "Frederiksberg",
    latitude: 55.6864,
    longitude: 12.5318,
    contactEmail: "contact@verasvintage.dk",
    coverImageUrl: null,
    coverTint: "mint",
    createdAt: "2026-02-08T09:00:00.000Z",
    updatedAt: "2026-03-04T13:00:00.000Z",
    publishedAt: "2026-02-10T10:00:00.000Z",
    tags: ["genbrugstøj", "søndag", "under buen"],
    occurrences: [
      {
        id: "occ-3",
        seriesId: "series-2",
        ...daysFromNow(30, 10, 0, 15, 0)
      },
      {
        id: "occ-4",
        seriesId: "series-2",
        ...daysFromNow(37, 10, 0, 15, 0)
      }
    ]
  },
  {
    id: "series-3",
    organizerId: "profile-organizer-1",
    slug: "kobenhavnstrup-loppemarked",
    title: "Københavnstrup Loppemarked",
    description:
      "Københavnstrup er det grønne søndagsmarked ved Emdrup med hyggelige kroge, food trucks og et bredt mix af loppefund i rolige omgivelser.",
    language: "da",
    category: "mixed",
    status: "published",
    vibe: "Grøn oase, søndagsstemning og lokale fund",
    featured: true,
    venueName: "Københavnstrup",
    addressLine: "Lundebakken 1",
    postalCode: "2400",
    city: "København NV",
    latitude: 55.7281,
    longitude: 12.5416,
    contactEmail: "rolf@kobenhavnstrup.dk",
    coverImageUrl: null,
    coverTint: "clay",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-03-01T13:00:00.000Z",
    publishedAt: "2026-02-15T08:00:00.000Z",
    tags: ["nordvest", "søndag", "food trucks"],
    occurrences: [
      {
        id: "occ-5",
        seriesId: "series-3",
        ...daysFromNow(37, 10, 0, 16, 0)
      },
      {
        id: "occ-6",
        seriesId: "series-3",
        ...daysFromNow(44, 10, 0, 16, 0)
      }
    ]
  },
  {
    id: "series-4",
    organizerId: "profile-organizer-1",
    slug: "loppemarked-i-bella",
    title: "Loppemarked i Bella",
    description:
      "Bella Center samler hundredvis af stande med antik, nips, brugskunst og secondhand i store indendørs haller. Et af byens største loppeevents.",
    language: "da",
    category: "design",
    status: "published",
    vibe: "Store haller, mange stande og indendørs loppejagt",
    featured: false,
    venueName: "Bella Center",
    addressLine: "Center Boulevard 5",
    postalCode: "2300",
    city: "København S",
    latitude: 55.6381,
    longitude: 12.5780,
    contactEmail: "loppemarked@bellacenter.dk",
    coverImageUrl: null,
    coverTint: "sand",
    createdAt: "2026-01-28T09:00:00.000Z",
    updatedAt: "2026-02-26T13:00:00.000Z",
    publishedAt: "2026-01-29T10:00:00.000Z",
    tags: ["bella center", "indendørs", "antik"],
    occurrences: [
      {
        id: "occ-7",
        seriesId: "series-4",
        ...daysFromNow(22, 10, 0, 17, 0)
      },
      {
        id: "occ-8",
        seriesId: "series-4",
        ...daysFromNow(23, 10, 0, 16, 0)
      }
    ]
  },
  {
    id: "series-5",
    organizerId: "profile-organizer-1",
    slug: "amager-sommermarked",
    title: "Amager Sommermarked",
    description:
      "Mixed market på torvet med planter, børnetøj, porcelæn og små borde under parasoller. Et klassisk lokalt marked.",
    language: "da",
    category: "mixed",
    status: "pending_review",
    vibe: "Parasoller, planter og nabosnak",
    featured: false,
    venueName: "Sundby Torv",
    addressLine: "Amagerbrogade 148",
    postalCode: "2300",
    city: "København S",
    latitude: 55.6591,
    longitude: 12.6105,
    contactEmail: "kontakt@amagersommer.dk",
    coverImageUrl: null,
    coverTint: "berry",
    createdAt: "2026-03-05T08:00:00.000Z",
    updatedAt: "2026-03-05T08:00:00.000Z",
    publishedAt: null,
    tags: ["mixed", "lokalt", "planter"],
    occurrences: [
      {
        id: "occ-9",
        seriesId: "series-5",
        ...daysFromNow(9, 10, 0, 15, 0)
      }
    ]
  }
];

export const sampleRevisions: MarketRevision[] = [
  {
    id: "revision-1",
    seriesId: "series-3",
    organizerId: "profile-organizer-1",
    status: "pending_review",
    payload: {
      organizerId: "profile-organizer-1",
      title: "Københavnstrup Loppemarked",
      description:
        "Opdateret version med tydeligere wayfinding fra Emdrup Station, flere siddepladser og ekstra fokus på food trucks og familievenlige kroge.",
      language: "da",
      category: "mixed",
      vibe: "Grønt, familievenligt og endnu bedre flow",
      venueName: "Københavnstrup",
      addressLine: "Lundebakken 1",
      postalCode: "2400",
      city: "København NV",
      latitude: 55.7281,
      longitude: 12.5416,
      contactEmail: "rolf@kobenhavnstrup.dk",
      coverImageUrl: null,
      tags: ["nordvest", "søndag", "food trucks"],
      occurrences: [
        {
          id: "occ-rev-1",
          seriesId: "series-3",
          ...daysFromNow(51, 10, 0, 16, 0)
        }
      ]
    },
    adminNotes: "Beskriv gerne food truck-delen lidt skarpere og nævn hvor tæt markedet ligger på Emdrup Station.",
    createdAt: "2026-03-05T16:00:00.000Z",
    reviewedAt: null,
    reviewedBy: null
  }
];

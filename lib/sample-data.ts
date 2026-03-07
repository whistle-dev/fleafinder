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
    slug: "broens-solstrejf-loppemarked",
    title: "Broens Solstrejf Loppemarked",
    description:
      "Et åbent gårdmarked med tøjstativer, kaffe og designfund lige ved havnen. Kom tidligt for de bedste vintagejakker og små møbler.",
    language: "da",
    category: "vintage",
    status: "published",
    vibe: "Havnelys, kaffe og velkuraterede fund",
    featured: true,
    venueName: "Broens Yard",
    addressLine: "Strandgade 95",
    postalCode: "1401",
    city: "København K",
    latitude: 55.6798,
    longitude: 12.5949,
    contactEmail: "hello@broensmarked.dk",
    coverImageUrl: null,
    coverTint: "sun",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-03-03T18:00:00.000Z",
    publishedAt: "2026-02-12T10:00:00.000Z",
    tags: ["havnefront", "kaffe", "kurateret"],
    occurrences: [
      {
        id: "occ-1",
        seriesId: "series-1",
        ...daysFromNow(1, 10, 0, 16, 0)
      },
      {
        id: "occ-2",
        seriesId: "series-1",
        ...daysFromNow(8, 10, 0, 16, 0)
      }
    ]
  },
  {
    id: "series-2",
    organizerId: "profile-organizer-1",
    slug: "norrebro-skolegardsmarked",
    title: "Nørrebro Skolegårdsmarked",
    description:
      "Et lokalt søndagsmarked med børnetøj, legetøj, lampeskærme og musik fra skolegårdens scene. Perfekt til familier og naboer.",
    language: "da",
    category: "kids",
    status: "published",
    vibe: "Nabolag, musik og børnevenlige fund",
    featured: true,
    venueName: "Skt. Hans Skole",
    addressLine: "Ryesgade 118",
    postalCode: "2100",
    city: "København Ø",
    latitude: 55.6998,
    longitude: 12.5718,
    contactEmail: "norrebro@yardsale.dk",
    coverImageUrl: null,
    coverTint: "mint",
    createdAt: "2026-02-08T09:00:00.000Z",
    updatedAt: "2026-03-04T13:00:00.000Z",
    publishedAt: "2026-02-10T10:00:00.000Z",
    tags: ["børn", "community", "musik"],
    occurrences: [
      {
        id: "occ-3",
        seriesId: "series-2",
        ...daysFromNow(2, 11, 0, 15, 0)
      }
    ]
  },
  {
    id: "series-3",
    organizerId: "profile-organizer-1",
    slug: "vesterbro-vinyl-og-vintage",
    title: "Vesterbro Vinyl & Vintage",
    description:
      "Et lille, intenst marked med denim, læder, plader og oversize skjorter. DJs spiller i baggården hele eftermiddagen.",
    language: "da",
    category: "clothing",
    status: "published",
    vibe: "Denim, plader og baggårdsenergi",
    featured: false,
    venueName: "Absalon Baggård",
    addressLine: "Sønder Boulevard 73",
    postalCode: "1720",
    city: "København V",
    latitude: 55.6691,
    longitude: 12.5498,
    contactEmail: "vesterbro@vinylvintage.dk",
    coverImageUrl: null,
    coverTint: "clay",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-03-01T13:00:00.000Z",
    publishedAt: "2026-02-15T08:00:00.000Z",
    tags: ["vinyl", "vintage", "dj"],
    occurrences: [
      {
        id: "occ-4",
        seriesId: "series-3",
        ...daysFromNow(5, 12, 0, 18, 0)
      }
    ]
  },
  {
    id: "series-4",
    organizerId: "profile-organizer-1",
    slug: "frederiksberg-design-loft",
    title: "Frederiksberg Design Loft",
    description:
      "Kurateret loftsalg med møbler, keramik og lamper fra private hjem. Mere galleri end rodebutik, men stadig gode loppepriser.",
    language: "da",
    category: "design",
    status: "published",
    vibe: "Lyst, roligt og meget designet",
    featured: false,
    venueName: "Atelier Frederiksberg",
    addressLine: "Falkoner Alle 21",
    postalCode: "2000",
    city: "Frederiksberg",
    latitude: 55.6819,
    longitude: 12.5348,
    contactEmail: "hej@designloft.dk",
    coverImageUrl: null,
    coverTint: "sand",
    createdAt: "2026-01-28T09:00:00.000Z",
    updatedAt: "2026-02-26T13:00:00.000Z",
    publishedAt: "2026-01-29T10:00:00.000Z",
    tags: ["keramik", "lamper", "møbler"],
    occurrences: [
      {
        id: "occ-5",
        seriesId: "series-4",
        ...daysFromNow(7, 10, 30, 15, 30)
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
        id: "occ-6",
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
      title: "Vesterbro Vinyl & Vintage",
      description:
        "Opdateret version med ekstra pladestande, bedre wayfinding og et lille kids corner i gården.",
      language: "da",
      category: "clothing",
      vibe: "Denim, plader og bedre flow",
      venueName: "Absalon Baggård",
      addressLine: "Sønder Boulevard 73",
      postalCode: "1720",
      city: "København V",
      latitude: 55.6691,
      longitude: 12.5498,
      contactEmail: "vesterbro@vinylvintage.dk",
      coverImageUrl: null,
      tags: ["vinyl", "vintage", "dj"],
      occurrences: [
        {
          id: "occ-rev-1",
          seriesId: "series-3",
          ...daysFromNow(12, 12, 0, 18, 0)
        }
      ]
    },
    adminNotes: "Tjek om kids corner skal fremgå tydeligere i beskrivelsen.",
    createdAt: "2026-03-05T16:00:00.000Z",
    reviewedAt: null,
    reviewedBy: null
  }
];

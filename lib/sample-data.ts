import type { MarketRevision, MarketSeries, Profile } from "@/lib/types";

const now = new Date("2026-03-10T10:00:00+01:00");

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
    displayName: "Flea Finder Seeds",
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
      "Det klassiske lørdagsmarked på Israels Plads samler tøj, små møbler, keramik og mange af de sælgere, københavnere kender fra sæson efter sæson.",
    language: "da",
    category: "mixed",
    status: "published",
    featured: true,
    venueName: "Israels Plads",
    addressLine: "Israels Plads",
    postalCode: "1363",
    city: "København K",
    latitude: 55.6836,
    longitude: 12.5614,
    contactEmail: "kbhloppetorv@gmail.com",
    website: "https://kbhloppetorv.dk/",
    coverImageUrl:
      "https://impro.usercontent.one/appid/oneComWsb/domain/kbhloppetorv.dk/media/kbhloppetorv.dk/onewebmedia/her-og-nu.jpg?etag=%22df53-6050db92%22&sourceContentType=image%2Fjpeg",
    coverTint: "sun",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-03-09T18:00:00.000Z",
    publishedAt: "2026-02-12T10:00:00.000Z",
    tags: ["mixed", "Israels Plads", "København K", "1363"],
    occurrences: [
      { id: "occ-1", seriesId: "series-1", ...daysFromNow(4, 10, 0, 15, 0) },
      { id: "occ-2", seriesId: "series-1", ...daysFromNow(11, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-2",
    organizerId: "profile-organizer-1",
    slug: "veras-market-under-buen",
    title: "Veras Market under Buen",
    description:
      "Veras fylder buen med secondhand-tøj, accessories og et publikum, der kommer tidligt for de bedste garderobefund og bliver hængende omkring markedet.",
    language: "da",
    category: "clothing",
    status: "published",
    featured: true,
    venueName: "Under Buen",
    addressLine: "Bispeengen 12",
    postalCode: "2000",
    city: "Frederiksberg",
    latitude: 55.6864,
    longitude: 12.5318,
    contactEmail: "contact@verasvintage.dk",
    website: "https://www.verasvintage.dk/",
    coverImageUrl:
      "https://verasvintage.dk/wp-content/uploads/2023/04/UnderBuen-30-04-2023-55-e1684415437533-1024x1024.jpg",
    coverTint: "mint",
    createdAt: "2026-02-08T09:00:00.000Z",
    updatedAt: "2026-03-08T13:00:00.000Z",
    publishedAt: "2026-02-10T10:00:00.000Z",
    tags: ["clothing", "Frederiksberg", "Under Buen", "2000"],
    occurrences: [
      { id: "occ-3", seriesId: "series-2", ...daysFromNow(18, 10, 0, 15, 0) },
      { id: "occ-4", seriesId: "series-2", ...daysFromNow(25, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-3",
    organizerId: "profile-organizer-1",
    slug: "veras-market-norrebrohallen",
    title: "Veras Market i Nørrebrohallen",
    description:
      "Indoor-udgaven af Veras samler vintage, sneakers, tasker og velkuraterede stande i Nørrebrohallen, når vejret ikke kalder på open air.",
    language: "da",
    category: "clothing",
    status: "published",
    featured: true,
    venueName: "Nørrebrohallen",
    addressLine: "Nørrebrogade 208",
    postalCode: "2200",
    city: "København N",
    latitude: 55.6992,
    longitude: 12.5418,
    contactEmail: "contact@verasvintage.dk",
    website: "https://www.verasvintage.dk/",
    coverImageUrl:
      "https://verasvintage.dk/wp-content/uploads/2023/12/KQ4A1729-e1756989676193-1024x683.jpg",
    coverTint: "berry",
    createdAt: "2026-02-11T09:00:00.000Z",
    updatedAt: "2026-03-08T13:00:00.000Z",
    publishedAt: "2026-02-11T10:00:00.000Z",
    tags: ["clothing", "Nørrebrohallen", "København N", "2200"],
    occurrences: [
      { id: "occ-5", seriesId: "series-3", ...daysFromNow(9, 10, 0, 15, 0) },
      { id: "occ-6", seriesId: "series-3", ...daysFromNow(30, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-4",
    organizerId: "profile-organizer-1",
    slug: "det-groenne-loppemarked",
    title: "Det Grønne Loppemarked",
    description:
      "Et stort, lokalt loppemarked med bredt mix af stande, grønne omgivelser og mange gengangere fra Amager, der kommer for både tøj, nips og nabosnak.",
    language: "da",
    category: "mixed",
    status: "published",
    featured: true,
    venueName: "Litauens Plads",
    addressLine: "Litauens Plads",
    postalCode: "2300",
    city: "København S",
    latitude: 55.6625,
    longitude: 12.6032,
    contactEmail: "info@detgroenneloppemarked.dk",
    website: "https://detgroenneloppemarked.dk/",
    coverImageUrl: "https://detgroenneloppemarked.dk/wp-content/uploads/2025/03/OM-OS-IMAGES1000PX_54.jpg",
    coverTint: "clay",
    createdAt: "2026-02-09T09:00:00.000Z",
    updatedAt: "2026-03-07T15:00:00.000Z",
    publishedAt: "2026-02-12T09:00:00.000Z",
    tags: ["mixed", "Litauens Plads", "København S", "2300"],
    occurrences: [
      { id: "occ-7", seriesId: "series-4", ...daysFromNow(12, 10, 0, 15, 0) },
      { id: "occ-8", seriesId: "series-4", ...daysFromNow(19, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-5",
    organizerId: "profile-organizer-1",
    slug: "loppemarked-i-bella",
    title: "Loppemarked i Bella",
    description:
      "Bella Center fyldes med mange hundrede stande og et mere klassisk loppepublikum, der går målrettet efter design, porcelæn, lamper og store fund under tag.",
    language: "da",
    category: "design",
    status: "published",
    featured: false,
    venueName: "Bella Center",
    addressLine: "Center Boulevard 5",
    postalCode: "2300",
    city: "København S",
    latitude: 55.6381,
    longitude: 12.578,
    contactEmail: "loppemarked@bellacenter.dk",
    website: "https://www.loppemarkedibella.dk/",
    coverImageUrl:
      "https://loppemarkedibella.dk/media/ufppntlq/rs12579_381-uset-media-dsc09083.jpg?format=webp&height=1920&width=1920",
    coverTint: "sand",
    createdAt: "2026-01-28T09:00:00.000Z",
    updatedAt: "2026-03-02T13:00:00.000Z",
    publishedAt: "2026-01-29T10:00:00.000Z",
    tags: ["design", "Bella Center", "København S", "2300"],
    occurrences: [
      { id: "occ-9", seriesId: "series-5", ...daysFromNow(26, 10, 0, 17, 0) },
      { id: "occ-10", seriesId: "series-5", ...daysFromNow(27, 10, 0, 16, 0) }
    ]
  },
  {
    id: "series-6",
    organizerId: "profile-organizer-1",
    slug: "kobenhavnstrup-loppemarked",
    title: "Københavnstrup Loppemarked",
    description:
      "Et grønt søndagsmarked ved Emdrup med blandede stande, food trucks og et mere lokalt tempo end de centrale markeder i byen.",
    language: "da",
    category: "mixed",
    status: "published",
    featured: false,
    venueName: "Københavnstrup",
    addressLine: "Lundebakken 1",
    postalCode: "2400",
    city: "København NV",
    latitude: 55.7281,
    longitude: 12.5416,
    contactEmail: "rolf@kobenhavnstrup.dk",
    website: "https://brugbyen.nu/",
    coverImageUrl:
      "https://i0.wp.com/www.kobenhavnstrup.dk/wp-content/uploads/2023/01/Lopper-i-solskin.jpg?resize=1920%2C1440&ssl=1",
    coverTint: "clay",
    createdAt: "2026-02-14T09:00:00.000Z",
    updatedAt: "2026-03-01T13:00:00.000Z",
    publishedAt: "2026-02-15T08:00:00.000Z",
    tags: ["mixed", "Københavnstrup", "København NV", "2400"],
    occurrences: [
      { id: "occ-11", seriesId: "series-6", ...daysFromNow(17, 10, 0, 15, 0) },
      { id: "occ-12", seriesId: "series-6", ...daysFromNow(24, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-7",
    organizerId: "profile-organizer-1",
    slug: "balders-lopper",
    title: "Balders Lopper",
    description:
      "Det lokale marked på Balders Plads er et klassisk Nørrebro-setup med børn, naboer, kaffekopper og stande med alt fra køkkenting til småmøbler.",
    language: "da",
    category: "mixed",
    status: "published",
    featured: false,
    venueName: "Balders Plads",
    addressLine: "Baldersgade 20",
    postalCode: "2200",
    city: "København N",
    latitude: 55.6995,
    longitude: 12.5462,
    contactEmail: "info@brugbyen.nu",
    website: "https://brugbyen.nu/",
    coverImageUrl:
      "https://brugbyen.kk.dk/sites/default/files/styles/event_hero_desktop/public/co-creation/event/Loppebillede%201_0.jpg?itok=OyFypFU4",
    coverTint: "sun",
    createdAt: "2026-02-16T09:00:00.000Z",
    updatedAt: "2026-03-06T13:00:00.000Z",
    publishedAt: "2026-02-17T08:00:00.000Z",
    tags: ["mixed", "Balders Plads", "København N", "2200"],
    occurrences: [
      { id: "occ-13", seriesId: "series-7", ...daysFromNow(13, 10, 0, 15, 0) },
      { id: "occ-14", seriesId: "series-7", ...daysFromNow(20, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-8",
    organizerId: "profile-organizer-1",
    slug: "loppemarked-paa-bryggen",
    title: "Loppemarked på Bryggen",
    description:
      "Et åbent kvartersmarked ved havnen med tøj, små fund, børneting og en mere afslappet søndagsrytme omkring Islands Brygge.",
    language: "da",
    category: "mixed",
    status: "published",
    featured: false,
    venueName: "Kulturhuset Islands Brygge",
    addressLine: "Islands Brygge 18",
    postalCode: "2300",
    city: "København S",
    latitude: 55.6653,
    longitude: 12.5787,
    contactEmail: "info@brugbyen.nu",
    website: "https://brugbyen.nu/",
    coverImageUrl:
      "https://kulturhusetislandsbrygge.kk.dk/sites/default/files/2026-02/loppemarkedp%C3%A5bryggen_nyhed.png",
    coverTint: "mint",
    createdAt: "2026-02-18T09:00:00.000Z",
    updatedAt: "2026-03-05T13:00:00.000Z",
    publishedAt: "2026-02-19T08:00:00.000Z",
    tags: ["mixed", "Islands Brygge", "København S", "2300"],
    occurrences: [
      { id: "occ-15", seriesId: "series-8", ...daysFromNow(15, 10, 0, 15, 0) },
      { id: "occ-16", seriesId: "series-8", ...daysFromNow(29, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-9",
    organizerId: "profile-organizer-1",
    slug: "loppemarked-i-remisen",
    title: "Loppemarked i Remisen",
    description:
      "En stor indendørs loppeweekend i Remisen, hvor mange tager direkte efter design, retroting og de tungere fund, som er rarest at se under tag.",
    language: "da",
    category: "design",
    status: "published",
    featured: false,
    venueName: "Remisen",
    addressLine: "Blegdamsvej 132",
    postalCode: "2100",
    city: "København Ø",
    latitude: 55.7039,
    longitude: 12.575,
    contactEmail: "info@brugbyen.nu",
    website: "https://brugbyen.nu/",
    coverImageUrl:
      "https://kulturogfritidoe.kk.dk/sites/default/files/styles/hero_desktop/public/2023-06/Remisen%20facade%20besk%C3%A5ret_0.png?itok=58cvznvd",
    coverTint: "sand",
    createdAt: "2026-02-20T09:00:00.000Z",
    updatedAt: "2026-03-05T16:00:00.000Z",
    publishedAt: "2026-02-21T08:00:00.000Z",
    tags: ["design", "Remisen", "København Ø", "2100"],
    occurrences: [
      { id: "occ-17", seriesId: "series-9", ...daysFromNow(22, 10, 0, 16, 0) },
      { id: "occ-18", seriesId: "series-9", ...daysFromNow(23, 10, 0, 16, 0) }
    ]
  },
  {
    id: "series-10",
    organizerId: "profile-organizer-1",
    slug: "paenere-genbrug-paa-sankt-jakobs-plads",
    title: "Pænere Genbrug på Sankt Jakobs Plads",
    description:
      "Et kurateret kvartersmarked på Østerbro med fokus på pæne garderobefund, boligting og en mindre, mere rolig skalering end de helt store markeder.",
    language: "da",
    category: "vintage",
    status: "published",
    featured: false,
    venueName: "Sankt Jakobs Plads",
    addressLine: "Sankt Jakobs Plads",
    postalCode: "2100",
    city: "København Ø",
    latitude: 55.7024,
    longitude: 12.5847,
    contactEmail: "info@brugbyen.nu",
    website: "https://brugbyen.nu/",
    coverImageUrl:
      "https://brugbyen.kk.dk/sites/default/files/styles/event_hero_desktop/public/2025-04/Design%20uden%20navn.jpg?itok=b1P_K2VZ",
    coverTint: "berry",
    createdAt: "2026-02-22T09:00:00.000Z",
    updatedAt: "2026-03-06T11:00:00.000Z",
    publishedAt: "2026-02-22T10:00:00.000Z",
    tags: ["vintage", "Sankt Jakobs Plads", "København Ø", "2100"],
    occurrences: [
      { id: "occ-19", seriesId: "series-10", ...daysFromNow(16, 11, 0, 15, 0) },
      { id: "occ-20", seriesId: "series-10", ...daysFromNow(37, 11, 0, 15, 0) }
    ]
  },
  {
    id: "series-11",
    organizerId: "profile-organizer-1",
    slug: "loppelinda-enghave-plads",
    title: "LoppeLinda på Enghave Plads",
    description:
      "LoppeLinda samler et tæt, hurtigt marked med tøj, accessories og mindre boligfund midt på Enghave Plads, tæt på metro og caféer.",
    language: "da",
    category: "clothing",
    status: "published",
    featured: false,
    venueName: "Enghave Plads",
    addressLine: "Enghave Plads",
    postalCode: "1670",
    city: "København V",
    latitude: 55.666,
    longitude: 12.5468,
    contactEmail: "kontakt@loppelinda.dk",
    website: "https://loppelinda.dk/",
    coverImageUrl:
      "https://static.wixstatic.com/media/4ff90b_38a172caa43f45d985a9f7d4484e582f~mv2.jpg/v1/fill/w_980%2Ch_526%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/4ff90b_38a172caa43f45d985a9f7d4484e582f~mv2.jpg",
    coverTint: "mint",
    createdAt: "2026-02-24T09:00:00.000Z",
    updatedAt: "2026-03-07T10:00:00.000Z",
    publishedAt: "2026-02-24T10:00:00.000Z",
    tags: ["clothing", "Enghave Plads", "København V", "1670"],
    occurrences: [
      { id: "occ-21", seriesId: "series-11", ...daysFromNow(14, 10, 0, 15, 0) },
      { id: "occ-22", seriesId: "series-11", ...daysFromNow(35, 10, 0, 15, 0) }
    ]
  },
  {
    id: "series-12",
    organizerId: "profile-organizer-1",
    slug: "loppelinda-stefansgade",
    title: "LoppeLinda i Stefansgade",
    description:
      "Et mindre gademarked omkring Stefansgade med meget tøj, småting og den slags hurtige fund, man tager med hjem i hånden frem for i bilen.",
    language: "da",
    category: "clothing",
    status: "published",
    featured: false,
    venueName: "Stefansgade",
    addressLine: "Stefansgade 35",
    postalCode: "2200",
    city: "København N",
    latitude: 55.6878,
    longitude: 12.5388,
    contactEmail: "kontakt@loppelinda.dk",
    website: "https://loppelinda.dk/",
    coverImageUrl:
      "https://static.wixstatic.com/media/4ff90b_e16371e3db764a6bb03847fa4d5317e3~mv2.jpg/v1/fill/w_980%2Ch_821%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_auto/4ff90b_e16371e3db764a6bb03847fa4d5317e3~mv2.jpg",
    coverTint: "sun",
    createdAt: "2026-02-25T09:00:00.000Z",
    updatedAt: "2026-03-07T10:00:00.000Z",
    publishedAt: "2026-02-25T10:00:00.000Z",
    tags: ["clothing", "Stefansgade", "København N", "2200"],
    occurrences: [
      { id: "occ-23", seriesId: "series-12", ...daysFromNow(21, 10, 0, 15, 0) },
      { id: "occ-24", seriesId: "series-12", ...daysFromNow(42, 10, 0, 15, 0) }
    ]
  }
];

export const sampleRevisions: MarketRevision[] = [
  {
    id: "revision-1",
    seriesId: "series-6",
    organizerId: "profile-organizer-1",
    status: "pending_review",
    payload: {
      organizerId: "profile-organizer-1",
      title: "Københavnstrup Loppemarked",
      description:
        "Opdateret version med tydeligere vej fra Emdrup Station, flere siddepladser og ekstra fokus på food trucks og lokale stande.",
      language: "da",
      category: "mixed",
      venueName: "Københavnstrup",
      addressLine: "Lundebakken 1",
      postalCode: "2400",
      city: "København NV",
      latitude: 55.7281,
      longitude: 12.5416,
      contactEmail: "rolf@kobenhavnstrup.dk",
      website: "https://brugbyen.nu/",
      coverImageUrl:
        "https://i0.wp.com/www.kobenhavnstrup.dk/wp-content/uploads/2023/01/Lopper-i-solskin.jpg?resize=1920%2C1440&ssl=1",
      tags: ["mixed", "Københavnstrup", "København NV", "2400"],
      occurrences: [
        {
          id: "occ-rev-1",
          seriesId: "series-6",
          ...daysFromNow(45, 10, 0, 15, 0)
        }
      ]
    },
    adminNotes: "Tilføj gerne lidt mere om standtyperne og hvor mange sælgere man typisk møder.",
    createdAt: "2026-03-08T16:00:00.000Z",
    reviewedAt: null,
    reviewedBy: null
  }
];

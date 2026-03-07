"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { COPENHAGEN_BOUNDS, COPENHAGEN_CENTER, isCopenhagenCity, isWithinCopenhagenBounds } from "@/lib/constants";
import { getExistingSlugs, getMarketBySlug } from "@/lib/data";
import { mapboxToken } from "@/lib/supabase/config";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/session";
import type { Locale, MarketOccurrence, MarketSeries, SeriesPayload } from "@/lib/types";
import { createIcsFile, ensureUniqueSlug, slugify } from "@/lib/utils";

export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const defaultActionState: ActionState = {
  status: "idle"
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export async function signInWithPassword(
  _previousState: ActionState = defaultActionState,
  formData: FormData
): Promise<ActionState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const locale = (String(formData.get("locale") ?? "da") as Locale) || "da";

  if (!email || !password) {
    return {
      status: "error",
      message: locale === "da" ? "Indtast e-mail og password." : "Enter email and password."
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      status: "error",
      message:
        locale === "da"
          ? "Supabase er ikke sat op endnu. Tilføj miljøvariablerne og kør SQL-migrationen."
          : "Supabase is not configured yet. Add the environment variables and run the SQL migration."
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  redirect(`/${locale}/dashboard`);
}

export async function signUpWithPassword(
  _previousState: ActionState = defaultActionState,
  formData: FormData
): Promise<ActionState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const locale = (String(formData.get("locale") ?? "da") as Locale) || "da";

  if (!email || !password) {
    return {
      status: "error",
      message: locale === "da" ? "Udfyld e-mail og password." : "Enter email and password."
    };
  }

  if (password.length < 8) {
    return {
      status: "error",
      message: locale === "da" ? "Password skal være mindst 8 tegn." : "Password must be at least 8 characters."
    };
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    return {
      status: "error",
      message:
        locale === "da"
          ? "Supabase er ikke sat op endnu. Tilføj miljøvariablerne og kør SQL-migrationen."
          : "Supabase is not configured yet. Add the environment variables and run the SQL migration."
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  if (data.session) {
    redirect(`/${locale}/dashboard`);
  }

  return {
    status: "success",
    message:
      locale === "da"
        ? "Konto oprettet. Hvis Supabase kræver e-mailbekræftelse, skal du godkende din e-mail før login."
        : "Account created. If Supabase requires email confirmation, confirm your email before signing in."
  };
}

export async function signOutAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "da");
  const supabase = await getServerSupabaseClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  redirect(`/${locale}`);
}

async function geocodeAddress(address: string, city: string) {
  if (!mapboxToken) {
    return null;
  }

  const searchCity = isCopenhagenCity(city) ? city : "København";
  const bbox = [
    COPENHAGEN_BOUNDS.west,
    COPENHAGEN_BOUNDS.south,
    COPENHAGEN_BOUNDS.east,
    COPENHAGEN_BOUNDS.north
  ].join(",");
  const query = encodeURIComponent(`${address}, ${searchCity}, Denmark`);
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&language=da&country=dk&bbox=${bbox}&proximity=${COPENHAGEN_CENTER.longitude},${COPENHAGEN_CENTER.latitude}&access_token=${mapboxToken}`,
    {
      next: { revalidate: 3600 }
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { features?: Array<{ center?: [number, number] }> };
  const [longitude, latitude] = data.features?.[0]?.center ?? [];

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  if (!isWithinCopenhagenBounds(latitude, longitude)) {
    return null;
  }

  return { latitude, longitude };
}

function parseOccurrences(value: string) {
  if (!value) {
    return [] as MarketOccurrence[];
  }

  try {
    const parsed = JSON.parse(value) as MarketOccurrence[];
    return parsed.filter((occurrence) => occurrence.startAt && occurrence.endAt);
  } catch {
    return [];
  }
}

async function uploadCoverImage(supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabaseClient>>>, image: File) {
  if (!image || image.size <= 0) {
    return null;
  }

  const extension = image.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await image.arrayBuffer());

  const { error } = await supabase.storage.from("market-images").upload(path, buffer, {
    contentType: image.type || "image/jpeg",
    upsert: false
  });

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from("market-images").getPublicUrl(path);
  return data.publicUrl;
}

async function buildPayload(formData: FormData, organizerId: string): Promise<SeriesPayload> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "mixed") as MarketSeries["category"];
  const language = String(formData.get("language") ?? "da") as Locale;
  const venueName = String(formData.get("venueName") ?? "").trim();
  const addressLine = String(formData.get("addressLine") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const city = String(formData.get("city") ?? "København").trim();
  const vibe = String(formData.get("vibe") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const coverTint = String(formData.get("coverTint") ?? "sand").trim();
  const occurrences = parseOccurrences(String(formData.get("occurrencesPayload") ?? ""));
  const explicitLat = Number(formData.get("latitude") ?? "");
  const explicitLng = Number(formData.get("longitude") ?? "");
  const geocoded = addressLine ? await geocodeAddress(addressLine, city) : null;

  return {
    organizerId,
    title,
    description,
    category,
    language,
    vibe,
    venueName,
    addressLine,
    postalCode,
    city,
    latitude: geocoded?.latitude ?? (Number.isFinite(explicitLat) ? explicitLat : 55.6761),
    longitude: geocoded?.longitude ?? (Number.isFinite(explicitLng) ? explicitLng : 12.5683),
    contactEmail,
    coverImageUrl: String(formData.get("existingCoverImageUrl") ?? "") || null,
    tags: [category, ...vibe.split(/[,\s]+/)].filter(Boolean).slice(0, 8),
    occurrences,
    coverTint
  };
}

function withNotice(path: string, notice: string) {
  const url = new URL(path, "https://fleafinder.app");
  url.searchParams.set("notice", notice);
  return `${url.pathname}${url.search}`;
}

async function replaceOccurrences(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabaseClient>>>,
  seriesId: string,
  occurrences: MarketOccurrence[]
) {
  await supabase.from("market_occurrences").delete().eq("series_id", seriesId);

  if (occurrences.length === 0) {
    return;
  }

  await supabase.from("market_occurrences").insert(
    occurrences.map((occurrence) => ({
      id: occurrence.id || crypto.randomUUID(),
      series_id: seriesId,
      start_at: occurrence.startAt,
      end_at: occurrence.endAt,
      note: occurrence.note ?? null
    }))
  );
}

async function saveSeriesDirectly(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabaseClient>>>,
  currentProfileId: string,
  seriesId: string | null,
  payload: SeriesPayload,
  status: MarketSeries["status"]
) {
  const knownMarkets = await getExistingSlugs();
  const slug = ensureUniqueSlug(payload.slug ?? slugify(payload.title), knownMarkets, seriesId ?? undefined);
  const recordId = seriesId ?? crypto.randomUUID();

  const { error } = await supabase.from("market_series").upsert(
    {
      id: recordId,
      organizer_id: currentProfileId,
      slug,
      title: payload.title,
      description: payload.description,
      language: payload.language,
      category: payload.category,
      status,
      vibe: payload.vibe,
      venue_name: payload.venueName || null,
      address_line: payload.addressLine,
      postal_code: payload.postalCode || null,
      city: payload.city,
      latitude: payload.latitude,
      longitude: payload.longitude,
      contact_email: payload.contactEmail,
      cover_image_url: payload.coverImageUrl,
      cover_tint: payload.coverTint ?? "sand",
      tags: payload.tags,
      featured: false,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (error) {
    throw error;
  }

  await replaceOccurrences(supabase, recordId, payload.occurrences);
  return slug;
}

async function saveRevision(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabaseClient>>>,
  seriesId: string,
  organizerId: string,
  payload: SeriesPayload
) {
  const { data: existingRevision } = await supabase
    .from("market_revisions")
    .select("id")
    .eq("series_id", seriesId)
    .eq("status", "pending_review")
    .maybeSingle();

  if (existingRevision?.id) {
    await supabase
      .from("market_revisions")
      .update({
        payload,
        admin_notes: null,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingRevision.id);

    return;
  }

  await supabase.from("market_revisions").insert({
    id: crypto.randomUUID(),
    series_id: seriesId,
    organizer_id: organizerId,
    status: "pending_review",
    payload,
    admin_notes: null
  });
}

export async function saveMarketSeriesAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "da");
  const returnTo = String(formData.get("returnTo") ?? `/${locale}/dashboard`);
  const intent = String(formData.get("intent") ?? "draft");
  const seriesId = String(formData.get("seriesId") ?? "").trim() || null;

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect(`/${locale}/sign-in`);
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    redirect(withNotice(returnTo, locale === "da" ? "Lokalt demo-mode: Supabase mangler." : "Local demo mode: Supabase missing."));
  }

  const payload = await buildPayload(formData, profile.id);
  const coverImage = formData.get("coverImage");

  if (coverImage instanceof File && coverImage.size > 0) {
    payload.coverImageUrl = await uploadCoverImage(supabase, coverImage);
  }

  const { data: existingSeries } = seriesId
    ? await supabase.from("market_series").select("id, slug, status, organizer_id").eq("id", seriesId).maybeSingle()
    : { data: null };

  if (existingSeries && existingSeries.organizer_id !== profile.id && profile.role !== "admin") {
    redirect(withNotice(returnTo, locale === "da" ? "Du kan kun redigere egne markeder." : "You can only edit your own markets."));
  }

  const isAdmin = profile.role === "admin";

  if (existingSeries?.status === "published" && isAdmin) {
    const slug = await saveSeriesDirectly(supabase, existingSeries.organizer_id, existingSeries.id, payload, "published");
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/markets`);
    revalidatePath(`/${locale}/markets/${slug}`);
    revalidatePath(returnTo);
    revalidatePath(`/${locale}/admin`);
    redirect(withNotice(returnTo, locale === "da" ? "Marked opdateret og stadig live." : "Market updated and kept live."));
  }

  if (existingSeries?.status === "published") {
    await saveRevision(supabase, existingSeries.id, profile.id, payload);
    revalidatePath(`/${locale}/admin`);
    revalidatePath(returnTo);
    redirect(withNotice(returnTo, locale === "da" ? "Ændringer sendt til godkendelse." : "Changes submitted for review."));
  }

  const nextStatus =
    intent === "submit" && isAdmin
      ? ("published" as const)
      : intent === "submit"
      ? ("pending_review" as const)
      : existingSeries?.status === "changes_requested"
        ? ("changes_requested" as const)
        : ("draft" as const);

  const slug = await saveSeriesDirectly(supabase, profile.id, existingSeries?.id ?? seriesId, payload, nextStatus);

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/markets`);
  revalidatePath(`/${locale}/markets/${slug}`);
  revalidatePath(returnTo);
  revalidatePath(`/${locale}/admin`);

  redirect(
    withNotice(
      `${returnTo}?series=${slug}`,
      intent === "submit" && isAdmin
        ? locale === "da"
          ? "Marked publiceret direkte."
          : "Market published directly."
        : intent === "submit"
        ? locale === "da"
          ? "Marked sendt til godkendelse."
          : "Market submitted for review."
        : locale === "da"
          ? "Kladde gemt."
          : "Draft saved."
    )
  );
}

export async function reviewSeriesAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "da");
  const action = String(formData.get("moderationAction") ?? "approve");
  const seriesId = String(formData.get("seriesId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect(`/${locale}/admin`);
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    redirect(withNotice(`/${locale}/admin`, locale === "da" ? "Supabase mangler." : "Supabase is missing."));
  }

  const nextStatus =
    action === "approve" ? "published" : action === "archive" ? "archived" : ("changes_requested" as const);

  await supabase
    .from("market_series")
    .update({
      status: nextStatus,
      published_at: nextStatus === "published" ? new Date().toISOString() : null,
      admin_notes: notes || null,
      updated_at: new Date().toISOString()
    })
    .eq("id", seriesId);

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/markets`);
  revalidatePath(`/${locale}/admin`);
  redirect(withNotice(`/${locale}/admin`, locale === "da" ? "Moderation opdateret." : "Moderation updated."));
}

export async function reviewRevisionAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "da");
  const action = String(formData.get("moderationAction") ?? "approve");
  const revisionId = String(formData.get("revisionId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const profile = await getCurrentProfile();

  if (!profile || profile.role !== "admin") {
    redirect(`/${locale}/admin`);
  }

  const supabase = await getServerSupabaseClient();

  if (!supabase) {
    redirect(withNotice(`/${locale}/admin`, locale === "da" ? "Supabase mangler." : "Supabase is missing."));
  }

  const { data: revision } = await supabase.from("market_revisions").select("*").eq("id", revisionId).maybeSingle();

  if (!revision) {
    redirect(withNotice(`/${locale}/admin`, locale === "da" ? "Revision ikke fundet." : "Revision not found."));
  }

  if (action === "approve") {
    const payload = revision.payload as SeriesPayload;
    const slug = await saveSeriesDirectly(supabase, revision.organizer_id, revision.series_id, payload, "published");

    await supabase
      .from("market_revisions")
      .update({
        status: "approved",
        admin_notes: notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id
      })
      .eq("id", revisionId);

    revalidatePath(`/${locale}/markets/${slug}`);
  } else {
    await supabase
      .from("market_revisions")
      .update({
        status: "changes_requested",
        admin_notes: notes || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id
      })
      .eq("id", revisionId);
  }

  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/markets`);
  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/admin`);
  redirect(withNotice(`/${locale}/admin`, locale === "da" ? "Revision håndteret." : "Revision handled."));
}

export async function getCalendarDownload(slug: string, occurrenceId: string) {
  const market = await getMarketBySlug(slug);
  const occurrence = market?.occurrences.find((item) => item.id === occurrenceId);

  if (!market || !occurrence) {
    return null;
  }

  return createIcsFile(market, occurrence);
}

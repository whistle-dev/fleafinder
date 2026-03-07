"use client";

import { useId, useState } from "react";

import { CATEGORY_LABELS } from "@/lib/constants";
import { marketCategories } from "@/lib/types";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, formatTimeRange } from "@/lib/utils";

import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function buildOccurrences(startDate: string, startTime: string, endTime: string, repeatWeekly: boolean, repeatCount: number) {
  if (!startDate || !startTime || !endTime) {
    return [] as Array<{ id: string; seriesId: string; startAt: string; endAt: string; note: null }>;
  }

  const count = repeatWeekly ? repeatCount + 1 : 1;

  return Array.from({ length: count }, (_, index) => {
    const start = new Date(`${startDate}T${startTime}:00`);
    const end = new Date(`${startDate}T${endTime}:00`);
    start.setDate(start.getDate() + index * 7);
    end.setDate(end.getDate() + index * 7);

    return {
      id: crypto.randomUUID(),
      seriesId: "",
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      note: null
    };
  });
}

function FormSection({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="space-y-1">
        <h3 className="font-display text-[1.4rem] leading-none tracking-[-0.04em] text-[var(--ink)]">{title}</h3>
        {description ? <p className="text-sm leading-6 text-[var(--ink-soft)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function MarketForm({
  locale,
  dictionary,
  market,
  action,
  returnTo
}: {
  locale: Locale;
  dictionary: {
    title: string;
    description: string;
    category: string;
    language: string;
    contactEmail: string;
    venueName: string;
    addressLine: string;
    postalCode: string;
    city: string;
    vibe: string;
    image: string;
    startDate: string;
    startTime: string;
    endTime: string;
    repeatWeekly: string;
    repeatCount: string;
    helper: string;
    saveDraft: string;
    submit: string;
  };
  market: MarketSeries;
  action: (formData: FormData) => void;
  returnTo: string;
}) {
  const firstOccurrence = market.occurrences[0];
  const startDateSeed = firstOccurrence?.startAt.slice(0, 10) ?? "";
  const startTimeSeed = firstOccurrence ? new Date(firstOccurrence.startAt).toISOString().slice(11, 16) : "10:00";
  const endTimeSeed = firstOccurrence ? new Date(firstOccurrence.endAt).toISOString().slice(11, 16) : "16:00";

  const [startDate, setStartDate] = useState(startDateSeed);
  const [startTime, setStartTime] = useState(startTimeSeed);
  const [endTime, setEndTime] = useState(endTimeSeed);
  const [repeatWeekly, setRepeatWeekly] = useState(market.occurrences.length > 1);
  const [repeatCount, setRepeatCount] = useState(Math.max(market.occurrences.length - 1, 3));
  const [title, setTitle] = useState(market.title);
  const [vibe, setVibe] = useState(market.vibe);
  const [category, setCategory] = useState(market.category);
  const [language, setLanguage] = useState(market.language);
  const [coverTint, setCoverTint] = useState(market.coverTint);
  const occurrences = buildOccurrences(startDate, startTime, endTime, repeatWeekly, repeatCount);
  const tintId = useId();

  const previewTitle = title.trim() || (locale === "da" ? "Nyt marked" : "New market");
  const previewVibe =
    vibe.trim() || (locale === "da" ? "Kort stemningslinje vises her." : "A short vibe line appears here.");

  return (
    <form action={action} className="space-y-5">
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="seriesId" type="hidden" value={market.id} />
      <input name="existingCoverImageUrl" type="hidden" value={market.coverImageUrl ?? ""} />
      <input name="latitude" type="hidden" value={market.latitude} />
      <input name="longitude" type="hidden" value={market.longitude} />
      <input name="occurrencesPayload" type="hidden" value={JSON.stringify(occurrences)} />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <FormSection
            description={
              locale === "da"
                ? "Hold teksten kort og konkret. Brugere scanner hurtigt på mobilen."
                : "Keep the copy short and concrete. People scan quickly on mobile."
            }
            title={locale === "da" ? "Indhold" : "Content"}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="market-title">{dictionary.title}</Label>
                <Input
                  defaultValue={market.title}
                  id="market-title"
                  name="title"
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  type="text"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="market-description">{dictionary.description}</Label>
                <Textarea defaultValue={market.description} id="market-description" name="description" required rows={5} />
              </div>

              <div className="space-y-2">
                <Label>{dictionary.category}</Label>
                <Select name="category" onValueChange={(value) => setCategory(value as typeof market.category)} value={category}>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.category} />
                  </SelectTrigger>
                  <SelectContent>
                    {marketCategories.map((entry) => (
                      <SelectItem key={entry} value={entry}>
                        {CATEGORY_LABELS[entry][locale]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{dictionary.language}</Label>
                <Select name="language" onValueChange={(value) => setLanguage(value as Locale)} value={language}>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.language} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="da">Dansk</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="market-vibe">{dictionary.vibe}</Label>
                <Input
                  defaultValue={market.vibe}
                  id="market-vibe"
                  name="vibe"
                  onChange={(event) => setVibe(event.target.value)}
                  placeholder={locale === "da" ? "Skolegård, kaffe og vintagefund" : "School yard, coffee, and vintage finds"}
                  required
                  type="text"
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            description={
              locale === "da"
                ? "Gør stedet tydeligt, så markedet er let at finde."
                : "Make the location clear so the market is easy to find."
            }
            title={locale === "da" ? "Sted og kontakt" : "Location and contact"}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="market-venue">{dictionary.venueName}</Label>
                <Input defaultValue={market.venueName ?? ""} id="market-venue" name="venueName" type="text" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-contact-email">{dictionary.contactEmail}</Label>
                <Input defaultValue={market.contactEmail} id="market-contact-email" name="contactEmail" required type="email" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="market-address">{dictionary.addressLine}</Label>
                <Input defaultValue={market.addressLine} id="market-address" name="addressLine" required type="text" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-postal-code">{dictionary.postalCode}</Label>
                <Input defaultValue={market.postalCode ?? ""} id="market-postal-code" name="postalCode" type="text" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-city">{dictionary.city}</Label>
                <Input defaultValue={market.city} id="market-city" name="city" required type="text" />
              </div>
            </div>
          </FormSection>

          <FormSection description={dictionary.helper} title={locale === "da" ? "Datoer" : "Dates"}>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="market-start-date">{dictionary.startDate}</Label>
                <Input id="market-start-date" onChange={(event) => setStartDate(event.target.value)} required type="date" value={startDate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market-start-time">{dictionary.startTime}</Label>
                <Input id="market-start-time" onChange={(event) => setStartTime(event.target.value)} required type="time" value={startTime} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="market-end-time">{dictionary.endTime}</Label>
                <Input id="market-end-time" onChange={(event) => setEndTime(event.target.value)} required type="time" value={endTime} />
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4 md:grid-cols-[minmax(0,1fr)_160px] md:items-end">
              <div className="flex items-start gap-3">
                <Checkbox checked={repeatWeekly} id="market-repeat-weekly" onCheckedChange={(checked) => setRepeatWeekly(Boolean(checked))} />
                <div className="space-y-1">
                  <Label htmlFor="market-repeat-weekly">{dictionary.repeatWeekly}</Label>
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">
                    {locale === "da" ? "Brug dette til ugentlige eller tilbagevendende markeder." : "Use this for weekly or recurring markets."}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="market-repeat-count">{dictionary.repeatCount}</Label>
                <Input
                  disabled={!repeatWeekly}
                  id="market-repeat-count"
                  max={12}
                  min={1}
                  onChange={(event) => setRepeatCount(Number(event.target.value))}
                  type="number"
                  value={repeatCount}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="market-cover-image">{dictionary.image}</Label>
                <Input accept="image/*" id="market-cover-image" name="coverImage" type="file" />
              </div>

              <div className="space-y-2">
                <Label htmlFor={tintId}>{locale === "da" ? "Farvetone" : "Cover tint"}</Label>
                <Select name="coverTint" onValueChange={setCoverTint} value={coverTint}>
                  <SelectTrigger id={tintId}>
                    <SelectValue placeholder={locale === "da" ? "Farvetone" : "Cover tint"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sand">Sand</SelectItem>
                    <SelectItem value="sun">Sun</SelectItem>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="berry">Berry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FormSection>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                {locale === "da" ? "Preview" : "Preview"}
              </div>
              <div className="font-display text-[1.8rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{previewTitle}</div>
              <div className="text-sm text-[var(--ink-soft)]">{CATEGORY_LABELS[category][locale]}</div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--ink-soft)]">{previewVibe}</p>
          </section>

          <section className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
            <div className="text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
              {locale === "da" ? "Datoer" : "Dates"}
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--ink)]">
              {occurrences.length > 0 ? (
                occurrences.map((occurrence) => (
                  <li key={occurrence.id}>
                    {formatDate(occurrence.startAt, locale)}
                    <span className="mx-2 text-[var(--ink-muted)]">•</span>
                    {formatTimeRange(occurrence.startAt, occurrence.endAt, locale)}
                  </li>
                ))
              ) : (
                <li className="text-[var(--ink-soft)]">
                  {locale === "da" ? "Vælg dato og tidspunkt for at se preview." : "Choose a date and time to preview the schedule."}
                </li>
              )}
            </ul>
          </section>

          <div className="flex flex-col gap-3">
            <SubmitButton className="w-full" name="intent" size="lg" value="submit" variant="default">
              {dictionary.submit}
            </SubmitButton>
            <SubmitButton className="w-full" name="intent" size="lg" value="draft" variant="outline">
              {dictionary.saveDraft}
            </SubmitButton>
          </div>
        </aside>
      </div>
    </form>
  );
}

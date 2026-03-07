"use client";

import { useId, useState } from "react";
import { format, parseISO } from "date-fns";
import { da as daLocale, enUS as enLocale } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/constants";
import { marketCategories } from "@/lib/types";
import type { Locale, MarketSeries } from "@/lib/types";
import { formatDate, formatTimeRange } from "@/lib/utils";
import { cn } from "@/lib/cn";

import { SubmitButton } from "@/components/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

type DateInput = {
  id: string;
  dateObj: Date | undefined;
  startTime: string;
  endTime: string;
};

function buildOccurrencesFromInputs(inputs: DateInput[]) {
  return inputs
    .filter((i) => i.dateObj && i.startTime && i.endTime)
    .map((i) => {
      const startDate = format(i.dateObj!, "yyyy-MM-dd");
      const start = new Date(`${startDate}T${i.startTime}:00`);
      const end = new Date(`${startDate}T${i.endTime}:00`);

      return {
        id: crypto.randomUUID(),
        seriesId: "",
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        note: null
      };
    });
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }).map((_, i) => {
  const hour = Math.floor(i / 4).toString().padStart(2, "0");
  const minute = ((i % 4) * 15).toString().padStart(2, "0");
  return `${hour}:${minute}`;
});

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
    <section className="grid gap-6 md:grid-cols-[280px_1fr] border-b border-[var(--line-subtle)] pb-10 pt-4">
      <div className="space-y-2">
        <h3 className="font-display text-2xl text-[var(--ink)]">{title}</h3>
        {description ? <p className="text-sm leading-relaxed text-[var(--ink-soft)] max-w-xs">{description}</p> : null}
      </div>
      <div className="bg-[var(--surface)] p-6 md:p-8 rounded-[16px] border border-[var(--line)] shadow-sm">
        {children}
      </div>
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
  const initialInputs: DateInput[] = market.occurrences.length > 0
    ? market.occurrences.map((occ) => ({
        id: crypto.randomUUID(),
        dateObj: parseISO(occ.startAt.slice(0, 10)),
        startTime: format(parseISO(occ.startAt), "HH:mm"),
        endTime: format(parseISO(occ.endAt), "HH:mm"),
      }))
    : [
        {
          id: crypto.randomUUID(),
          dateObj: undefined,
          startTime: "10:00",
          endTime: "16:00",
        }
      ];

  const [dateInputs, setDateInputs] = useState<DateInput[]>(initialInputs);
  const [title, setTitle] = useState(market.title);
  const [vibe, setVibe] = useState(market.vibe);
  const [category, setCategory] = useState(market.category);
  const [language, setLanguage] = useState(market.language);
  
  const occurrences = buildOccurrencesFromInputs(dateInputs);
  const dateFnsLocale = locale === "da" ? daLocale : enLocale;

  const updateDateInput = (id: string, field: keyof DateInput, value: any) => {
    setDateInputs((current) =>
      current.map((input) => (input.id === id ? { ...input, [field]: value } : input))
    );
  };

  const addDateInput = () => {
    const lastInput = dateInputs[dateInputs.length - 1];
    setDateInputs((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        dateObj: lastInput?.dateObj ? new Date(lastInput.dateObj.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined, // Default to next week
        startTime: lastInput?.startTime ?? "10:00",
        endTime: lastInput?.endTime ?? "16:00"
      }
    ]);
  };

  const removeDateInput = (id: string) => {
    setDateInputs((current) => current.filter((input) => input.id !== id));
  };

  return (
    <form action={action} className="space-y-8 mt-8">
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="seriesId" type="hidden" value={market.id} />
      <input name="existingCoverImageUrl" type="hidden" value={market.coverImageUrl ?? ""} />
      <input name="latitude" type="hidden" value={market.latitude} />
      <input name="longitude" type="hidden" value={market.longitude} />
      <input name="occurrencesPayload" type="hidden" value={JSON.stringify(occurrences)} />
      <input name="coverTint" type="hidden" value="sand" />

      <div className="space-y-2">
        <FormSection
          description={
            locale === "da"
              ? "Hold teksten kort og konkret. Brugere scanner hurtigt på mobilen."
              : "Keep the copy short and concrete. People scan quickly on mobile."
          }
          title={locale === "da" ? "Indhold" : "Content"}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5 md:col-span-2">
              <Label htmlFor="market-title">{dictionary.title}</Label>
              <Input
                defaultValue={market.title}
                id="market-title"
                name="title"
                onChange={(event) => setTitle(event.target.value)}
                required
                type="text"
                className="text-lg py-6"
              />
            </div>

            <div className="space-y-2.5 md:col-span-2">
              <Label htmlFor="market-description">{dictionary.description}</Label>
              <Textarea defaultValue={market.description} id="market-description" name="description" required rows={5} />
            </div>

            <div className="space-y-2.5">
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

            <div className="space-y-2.5">
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

            <div className="space-y-2.5 md:col-span-2">
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
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="market-venue">{dictionary.venueName}</Label>
              <Input defaultValue={market.venueName ?? ""} id="market-venue" name="venueName" type="text" />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="market-contact-email">{dictionary.contactEmail}</Label>
              <Input defaultValue={market.contactEmail} id="market-contact-email" name="contactEmail" required type="email" />
            </div>

            <div className="space-y-2.5 md:col-span-2">
              <Label htmlFor="market-address">{dictionary.addressLine}</Label>
              <Input defaultValue={market.addressLine} id="market-address" name="addressLine" required type="text" />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="market-postal-code">{dictionary.postalCode}</Label>
              <Input defaultValue={market.postalCode ?? ""} id="market-postal-code" name="postalCode" type="text" />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="market-city">{dictionary.city}</Label>
              <Input defaultValue={market.city} id="market-city" name="city" required type="text" />
            </div>
          </div>
        </FormSection>

        <FormSection description={dictionary.helper} title={locale === "da" ? "Datoer" : "Dates"}>
          <div className="space-y-6">
            <div className="space-y-4">
              {dateInputs.map((input, index) => (
                <div
                  key={input.id}
                  className="relative grid gap-4 rounded-2xl border border-[var(--line-subtle)] bg-[var(--paper-warm)] p-5 pr-16 transition-colors hover:border-[var(--line)] md:grid-cols-3"
                >
                  <div className="space-y-2.5">
                    <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                      {index === 0 ? dictionary.startDate : (locale === "da" ? "Dato" : "Date")}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface)] hover:border-[var(--line-strong)] shadow-none h-11 px-4 rounded-[12px]",
                            !input.dateObj && "text-[var(--ink-muted)]"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {input.dateObj ? format(input.dateObj, "PPP", { locale: dateFnsLocale }) : <span>{locale === "da" ? "Vælg dato" : "Pick date"}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={input.dateObj}
                          onSelect={(d) => updateDateInput(input.id, "dateObj", d)}
                          initialFocus
                          locale={dateFnsLocale}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">{dictionary.startTime}</Label>
                    <Select value={input.startTime} onValueChange={(val) => updateDateInput(input.id, "startTime", val)}>
                      <SelectTrigger className="h-11 bg-[var(--surface)] border-[var(--line)] rounded-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2.5">
                    <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">{dictionary.endTime}</Label>
                    <Select value={input.endTime} onValueChange={(val) => updateDateInput(input.id, "endTime", val)}>
                      <SelectTrigger className="h-11 bg-[var(--surface)] border-[var(--line)] rounded-[12px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Remove button */}
                  {dateInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDateInput(input.id)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-[var(--ink-muted)] transition-colors hover:bg-[rgba(182,97,68,0.1)] hover:text-[var(--terracotta)] cursor-pointer"
                      aria-label="Remove date"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button type="button" variant="soft" onClick={addDateInput} className="w-full md:w-auto">
                <Plus className="size-4 mr-1" />
                {locale === "da" ? "Tilføj en dato mere" : "Add another date"}
              </Button>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--line-subtle)] space-y-2.5 max-w-sm">
              <Label htmlFor="market-cover-image">{dictionary.image}</Label>
              <Input accept="image/*" id="market-cover-image" name="coverImage" type="file" />
            </div>
          </div>
        </FormSection>
      </div>

      {/* Footer Sticky Action Bar */}
      <div className="sticky bottom-6 z-20 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-4 text-sm text-[var(--ink-soft)] max-w-sm truncate hidden md:flex">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)]"></div>
          <span className="truncate">
            {occurrences.length} {locale === "da" ? "datoer valgt" : "dates selected"}
          </span>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <SubmitButton className="flex-1 md:flex-none" name="intent" size="lg" value="draft" variant="outline">
            {dictionary.saveDraft}
          </SubmitButton>
          <SubmitButton className="flex-1 md:flex-none" name="intent" size="lg" value="submit" variant="default">
            {dictionary.submit}
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

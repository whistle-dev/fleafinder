"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { da as daLocale, enUS as enLocale } from "date-fns/locale";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";

import { CATEGORY_LABELS } from "@/lib/constants";
import { compressImageFile } from "@/lib/image-compression";
import { marketCategories } from "@/lib/types";
import type { Locale, MarketSeries } from "@/lib/types";
import { MARKET_COVER_IMAGE_MAX_BYTES, MARKET_COVER_IMAGE_MAX_LABEL } from "@/lib/uploads";
import { formatDate, formatTimeRange, getMarketImageSrc, normalizeWebsiteUrl } from "@/lib/utils";
import { cn } from "@/lib/cn";

import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type DateInput = {
  id: string;
  dateObj: Date | undefined;
  startTime: string;
  endTime: string;
};

type CoverImageMode = "upload" | "url";

function formatFileSize(size: number) {
  const megabytes = size / (1024 * 1024);
  return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
}

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
    <section className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[300px_1fr] gap-8 md:gap-16 py-12 border-b border-[var(--line-subtle)] first:pt-0 last:border-b-0">
      <div className="space-y-3">
        <h3 className="font-display text-3xl md:text-4xl text-[var(--ink)] leading-none">{title}</h3>
        {description ? <p className="text-base text-[var(--ink-muted)] leading-relaxed max-w-sm">{description}</p> : null}
      </div>
      <div className="space-y-8">
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
    website: string;
    image: string;
    imageUrl: string;
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
  const [category, setCategory] = useState(market.category);
  const [language, setLanguage] = useState(market.language);
  const [coverImageUrlValue, setCoverImageUrlValue] = useState(market.coverImageUrl ?? "");
  const [coverImageError, setCoverImageError] = useState<string | null>(null);
  const [coverImageNotice, setCoverImageNotice] = useState<string | null>(null);
  const [localCoverImagePreviewUrl, setLocalCoverImagePreviewUrl] = useState<string | null>(null);
  const [selectedCoverImageName, setSelectedCoverImageName] = useState<string | null>(null);
  const [isCompressingCoverImage, setIsCompressingCoverImage] = useState(false);
  const [coverImageMode, setCoverImageMode] = useState<CoverImageMode>(
    market.coverImageUrl ? "url" : "upload"
  );
  
  const occurrences = buildOccurrencesFromInputs(dateInputs);
  const dateFnsLocale = locale === "da" ? daLocale : enLocale;
  const normalizedCoverImageUrl = normalizeWebsiteUrl(coverImageUrlValue);
  const savedCoverImagePreviewUrl = market.coverImageUrl ? getMarketImageSrc(market.coverImageUrl) : null;
  const uploadPreviewUrl = localCoverImagePreviewUrl ?? savedCoverImagePreviewUrl;
  const urlPreviewUrl = normalizedCoverImageUrl ? getMarketImageSrc(normalizedCoverImageUrl) : savedCoverImagePreviewUrl;

  useEffect(() => {
    return () => {
      if (localCoverImagePreviewUrl) {
        URL.revokeObjectURL(localCoverImagePreviewUrl);
      }
    };
  }, [localCoverImagePreviewUrl]);

  const updateLocalCoverImagePreview = (file: File | null) => {
    setLocalCoverImagePreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setSelectedCoverImageName(file?.name ?? null);
  };

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

  const handleCoverImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      setCoverImageError(null);
      setCoverImageNotice(null);
      updateLocalCoverImagePreview(null);
      return;
    }

    setCoverImageError(null);
    setCoverImageNotice(null);

    if (file.size <= MARKET_COVER_IMAGE_MAX_BYTES) {
      updateLocalCoverImagePreview(file);
      return;
    }

    void (async () => {
      setIsCompressingCoverImage(true);
      setCoverImageNotice(
        locale === "da"
          ? "Komprimerer billedet automatisk..."
          : "Compressing image automatically..."
      );

      try {
        const compressed = await compressImageFile(file, MARKET_COVER_IMAGE_MAX_BYTES);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(compressed.file);
        input.files = dataTransfer.files;
        updateLocalCoverImagePreview(compressed.file);
        setCoverImageNotice(
          locale === "da"
            ? `Billedet blev komprimeret til ${formatFileSize(compressed.file.size)}.`
            : `Image compressed to ${formatFileSize(compressed.file.size)}.`
        );
      } catch {
        input.value = "";
        setCoverImageNotice(null);
        updateLocalCoverImagePreview(null);
        setCoverImageError(
          locale === "da"
            ? `Vi kunne ikke komprimere billedet nok. Vælg en fil under ${MARKET_COVER_IMAGE_MAX_LABEL}.`
            : `We could not compress the image enough. Choose a file under ${MARKET_COVER_IMAGE_MAX_LABEL}.`
        );
      } finally {
        setIsCompressingCoverImage(false);
      }
    })();
  };

  const isPublished = market.status === "published";

  return (
    <form
      action={action}
      className="mt-4 md:mt-8 pb-32"
      onSubmit={(event) => {
        if (isCompressingCoverImage) {
          event.preventDefault();
        }
      }}
    >
      <input name="locale" type="hidden" value={locale} />
      <input name="returnTo" type="hidden" value={returnTo} />
      <input name="seriesId" type="hidden" value={market.id} />
      <input name="existingCoverImageUrl" type="hidden" value={market.coverImageUrl ?? ""} />
      <input name="coverImageMode" type="hidden" value={coverImageMode} />
      <input name="latitude" type="hidden" value={market.latitude} />
      <input name="longitude" type="hidden" value={market.longitude} />
      <input name="occurrencesPayload" type="hidden" value={JSON.stringify(occurrences)} />
      <input name="coverTint" type="hidden" value="sand" />

      <div className="space-y-4">
        <FormSection
          description={
            locale === "da"
              ? "Hold teksten kort og konkret. Brugere scanner hurtigt på mobilen."
              : "Keep the copy short and concrete. People scan quickly on mobile."
          }
          title={locale === "da" ? "Indhold" : "Content"}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="market-title" className="text-base text-[var(--ink)]">{dictionary.title}</Label>
              <Input
                defaultValue={market.title}
                id="market-title"
                name="title"
                required
                type="text"
                className="text-xl md:text-2xl py-6 md:py-8 bg-transparent border-0 border-b border-[var(--line-strong)] rounded-none focus-visible:ring-0 focus-visible:border-[var(--accent)] px-0"
                placeholder={locale === "da" ? "Giv dit marked et navn" : "Give your market a name"}
              />
            </div>

            <div className="space-y-3 md:col-span-2 pt-2">
              <Label htmlFor="market-description" className="text-base text-[var(--ink)]">{dictionary.description}</Label>
              <Textarea 
                defaultValue={market.description} 
                id="market-description" 
                name="description" 
                required 
                rows={5}
                className="bg-[var(--surface)] border-[var(--line-strong)] focus-visible:border-[var(--accent)] text-base rounded-xl resize-none p-4"
                placeholder={locale === "da" ? "Beskriv hvad man kan finde, hvem der sælger, og hvad der gør det specielt." : "Describe what people can find, who is selling, and what makes it special."}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base text-[var(--ink)]">{dictionary.category}</Label>
              <Select name="category" onValueChange={(value) => setCategory(value as typeof market.category)} value={category}>
                <SelectTrigger className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus:border-[var(--accent)] focus:ring-0">
                  <SelectValue placeholder={dictionary.category} />
                </SelectTrigger>
                <SelectContent className="bg-[var(--surface-elevated)] border-[var(--line-strong)] text-[var(--ink)] rounded-xl">
                  {marketCategories.map((entry) => (
                    <SelectItem key={entry} value={entry} className="focus:bg-[var(--surface)] focus:text-[var(--accent)] text-base py-3 cursor-pointer">
                      {CATEGORY_LABELS[entry][locale]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base text-[var(--ink)]">{dictionary.language}</Label>
              <Select name="language" onValueChange={(value) => setLanguage(value as Locale)} value={language}>
                <SelectTrigger className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus:border-[var(--accent)] focus:ring-0">
                  <SelectValue placeholder={dictionary.language} />
                </SelectTrigger>
                <SelectContent className="bg-[var(--surface-elevated)] border-[var(--line-strong)] text-[var(--ink)] rounded-xl">
                  <SelectItem value="da" className="focus:bg-[var(--surface)] focus:text-[var(--accent)] text-base py-3 cursor-pointer">Dansk</SelectItem>
                  <SelectItem value="en" className="focus:bg-[var(--surface)] focus:text-[var(--accent)] text-base py-3 cursor-pointer">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>
        </FormSection>

        <FormSection
          description={
            locale === "da"
              ? "Gør stedet tydeligt, så markedet er let at finde. Vi bruger dette til at placere markedet på kortet."
              : "Make the location clear so the market is easy to find. We use this to place the market on the map."
          }
          title={locale === "da" ? "Sted & Kontakt" : "Location & Contact"}
        >
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="market-venue" className="text-base text-[var(--ink)]">{dictionary.venueName}</Label>
              <Input 
                defaultValue={market.venueName ?? ""} 
                id="market-venue" 
                name="venueName" 
                type="text"
                placeholder={locale === "da" ? "F.eks. Stefansgården" : "E.g. Stefansgården"}
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="market-contact-email" className="text-base text-[var(--ink)]">{dictionary.contactEmail}</Label>
              <Input 
                defaultValue={market.contactEmail} 
                id="market-contact-email" 
                name="contactEmail" 
                required 
                type="email"
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0" 
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="market-website" className="text-base text-[var(--ink)]">{dictionary.website}</Label>
              <Input
                defaultValue={market.website ?? ""}
                id="market-website"
                name="website"
                type="url"
                placeholder={locale === "da" ? "https://ditmarked.dk" : "https://yourmarket.com"}
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0"
              />
            </div>

            <div className="space-y-3 md:col-span-2 pt-4 border-t border-[var(--line-subtle)]">
              <Label htmlFor="market-address" className="text-base text-[var(--ink)]">{dictionary.addressLine}</Label>
              <Input 
                defaultValue={market.addressLine} 
                id="market-address" 
                name="addressLine" 
                required 
                type="text"
                placeholder={locale === "da" ? "Gadenavn og nummer" : "Street name and number"}
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="market-postal-code" className="text-base text-[var(--ink)]">{dictionary.postalCode}</Label>
              <Input 
                defaultValue={market.postalCode ?? ""} 
                id="market-postal-code" 
                name="postalCode" 
                type="text"
                placeholder="2200"
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0" 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="market-city" className="text-base text-[var(--ink)]">{dictionary.city}</Label>
              <Input 
                defaultValue={market.city} 
                id="market-city" 
                name="city" 
                required 
                type="text"
                placeholder={locale === "da" ? "København N" : "Copenhagen N"}
                className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0" 
              />
            </div>
          </div>
        </FormSection>

        <FormSection description={dictionary.helper} title={locale === "da" ? "Datoer" : "Dates"}>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              {dateInputs.map((input, index) => (
                <div
                  key={input.id}
                  className="relative grid gap-4 md:grid-cols-[1fr_auto_auto] items-end bg-[var(--surface)] border border-[var(--line-strong)] p-4 md:p-6 pr-14 md:pr-16 rounded-2xl group transition-colors hover:border-[var(--accent-soft)]"
                >
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">
                      {index === 0 ? dictionary.startDate : (locale === "da" ? "Dato" : "Date")}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-transparent border-[var(--line-strong)] hover:bg-[var(--surface-elevated)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors h-14 px-4 rounded-xl text-base",
                            !input.dateObj && "text-[var(--ink-muted)]"
                          )}
                        >
                          <CalendarIcon className="mr-3 h-5 w-5 opacity-70" />
                          {input.dateObj ? format(input.dateObj, "PPP", { locale: dateFnsLocale }) : <span>{locale === "da" ? "Vælg dato" : "Pick date"}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 border-[var(--line-strong)] bg-[var(--surface-elevated)] text-[var(--ink)] shadow-xl" align="start">
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

                  <div className="grid grid-cols-2 md:flex gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">{dictionary.startTime}</Label>
                      <Select value={input.startTime} onValueChange={(val) => updateDateInput(input.id, "startTime", val)}>
                        <SelectTrigger className="w-full md:w-28 h-14 bg-transparent border-[var(--line-strong)] rounded-xl text-base focus:border-[var(--accent)] focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--surface-elevated)] border-[var(--line-strong)] text-[var(--ink)] rounded-xl max-h-[300px]">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time} className="focus:bg-[var(--surface)] focus:text-[var(--accent)] py-2 cursor-pointer">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">{dictionary.endTime}</Label>
                      <Select value={input.endTime} onValueChange={(val) => updateDateInput(input.id, "endTime", val)}>
                        <SelectTrigger className="w-full md:w-28 h-14 bg-transparent border-[var(--line-strong)] rounded-xl text-base focus:border-[var(--accent)] focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[var(--surface-elevated)] border-[var(--line-strong)] text-[var(--ink)] rounded-xl max-h-[300px]">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time} className="focus:bg-[var(--surface)] focus:text-[var(--accent)] py-2 cursor-pointer">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Remove button */}
                  {dateInputs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDateInput(input.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5 text-[var(--ink-muted)] transition-all hover:bg-[var(--terracotta-soft)] hover:text-[var(--terracotta)] cursor-pointer"
                      aria-label="Remove date"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={addDateInput} 
                className="w-full md:w-auto h-12 rounded-xl border-[var(--line-strong)] text-[var(--ink)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-transparent hover:bg-transparent"
              >
                <Plus className="size-4 mr-2" />
                {locale === "da" ? "Tilføj endnu en dato" : "Add another date"}
              </Button>
            </div>

            <div className="pt-10 mt-10 border-t border-[var(--line-subtle)] space-y-4">
              <div className="space-y-3">
                <Label className="text-base text-[var(--ink)]">{dictionary.image}</Label>
                <ToggleGroup
                  type="single"
                  value={coverImageMode}
                  onValueChange={(value) => {
                    if (!value) return;
                    setCoverImageMode(value as CoverImageMode);
                    setCoverImageError(null);
                    setCoverImageNotice(null);
                  }}
                  variant="outline"
                  className="inline-flex rounded-xl border border-[var(--line-strong)] bg-[var(--surface)] p-1"
                >
                  <ToggleGroupItem
                    value="upload"
                    className="rounded-lg px-4 text-sm data-[state=on]:bg-[var(--accent)] data-[state=on]:text-[var(--paper)]"
                  >
                    {locale === "da" ? "Upload fil" : "Upload file"}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="url"
                    className="rounded-lg px-4 text-sm data-[state=on]:bg-[var(--accent)] data-[state=on]:text-[var(--paper)]"
                  >
                    {locale === "da" ? "Brug URL" : "Use URL"}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {coverImageMode === "url" ? (
                <div className="space-y-3">
                  <Label htmlFor="market-cover-image-url" className="text-base text-[var(--ink)]">{dictionary.imageUrl}</Label>
                  <Input
                    id="market-cover-image-url"
                    name="coverImageUrl"
                    type="url"
                    value={coverImageUrlValue}
                    onChange={(event) => setCoverImageUrlValue(event.target.value)}
                    placeholder={locale === "da" ? "https://ditmarked.dk/billede.jpg" : "https://yourmarket.com/image.jpg"}
                    className="h-14 bg-[var(--surface)] border-[var(--line-strong)] rounded-xl px-4 text-base focus-visible:border-[var(--accent)] focus-visible:ring-0"
                  />
                  <p className="text-sm text-[var(--ink-muted)]">
                    {locale === "da"
                      ? "Brug et direkte link til billedet, helst fra markedets egen hjemmeside eller et sted du kontrollerer."
                      : "Use a direct image URL, ideally from the market website or a host you control."}
                  </p>
                  <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)]">
                    {urlPreviewUrl ? (
                      <img
                        src={urlPreviewUrl}
                        alt={locale === "da" ? "Preview af coverbillede" : "Cover image preview"}
                        className="aspect-[16/9] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/9] items-center justify-center px-6 text-center text-sm text-[var(--ink-muted)]">
                        {locale === "da"
                          ? "Indsæt en gyldig billed-URL for at se preview."
                          : "Paste a valid image URL to preview it."}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {coverImageMode === "upload" ? (
                <div className="space-y-3">
                  <Label htmlFor="market-cover-image" className="text-base text-[var(--ink)]">
                    {dictionary.image}
                  </Label>
                  <input 
                    accept="image/*" 
                    id="market-cover-image" 
                    name="coverImage" 
                    type="file"
                    onChange={handleCoverImageChange}
                    aria-invalid={coverImageError ? true : undefined}
                    className="sr-only" 
                  />
                  <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                    <label
                      htmlFor="market-cover-image"
                      className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-5 text-center transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      <span className="text-sm uppercase tracking-[0.22em] text-[var(--ink-muted)]">
                        {locale === "da" ? "Fil" : "File"}
                      </span>
                      <span className="mt-3 font-display text-2xl leading-none text-[var(--ink)]">
                        {selectedCoverImageName
                          ? locale === "da"
                            ? "Vælg et andet billede"
                            : "Choose another image"
                          : locale === "da"
                            ? "Vælg billede"
                            : "Choose image"}
                      </span>
                      <span className="mt-3 text-sm text-[var(--ink-muted)]">
                        {selectedCoverImageName ??
                          (locale === "da"
                            ? "JPG, PNG eller WebP"
                            : "JPG, PNG, or WebP")}
                      </span>
                    </label>
                    <div className="overflow-hidden rounded-2xl border border-[var(--line-strong)] bg-[var(--surface)]">
                      {uploadPreviewUrl ? (
                        <img
                          src={uploadPreviewUrl}
                          alt={locale === "da" ? "Preview af uploadet billede" : "Uploaded image preview"}
                          className="aspect-[16/9] w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-[16/9] items-center justify-center px-6 text-center text-sm text-[var(--ink-muted)]">
                          {locale === "da"
                            ? "Når du vælger et billede, vises det her i stedet for et filnavn."
                            : "When you choose an image, it will appear here instead of a file name."}
                        </div>
                      )}
                    </div>
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      coverImageError
                        ? "text-[var(--terracotta)]"
                        : coverImageNotice
                          ? "text-[var(--accent)]"
                          : "text-[var(--ink-muted)]"
                    )}
                  >
                    {coverImageError ??
                      coverImageNotice ??
                      (locale === "da"
                        ? `Upload et billede op til ${MARKET_COVER_IMAGE_MAX_LABEL}. Større filer komprimeres automatisk før upload.`
                        : `Upload an image up to ${MARKET_COVER_IMAGE_MAX_LABEL}. Larger files are compressed automatically before upload.`)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </FormSection>
      </div>

      {/* Mobile-optimized Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:p-6 bg-gradient-to-t from-[var(--paper)] via-[var(--paper)] to-transparent pointer-events-none">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 bg-[var(--surface-elevated)] backdrop-blur-xl border border-[var(--line-strong)] rounded-2xl p-4 md:px-6 shadow-xl pointer-events-auto">
          <div className="flex items-center gap-3 text-[var(--ink-muted)] w-full md:w-auto justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-sm font-medium">
              {occurrences.length} {locale === "da" ? "datoer valgt" : "dates selected"}
            </span>
          </div>
          
          <div className="flex w-full md:w-auto items-stretch md:items-center gap-3">
            {!isPublished && (
              <SubmitButton 
                className="flex-1 md:flex-none h-12 md:h-14 px-6 rounded-xl border-[var(--line-strong)] text-[var(--ink)] hover:text-[var(--accent)] hover:border-[var(--accent)] bg-transparent font-medium" 
                disabled={isCompressingCoverImage}
                name="intent" 
                value="draft" 
                variant="outline"
              >
                {dictionary.saveDraft}
              </SubmitButton>
            )}
            <SubmitButton 
              className="flex-1 md:flex-none h-12 md:h-14 px-8 rounded-xl bg-[var(--accent)] text-[var(--paper)] hover:bg-[var(--accent-dark)] font-medium text-lg shadow-sm" 
              disabled={isCompressingCoverImage}
              name="intent" 
              value={isPublished ? "publish" : "submit"} 
              variant="default"
            >
              {isCompressingCoverImage
                ? locale === "da"
                  ? "Komprimerer..."
                  : "Compressing..."
                : isPublished
                  ? (locale === "da" ? "Gem ændringer" : "Save changes")
                  : dictionary.submit}
            </SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}

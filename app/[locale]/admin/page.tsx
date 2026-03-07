import { reviewRevisionAction, reviewSeriesAction } from "@/lib/actions";
import { getAdminWorkspace } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/session";
import type { Locale } from "@/lib/types";
import { formatDate, getNextOccurrence, isLocale } from "@/lib/utils";

import { StatusPill } from "@/components/status-pill";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function AdminPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale: localeParam }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const locale = (isLocale(localeParam) ? localeParam : "da") as Locale;
  const dictionary = getDictionary(locale);
  const profile = await getCurrentProfile();
  const notice = typeof resolvedSearchParams.notice === "string" ? resolvedSearchParams.notice : "";

  if (!profile || profile.role !== "admin") {
    return (
      <Card className="max-w-2xl">
        <CardHeader className="gap-4">
          <Badge>{dictionary.admin.title}</Badge>
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-[0.95] tracking-[-0.06em] text-[var(--ink)]">
              {dictionary.admin.title}
            </h1>
            <p className="text-base leading-7 text-[var(--ink-soft)]">{dictionary.admin.noAccess}</p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  const workspace = await getAdminWorkspace();
  const pendingTotal = workspace.pendingSeries.length + workspace.pendingRevisions.length;

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="gap-4">
          <Badge>Admin</Badge>
          <div className="space-y-3">
            <h1 className="font-display text-[clamp(2.1rem,5vw,4rem)] leading-[0.95] tracking-[-0.06em] text-[var(--ink)]">
              {dictionary.admin.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--ink-soft)]">{dictionary.admin.intro}</p>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{locale === "da" ? "Samlet" : "Total"}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{pendingTotal}</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{dictionary.admin.pendingSeries}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{workspace.pendingSeries.length}</div>
          </div>
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] p-4">
            <div className="text-sm text-[var(--ink-soft)]">{dictionary.admin.pendingRevisions}</div>
            <div className="mt-1 font-display text-[2rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{workspace.pendingRevisions.length}</div>
          </div>
        </CardContent>
      </Card>

      {notice ? (
        <div className="rounded-2xl border border-[rgba(228,116,57,0.22)] bg-[rgba(228,116,57,0.08)] px-4 py-3 text-sm text-[#8e4c29]">
          {notice}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4">
          <div className="space-y-2 px-1">
            <Badge>{dictionary.admin.pendingSeries}</Badge>
            <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.05em] text-[var(--ink)]">
              {dictionary.admin.pendingSeries}
            </h2>
          </div>

          {workspace.pendingSeries.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-sm leading-6 text-[var(--ink-soft)]">{dictionary.admin.noItems}</CardContent>
            </Card>
          ) : null}

          {workspace.pendingSeries.map((market) => {
            const nextOccurrence = getNextOccurrence(market.occurrences);

            return (
              <Card key={market.id}>
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Badge>{market.city}</Badge>
                      <div className="font-display text-[1.5rem] leading-none tracking-[-0.05em] text-[var(--ink)]">{market.title}</div>
                      <p className="text-sm leading-6 text-[var(--ink-soft)]">{market.addressLine}</p>
                    </div>
                    <StatusPill locale={locale} status={market.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm leading-6 text-[var(--ink-soft)]">{market.description}</p>
                  {nextOccurrence ? (
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink)]">
                      {formatDate(nextOccurrence.startAt, locale)}
                    </div>
                  ) : null}
                  <form action={reviewSeriesAction} className="space-y-4">
                    <input name="locale" type="hidden" value={locale} />
                    <input name="seriesId" type="hidden" value={market.id} />
                    <div className="space-y-2">
                      <Label htmlFor={`series-notes-${market.id}`}>{dictionary.form.notes}</Label>
                      <Textarea id={`series-notes-${market.id}`} name="notes" placeholder={dictionary.form.notes} rows={4} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <SubmitButton name="moderationAction" value="approve">
                        {dictionary.form.publish}
                      </SubmitButton>
                      <SubmitButton name="moderationAction" value="request_changes" variant="secondary">
                        {dictionary.form.requestChanges}
                      </SubmitButton>
                      <SubmitButton name="moderationAction" value="archive" variant="outline">
                        {dictionary.form.archive}
                      </SubmitButton>
                    </div>
                  </form>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="space-y-4">
          <div className="space-y-2 px-1">
            <Badge>{dictionary.admin.pendingRevisions}</Badge>
            <h2 className="font-display text-[1.9rem] leading-none tracking-[-0.05em] text-[var(--ink)]">
              {dictionary.admin.pendingRevisions}
            </h2>
          </div>

          {workspace.pendingRevisions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-sm leading-6 text-[var(--ink-soft)]">{dictionary.admin.noItems}</CardContent>
            </Card>
          ) : null}

          {workspace.pendingRevisions.map((revision) => (
            <Card key={revision.id}>
              <CardHeader className="gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Badge>{locale === "da" ? "Revision" : "Revision"}</Badge>
                    <div className="font-display text-[1.5rem] leading-none tracking-[-0.05em] text-[var(--ink)]">
                      {revision.payload.title}
                    </div>
                    <p className="text-sm leading-6 text-[var(--ink-soft)]">{revision.payload.addressLine}</p>
                  </div>
                  <StatusPill locale={locale} status={revision.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-[var(--ink-soft)]">{revision.payload.description}</p>
                <form action={reviewRevisionAction} className="space-y-4">
                  <input name="locale" type="hidden" value={locale} />
                  <input name="revisionId" type="hidden" value={revision.id} />
                  <div className="space-y-2">
                    <Label htmlFor={`revision-notes-${revision.id}`}>{dictionary.form.notes}</Label>
                    <Textarea
                      defaultValue={revision.adminNotes ?? ""}
                      id={`revision-notes-${revision.id}`}
                      name="notes"
                      placeholder={dictionary.form.notes}
                      rows={4}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SubmitButton name="moderationAction" value="approve">
                      {dictionary.form.publish}
                    </SubmitButton>
                    <SubmitButton name="moderationAction" value="request_changes" variant="secondary">
                      {dictionary.form.requestChanges}
                    </SubmitButton>
                  </div>
                </form>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}

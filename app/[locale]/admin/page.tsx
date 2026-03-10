import { reviewRevisionAction, reviewSeriesAction } from "@/lib/actions";
import { getAdminWorkspace } from "@/lib/data";
import { getDictionary } from "@/lib/i18n";
import { getCurrentProfile } from "@/lib/session";
import type { Locale } from "@/lib/types";
import { formatDate, getNextOccurrence, isLocale } from "@/lib/utils";

import { StatusPill } from "@/components/status-pill";
import { SubmitButton } from "@/components/submit-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
      <div className="mx-auto max-w-2xl text-center py-20">
        <h1 className="font-display text-4xl text-[var(--ink)] mb-4">{dictionary.admin.title}</h1>
        <p className="text-[var(--ink-soft)] mb-8">{dictionary.admin.noAccess}</p>
      </div>
    );
  }

  const workspace = await getAdminWorkspace();
  const pendingTotal = workspace.pendingSeries.length + workspace.pendingRevisions.length;

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="solid">Admin</Badge>
            <h1 className="font-display text-4xl text-[var(--ink)] tracking-tight">
              {dictionary.admin.title}
            </h1>
            <p className="text-lg text-[var(--ink-soft)] max-w-xl">
              {dictionary.admin.intro}
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-soft)] mb-2">
            {locale === "da" ? "Samlet ventende" : "Total Pending"}
          </div>
          <div className="font-display text-4xl text-[var(--ink)]">{pendingTotal}</div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-soft)] mb-2">
            {dictionary.admin.pendingSeries}
          </div>
          <div className="font-display text-4xl text-[var(--ink)]">{workspace.pendingSeries.length}</div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <div className="text-sm font-medium uppercase tracking-wider text-[var(--ink-soft)] mb-2">
            {dictionary.admin.pendingRevisions}
          </div>
          <div className="font-display text-4xl text-[var(--ink)]">{workspace.pendingRevisions.length}</div>
        </div>
      </div>

      {notice ? (
        <div className="rounded-xl border border-[var(--terracotta-soft)] bg-[var(--terracotta-soft)] px-5 py-4 text-sm font-medium text-[var(--terracotta)]">
          {notice}
        </div>
      ) : null}

      <Tabs defaultValue="series" className="space-y-6">
        <TabsList>
          <TabsTrigger value="series">{dictionary.admin.pendingSeries}</TabsTrigger>
          <TabsTrigger value="revisions">{dictionary.admin.pendingRevisions}</TabsTrigger>
        </TabsList>

        <TabsContent value="series" className="space-y-6">
          {workspace.pendingSeries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-12 text-center text-[var(--ink-soft)]">
              {dictionary.admin.noItems}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspace.pendingSeries.map((market) => {
                  const nextOccurrence = getNextOccurrence(market.occurrences);
                  return (
                    <TableRow key={market.id}>
                      <TableCell>
                        <div className="font-medium text-[var(--ink)]">{market.title}</div>
                        <div className="text-xs text-[var(--ink-muted)] line-clamp-1 max-w-[200px]">{market.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-[var(--ink)]">{market.city}</div>
                        <div className="text-xs text-[var(--ink-muted)]">{market.addressLine}</div>
                      </TableCell>
                      <TableCell>
                        <StatusPill locale={locale} status={market.status} />
                      </TableCell>
                      <TableCell>
                        {nextOccurrence ? (
                          <span className="text-sm text-[var(--ink-soft)]">{formatDate(nextOccurrence.startAt, locale)}</span>
                        ) : (
                          <span className="text-sm text-[var(--ink-muted)]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Review</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-[var(--surface)] border-[var(--line)] p-0 rounded-2xl overflow-hidden shadow-[var(--shadow-xl)]">
                            <DialogHeader className="sr-only">
                              <DialogTitle>Review Market</DialogTitle>
                            </DialogHeader>
                            <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                              <div>
                                <h2 className="font-display text-3xl text-[var(--ink)] mb-2">{market.title}</h2>
                                <p className="text-[var(--ink-soft)]">{market.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 border-y border-[var(--line-subtle)] py-4">
                                <div>
                                  <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Category</div>
                                  <div className="text-sm font-medium">{market.category}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Location</div>
                                  <div className="text-sm font-medium">{market.addressLine}, {market.city}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Contact</div>
                                  <div className="text-sm font-medium">{market.contactEmail}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-widest text-[var(--ink-muted)]">Website</div>
                                  <div className="text-sm font-medium break-all">{market.website || "-"}</div>
                                </div>
                              </div>

                              <form action={reviewSeriesAction} className="space-y-4 pt-2">
                                <input name="locale" type="hidden" value={locale} />
                                <input name="seriesId" type="hidden" value={market.id} />
                                <div className="space-y-2">
                                  <Label htmlFor={`series-notes-${market.id}`}>{dictionary.form.notes}</Label>
                                  <Textarea id={`series-notes-${market.id}`} name="notes" placeholder={dictionary.form.notes} rows={3} />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
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
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="revisions" className="space-y-6">
          {workspace.pendingRevisions.length === 0 ? (
             <div className="rounded-2xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-12 text-center text-[var(--ink-soft)]">
             {dictionary.admin.noItems}
           </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Market (Revision)</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspace.pendingRevisions.map((revision) => (
                  <TableRow key={revision.id}>
                    <TableCell>
                      <div className="font-medium text-[var(--ink)]">{revision.payload.title}</div>
                      <div className="text-xs text-[var(--ink-muted)] line-clamp-1 max-w-[200px]">{revision.payload.description}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-[var(--ink)]">{revision.payload.city}</div>
                      <div className="text-xs text-[var(--ink-muted)]">{revision.payload.addressLine}</div>
                    </TableCell>
                    <TableCell>
                      <StatusPill locale={locale} status={revision.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Review Changes</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-[var(--surface)] border-[var(--line)] p-0 rounded-2xl overflow-hidden shadow-[var(--shadow-xl)]">
                          <DialogHeader className="sr-only">
                            <DialogTitle>Review Revision</DialogTitle>
                          </DialogHeader>
                          <div className="p-6 md:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
                            <div>
                              <Badge variant="subtle" className="mb-4">Revision Payload</Badge>
                              <h2 className="font-display text-3xl text-[var(--ink)] mb-2">{revision.payload.title}</h2>
                              <p className="text-[var(--ink-soft)]">{revision.payload.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {Object.entries(revision.payload).map(([key, value]) => {
                                if (!value || typeof value === "object" || key === "title" || key === "description" || key === "id" || key === "organizerId" || key === "slug") return null;
                                
                                const displayKey = key.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
                                
                                return (
                                  <div key={key} className="bg-[var(--paper-warm)] border border-[var(--line-subtle)] p-4 rounded-xl flex flex-col gap-1">
                                    <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--ink-muted)]">
                                      {displayKey}
                                    </span>
                                    <span className="text-sm text-[var(--ink)] font-medium break-words">
                                      {String(value)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            <form action={reviewRevisionAction} className="space-y-4 pt-4 border-t border-[var(--line-subtle)]">
                              <input name="locale" type="hidden" value={locale} />
                              <input name="revisionId" type="hidden" value={revision.id} />
                              <div className="space-y-2">
                                <Label htmlFor={`revision-notes-${revision.id}`}>{dictionary.form.notes}</Label>
                                <Textarea
                                  defaultValue={revision.adminNotes ?? ""}
                                  id={`revision-notes-${revision.id}`}
                                  name="notes"
                                  placeholder={dictionary.form.notes}
                                  rows={3}
                                />
                              </div>
                              <div className="flex flex-wrap gap-2 pt-2">
                                <SubmitButton name="moderationAction" value="approve">
                                  {dictionary.form.publish}
                                </SubmitButton>
                                <SubmitButton name="moderationAction" value="request_changes" variant="secondary">
                                  {dictionary.form.requestChanges}
                                </SubmitButton>
                              </div>
                            </form>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

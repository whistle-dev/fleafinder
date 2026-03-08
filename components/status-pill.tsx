import { REVISION_LABELS, STATUS_LABELS } from "@/lib/constants";
import type { ListingStatus, Locale, RevisionStatus } from "@/lib/types";

import { Badge } from "@/components/ui/badge";

export function StatusPill({
  status,
  locale
}: {
  status: ListingStatus | RevisionStatus;
  locale: Locale;
}) {
  const label =
    (status in STATUS_LABELS ? STATUS_LABELS[status as ListingStatus] : REVISION_LABELS[status as RevisionStatus])?.[
      locale
    ] ?? status;

  const statusClass =
    status === "published" || status === "approved"
      ? "border-transparent bg-emerald-500/20 text-emerald-300"
      : status === "pending_review"
        ? "border-transparent bg-amber-500/20 text-amber-300"
        : status === "changes_requested"
          ? "border-transparent bg-rose-500/20 text-rose-300"
          : "border border-white/20 bg-transparent text-white/70";

  return (
    <Badge className={statusClass} variant="default">
      {label}
    </Badge>
  );
}

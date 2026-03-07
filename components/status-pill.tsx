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
      ? "border-transparent bg-[rgba(31,93,85,0.14)] text-[#1f5d55]"
      : status === "pending_review"
        ? "border-transparent bg-[rgba(228,116,57,0.16)] text-[#9d4c20]"
        : status === "changes_requested"
          ? "border-transparent bg-[rgba(132,82,105,0.16)] text-[#6f4556]"
          : "border-[rgba(31,45,39,0.08)] bg-[rgba(31,45,39,0.06)] text-[var(--ink)]";

  return (
    <Badge className={statusClass} variant="default">
      {label}
    </Badge>
  );
}

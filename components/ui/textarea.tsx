import * as React from "react"

import { cn } from "@/lib/cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-32 w-full rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[15px] text-[var(--ink)] shadow-none outline-none transition-all placeholder:text-[var(--ink-muted)] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--ink-muted)]",
        "focus-visible:border-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--ink)]",
        "aria-invalid:border-[var(--terracotta)] aria-invalid:ring-[var(--terracotta)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

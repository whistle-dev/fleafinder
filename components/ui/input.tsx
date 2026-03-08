import * as React from "react"

import { cn } from "@/lib/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-[15px] text-[var(--ink)] shadow-none outline-none transition-all placeholder:text-[var(--ink-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--surface-elevated)] file:px-3 file:py-1 file:text-sm file:font-medium file:text-[var(--ink)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-[var(--accent-soft)]",
        "focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]",
        "aria-invalid:border-[var(--terracotta)] aria-invalid:ring-[var(--terracotta)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }

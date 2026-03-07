"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@/lib/cn"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-[6px] border border-[var(--line-strong)] bg-[var(--surface)] text-white shadow-none outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--terracotta)] aria-invalid:ring-[var(--terracotta)] data-[state=checked]:border-[var(--ink)] data-[state=checked]:bg-[var(--ink)] focus-visible:border-[var(--ink)] focus-visible:ring-1 focus-visible:ring-[var(--ink)] hover:border-[var(--ink-muted)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

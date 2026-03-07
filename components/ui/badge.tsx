import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const badgeVariants = cva(
  'font-body inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.03em] transition-colors uppercase',
  {
    variants: {
      variant: {
        default:
          "border border-[var(--line)] bg-[var(--paper-cream)] text-[var(--ink)]",
        secondary:
          "border border-transparent bg-[var(--paper-warm)] text-[var(--ink-soft)]",
        accent:
          "border border-transparent bg-[var(--accent-soft)] text-[var(--accent-dark)]",
        subtle:
          "border border-[var(--line-subtle)] bg-[var(--paper)] text-[var(--ink-muted)]",
        solid:
          "border border-transparent bg-[var(--ink)] text-[var(--surface)]"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

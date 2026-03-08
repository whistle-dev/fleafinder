import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "font-body inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.03em] transition-colors uppercase",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--accent)] bg-[var(--surface-elevated)] text-[var(--accent)]",
        secondary:
          "border border-transparent bg-[var(--surface)] text-[var(--accent-soft)]",
        accent: "border border-transparent bg-[var(--accent)] text-[#335405]",
        subtle:
          "border border-[var(--line-subtle)] bg-[var(--paper)] text-[var(--ink-muted)]",
        solid: "border border-transparent bg-[var(--accent)] text-[#335405]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

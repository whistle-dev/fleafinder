import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ink)] [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ink)] !text-[var(--paper)] hover:bg-[var(--ink-soft)] hover:!text-[var(--paper)] shadow-none",
        outline:
          "border border-[var(--line-strong)] bg-transparent !text-[var(--ink)] hover:bg-[var(--paper-warm)] hover:!text-[var(--ink)]",
        ghost:
          "!text-[var(--ink)] hover:bg-[var(--paper-warm)] hover:!text-[var(--ink)]",
        secondary:
          "bg-[var(--paper-cream)] !text-[var(--ink)] hover:bg-[var(--line-strong)] hover:!text-[var(--ink)]",
        accent:
          "bg-[var(--accent)] !text-[var(--paper)] hover:bg-[var(--accent-dark)] hover:!text-[var(--paper)] shadow-none",
        soft:
          "border border-[var(--line)] bg-[var(--paper-warm)] !text-[var(--ink)] hover:bg-[var(--paper-cream)] hover:!text-[var(--ink)]"
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-[13px]",
        lg: "h-12 px-8 text-[15px]",
        icon: "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }

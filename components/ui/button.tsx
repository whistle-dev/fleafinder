import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-lg)] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)] [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] !text-[#335405] hover:opacity-90 hover:!text-[#335405] shadow-none",
        outline:
          "border border-[var(--accent)] bg-transparent !text-[var(--accent)] hover:bg-[var(--accent-soft)] hover:!text-[var(--accent)]",
        ghost:
          "!text-[var(--ink)] hover:bg-[var(--accent-soft)] hover:!text-[var(--accent)]",
        secondary:
          "bg-[var(--surface-elevated)] !text-[var(--ink)] hover:bg-[var(--accent-soft)] hover:!text-[var(--accent)]",
        accent:
          "bg-[var(--accent)] !text-[#335405] hover:opacity-90 hover:!text-[#335405] shadow-none",
        soft: "border border-[var(--line)] bg-[var(--surface)] !text-[var(--ink)] hover:border-[var(--accent)] hover:!text-[var(--accent)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-[13px]",
        lg: "h-12 px-8 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

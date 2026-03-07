"use client";

import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  className,
  name,
  value,
  variant,
  size
}: {
  children: ReactNode;
  className?: string;
  name?: string;
  value?: string;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button className={className} disabled={pending} name={name} size={size} type="submit" value={value} variant={variant}>
      {pending ? "..." : children}
    </Button>
  );
}

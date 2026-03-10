"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackHref: string;
  children?: React.ReactNode;
  className?: string;
}

export function BackButton({
  fallbackHref,
  children = "Back",
  className,
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <Button asChild variant="ghost" className={className}>
      <Link
        href={fallbackHref}
        onClick={handleClick}
        className={cn("group relative overflow-hidden inline-flex items-center justify-start min-w-[5rem]")}
      >
        <i
          className="absolute left-0 top-0 bottom-0 z-10 flex w-10 items-center justify-center bg-[var(--ink)]/15 transition-[width] duration-500 ease-out group-hover:w-full"
          aria-hidden
        >
          <ArrowLeft
            className="opacity-70 shrink-0 ml-0.5"
            size={16}
            strokeWidth={2}
            aria-hidden
          />
        </i>
        <span className="relative z-0 ml-14 transition-opacity duration-500 group-hover:opacity-0">
          {children}
        </span>
      </Link>
    </Button>
  );
}

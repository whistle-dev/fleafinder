import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";

interface GetStartedButtonProps {
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export function GetStartedButton({
  href,
  children = "Get Started",
  className,
}: GetStartedButtonProps) {
  const content = (
    <>
      <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">
        {children}
      </span>
      <i
        className="absolute right-1 top-1 bottom-1 z-10 grid w-10 place-items-center rounded-sm bg-[var(--ink)]/15 text-[var(--paper)] transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95"
        aria-hidden
      >
        <ChevronRight size={16} strokeWidth={2} aria-hidden />
      </i>
    </>
  );

  if (href) {
    return (
      <Button
        asChild
        className={cn("group relative overflow-hidden", className)}
        size="lg"
      >
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      className={cn("group relative overflow-hidden", className)}
      size="lg"
    >
      {content}
    </Button>
  );
}

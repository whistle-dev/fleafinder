import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/cn"

type MarqueeProps = ComponentPropsWithoutRef<"div"> & {
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex gap-(--gap) overflow-hidden [--duration:28s] [--gap:1rem]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    >
      {Array.from({ length: repeat }).map((_, index) => (
        <div
          className={cn(
            "flex shrink-0 justify-around gap-(--gap)",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            reverse && "[animation-direction:reverse]",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          key={index}
        >
          {children}
        </div>
      ))}
    </div>
  )
}

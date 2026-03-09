"use client";

import React from "react"
import { useScreenSize } from "@/hooks/use-screen-size"
import { PixelTrail } from "@/components/ui/pixel-trail"

interface PixelTrailWrapperProps {
  className?: string
}

export const PixelTrailWrapper: React.FC<PixelTrailWrapperProps> = ({ className }) => {
  const screenSize = useScreenSize()

  return (
    <div className={`absolute inset-0 z-0 ${className}`}>
      <PixelTrail
        pixelSize={screenSize.lessThan(`md`) ? 48 : 80}
        fadeDuration={0}
        delay={1200}
        pixelClassName="rounded-full bg-[var(--accent)] opacity-40"
      />
    </div>
  )
}

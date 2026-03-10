"use client";

import Image from "next/image";
import { useState } from "react";

import { getCoverTintGradient, getMarketImageSrc } from "@/lib/utils";

export function MarketCoverImage({
  title,
  coverImageUrl,
  coverTint,
  imageClassName,
  priority = false
}: {
  title: string;
  coverImageUrl?: string | null;
  coverTint: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = !hasError ? getMarketImageSrc(coverImageUrl) : null;

  return (
    <>
      <div
        className="absolute inset-0 z-0"
        style={{ background: getCoverTintGradient(coverTint) }}
      />
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          unoptimized
          priority={priority}
          className={imageClassName}
          onError={() => setHasError(true)}
        />
      ) : null}
    </>
  );
}

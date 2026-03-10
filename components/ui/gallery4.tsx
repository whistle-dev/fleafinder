"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { HomepageReveal, HomepageWordReveal } from "@/components/ui/homepage-reveal";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  card: ReactNode;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
  viewAllHref: string;
  viewAllLabel: string;
  baseDelay?: number;
}

const HEADER_STAGGER = 0.08;
const CAROUSEL_DELAY_OFFSET = 0.18;
const SECTION_VIEWPORT_MARGIN = "0px 0px -18% 0px";

function Gallery4({
  title = "Case Studies",
  description,
  items,
  viewAllHref,
  viewAllLabel,
  baseDelay = 0,
}: Gallery4Props) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5 py-8 md:gap-6">
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 md:gap-x-4">
            <div className="min-w-0">
              <h2 className="font-display text-2xl text-[var(--accent)] md:text-3xl">
                <HomepageWordReveal
                  delay={baseDelay}
                  text={title}
                  wordDelay={HEADER_STAGGER}
                  amount={0.55}
                  margin={SECTION_VIEWPORT_MARGIN}
                />
              </h2>
            </div>
            <HomepageReveal
              delay={baseDelay + 0.1}
              y={12}
              amount={0.45}
              margin={SECTION_VIEWPORT_MARGIN}
            >
              <Link
                href={viewAllHref}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] underline decoration-[var(--line-strong)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]"
              >
                {viewAllLabel}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </HomepageReveal>
          </div>
          <HomepageReveal
            className="hidden shrink-0 items-center gap-3 md:flex"
            delay={baseDelay + 0.16}
            y={12}
            amount={0.45}
            margin={SECTION_VIEWPORT_MARGIN}
          >
            <Button
              size="icon"
              variant="soft"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous markets"
              className="disabled:opacity-40"
            >
              <ArrowLeft data-icon="inline-start" />
            </Button>
            <Button
              size="icon"
              variant="soft"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next markets"
              className="disabled:opacity-40"
            >
              <ArrowRight data-icon="inline-start" />
            </Button>
          </HomepageReveal>
        </div>
        {description ? (
          <HomepageReveal
            className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-base"
            delay={baseDelay + 0.22}
            y={16}
            amount={0.45}
            margin={SECTION_VIEWPORT_MARGIN}
          >
            {description}
          </HomepageReveal>
        ) : null}
      </div>

      <HomepageReveal
        delay={baseDelay + CAROUSEL_DELAY_OFFSET}
        y={20}
        amount={0.38}
        margin={SECTION_VIEWPORT_MARGIN}
      >
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="-ml-5 py-2 md:py-3">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-[86%] pl-5 pb-3 sm:basis-[68%] lg:basis-[42%] xl:basis-[34%]"
              >
                <div className="px-1 pt-1 md:px-2 md:pt-2">
                  {item.card}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </HomepageReveal>
    </section>
  );
}

export { Gallery4 };

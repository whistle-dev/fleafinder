'use client'

import Link from "next/link"
import Image from "next/image"
import { CenterUnderline, ComesInGoesOutUnderline, GoesOutComesInUnderline } from "@/components/ui/underline-animation"
import { Locale } from "@/lib/types"

interface FooterProps {
  locale: Locale;
  dictionary: {
    navigation: {
      explore: string;
      addMarket: string;
    };
  };
}

export function Footer({ locale, dictionary }: FooterProps) {
  return (
    <footer className="mt-12 border-t border-[var(--line-subtle)] pt-8 pb-8 bg-transparent text-[var(--accent)] font-body">
      <div className="flex flex-row items-start justify-between gap-4 md:gap-6 w-full text-[10px] sm:text-xs uppercase">
        {/* Left: Fleafinder logo + name */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-7 h-7 sm:w-8 sm:h-8">
            <div className="w-full h-full bg-[var(--accent)]" style={{ maskImage: "url('/flea-logo.png')", WebkitMaskImage: "url('/flea-logo.png')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-[-0.03em] text-xs sm:text-sm">
              FLEAFINDER
            </span>
            <span className="opacity-70 text-[10px] sm:text-xs">
              &copy; {new Date().getFullYear()}
            </span>
          </div>
        </div>

        {/* Right: contact block */}
        <div className="flex flex-col items-end text-right text-xs sm:text-sm text-[var(--accent)] font-medium pt-1 sm:pt-1.5">
          <div className="font-display tracking-tight text-[var(--accent)]">
            CONTACT
          </div>
          <ul className="flex flex-col items-end space-y-1.5 pt-4 font-body">
            <li>
              <Link href="#">
                <CenterUnderline
                  label="LINKEDIN"
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li>
              <Link href="#">
                <ComesInGoesOutUnderline
                  label="INSTAGRAM"
                  direction="right"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </Link>
            </li>
            <li>
              <Link href="#">
                <ComesInGoesOutUnderline
                  label="X (TWITTER)"
                  direction="left"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </Link>
            </li>

            <div className="pt-3">
              <ul className="flex flex-col items-end space-y-1.5">
                <li>
                  <Link href="#">
                    <GoesOutComesInUnderline
                      label="HELLO@FLEAFINDER.APP"
                      direction="left"
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </ul>
        </div>
      </div>
    </footer>
  )
}

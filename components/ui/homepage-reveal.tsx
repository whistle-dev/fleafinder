"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SPRING = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.82,
};

type HomepageRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  margin?: string;
  style?: CSSProperties;
  trigger?: "in-view" | "mount";
};

export function HomepageReveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.25,
  margin,
  style,
  trigger = "in-view",
}: HomepageRevealProps) {
  const reduceMotion = useReducedMotion();
  const target = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      className={className}
      style={style}
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y, filter: "blur(10px)" }
      }
      animate={trigger === "mount" ? target : undefined}
      whileInView={trigger === "in-view" ? target : undefined}
      viewport={trigger === "in-view" ? { once: true, amount, margin } : undefined}
      transition={{
        ...(reduceMotion ? { duration: 0.2 } : SPRING),
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

type HomepageWordRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  wordDelay?: number;
  y?: number;
  amount?: number;
  margin?: string;
};

export function HomepageWordReveal({
  text,
  className,
  delay = 0,
  wordDelay = 0.045,
  y = 18,
  amount = 0.35,
  margin,
}: HomepageWordRevealProps) {
  const reduceMotion = useReducedMotion();
  const segments = text.split(/(\s+)/);
  let wordIndex = 0;

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (!segment.trim()) {
          return <span key={`space-${index}`}>{segment}</span>;
        }

        const currentWordIndex = wordIndex++;

        return (
          <motion.span
            key={`${segment}-${index}`}
            className="inline-block will-change-transform"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y, filter: "blur(10px)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount, margin }}
            transition={{
              ...(reduceMotion ? { duration: 0.2 } : SPRING),
              delay: delay + currentWordIndex * wordDelay,
            }}
          >
            {segment}
          </motion.span>
        );
      })}
    </span>
  );
}

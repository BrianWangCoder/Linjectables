"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode, ElementType } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 1.1, ease: EASE, delay: i } }),
};

/** Fade + translate up when entering the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  amount = 0.25,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span" | "article";
  amount?: number;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={fadeUp} custom={delay} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Comp>
  );
}

/** Parent that staggers any <StaggerItem> children. */
export function Stagger({
  children,
  className,
  stagger = 0.1,
  delay = 0,
  as = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: "div" | "ul" | "ol" | "form" | "dl";
  amount?: number;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "article" | "dt" | "dd" }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={{ hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE } } }}>
      {children}
    </Comp>
  );
}

/**
 * Line-by-line mask reveal for headlines. Pass text with "\n" to control lines.
 * Each line slides up from behind a clip mask, staggered.
 */
export function RevealText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.12,
  immediate = false,
  id,
}: {
  id?: string;
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  /** animate on mount (hero) instead of on scroll */
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  const lines = text.split("\n");
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.4 } };
  return (
    <Tag id={id} className={className} aria-label={text.replace(/\n/g, " ")}>
      <motion.span
        aria-hidden
        className="block"
        initial={reduce ? "show" : "hidden"}
        {...trigger}
        variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
            <motion.span
              className="block will-change-transform"
              variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.2, ease: EASE } } }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

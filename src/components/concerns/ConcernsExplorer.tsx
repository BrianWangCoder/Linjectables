"use client";

import Image from "next/image";
import Link from "@/components/i18n/LocaleLink";
import { useI18n } from "@/components/i18n/I18nProvider";
import { fmt } from "@/i18n";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import type { Img } from "@/lib/types";

export type ConcernView = {
  slug: string;
  title: string;
  label: string;
  x: number;
  y: number;
  side: "left" | "right";
  description: string;
  treatments: { title: string; slug: string; shortDescription: string }[];
};

export default function ConcernsExplorer({ concerns, portrait }: { concerns: ConcernView[]; portrait: Img }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const c = concerns[active];
  if (!c) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      {/* Mobile / keyboard-friendly tab list */}
      <div role="tablist" aria-label={t.concerns.areas} className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] lg:hidden">
        {concerns.map((x, i) => (
          <button
            key={x.slug}
            role="tab"
            aria-selected={i === active}
            aria-controls="concern-panel"
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 rounded-full border px-5 py-2.5 text-[12px] uppercase tracking-[0.18em] transition-colors duration-500",
              i === active ? "border-ink bg-ink text-paper" : "border-ink/25",
            )}
          >
            {x.label}
          </button>
        ))}
      </div>

      {/* Portrait with hotspots */}
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-sand lg:col-span-6"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.div
          className="absolute inset-0"
          variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: EASE } } }}
        >
          <Image src={portrait.src} alt={portrait.alt} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        </motion.div>
        {concerns.map((x, i) => {
          const on = i === active;
          return (
            <button
              key={x.slug}
              onClick={() => setActive(i)}
              aria-label={fmt(t.concerns.show, { title: x.title })}
              aria-pressed={on}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x.x}%`, top: `${x.y}%` }}
            >
              <span className="relative grid h-5 w-5 place-items-center">
                <span className={cn("absolute inset-0 rounded-full bg-white/70", "animate-pulse-ring")} style={{ animationDelay: `${i * 0.3}s` }} />
                <span className={cn("relative h-3 w-3 rounded-full border border-white transition-all duration-500 ease-lux", on ? "scale-125 bg-ink" : "bg-white")} />
              </span>
              {/* connector line + label (desktop) */}
              <span
                className={cn(
                  "pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-2 sm:flex",
                  x.side === "right" ? "left-full flex-row pl-1" : "right-full flex-row-reverse pr-1",
                )}
              >
                <span className={cn("block h-px bg-white transition-all duration-700 ease-lux", on ? "w-16" : "w-8 group-hover:w-12")} />
                <span
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] backdrop-blur transition-colors duration-500",
                    on ? "bg-ink text-paper" : "bg-white/80 text-ink",
                  )}
                >
                  {x.label}
                </span>
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* Panel */}
      <div id="concern-panel" role="tabpanel" aria-live="polite" className="relative lg:col-span-6 lg:flex lg:items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={c.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full"
          >
            <p className="eyebrow text-stone">{c.label}</p>
            <h2 className="display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{c.title}</h2>
            <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/75">{c.description}</p>

            <p className="eyebrow mt-12 text-stone">{t.concerns.options}</p>
            <ol className="mt-4 border-t border-line">
              {c.treatments.map((t, i) => (
                <motion.li
                  key={t.slug}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.07 }}
                  className="border-b border-line"
                >
                  <Link href={`/treatments/${t.slug}`} className="group flex items-baseline gap-6 py-5">
                    <span className="text-xs tabular-nums text-stone">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">
                      <span className="display block text-2xl transition-transform duration-700 ease-lux group-hover:translate-x-1.5">{t.title}</span>
                      <span className="mt-1 block text-sm text-stone">{t.shortDescription}</span>
                    </span>
                    <span className="transition-transform duration-700 ease-lux group-hover:translate-x-1" aria-hidden>→</span>
                  </Link>
                </motion.li>
              ))}
            </ol>
            <Link href="/treatments" className="btn btn-dark mt-10">{t.concerns.exploreAll}</Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

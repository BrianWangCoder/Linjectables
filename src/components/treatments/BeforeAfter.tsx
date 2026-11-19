"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/components/motion/Reveal";
import type { BeforeAfter as Pair } from "@/lib/types";
import { useI18n } from "@/components/i18n/I18nProvider";

/** Draggable comparison slider (mouse, touch, keyboard). */
export function CompareSlider({ pair }: { pair: Pair }) {
  const { t } = useI18n();
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromEvent = useCallback((clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onDown = (e: PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    fromEvent(e.clientX);
  };
  const onMove = (e: PointerEvent) => dragging.current && fromEvent(e.clientX);
  const onUp = () => (dragging.current = false);
  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  return (
    <figure>
      <div
        ref={box}
        className="relative aspect-square cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[22px] bg-sand"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <Image src={pair.after.src} alt={pair.after.alt} fill sizes="(min-width:1024px) 33vw, 90vw" className="pointer-events-none object-cover" draggable={false} />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={pair.before.src} alt={pair.before.alt} fill sizes="(min-width:1024px) 33vw, 90vw" className="pointer-events-none object-cover" draggable={false} />
        </div>
        <span className="eyebrow pointer-events-none absolute left-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-[10px]">{t.treatments.before}</span>
        <span className="eyebrow pointer-events-none absolute right-4 top-4 rounded-full bg-paper/85 px-3 py-1 text-[10px]">{t.treatments.after}</span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }}>
          <div
            role="slider"
            tabIndex={0}
            aria-label={t.treatments.compare}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            aria-valuetext={`${Math.round(pos)}% ${t.treatments.before}`}
            onKeyDown={onKey}
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-white text-ink shadow-lg focus-visible:outline-ink"
          >
            <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden><path d="M6.5 1L1.5 6l5 5" stroke="currentColor" fill="none" strokeWidth="1.4" /></svg>
            <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden><path d="M1.5 1l5 5-5 5" stroke="currentColor" fill="none" strokeWidth="1.4" /></svg>
          </div>
        </div>
      </div>
      {pair.caption && <figcaption className="mt-4 text-sm text-stone">{pair.caption}</figcaption>}
    </figure>
  );
}

/** Row of comparison sliders; becomes a swipeable carousel on small screens. */
export default function BeforeAfterGallery({ pairs }: { pairs: Pair[] }) {
  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
      {pairs.map((p, i) => (
        <motion.div
          key={i}
          className="w-[84vw] shrink-0 snap-center sm:w-[60vw] lg:w-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
        >
          <CompareSlider pair={p} />
        </motion.div>
      ))}
    </div>
  );
}

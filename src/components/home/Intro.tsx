"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";

/** Large philosophy statement – words brighten from grey to ink as you scroll through. */
export default function Intro({ eyebrow, text }: { eyebrow: string; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  // Chinese has no spaces between words – highlight character by character instead
  const spaced = /\s/.test(text.trim());
  const words = spaced ? text.split(" ") : Array.from(text);
  return (
    <section className="container-lux py-28 lg:py-44">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <p className="eyebrow text-stone">{eyebrow}</p>
        </Reveal>
        <p ref={ref} className="display text-[1.9rem] leading-[1.18] sm:text-4xl lg:col-span-9 lg:text-[3.2rem] lg:leading-[1.12]">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {spaced ? `${w} ` : w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}
    </motion.span>
  );
}

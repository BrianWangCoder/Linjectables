"use client";

import Image from "next/image";
import Link from "@/components/i18n/LocaleLink";
import { useI18n } from "@/components/i18n/I18nProvider";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BookButton from "@/components/booking/BookButton";
import { EASE, RevealText } from "@/components/motion/Reveal";
import type { SiteSettings } from "@/lib/types";

export default function Hero({ hero }: { hero: SiteSettings["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [playVideo, setPlayVideo] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Only load the video on capable connections / without reduced motion
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (hero.videoUrl && !reduce && !conn?.saveData) setPlayVideo(true);
  }, [hero.videoUrl, reduce]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink text-white">
      <motion.div className="absolute inset-0" style={{ y }}>
        <motion.div className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
          <Image src={hero.poster.src} alt={hero.poster.alt} fill priority sizes="100vw" className="object-cover" />
          {playVideo && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={hero.videoUrl}
              poster={hero.poster.src}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden
            />
          )}
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/30" />

      <motion.div style={{ opacity: fade }} className="container-lux relative flex h-full flex-col justify-end pb-28 lg:pb-24">
        <motion.p className="eyebrow mb-6 text-white/80" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.5 }}>
          {hero.eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          immediate
          delay={0.6}
          stagger={0.14}
          text={hero.headline}
          className="display max-w-5xl text-[clamp(3rem,9vw,8.5rem)] leading-[0.95]"
        />
        <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <motion.p className="max-w-md text-base text-white/80 sm:text-lg" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.1 }}>
            {hero.subheadline}
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE, delay: 1.3 }}>
            <Link href="/treatments" className="btn btn-outline-light">{t.home.explore}</Link>
            <BookButton variant="light" label={t.booking.consultation} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }} aria-hidden>
        <span className="block h-12 w-px overflow-hidden bg-white/25">
          <motion.span className="block h-1/2 w-full bg-white" animate={{ y: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      </motion.div>
    </section>
  );
}

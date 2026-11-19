"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Desktop: the section pins and the gallery travels horizontally as you scroll
 * (GSAP ScrollTrigger), with each image drifting at its own parallax rate.
 * Mobile / reduced motion: a native swipeable row with scroll-snap.
 */
export default function ClinicGallery({ experience }: { experience: SiteSettings["experience"] }) {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -6 * Number(img.dataset.speed) },
            { xPercent: 6 * Number(img.dataset.speed), ease: "none", scrollTrigger: { trigger: img, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  const shapes = ["h-[56vh] w-[42vw]", "h-[68vh] w-[30vw] self-end", "h-[46vh] w-[34vw]", "h-[62vh] w-[26vw] self-end", "h-[52vh] w-[40vw]"];

  return (
    <section ref={section} className="overflow-hidden bg-paper py-24 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:px-8 lg:snap-none lg:gap-10 lg:overflow-visible lg:px-14 lg:pb-0"
      >
        <div className="flex w-[82vw] shrink-0 snap-start flex-col justify-center pr-6 sm:w-[60vw] lg:w-[34vw] lg:pr-16">
          <Reveal>
            <p className="eyebrow text-stone">{experience.eyebrow}</p>
          </Reveal>
          <RevealText as="h2" text={experience.heading} className="h-section mt-5" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink/75">{experience.text}</p>
            <p className="eyebrow mt-10 hidden text-stone lg:block">{t.home.scroll}</p>
          </Reveal>
        </div>
        {experience.images.map((img, i) => (
          <figure
            key={img.src + i}
            className={cn(
              "relative h-[60vh] max-h-[520px] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[22px] sm:w-[52vw] lg:max-h-none",
              shapes[i % shapes.length],
            )}
          >
            <div className="absolute inset-y-0 -left-[10%] w-[120%]" data-speed={(i % 3) + 1}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 42vw, 80vw" className="object-cover" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

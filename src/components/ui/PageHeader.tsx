import { Reveal, RevealText } from "@/components/motion/Reveal";
import type { ReactNode } from "react";

/** Standard inner-page header: eyebrow, big line-reveal H1, optional intro. */
export default function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro?: string; children?: ReactNode }) {
  return (
    <header className="container-lux pb-16 pt-36 lg:pb-24 lg:pt-48">
      <Reveal>
        <p className="eyebrow text-stone">{eyebrow}</p>
      </Reveal>
      <RevealText as="h1" immediate delay={0.2} text={title} className="display mt-6 max-w-5xl text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.98]" />
      {intro && (
        <Reveal delay={0.4}>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-ink/75 sm:text-base">{intro}</p>
        </Reveal>
      )}
      {children}
    </header>
  );
}

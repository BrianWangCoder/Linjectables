import Link from "@/components/i18n/LocaleLink";
import BookButton from "@/components/booking/BookButton";
import { Reveal, RevealText } from "@/components/motion/Reveal";
import type { Dictionary } from "@/i18n";

export default function CtaBand({ heading, text, t }: { heading: string; text: string; t: Dictionary }) {
  return (
    <section className="bg-ink py-28 text-center text-white lg:py-40">
      <div className="container-lux flex flex-col items-center">
        <Reveal>
          <p className="eyebrow text-white/60">{t.home.journey}</p>
        </Reveal>
        <RevealText as="h2" text={heading} className="h-section mt-6 max-w-4xl" />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-md text-white/70">{text}</p>
        </Reveal>
        <Reveal delay={0.25} className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/treatments" className="btn btn-outline-light">{t.home.explore}</Link>
          <BookButton variant="light" label={t.booking.consultation} />
        </Reveal>
      </div>
    </section>
  );
}

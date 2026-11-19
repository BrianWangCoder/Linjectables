import ImageReveal from "@/components/motion/ImageReveal";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/motion/Reveal";
import BookButton from "@/components/booking/BookButton";
import type { SiteSettings } from "@/lib/types";
import type { Dictionary } from "@/i18n";

export default function Injector({ injector, t }: { injector: SiteSettings["injector"]; t: Dictionary }) {
  const i = injector;
  return (
    <section id="about" className="scroll-mt-24 py-24 lg:py-36">
      <div className="container-lux grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
        <ImageReveal
          image={i.image}
          className="aspect-[4/5] rounded-[22px] lg:col-span-6"
          parallax={50}
          sizes="(min-width:1024px) 45vw, 100vw"
        />
        <div className="lg:col-span-6 xl:pr-10">
          <Reveal>
            <p className="eyebrow text-stone">{i.eyebrow}</p>
          </Reveal>
          <RevealText as="h2" text={i.name} className="h-section mt-5" />
          <Reveal delay={0.15}>
            <p className="mt-4 text-[12px] uppercase tracking-[0.22em]">{i.title}</p>
          </Reveal>

          <Stagger className="mt-10 space-y-6 text-[15px] leading-relaxed text-ink/80" delay={0.2}>
            <StaggerItem><p>{i.bio}</p></StaggerItem>
            <StaggerItem>
              <p className="display text-2xl leading-snug text-ink">&ldquo;{i.approach}&rdquo;</p>
            </StaggerItem>
            <StaggerItem>
              <dl className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
                <div>
                  <dt className="eyebrow text-stone">{t.home.qualifications}</dt>
                  <dd>
                    <ul className="mt-3 space-y-1.5">
                      {i.qualifications.map((q) => <li key={q}>{q}</li>)}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-stone">{t.home.experience}</dt>
                  <dd className="mt-3">{i.experience}</dd>
                </div>
              </dl>
            </StaggerItem>
            <StaggerItem className="pt-4">
              <BookButton variant="outline" label={t.booking.aConsultation} />
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}

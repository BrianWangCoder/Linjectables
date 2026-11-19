import Link from "@/components/i18n/LocaleLink";
import TreatmentCard from "./TreatmentCard";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { categoryHref, type CatalogueCategory } from "@/lib/content";
import type { Dictionary } from "@/i18n";

/** Cream section with the six category cards – used on the homepage and /treatments. */
export default function TreatmentsSection({
  catalogue,
  t,
  showViewAll = true,
  headingAs = "h2",
}: {
  t: Dictionary;
  catalogue: CatalogueCategory[];
  showViewAll?: boolean;
  headingAs?: "h1" | "h2";
}) {
  return (
    <section id="treatments" className="bg-cream py-24 lg:py-36">
      <div className="container-lux">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Reveal>
              <p className="eyebrow text-stone">{t.treatments.eyebrow}</p>
            </Reveal>
            <RevealText as={headingAs} text={t.treatments.heading} className="h-section mt-5" />
          </div>
          {showViewAll && (
            <Reveal delay={0.2}>
              <Link href="/treatments" className="link-underline text-[12px] font-medium uppercase tracking-[0.2em]">
                {t.treatments.viewAll}
              </Link>
            </Reveal>
          )}
        </div>

        <Stagger className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-8" stagger={0.12}>
          {catalogue.map((c, i) => (
            <StaggerItem key={c.slug}>
              <TreatmentCard
                href={categoryHref(c)}
                image={c.image}
                tag={c.tag}
                label={c.title}
                title={c.treatments[0]?.title ?? c.title}
                subtitle={c.subtitle}
                priority={i < 3 && headingAs === "h1"}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

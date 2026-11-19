import type { Metadata } from "next";
import Link from "@/components/i18n/LocaleLink";
import TreatmentsSection from "@/components/treatments/TreatmentsSection";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import JsonLd from "@/components/ui/JsonLd";
import { getCatalogue } from "@/lib/content";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { formatPrice, startingPrice } from "@/lib/utils";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return pageMetadata({ ...t.meta.treatments, path: "/treatments", locale });
}

export default async function TreatmentsPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const catalogue = await getCatalogue(locale);
  return (
    <>
      <div className="pt-16 lg:pt-20" />
      <TreatmentsSection catalogue={catalogue} t={t} showViewAll={false} headingAs="h1" />

      <section className="container-lux py-24 lg:py-32" aria-labelledby="all-treatments">
        <Reveal>
          <h2 id="all-treatments" className="eyebrow text-stone">{t.treatments.all}</h2>
        </Reveal>
        <Stagger as="ul" className="mt-10 border-t border-line">
          {catalogue.flatMap((c) =>
            c.treatments.map((tr) => {
              const from = startingPrice(tr.prices);
              return (
                <StaggerItem as="li" key={tr.slug} className="border-b border-line">
                  <Link href={`/treatments/${tr.slug}`} className="group grid items-baseline gap-2 py-7 sm:grid-cols-12 sm:gap-6">
                    <span className="eyebrow text-stone sm:col-span-3">{c.title}</span>
                    <span className="display text-3xl transition-transform duration-700 ease-lux group-hover:translate-x-2 sm:col-span-5 lg:text-4xl">{tr.title}</span>
                    <span className="text-sm text-stone sm:col-span-3">{from ? formatPrice(from, true, t) : ""}</span>
                    <span className="hidden text-right transition-transform duration-700 ease-lux group-hover:translate-x-1 sm:col-span-1 sm:block" aria-hidden>→</span>
                  </Link>
                </StaggerItem>
              );
            }),
          )}
        </Stagger>
      </section>
      <JsonLd data={breadcrumbJsonLd([{ name: t.notFound.home, path: "/" }, { name: t.nav.treatments, path: "/treatments" }], locale)} />
    </>
  );
}

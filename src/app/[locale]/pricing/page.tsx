import type { Metadata } from "next";
import Link from "@/components/i18n/LocaleLink";
import PageHeader from "@/components/ui/PageHeader";
import Accordion from "@/components/ui/Accordion";
import BookButton from "@/components/booking/BookButton";
import JsonLd from "@/components/ui/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { getActivePromotions, getCatalogue } from "@/lib/content";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { formatPrice, startingPrice } from "@/lib/utils";
import { fmt, getDictionary } from "@/i18n";
import { localeMeta, type Locale } from "@/i18n/config";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata({ ...getDictionary(locale).meta.pricing, path: "/pricing", locale });
}

export default async function PricingPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const [catalogue, promotions] = await Promise.all([getCatalogue(locale), getActivePromotions(locale)]);

  return (
    <>
      <PageHeader
        eyebrow="Price list"
        title={"Simple, transparent\npricing"}
        intro="All prices are in NZD and are a guide only. Your final plan and price are confirmed at consultation."
      />

      {promotions.length > 0 && (
        <section className="container-lux pb-16" aria-labelledby="promos-h">
          <Reveal><h2 id="promos-h" className="eyebrow text-stone">{t.pricing.promotions}</h2></Reveal>
          <Stagger className="mt-6 grid gap-5 md:grid-cols-2">
            {promotions.map((p) => (
              <StaggerItem key={p.title} className="flex flex-col justify-between rounded-[22px] bg-ink p-8 text-white sm:p-10">
                <div>
                  <p className="display text-3xl">{p.title}</p>
                  <p className="mt-3 text-white/75">{p.description}</p>
                  {p.endDate && <p className="eyebrow mt-5 text-white/50">{fmt(t.pricing.until, { date: new Date(p.endDate).toLocaleDateString(localeMeta[locale].intl, { day: "numeric", month: "long", year: "numeric" }) })}</p>}
                </div>
                <div className="mt-8">
                  {p.ctaUrl ? (
                    <a href={p.ctaUrl} className="btn btn-light">{p.ctaLabel || t.pricing.learnMore}</a>
                  ) : (
                    <BookButton variant="light" label={p.ctaLabel || t.nav.bookNow} />
                  )}
                  {p.disclaimer && <p className="mt-6 text-[11px] leading-relaxed text-white/50">{p.disclaimer}</p>}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      <section className="container-lux pb-24 lg:pb-36" aria-label={t.pricing.byCategory}>
        <Reveal>
          <Accordion
            defaultOpen={[0]}
            items={catalogue.map((c) => {
              const prices = c.treatments.flatMap((tr) => tr.prices);
              const from = startingPrice(prices);
              return {
                id: c.slug,
                title: c.title,
                meta: from ? <span className="hidden text-sm text-stone sm:inline">{formatPrice(from, true, t)}</span> : null,
                content: (
                  <div className="space-y-10">
                    {c.treatments.map((tr) => (
                      <div key={tr.slug}>
                        {c.treatments.length > 1 && <p className="eyebrow mb-2 text-stone">{tr.title}</p>}
                        <ul>
                          {tr.prices.map((p) => (
                            <li key={p.name} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-b border-line py-5 last:border-b-0 md:grid-cols-12">
                              <div className="md:col-span-5">
                                <p className="text-[17px]">{p.name}</p>
                                {p.unit && <p className="mt-0.5 text-sm text-stone">{p.unit}</p>}
                              </div>
                              <p className="display text-right text-2xl md:col-span-3 md:text-left">{formatPrice(p.price, p.from, t)}</p>
                              <div className="col-span-2 flex items-center gap-5 md:col-span-4 md:justify-end">
                                <Link href={`/treatments/${tr.slug}`} className="link-underline text-[12px] uppercase tracking-[0.18em]">
                                  {t.pricing.learnMore}
                                </Link>
                                <BookButton url={p.timelyBookingUrl || tr.timelyBookingUrl} label={fmt(t.treatments.bookTitle, { title: p.name })} className="!px-5 !py-2.5">

                                </BookButton>
                              </div>
                            </li>
                          ))}
                        </ul>
                        {tr.priceNote && <p className="mt-3 text-xs text-stone">{tr.priceNote}</p>}
                      </div>
                    ))}
                  </div>
                ),
              };
            })}
          />
        </Reveal>
        <Reveal>
          <p className="mt-10 max-w-2xl text-xs leading-relaxed text-stone">
            {t.pricing.disclaimer}
          </p>
        </Reveal>
      </section>

      {catalogue.flatMap((c) => c.treatments).map((tr) => (
        <JsonLd key={tr.slug} data={serviceJsonLd(tr, locale)} />
      ))}
    </>
  );
}

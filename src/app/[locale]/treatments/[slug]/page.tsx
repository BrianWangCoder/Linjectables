import { notFound } from "next/navigation";
import Link from "@/components/i18n/LocaleLink";
import type { Metadata } from "next";
import ImageReveal from "@/components/motion/ImageReveal";
import { Reveal, RevealText, Stagger, StaggerItem } from "@/components/motion/Reveal";
import BookButton from "@/components/booking/BookButton";
import Accordion from "@/components/ui/Accordion";
import BeforeAfterGallery from "@/components/treatments/BeforeAfter";
import TreatmentCard from "@/components/treatments/TreatmentCard";
import JsonLd from "@/components/ui/JsonLd";
import { CheckIcon } from "@/components/ui/Icons";
import { getCategories, getTreatment, getTreatments } from "@/lib/content";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, serviceJsonLd } from "@/lib/seo";
import { formatPrice, paragraphs, startingPrice } from "@/lib/utils";
import { fmt, getDictionary } from "@/i18n";
import { locales, type Locale } from "@/i18n/config";

export const revalidate = 60;
export const dynamicParams = true; // new CMS treatments render on first request, then cache

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = (params?.locale ?? locales[0]) as Locale;
  return (await getTreatments(locale)).map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await params).locale as Locale;
  const t = await getTreatment(locale, slug);
  if (!t) return {};
  const tx = getDictionary(locale);
  return pageMetadata({
    title: t.seo.title || fmt(tx.meta.treatmentFallback, { title: t.title }),
    description: t.seo.description || t.shortDescription,
    path: `/treatments/${t.slug}`,
    image: t.seo.ogImage,
    locale,
  });
}

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const locale = (await params).locale as Locale;
  const tx = getDictionary(locale);
  const [t, all, cats] = await Promise.all([getTreatment(locale, slug), getTreatments(locale), getCategories(locale)]);
  if (!t) notFound();

  const category = cats.find((c) => c.slug === t.category);
  const from = startingPrice(t.prices);
  const related = t.related.map((s) => all.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const details = [
    [tx.treatments.details.duration, t.details.duration],
    [tx.treatments.details.downtime, t.details.downtime],
    [tx.treatments.details.onset, t.details.onset],
    [tx.treatments.details.longevity, t.details.longevity],
    [tx.treatments.details.sessions, t.details.sessions],
  ] as const;

  return (
    <article>
      {/* 1 · Hero */}
      <header className="container-lux pt-32 lg:pt-44">
        <Reveal>
          <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap gap-2 text-stone">
            <Link href="/treatments" className="link-underline">{tx.treatments.breadcrumb}</Link>
            <span aria-hidden>/</span>
            <span>{category?.title ?? tx.treatments.treatment}</span>
          </nav>
        </Reveal>
        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-end">
          <RevealText as="h1" immediate delay={0.2} text={t.title} className="display text-[clamp(2.9rem,8vw,7.5rem)] leading-[0.95] lg:col-span-8" />
          <Reveal delay={0.5} className="lg:col-span-4 lg:pb-3">
            <p className="text-[15px] leading-relaxed text-ink/75">{t.shortDescription}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <BookButton url={t.timelyBookingUrl} label={fmt(tx.treatments.bookTitle, { title: t.title })}>{tx.booking.treatment}</BookButton>
              {from && <span className="text-sm text-stone">{formatPrice(from, true, tx)}</span>}
            </div>
          </Reveal>
        </div>
      </header>
      <div className="container-lux mt-14 lg:mt-20">
        <ImageReveal image={t.heroImage} priority className="aspect-[4/5] rounded-[22px] sm:aspect-[16/9] lg:aspect-[21/9]" parallax={60} sizes="100vw" />
      </div>

      {/* 2 · Introduction */}
      <section className="container-lux grid gap-10 py-24 lg:grid-cols-12 lg:py-36">
        <Reveal className="lg:col-span-4">
          <h2 className="eyebrow text-stone">{tx.treatments.whatIsIt}</h2>
        </Reveal>
        <div className="lg:col-span-8">
          <Reveal>
            <p className="display text-3xl leading-[1.2] sm:text-4xl lg:text-[2.75rem]">{t.intro}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-10 border-t border-line pt-6">
              <h3 className="eyebrow text-stone">{tx.treatments.addresses}</h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/80">{t.addresses}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · Benefits & areas */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="container-lux grid gap-16 lg:grid-cols-2">
          <div>
            <RevealText as="h2" text={tx.treatments.benefits} className="h-section" />
            <Stagger as="ul" className="mt-10 space-y-4">
              {t.benefits.map((b) => (
                <StaggerItem as="li" key={b} className="flex items-center gap-4 border-b border-ink/10 pb-4 text-lg">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-paper"><CheckIcon className="h-4 w-4" /></span>
                  {b}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
          <div>
            <RevealText as="h2" text={tx.treatments.areas} className="h-section" />
            <Stagger as="ul" className="mt-10 flex flex-wrap gap-3" stagger={0.05}>
              {t.areas.map((a) => (
                <StaggerItem as="li" key={a} className="rounded-full border border-ink/25 px-5 py-2.5 text-sm">
                  {a}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* 4 · How it works  +  5 · Details */}
      <section className="container-lux py-24 lg:py-36">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="eyebrow text-stone">{tx.treatments.howItWorks}</h2>
          </Reveal>
          <div className="space-y-5 text-lg leading-relaxed text-ink/85 lg:col-span-8">
            {paragraphs(t.howItWorks).map((p, i) => (
              <Reveal key={i} delay={i * 0.05}><p>{p}</p></Reveal>
            ))}
          </div>
        </div>
        <Stagger as="dl" className="mt-20 grid grid-cols-2 border-t border-line sm:grid-cols-3 lg:grid-cols-5">
          {details.map(([label, value]) => (
            <StaggerItem key={label} className="border-b border-line py-8 pr-4 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
              <dt className="eyebrow text-stone">{label}</dt>
              <dd className="display mt-3 text-2xl leading-tight">{value}</dd>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* 6 · Pricing (same CMS rows as /pricing) */}
      <section className="bg-ink py-24 text-white lg:py-32" aria-labelledby="pricing-h">
        <div className="container-lux grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal><p className="eyebrow text-white/55">{tx.treatments.investment}</p></Reveal>
            <RevealText as="h2" id="pricing-h" text={tx.treatments.pricing} className="h-section mt-5" />
            {t.priceNote && <Reveal delay={0.1}><p className="mt-6 max-w-xs text-sm text-white/60">{t.priceNote}</p></Reveal>}
          </div>
          <Stagger as="ul" className="border-t border-white/15 lg:col-span-8">
            {t.prices.map((p) => (
              <StaggerItem as="li" key={p.name} className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 py-6">
                <div>
                  <p className="text-lg">{p.name}</p>
                  {p.unit && <p className="mt-1 text-sm text-white/55">{p.unit}</p>}
                </div>
                <div className="flex items-center gap-6">
                  <span className="display text-2xl">{formatPrice(p.price, p.from, tx)}</span>
                  <BookButton url={p.timelyBookingUrl || t.timelyBookingUrl} label={fmt(tx.treatments.bookTitle, { title: p.name })} variant="outline-light" className="!px-5 !py-2.5">
                    {tx.booking.book}
                  </BookButton>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 7 · Before & after */}
      {t.showBeforeAfter && t.beforeAfter.length > 0 && (
        <section className="container-lux py-24 lg:py-36" aria-labelledby="ba-h">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Reveal><p className="eyebrow text-stone">{tx.treatments.results}</p></Reveal>
              <RevealText as="h2" id="ba-h" text={tx.treatments.beforeAfter} className="h-section mt-5" />
            </div>
            <Reveal delay={0.1}><p className="max-w-xs text-sm text-stone">{tx.treatments.beforeAfterNote}</p></Reveal>
          </div>
          <div className="mt-14">
            <BeforeAfterGallery pairs={t.beforeAfter} />
          </div>
        </section>
      )}

      {/* 8 · FAQs  +  9 · Safety */}
      <section className="bg-cream py-24 lg:py-36">
        <div className="container-lux grid gap-20 lg:grid-cols-2 lg:gap-16">
          {t.faqs.length > 0 && (
            <div>
              <RevealText as="h2" text={tx.treatments.faqs} className="h-section" />
              <Reveal delay={0.1}>
                <Accordion className="mt-10" titleClassName="text-lg" items={t.faqs.map((f) => ({ title: f.question, content: <p className="max-w-xl leading-relaxed text-ink/75">{f.answer}</p> }))} />
              </Reveal>
            </div>
          )}
          {t.safety.length > 0 && (
            <div>
              <RevealText as="h2" text={"Safety &\naftercare"} className="h-section" />
              <Reveal delay={0.1}>
                <Accordion
                  className="mt-10"
                  titleClassName="text-lg"
                  items={t.safety.map((s) => ({
                    title: s.title,
                    content: (
                      <div className="max-w-xl space-y-4 leading-relaxed text-ink/75">
                        {paragraphs(s.body).map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    ),
                  }))}
                />
              </Reveal>
            </div>
          )}
        </div>
      </section>

      {/* 10 · Book this treatment */}
      <section className="container-lux py-24 text-center lg:py-36">
        <Reveal><p className="eyebrow text-stone">{tx.treatments.ready}</p></Reveal>
        <RevealText as="h2" text={fmt(tx.treatments.bookTitle, { title: locale === "en" ? t.title.toLowerCase() : t.title })} className="h-section mx-auto mt-5 max-w-4xl" />
        <Reveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-3">
          <BookButton url={t.timelyBookingUrl} label={fmt(tx.treatments.bookTitle, { title: t.title })}>{tx.booking.treatment}</BookButton>
          <BookButton label={tx.booking.aConsultation} variant="outline">{tx.booking.consultation}</BookButton>
        </Reveal>
      </section>

      {/* 11 · Related */}
      {related.length > 0 && (
        <section className="border-t border-line py-24 lg:py-32">
          <div className="container-lux">
            <RevealText as="h2" text={tx.treatments.related} className="h-section" />
            <Stagger className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {related.map((r) => {
                const c = cats.find((x) => x.slug === r.category);
                return (
                  <StaggerItem key={r.slug}>
                    <TreatmentCard href={`/treatments/${r.slug}`} image={c?.image ?? r.heroImage} tag={c?.tag} label={c?.title ?? ""} title={r.title} subtitle={c?.subtitle ?? r.shortDescription} />
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      <JsonLd data={serviceJsonLd(t, locale)} />
      {t.faqs.length > 0 && <JsonLd data={faqJsonLd(t.faqs)} />}
      <JsonLd data={breadcrumbJsonLd([{ name: tx.notFound.home, path: "/" }, { name: tx.nav.treatments, path: "/treatments" }, { name: t.title, path: `/treatments/${t.slug}` }], locale)} />
    </article>
  );
}

import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import Marquee from "@/components/home/Marquee";
import Injector from "@/components/home/Injector";
import ClinicGallery from "@/components/home/ClinicGallery";
import CtaBand from "@/components/home/CtaBand";
import TreatmentsSection from "@/components/treatments/TreatmentsSection";
import { Reveal } from "@/components/motion/Reveal";
import { getCatalogue, getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const s = await getSiteSettings(locale);
  return pageMetadata({
    title: s.seo.title ?? "LINJECTABLES | Aesthetic Injectables Auckland",
    description: s.seo.description ?? "",
    path: "/",
    image: s.seo.ogImage,
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const [s, catalogue] = await Promise.all([getSiteSettings(locale), getCatalogue(locale)]);
  return (
    <>
      <Hero hero={s.hero} />
      <Intro eyebrow={s.intro.eyebrow} text={s.intro.text} />

      <section className="border-y border-line py-14" aria-label={t.home.partners}>
        <Reveal className="container-lux">
          <p className="eyebrow mb-10 text-stone">{t.home.partners}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Marquee partners={s.partners} />
        </Reveal>
      </section>

      <TreatmentsSection catalogue={catalogue} t={t} />
      <Injector injector={s.injector} t={t} />
      <ClinicGallery experience={s.experience} />
      <CtaBand heading={s.cta.heading} text={s.cta.text} t={t} />
    </>
  );
}

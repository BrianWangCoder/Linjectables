import ConcernsExplorer, { type ConcernView } from "@/components/concerns/ConcernsExplorer";
import PageHeader from "@/components/ui/PageHeader";
import { getConcerns, getSiteSettings, getTreatments } from "@/lib/content";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { getDictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata({ ...getDictionary(locale).meta.concerns, path: "/concerns", locale });
}

export default async function ConcernsPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const [concerns, treatments, settings] = await Promise.all([getConcerns(locale), getTreatments(locale), getSiteSettings(locale)]);
  const view: ConcernView[] = concerns.map((c) => ({
    ...c,
    treatments: c.treatments
      .map((slug) => treatments.find((x) => x.slug === slug))
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .map((x) => ({ title: x.title, slug: x.slug, shortDescription: x.shortDescription })),
  }));

  return (
    <>
      <PageHeader eyebrow={t.concerns.eyebrow} title={t.concerns.title} intro={t.concerns.intro} />
      <section className="container-lux pb-24 lg:pb-36">
        <ConcernsExplorer concerns={view} portrait={settings.concernsImage} />
      </section>
    </>
  );
}

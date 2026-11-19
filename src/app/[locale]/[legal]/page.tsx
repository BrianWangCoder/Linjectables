import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { getLegalPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { paragraphs } from "@/lib/utils";
import { fmt, getDictionary } from "@/i18n";
import { localeMeta, type Locale } from "@/i18n/config";

export const revalidate = 60;
export const dynamicParams = false;

const SLUGS = ["privacy-policy", "terms"] as const;
export const generateStaticParams = () => SLUGS.map((legal) => ({ legal }));

type Props = { params: Promise<{ locale: string; legal: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { legal } = await params;
  const locale = (await params).locale as Locale;
  const page = await getLegalPage(locale, legal);
  if (!page) return {};
  const t = getDictionary(locale);
  return pageMetadata({ title: `${page.title} | LINJECTABLES`, description: fmt(t.meta.legal, { title: page.title }), path: `/${legal}`, locale });
}

export default async function LegalPage({ params }: Props) {
  const { legal } = await params;
  const locale = (await params).locale as Locale;
  const page = await getLegalPage(locale, legal);
  if (!page) notFound();
  const t = getDictionary(locale);
  const date = new Date(page.updated).toLocaleDateString(localeMeta[locale].intl, { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <PageHeader eyebrow={fmt(t.legal.updated, { date })} title={page.title} />
      <Reveal className="container-lux pb-28">
        <div className="max-w-2xl space-y-5 leading-relaxed text-ink/80">
          {paragraphs(page.body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>
    </>
  );
}

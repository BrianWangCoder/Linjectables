import PageHeader from "@/components/ui/PageHeader";
import BookButton from "@/components/booking/BookButton";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import { getSiteSettings } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { telHref } from "@/lib/utils";
import type { Metadata } from "next";
import { fmt, getDictionary } from "@/i18n";
import { localeMeta, type Locale } from "@/i18n/config";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata({ ...getDictionary(locale).meta.contact, path: "/contact", locale });
}

export default async function ContactPage({ params }: Props) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const s = await getSiteSettings(locale);
  const hl = localeMeta[locale].intl.split("-")[0];
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(s.mapEmbedQuery)}&hl=${hl}&output=embed`;
  const row = "flex items-start gap-4 border-b border-line py-5";

  return (
    <>
      <PageHeader eyebrow={t.contact.eyebrow} title={t.contact.title} intro={t.contact.intro}>
        <Reveal delay={0.5} className="mt-10 flex flex-wrap gap-3">
          <BookButton label={t.nav.bookOnline} />
          <a href="#enquire" className="btn btn-outline">{t.contact.sendMessage}</a>
        </Reveal>
      </PageHeader>

      <section className="container-lux grid gap-16 pb-24 lg:grid-cols-12 lg:pb-32">
        <div className="lg:col-span-5">
          <Stagger as="dl">
            <StaggerItem className={row}>
              <PinIcon className="mt-0.5 shrink-0" />
              <div>
                <dt className="eyebrow text-stone">{t.contact.address}</dt>
                <dd className="mt-2">
                  <address className="not-italic">{s.address.street}<br />{s.address.suburb}, {s.address.city} {s.address.postcode}</address>
                  <a href={s.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block text-sm">{t.contact.openMaps}</a>
                </dd>
              </div>
            </StaggerItem>
            <StaggerItem className={row}>
              <PhoneIcon className="mt-0.5 shrink-0" />
              <div><dt className="eyebrow text-stone">{t.contact.phone}</dt><dd className="mt-2"><a href={telHref(s.phone)} className="link-underline">{s.phone}</a></dd></div>
            </StaggerItem>
            <StaggerItem className={row}>
              <MailIcon className="mt-0.5 shrink-0" />
              <div><dt className="eyebrow text-stone">{t.contact.email}</dt><dd className="mt-2"><a href={`mailto:${s.email}`} className="link-underline">{s.email}</a></dd></div>
            </StaggerItem>
            <StaggerItem className={row}>
              <InstagramIcon className="mt-0.5 shrink-0" />
              <div><dt className="eyebrow text-stone">{t.contact.instagram}</dt><dd className="mt-2"><a href={s.instagram} target="_blank" rel="noopener noreferrer" className="link-underline">@{s.instagram.replace(/\/$/, "").split("/").pop()}</a></dd></div>
            </StaggerItem>
            <StaggerItem className="py-5">
              <dt className="eyebrow text-stone">{t.contact.hours}</dt>
              <dd className="mt-3 space-y-1.5">
                {s.openingHours.map((h) => (
                  <p key={h.label} className="flex justify-between gap-6"><span>{h.label}</span><span className="text-stone">{h.hours}</span></p>
                ))}
              </dd>
            </StaggerItem>
          </Stagger>
        </div>

        <Reveal className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-sand lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <iframe
              title={fmt(t.contact.mapTitle, { name: s.clinicName })}
              src={mapSrc}
              className="absolute inset-0 h-full w-full grayscale-[0.9] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </section>

      <section className="bg-cream py-24 lg:py-32">
        <div className="container-lux grid gap-16 lg:grid-cols-2">
          <Reveal>
            <h2 className="eyebrow text-stone">{t.contact.parking}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/80">{s.parkingInfo}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="eyebrow text-stone">{t.contact.access}</h2>
            <p className="mt-4 max-w-md leading-relaxed text-ink/80">{s.accessInfo}</p>
          </Reveal>
        </div>
      </section>

      {/* The universal enquiry form (same component) renders directly below this, above the footer. */}
    </>
  );
}

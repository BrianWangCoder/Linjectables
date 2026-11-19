import Link from "@/components/i18n/LocaleLink";
import Logo from "./Logo";
import { Reveal } from "@/components/motion/Reveal";
import { InstagramIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";
import type { SiteSettings } from "@/lib/types";
import { telHref } from "@/lib/utils";
import type { Dictionary } from "@/i18n";

export default function Footer({ settings, t }: { settings: SiteSettings; t: Dictionary }) {
  const s = settings;
  const year = new Date().getFullYear();
  const icon = "grid h-11 w-11 place-items-center rounded-full border border-white/25 transition-colors duration-500 ease-lux hover:bg-white hover:text-ink";
  return (
    <footer className="bg-ink pb-28 pt-20 text-white lg:pb-10 lg:pt-28">
      <div className="container-lux">
        <Reveal>
          <Link href="/" aria-label={t.nav.home} className="inline-block">
            <Logo className="text-[clamp(1.9rem,6.4vw,5.75rem)] tracking-[0.22em]" />
          </Link>
        </Reveal>

        <div className="mt-16 grid gap-12 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0.05}>
            <p className="eyebrow mb-4 text-white">{t.footer.visit}</p>
            <address className="not-italic leading-relaxed">
              {s.address.street}
              <br />
              {s.address.suburb}, {s.address.city} {s.address.postcode}
            </address>
            <a href={s.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline mt-3 inline-block text-white">
              {t.footer.directions}
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow mb-4 text-white">{t.footer.hours}</p>
            <dl className="space-y-1.5">
              {s.openingHours.map((h) => (
                <div key={h.label} className="flex justify-between gap-6">
                  <dt>{h.label}</dt>
                  <dd className="text-white">{h.hours}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow mb-4 text-white">{t.footer.contact}</p>
            <p><a href={telHref(s.phone)} className="link-underline">{s.phone}</a></p>
            <p className="mt-1.5"><a href={`mailto:${s.email}`} className="link-underline">{s.email}</a></p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="eyebrow mb-4 text-white">{t.footer.follow}</p>
            <div className="flex gap-3">
              <a href={`mailto:${s.email}`} className={icon} aria-label={t.footer.emailUs}><MailIcon /></a>
              <a href={telHref(s.phone)} className={icon} aria-label={t.footer.callUs}><PhoneIcon /></a>
              <a href={s.instagram} target="_blank" rel="noopener noreferrer" className={icon} aria-label="Instagram"><InstagramIcon /></a>
              <a href={s.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={icon} aria-label={t.footer.maps}><PinIcon /></a>
            </div>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-white/15 pt-8 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t.footer.copyright} {year}</p>
          <p>
            <Link href="/privacy-policy" className="link-underline hover:text-white">{t.footer.privacy}</Link>
            <span className="mx-3" aria-hidden>|</span>
            <Link href="/terms" className="link-underline hover:text-white">{t.footer.terms}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

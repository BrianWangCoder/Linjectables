import type { Metadata } from "next";
import type { Faq, SiteSettings, Treatment } from "./types";
import { siteUrl } from "./utils";
import { localeMeta, locales, localizeHref, type Locale } from "@/i18n/config";

/** Absolute URL of `path` (un-prefixed, e.g. "/pricing") in a given language. */
export const localeUrl = (path: string, locale: Locale) => `${siteUrl}${localizeHref(path, locale)}`.replace(/\/$/, "") || siteUrl;

/** hreflang map for a page, used in <head> and the sitemap. */
export const languageAlternates = (path: string) => ({
  ...Object.fromEntries(locales.map((l) => [localeMeta[l].hreflang, localeUrl(path, l)])),
  "x-default": localeUrl(path, "en"),
});

export function pageMetadata({
  title,
  description,
  path,
  image,
  locale,
}: {
  title: string;
  description: string;
  /** un-prefixed path, e.g. "/treatments/dermal-fillers" */
  path: string;
  image?: string;
  locale: Locale;
}): Metadata {
  const url = localeUrl(path, locale);
  const og = image ? (image.startsWith("http") ? image : `${siteUrl}${image}`) : `${siteUrl}/opengraph-image`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      title,
      description,
      url,
      siteName: "LINJECTABLES",
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      type: "website",
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export function clinicJsonLd(s: SiteSettings, locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": `${siteUrl}/#clinic`,
    name: s.clinicName,
    description: s.seo.description,
    url: localeUrl("/", locale),
    availableLanguage: ["English", "Korean", "Chinese"],
    telephone: s.phone,
    email: s.email,
    image: `${siteUrl}/opengraph-image`,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address.street,
      addressLocality: s.address.suburb,
      addressRegion: s.address.city,
      postalCode: s.address.postcode,
      addressCountry: s.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: s.geo.lat, longitude: s.geo.lng },
    hasMap: s.googleMapsUrl,
    sameAs: [s.instagram].filter(Boolean),
    areaServed: { "@type": "City", name: "Auckland" },
    openingHoursSpecification: s.openingHours
      .filter((h) => h.days.length && h.opens && h.closes)
      .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
  };
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}

export function serviceJsonLd(t: Treatment, locale: Locale = "en") {
  const url = localeUrl(`/treatments/${t.slug}`, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.title,
    description: t.shortDescription,
    serviceType: t.title,
    url,
    inLanguage: localeMeta[locale].hreflang,
    areaServed: { "@type": "City", name: "Auckland" },
    provider: { "@id": `${siteUrl}/#clinic` },
    offers: t.prices
      .filter((p) => p.price > 0)
      .map((p) => ({
        "@type": "Offer",
        name: p.name,
        priceCurrency: "NZD",
        ...(p.from ? { priceSpecification: { "@type": "PriceSpecification", minPrice: p.price, priceCurrency: "NZD" } } : { price: p.price }),
        url,
      })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[], locale: Locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: localeUrl(it.path, locale) })),
  };
}

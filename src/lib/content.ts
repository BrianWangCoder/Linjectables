import "server-only";
import { cache } from "react";
import * as seed from "@/content";
import {
  getSanityClient,
  REVALIDATE_SECONDS,
  SETTINGS_QUERY,
  CATEGORIES_QUERY,
  TREATMENTS_QUERY,
  CONCERNS_QUERY,
  PROMOTIONS_QUERY,
  LEGAL_QUERY,
} from "@/lib/sanity";
import type { Img, Concern, LegalPage, Promotion, SiteSettings, Treatment, TreatmentCategory } from "@/lib/types";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Single data-access layer. Uses Sanity when configured; otherwise (or if a
 * document type is still empty) falls back to the seed content so the site
 * always renders.
 *
 * Every document carries its English fields plus an optional `i18n: { ko, zh }`
 * object of overrides. `localize()` layers the requested language on top, so any
 * untranslated field simply shows in English.
 */
type WithI18n = { i18n?: Partial<Record<Locale, unknown>> | null };

async function fetchOr<T>(query: string, fallback: T, tag: string): Promise<T> {
  const client = getSanityClient();
  if (!client) return fallback;
  try {
    const data = await client.fetch<T>(query, {}, { next: { revalidate: REVALIDATE_SECONDS, tags: [tag] } });
    if (data == null || (Array.isArray(data) && data.length === 0)) return fallback;
    return data;
  } catch (err) {
    console.error(`[content] Sanity fetch failed for "${tag}", using seed content`, err);
    return fallback;
  }
}

/* ---------- raw (all languages) – fetched once per request ---------- */
const rawSettings = cache(async () => {
  const data = await fetchOr<(Partial<SiteSettings> & WithI18n) | null>(SETTINGS_QUERY, null, "siteSettings");
  if (!data) return seed.siteSettings as SiteSettings & WithI18n;
  // Fill gaps from the English seed only – never mix seed translations into real CMS content.
  const { i18n: _seedI18n, ...seedEnglish } = seed.siteSettings;
  return deepMerge(seedEnglish, data) as SiteSettings & WithI18n;
});
const rawCategories = cache(() => fetchOr<(TreatmentCategory & WithI18n)[]>(CATEGORIES_QUERY, seed.categories, "treatmentCategory"));
const rawTreatments = cache(() => fetchOr<(Treatment & WithI18n)[]>(TREATMENTS_QUERY, seed.treatments as (Treatment & WithI18n)[], "treatment"));
const rawConcerns = cache(() => fetchOr<(Concern & WithI18n)[]>(CONCERNS_QUERY, seed.concerns, "concern"));
const rawPromotions = cache(() => fetchOr<(Promotion & WithI18n)[]>(PROMOTIONS_QUERY, seed.promotions, "promotion"));
const rawLegal = cache(() => fetchOr<(LegalPage & WithI18n)[]>(LEGAL_QUERY, seed.legalPages, "legalPage"));

/* ---------- localized getters ---------- */
export const getSiteSettings = cache(async (locale: Locale = defaultLocale): Promise<SiteSettings> => localize(await rawSettings(), locale));

export const getCategories = cache(async (locale: Locale = defaultLocale): Promise<TreatmentCategory[]> =>
  (await rawCategories()).map((raw) => {
    const c = localize(raw, locale);
    return { ...c, subtitle: c.subtitle ?? "", image: fixImg(c.image, `/placeholders/cat-${c.slug}.svg`, c.title) };
  }),
);

export const getTreatments = cache(async (locale: Locale = defaultLocale): Promise<Treatment[]> =>
  (await rawTreatments()).map((raw) => {
    const t = localize(raw, locale);
    return {
      ...t,
      details: { duration: "", downtime: "", onset: "", longevity: "", sessions: "", ...stripNulls(t.details ?? null) },
      seo: t.seo ?? {},
      heroImage: fixImg(t.heroImage, "/placeholders/t-dermal-fillers.svg", t.title),
      beforeAfter: t.beforeAfter.filter((b) => b.before?.src && b.after?.src),
    };
  }),
);

export const getTreatment = cache(async (locale: Locale, slug: string) => (await getTreatments(locale)).find((t) => t.slug === slug) ?? null);

export const getConcerns = cache(async (locale: Locale = defaultLocale): Promise<Concern[]> => (await rawConcerns()).map((c) => localize(c, locale)));

export const getActivePromotions = cache(async (locale: Locale = defaultLocale): Promise<Promotion[]> => {
  const today = new Date().toISOString().slice(0, 10);
  return (await rawPromotions())
    .map((p) => localize(p, locale))
    .filter((p) => p.active && (!p.startDate || p.startDate <= today) && (!p.endDate || p.endDate >= today));
});

export const getLegalPage = cache(async (locale: Locale, slug: string): Promise<LegalPage | null> => {
  const page = (await rawLegal()).find((p) => p.slug === slug) ?? seed.legalPages.find((p) => p.slug === slug);
  return page ? localize(page, locale) : null;
});

/** Categories with their treatments attached, in display order. */
export const getCatalogue = cache(async (locale: Locale = defaultLocale) => {
  const [cats, treatments] = await Promise.all([getCategories(locale), getTreatments(locale)]);
  return [...cats]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ ...c, treatments: treatments.filter((t) => t.category === c.slug) }));
});

export type CatalogueCategory = Awaited<ReturnType<typeof getCatalogue>>[number];

/** Where a category card / menu item should link: its first treatment page. */
export function categoryHref(c: CatalogueCategory) {
  return c.treatments[0] ? `/treatments/${c.treatments[0].slug}` : "/treatments";
}

/* ---------- helpers ---------- */

/** Arrays merged item-by-item (translation only changes text, never prices/links/images). */
const INDEX_MERGE_KEYS = new Set(["prices", "openingHours", "beforeAfter", "partners", "images"]);

function localize<T extends WithI18n>(doc: T, locale: Locale): Omit<T, "i18n"> {
  const { i18n, ...rest } = doc;
  if (locale === defaultLocale || !i18n?.[locale]) return rest;
  return overlay(rest, i18n[locale]) as Omit<T, "i18n">;
}

function overlay(base: unknown, over: unknown, key = ""): unknown {
  if (over === null || over === undefined || over === "") return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(over) || over.length === 0) return base;
    if (INDEX_MERGE_KEYS.has(key)) return base.map((item, i) => overlay(item, over[i]));
    return over;
  }
  if (base && typeof base === "object" && typeof over === "object" && !Array.isArray(over)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(over as Record<string, unknown>)) out[k] = overlay(out[k], v, k);
    return out;
  }
  return over;
}

function fixImg(img: Img | null | undefined, fallback: string, alt: string): Img {
  return img?.src ? { ...img, alt: img.alt || alt } : { src: fallback, alt: `Placeholder – ${alt}` };
}

/** Recursively fill null/undefined/empty values in `data` from `base`. */
function deepMerge<T>(base: T, data: unknown): T {
  if (data === null || data === undefined || data === "") return base;
  if (Array.isArray(base)) return (Array.isArray(data) && data.length ? data : base) as T;
  if (base && typeof base === "object" && typeof data === "object" && !Array.isArray(data)) {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      out[k] = k in out ? deepMerge(out[k], v) : v;
    }
    return out as T;
  }
  return data as T;
}

function stripNulls<T extends object>(obj: T | null): Partial<T> | null {
  if (!obj) return null;
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined)) as Partial<T>;
}

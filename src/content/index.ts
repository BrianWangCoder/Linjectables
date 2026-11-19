/**
 * Seed content with its Korean/Chinese overrides attached as an `i18n` field –
 * the exact shape stored in Sanity (and uploaded by `npm run seed:sanity`).
 */
import * as base from "./seed";
import ko from "./translations/ko";
import zh from "./translations/zh";
import type { ContentTranslation } from "./translations/types";

export type I18nField<T> = { i18n?: { ko?: T; zh?: T } };
const pick = <K extends keyof ContentTranslation>(key: K) => ({ ko: ko[key], zh: zh[key] });

export const siteSettings = { ...base.siteSettings, i18n: pick("siteSettings") };

export const categories = base.categories.map((c) => ({
  ...c,
  i18n: { ko: ko.categories?.[c.slug], zh: zh.categories?.[c.slug] },
}));

export const treatments = base.treatments.map((t) => ({
  ...t,
  i18n: { ko: ko.treatments?.[t.slug], zh: zh.treatments?.[t.slug] },
}));

export const concerns = base.concerns.map((c) => ({
  ...c,
  i18n: { ko: ko.concerns?.[c.slug], zh: zh.concerns?.[c.slug] },
}));

export const promotions = base.promotions.map((p, i) => ({
  ...p,
  i18n: { ko: ko.promotions?.[i], zh: zh.promotions?.[i] },
}));

export const legalPages = base.legalPages.map((l) => ({
  ...l,
  i18n: { ko: ko.legalPages?.[l.slug], zh: zh.legalPages?.[l.slug] },
}));

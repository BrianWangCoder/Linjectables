/**
 * Locale configuration.
 * English lives at the root (/treatments), other languages are prefixed (/ko/treatments, /zh/treatments).
 * The middleware rewrites un-prefixed URLs to the internal /en/... route.
 */
export const locales = ["en", "ko", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const localeMeta: Record<Locale, { label: string; short: string; htmlLang: string; hreflang: string; og: string; intl: string }> = {
  en: { label: "English", short: "EN", htmlLang: "en-NZ", hreflang: "en-NZ", og: "en_NZ", intl: "en-NZ" },
  ko: { label: "한국어", short: "KO", htmlLang: "ko", hreflang: "ko", og: "ko_KR", intl: "ko-KR" },
  zh: { label: "中文", short: "中文", htmlLang: "zh-Hans", hreflang: "zh-Hans", og: "zh_CN", intl: "zh-CN" },
};

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

/** "/ko/treatments" → "/treatments", "/zh" → "/" */
export function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(ko|zh|en)(?=\/|$)/);
  if (!m) return pathname || "/";
  return pathname.slice(m[0].length) || "/";
}

/** Prefix an internal href with the locale. Leaves external links, mailto:, tel:, #hash and /api alone. */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api")) return href;
  const [, path = "/", rest = ""] = href.match(/^([^?#]*)(.*)$/) ?? [];
  const clean = stripLocale(path);
  if (locale === defaultLocale) return clean + rest;
  return (clean === "/" ? `/${locale}` : `/${locale}${clean}`) + rest;
}

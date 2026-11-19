import type { MetadataRoute } from "next";
import { getTreatments } from "@/lib/content";
import { languageAlternates, localeUrl } from "@/lib/seo";
import { locales } from "@/i18n/config";

export const revalidate = 3600;

/** Every page in every language, each entry listing its hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const treatments = await getTreatments();
  const now = new Date();
  const pages: [string, number, "weekly" | "monthly" | "yearly"][] = [
    ["/", 1, "weekly"],
    ["/treatments", 0.9, "weekly"],
    ...treatments.map((t) => [`/treatments/${t.slug}`, 0.9, "monthly"] as [string, number, "monthly"]),
    ["/pricing", 0.8, "weekly"],
    ["/concerns", 0.7, "monthly"],
    ["/contact", 0.7, "monthly"],
    ["/privacy-policy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
  ];
  return pages.flatMap(([path, priority, changeFrequency]) =>
    locales.map((locale) => ({
      url: localeUrl(path, locale),
      lastModified: now,
      changeFrequency,
      priority: locale === "en" ? priority : Math.round(priority * 0.9 * 10) / 10,
      alternates: { languages: languageAlternates(path) },
    })),
  );
}

import { createClient, type SanityClient } from "@sanity/client";

export const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
export const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const isSanityConfigured = Boolean(sanityProjectId);

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  if (!client) {
    client = createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: "2025-01-01",
      useCdn: !process.env.SANITY_API_READ_TOKEN,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      perspective: "published",
    });
  }
  return client;
}

/** Revalidate CMS-driven pages at most every 60s; /api/revalidate makes publishes instant. */
export const REVALIDATE_SECONDS = 60;

/* --------------------------------------------------------------------------
 * GROQ projections – every image is flattened to { src, alt, width, height }
 * so the output matches src/lib/types.ts exactly.
 * ------------------------------------------------------------------------ */
const img = (field: string) =>
  `"${field}": ${field}{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  clinicName, tagline, address, geo{ "lat": lat, "lng": lng }, phone, email, instagram, googleMapsUrl, mapEmbedQuery,
  parkingInfo, accessInfo, openingHours[]{ label, hours, "days": coalesce(days, []), opens, closes },
  timelyBookingUrl, "bookingMode": coalesce(bookingMode, "overlay"),
  "partners": coalesce(partners[]{ name, ${img("logo")} }, []),
  hero{ eyebrow, headline, subheadline, "videoUrl": coalesce(videoFile.asset->url, videoUrl), ${img("poster")} },
  intro,
  injector{ eyebrow, name, title, "qualifications": coalesce(qualifications, []), experience, bio, approach, ${img("image")} },
  experience{ eyebrow, heading, text, "images": images[]{ "src": asset->url, "alt": coalesce(alt, ""), "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } },
  cta, enquiry{ eyebrow, heading, ${img("image")} }, ${img("concernsImage")},
  seo{ title, description, "ogImage": ogImage.asset->url },
  i18n
}`;

export const CATEGORIES_QUERY = `*[_type == "treatmentCategory"] | order(order asc){
  title, "slug": slug.current, tag, subtitle, order, ${img("image")}, i18n
}`;

const TREATMENT_FIELDS = `
  title, "slug": slug.current, "category": category->slug.current, shortDescription, ${img("heroImage")},
  intro, addresses, "benefits": coalesce(benefits, []), "areas": coalesce(areas, []), howItWorks, details,
  "prices": coalesce(prices[]{ name, price, from, unit, timelyBookingUrl }, []), priceNote, timelyBookingUrl,
  "showBeforeAfter": coalesce(showBeforeAfter, false),
  "beforeAfter": coalesce(beforeAfter[]{ caption, ${img("before")}, ${img("after")} }, []),
  "faqs": coalesce(faqs[]{ question, answer }, []),
  "safety": coalesce(safety[]{ title, body }, []),
  "related": coalesce(related[]->slug.current, []),
  seo{ title, description, "ogImage": ogImage.asset->url },
  i18n
`;

export const TREATMENTS_QUERY = `*[_type == "treatment"] | order(category->order asc, order asc, title asc){ ${TREATMENT_FIELDS} }`;

export const CONCERNS_QUERY = `*[_type == "concern"] | order(order asc){
  title, "slug": slug.current, label, x, y, "side": coalesce(side, "right"), description,
  "treatments": coalesce(treatments[]->slug.current, []), i18n
}`;

export const PROMOTIONS_QUERY = `*[_type == "promotion"] | order(_createdAt desc){
  title, description, "active": coalesce(active, false), startDate, endDate, disclaimer, ctaLabel, ctaUrl, i18n
}`;

export const LEGAL_QUERY = `*[_type == "legalPage"]{ title, "slug": slug.current, "updated": coalesce(updated, _updatedAt), body, i18n }`;

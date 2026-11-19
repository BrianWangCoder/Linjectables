/**
 * Uploads the placeholder seed content (src/content/seed.ts) into Sanity.
 *
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx SANITY_API_WRITE_TOKEN=yyy npm run seed:sanity
 *
 * Safe to re-run: documents use fixed IDs and are created-or-replaced.
 * Placeholder SVG images are uploaded as image assets so the Studio is fully populated.
 */
import { createClient } from "@sanity/client";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { siteSettings, categories, treatments, concerns, promotions, legalPages } from "../src/content";
import type { Img } from "../src/lib/types";

// tiny .env loader so the script works without extra deps
for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (in .env.local) first.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const assetCache = new Map<string, string>();
async function image(img?: Img) {
  if (!img) return undefined;
  let id = assetCache.get(img.src);
  if (!id) {
    const file = path.join(process.cwd(), "public", img.src);
    if (!existsSync(file)) return undefined;
    const asset = await client.assets.upload("image", readFileSync(file), { filename: path.basename(file) });
    id = asset._id;
    assetCache.set(img.src, id);
  }
  return { _type: "image", alt: img.alt, asset: { _type: "reference", _ref: id } };
}

const key = (i: number) => `k${i}`;
const ref = (id: string) => ({ _type: "reference", _ref: id });
const withKeys = <T extends object>(arr: T[]) => arr.map((x, i) => ({ _key: key(i), ...x }));
/** Recursively add _key to objects inside arrays (Sanity requires it) and drop undefined. */
const keyify = (v: unknown): unknown =>
  Array.isArray(v)
    ? v.map((x, i) => (x && typeof x === "object" ? { _key: key(i), ...(keyify(x) as object) } : x))
    : v && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, keyify(x)]))
      : v;

async function run() {
  const s = siteSettings;
  console.log("→ site settings");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    clinicName: s.clinicName,
    tagline: s.tagline,
    address: s.address,
    geo: s.geo,
    phone: s.phone,
    email: s.email,
    instagram: s.instagram,
    googleMapsUrl: s.googleMapsUrl,
    mapEmbedQuery: s.mapEmbedQuery,
    parkingInfo: s.parkingInfo,
    accessInfo: s.accessInfo,
    openingHours: withKeys(s.openingHours),
    timelyBookingUrl: s.timelyBookingUrl,
    bookingMode: s.bookingMode,
    partners: withKeys(s.partners.map((p) => ({ name: p.name }))),
    hero: { eyebrow: s.hero.eyebrow, headline: s.hero.headline, subheadline: s.hero.subheadline, poster: await image(s.hero.poster) },
    intro: s.intro,
    injector: { ...s.injector, image: await image(s.injector.image) },
    experience: {
      eyebrow: s.experience.eyebrow,
      heading: s.experience.heading,
      text: s.experience.text,
      images: withKeys((await Promise.all(s.experience.images.map(image))).filter((x): x is NonNullable<typeof x> => Boolean(x))),
    },
    cta: s.cta,
    enquiry: { eyebrow: s.enquiry.eyebrow, heading: s.enquiry.heading, image: await image(s.enquiry.image) },
    concernsImage: await image(s.concernsImage),
    seo: { title: s.seo.title, description: s.seo.description },
    i18n: keyify(s.i18n),
  });

  console.log("→ categories");
  for (const c of categories) {
    await client.createOrReplace({ _id: `category-${c.slug}`, _type: "treatmentCategory", title: c.title, slug: { _type: "slug", current: c.slug }, tag: c.tag, subtitle: c.subtitle, order: c.order, image: await image(c.image), i18n: keyify(c.i18n) });
  }

  console.log("→ treatments (pass 1)");
  for (const t of treatments) {
    await client.createOrReplace({
      _id: `treatment-${t.slug}`,
      _type: "treatment",
      title: t.title,
      slug: { _type: "slug", current: t.slug },
      category: ref(`category-${t.category}`),
      order: 1,
      shortDescription: t.shortDescription,
      heroImage: await image(t.heroImage),
      intro: t.intro,
      addresses: t.addresses,
      benefits: t.benefits,
      areas: t.areas,
      howItWorks: t.howItWorks,
      details: t.details,
      prices: withKeys(t.prices),
      priceNote: t.priceNote,
      timelyBookingUrl: t.timelyBookingUrl,
      showBeforeAfter: t.showBeforeAfter,
      beforeAfter: withKeys(await Promise.all(t.beforeAfter.map(async (b) => ({ caption: b.caption, before: await image(b.before), after: await image(b.after) })))),
      faqs: withKeys(t.faqs),
      safety: withKeys(t.safety),
      seo: t.seo,
      i18n: keyify(t.i18n),
    });
  }
  console.log("→ treatments (related links)");
  for (const t of treatments) {
    await client.patch(`treatment-${t.slug}`).set({ related: withKeys(t.related.map((r) => ref(`treatment-${r}`))) }).commit();
  }

  console.log("→ concerns");
  for (const [i, c] of concerns.entries()) {
    await client.createOrReplace({ _id: `concern-${c.slug}`, _type: "concern", title: c.title, slug: { _type: "slug", current: c.slug }, label: c.label, x: c.x, y: c.y, side: c.side, description: c.description, order: i + 1, treatments: withKeys(c.treatments.map((r) => ref(`treatment-${r}`))), i18n: keyify(c.i18n) });
  }

  console.log("→ promotions & legal");
  for (const [i, p] of promotions.entries()) await client.createOrReplace({ _id: `promotion-${i + 1}`, _type: "promotion", ...p, i18n: keyify(p.i18n) });
  for (const l of legalPages) await client.createOrReplace({ _id: `legal-${l.slug}`, _type: "legalPage", title: l.title, slug: { _type: "slug", current: l.slug }, updated: l.updated, body: l.body, i18n: keyify(l.i18n) });

  console.log("✓ Seed complete");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

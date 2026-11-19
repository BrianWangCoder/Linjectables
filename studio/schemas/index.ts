import { defineArrayMember, defineField, defineType } from "sanity";

/* ---------- helpers ---------- */
const altImage = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        description: "Describe the image for screen readers and Google (e.g. 'Injector consulting a client in the treatment room').",
        validation: (r) => r.required().warning("Alt text helps accessibility and SEO"),
      }),
    ],
  });

const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "title", title: "Meta title", type: "string", description: "≈ 50–60 characters, e.g. 'Anti-Wrinkle Injections Auckland | LINJECTABLES'", validation: (r) => r.max(70) }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3, validation: (r) => r.max(170) }),
    defineField({ name: "ogImage", title: "Social share image", type: "image", description: "1200×630 recommended" }),
  ],
});

const timelyField = (name = "timelyBookingUrl", title = "Timely booking link") =>
  defineField({
    name,
    title,
    type: "url",
    description:
      "In Timely: Settings → Online bookings → Booking links → create a link for this specific service, then paste it here.",
  });

/* ---------- translations (Korean / Chinese overrides) ---------- */
const s = (name: string, title?: string) => defineField({ name, title, type: "string" });
const t = (name: string, title?: string, rows = 3) => defineField({ name, title, type: "text", rows });
const list = (name: string, title?: string) => defineField({ name, title, type: "array", of: [{ type: "string" }] });
const obj = (name: string, fields: ReturnType<typeof defineField>[], title?: string) => defineField({ name, title, type: "object", fields });
const objList = (name: string, fields: ReturnType<typeof defineField>[], title?: string, description?: string) =>
  defineField({ name, title, description, type: "array", of: [defineArrayMember({ type: "object", fields })] });

/**
 * Adds an `i18n` field with a Korean and a Chinese copy of the translatable fields.
 * Anything left empty shows the English version on the website.
 */
const translations = (fields: () => ReturnType<typeof defineField>[], group?: string) =>
  defineField({
    name: "i18n",
    title: "Translations",
    description: "Korean and Chinese versions. Leave a field empty to show the English text. Prices, links and images are shared with English.",
    type: "object",
    ...(group ? { group } : {}),
    options: { collapsible: true, collapsed: !group },
    fields: [
      defineField({ name: "ko", title: "한국어 · Korean", type: "object", options: { collapsible: true, collapsed: false }, fields: fields() }),
      defineField({ name: "zh", title: "中文 · Chinese (Simplified)", type: "object", options: { collapsible: true, collapsed: true }, fields: fields() }),
    ],
  });

const seoT = () => obj("seo", [s("title", "Meta title"), t("description", "Meta description")], "SEO");

/* ---------- site settings (singleton) ---------- */
const siteSettings = defineType({
  name: "siteSettings",
  title: "Clinic info, hours & homepage",
  type: "document",
  groups: [
    { name: "clinic", title: "Clinic & contact", default: true },
    { name: "booking", title: "Booking" },
    { name: "home", title: "Homepage" },
    { name: "seo", title: "SEO" },
    { name: "translations", title: "한국어 / 中文" },
  ],
  fields: [
    defineField({ name: "clinicName", type: "string", group: "clinic", initialValue: "LINJECTABLES" }),
    defineField({ name: "tagline", type: "string", group: "clinic" }),
    defineField({
      name: "address",
      type: "object",
      group: "clinic",
      fields: ["street", "suburb", "city", "postcode", "country"].map((n) => defineField({ name: n, type: "string" })),
    }),
    defineField({
      name: "geo",
      title: "Map coordinates",
      description: "Used for Google search results. Right-click the clinic in Google Maps to copy these.",
      type: "object",
      group: "clinic",
      fields: [defineField({ name: "lat", type: "number" }), defineField({ name: "lng", type: "number" })],
    }),
    defineField({ name: "phone", type: "string", group: "clinic" }),
    defineField({ name: "email", type: "string", group: "clinic" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url", group: "clinic" }),
    defineField({ name: "googleMapsUrl", title: "Google Maps link", type: "url", group: "clinic" }),
    defineField({ name: "mapEmbedQuery", title: "Map search text", description: "What the embedded map searches for, e.g. the full address.", type: "string", group: "clinic" }),
    defineField({ name: "parkingInfo", title: "Parking information", type: "text", rows: 3, group: "clinic" }),
    defineField({ name: "accessInfo", title: "Access information", type: "text", rows: 3, group: "clinic" }),
    defineField({
      name: "openingHours",
      type: "array",
      group: "clinic",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Day(s) as shown", type: "string", description: "e.g. 'Tuesday – Friday'" }),
            defineField({ name: "hours", title: "Hours as shown", type: "string", description: "e.g. '10am – 7pm' or 'Closed'" }),
            defineField({
              name: "days",
              title: "Days (for Google)",
              type: "array",
              of: [{ type: "string" }],
              options: { list: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
            }),
            defineField({ name: "opens", type: "string", description: "24h, e.g. 10:00 (leave empty if closed)" }),
            defineField({ name: "closes", type: "string", description: "24h, e.g. 19:00" }),
          ],
          preview: { select: { title: "label", subtitle: "hours" } },
        }),
      ],
    }),
    { ...timelyField("timelyBookingUrl", "Main Timely booking link"), group: "booking" },
    defineField({
      name: "bookingMode",
      title: "How booking opens",
      type: "string",
      group: "booking",
      options: { list: [{ title: "Overlay on the website", value: "overlay" }, { title: "New browser tab", value: "newTab" }], layout: "radio" },
      initialValue: "overlay",
    }),
    defineField({
      name: "partners",
      title: "Partner brands (logo marquee)",
      type: "array",
      group: "home",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "name", type: "string" }), altImage("logo", "Logo (SVG/PNG, transparent)")], preview: { select: { title: "name", media: "logo" } } })],
    }),
    defineField({
      name: "hero",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "headline", type: "text", rows: 2, description: "Use a line break to control where the headline splits." }),
        defineField({ name: "subheadline", type: "string" }),
        defineField({ name: "videoFile", title: "Background video (MP4, < 8MB, muted loop)", type: "file", options: { accept: "video/mp4" } }),
        defineField({ name: "videoUrl", title: "…or video URL", type: "url" }),
        altImage("poster", "Poster image", "Shown while the video loads and on low-power devices."),
      ],
    }),
    defineField({ name: "intro", title: "Introduction", type: "object", group: "home", fields: [defineField({ name: "eyebrow", type: "string" }), defineField({ name: "text", type: "text", rows: 5 })] }),
    defineField({
      name: "injector",
      title: "Meet your injector",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "name", type: "string" }),
        defineField({ name: "title", type: "string" }),
        defineField({ name: "qualifications", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "experience", type: "string" }),
        defineField({ name: "bio", type: "text", rows: 5 }),
        defineField({ name: "approach", type: "text", rows: 5 }),
        altImage("image", "Portrait"),
      ],
    }),
    defineField({
      name: "experience",
      title: "Clinic experience gallery",
      type: "object",
      group: "home",
      fields: [
        defineField({ name: "eyebrow", type: "string" }),
        defineField({ name: "heading", type: "string" }),
        defineField({ name: "text", type: "text", rows: 3 }),
        defineField({ name: "images", type: "array", of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", type: "string" })] })] }),
      ],
    }),
    defineField({ name: "cta", title: "Call-to-action band", type: "object", group: "home", fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "text", type: "string" })] }),
    defineField({
      name: "enquiry",
      title: "Enquiry form block (all pages)",
      type: "object",
      group: "home",
      fields: [defineField({ name: "eyebrow", type: "string" }), defineField({ name: "heading", type: "string" }), altImage("image", "Portrait (shown in black & white)")],
    }),
    { ...altImage("concernsImage", "Concerns page portrait", "Portrait used behind the hotspots on the Concerns page. Adjust hotspot positions on each Concern."), group: "home" },
    { ...seoField, group: "seo" },
    translations(
      () => [
        s("tagline"),
        t("parkingInfo", "Parking information"),
        t("accessInfo", "Access information"),
        objList("openingHours", [s("label", "Day(s)"), s("hours", "Hours")], "Opening hours", "Same order as the English opening hours."),
        obj("hero", [s("eyebrow"), t("headline", "Headline", 2), s("subheadline")], "Hero"),
        obj("intro", [s("eyebrow"), t("text", "Text", 5)], "Introduction"),
        obj("injector", [s("eyebrow"), s("title"), list("qualifications"), s("experience"), t("bio", "Bio", 5), t("approach", "Approach", 5)], "Meet your injector"),
        obj("experience", [s("eyebrow"), s("heading"), t("text")], "Clinic experience"),
        obj("cta", [s("heading"), s("text")], "Call-to-action band"),
        obj("enquiry", [s("eyebrow"), s("heading")], "Enquiry form block"),
        seoT(),
      ],
      "translations",
    ),
  ],
  preview: { prepare: () => ({ title: "Clinic info, hours & homepage" }) },
});

/* ---------- category ---------- */
const treatmentCategory = defineType({
  name: "treatmentCategory",
  title: "Treatment category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "tag", title: "Pill tag", type: "string", description: "e.g. SIGNATURE, MOST POPULAR (optional)" }),
    defineField({ name: "subtitle", type: "string" }),
    altImage("image", "Card image (portrait)"),
    defineField({ name: "order", type: "number", description: "1 = first", validation: (r) => r.required() }),
    translations(() => [s("title"), s("tag", "Pill tag"), s("subtitle")]),
  ],
  orderings: [{ title: "Display order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "subtitle", media: "image" } },
});

/* ---------- treatment ---------- */
const treatment = defineType({
  name: "treatment",
  title: "Treatment",
  type: "document",
  groups: [
    { name: "content", title: "Page content", default: true },
    { name: "pricing", title: "Prices & booking" },
    { name: "results", title: "Before & after" },
    { name: "faq", title: "FAQs & safety" },
    { name: "seo", title: "SEO" },
    { name: "translations", title: "한국어 / 中文" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL", type: "slug", group: "content", options: { source: "title" }, description: "The page lives at /treatments/<this>", validation: (r) => r.required() }),
    defineField({ name: "category", type: "reference", to: [{ type: "treatmentCategory" }], group: "content", validation: (r) => r.required() }),
    defineField({ name: "order", title: "Order within category", type: "number", group: "content", initialValue: 1 }),
    defineField({ name: "shortDescription", type: "text", rows: 2, group: "content" }),
    { ...altImage("heroImage", "Hero image"), group: "content" },
    defineField({ name: "intro", title: "Introduction – what it is", type: "text", rows: 4, group: "content" }),
    defineField({ name: "addresses", title: "What it's designed to address", type: "text", rows: 3, group: "content" }),
    defineField({ name: "benefits", title: "Key benefits", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "areas", title: "Suitable treatment areas", type: "array", of: [{ type: "string" }], group: "content" }),
    defineField({ name: "howItWorks", title: "How it works", type: "text", rows: 5, group: "content" }),
    defineField({
      name: "details",
      title: "Treatment details",
      type: "object",
      group: "content",
      fields: [
        defineField({ name: "duration", title: "Appointment duration", type: "string" }),
        defineField({ name: "downtime", type: "string" }),
        defineField({ name: "onset", title: "Onset of results", type: "string" }),
        defineField({ name: "longevity", title: "How long results last", type: "string" }),
        defineField({ name: "sessions", title: "Recommended sessions", type: "string" }),
      ],
    }),
    defineField({
      name: "prices",
      title: "Price list rows",
      description: "These rows appear on this treatment page AND on the Pricing page. Change a price here and it updates everywhere.",
      type: "array",
      group: "pricing",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "price", title: "Price (NZD)", type: "number", description: "0 = Complimentary", validation: (r) => r.required().min(0) }),
            defineField({ name: "from", title: "Show as 'From $…'", type: "boolean", initialValue: true }),
            defineField({ name: "unit", title: "Unit / package info", type: "string", description: "e.g. per 1ml, per area, course of 3" }),
            timelyField("timelyBookingUrl", "Timely link for this service (optional)"),
          ],
          preview: { select: { title: "name", price: "price", from: "from" }, prepare: ({ title, price, from }) => ({ title, subtitle: `${from ? "From " : ""}$${price}` }) },
        }),
      ],
    }),
    defineField({ name: "priceNote", title: "Price note", type: "string", group: "pricing" }),
    { ...timelyField(), group: "pricing" },
    defineField({ name: "showBeforeAfter", title: "Show before & after section", type: "boolean", group: "results", initialValue: false }),
    defineField({
      name: "beforeAfter",
      title: "Before & after pairs",
      description: "Only publish images you have written client consent to use.",
      type: "array",
      group: "results",
      of: [defineArrayMember({ type: "object", fields: [altImage("before", "Before"), altImage("after", "After"), defineField({ name: "caption", type: "string" })], preview: { select: { title: "caption", media: "after" } } })],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "faq",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "question", type: "string" }), defineField({ name: "answer", type: "text", rows: 4 })], preview: { select: { title: "question" } } })],
    }),
    defineField({
      name: "safety",
      title: "Side effects, suitability & aftercare",
      type: "array",
      group: "faq",
      of: [defineArrayMember({ type: "object", fields: [defineField({ name: "title", type: "string" }), defineField({ name: "body", type: "text", rows: 6 })], preview: { select: { title: "title" } } })],
    }),
    defineField({ name: "related", title: "Related treatments", type: "array", group: "content", of: [{ type: "reference", to: [{ type: "treatment" }] }], validation: (r) => r.max(3) }),
    { ...seoField, group: "seo" },
    translations(
      () => [
        s("title"),
        t("shortDescription", "Short description", 2),
        t("intro", "Introduction – what it is", 4),
        t("addresses", "What it's designed to address"),
        list("benefits", "Key benefits"),
        list("areas", "Treatment areas"),
        t("howItWorks", "How it works", 5),
        obj("details", [s("duration"), s("downtime"), s("onset"), s("longevity"), s("sessions")], "Treatment details"),
        objList("prices", [s("name"), s("unit", "Unit / package info")], "Price rows (names only)", "Same order as the English price rows. Prices and booking links are shared."),
        s("priceNote", "Price note"),
        objList("beforeAfter", [s("caption")], "Before & after captions", "Same order as the English pairs."),
        objList("faqs", [s("question"), t("answer", "Answer", 4)], "FAQs"),
        objList("safety", [s("title"), t("body", "Body", 6)], "Side effects, suitability & aftercare"),
        seoT(),
      ],
      "translations",
    ),
  ],
  preview: { select: { title: "title", subtitle: "category.title", media: "heroImage" } },
});

/* ---------- concern ---------- */
const concern = defineType({
  name: "concern",
  title: "Concern",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "label", title: "Hotspot label", type: "string", description: "Short word shown on the portrait, e.g. 'Eyes'" }),
    defineField({ name: "x", title: "Hotspot X position (%)", type: "number", validation: (r) => r.min(0).max(100) }),
    defineField({ name: "y", title: "Hotspot Y position (%)", type: "number", validation: (r) => r.min(0).max(100) }),
    defineField({ name: "side", title: "Label side", type: "string", options: { list: ["left", "right"], layout: "radio" }, initialValue: "right" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "treatments", title: "Treatment options (in order)", type: "array", of: [{ type: "reference", to: [{ type: "treatment" }] }] }),
    defineField({ name: "order", type: "number" }),
    translations(() => [s("title"), s("label", "Hotspot label"), t("description", "Description", 4)]),
  ],
  preview: { select: { title: "title", subtitle: "label" } },
});

/* ---------- promotion ---------- */
const promotion = defineType({
  name: "promotion",
  title: "Promotion",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({ name: "active", title: "Show on website", type: "boolean", initialValue: true }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({
      name: "disclaimer",
      type: "text",
      rows: 3,
      description:
        "Required terms. NZ law restricts advertising prescription medicines (e.g. botulinum toxin) to the public – do not name brands, and keep wording compliant with the Medicines Act and ASA Therapeutic & Health Advertising Code.",
    }),
    defineField({ name: "ctaLabel", title: "Button label", type: "string" }),
    defineField({ name: "ctaUrl", title: "Button link (defaults to Timely)", type: "url" }),
    translations(() => [s("title"), t("description"), t("disclaimer"), s("ctaLabel", "Button label")]),
  ],
  preview: { select: { title: "title", active: "active" }, prepare: ({ title, active }) => ({ title, subtitle: active ? "● Live" : "Hidden" }) },
});

/* ---------- legal ---------- */
const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, description: "'privacy-policy' or 'terms'" }),
    defineField({ name: "updated", title: "Last updated", type: "date" }),
    defineField({ name: "body", type: "text", rows: 20, description: "Separate paragraphs with a blank line." }),
    translations(() => [s("title"), t("body", "Body", 20)]),
  ],
});

export const schemaTypes = [siteSettings, treatmentCategory, treatment, concern, promotion, legalPage];

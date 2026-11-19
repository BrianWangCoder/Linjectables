/**
 * Normalised content types. Both the Sanity queries (src/lib/sanity.ts) and the
 * local seed (src/content/seed.ts) resolve to these shapes, so components never
 * care where content came from.
 */

export type Img = {
  src: string;
  alt: string;
  /** optional intrinsic size (Sanity supplies this; placeholders are 4:5 by default) */
  width?: number;
  height?: number;
};

export type Seo = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type OpeningHours = {
  label: string; // e.g. "Tuesday – Friday"
  hours: string; // e.g. "10am – 7pm" or "Closed"
  /** schema.org days for JSON-LD, e.g. ["Tuesday","Wednesday"] */
  days: string[];
  opens?: string; // "10:00"
  closes?: string; // "19:00"
};

export type Partner = { name: string; logo?: Img };

export type SiteSettings = {
  clinicName: string;
  tagline: string;
  address: { street: string; suburb: string; city: string; postcode: string; country: string };
  geo: { lat: number; lng: number };
  phone: string;
  email: string;
  instagram: string;
  googleMapsUrl: string;
  mapEmbedQuery: string;
  parkingInfo: string;
  accessInfo: string;
  openingHours: OpeningHours[];
  timelyBookingUrl: string;
  /** "overlay" keeps visitors on-site (iframe drawer); "newTab" opens Timely in a new tab */
  bookingMode: "overlay" | "newTab";
  partners: Partner[];
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    videoUrl?: string;
    poster: Img;
  };
  intro: { eyebrow: string; text: string };
  injector: {
    eyebrow: string;
    name: string;
    title: string;
    qualifications: string[];
    experience: string;
    bio: string;
    approach: string;
    image: Img;
  };
  experience: { eyebrow: string; heading: string; text: string; images: Img[] };
  cta: { heading: string; text: string };
  enquiry: { eyebrow: string; heading: string; image: Img };
  /** portrait used on the Concerns page hotspot map */
  concernsImage: Img;
  seo: Seo;
};

export type PriceItem = {
  name: string;
  price: number;
  /** show "from" before the price */
  from?: boolean;
  /** unit / package information, e.g. "per area", "per 1ml syringe", "course of 3" */
  unit?: string;
  /** Timely link for this exact service. Falls back to the treatment's link. */
  timelyBookingUrl?: string;
};

export type Faq = { question: string; answer: string };

export type DetailSection = { title: string; body: string };

export type BeforeAfter = { before: Img; after: Img; caption?: string };

export type TreatmentCategory = {
  title: string;
  slug: string;
  tag?: string;
  subtitle: string;
  image: Img;
  order: number;
};

export type Treatment = {
  title: string;
  slug: string;
  category: string; // category slug
  shortDescription: string;
  heroImage: Img;
  intro: string;
  addresses: string;
  benefits: string[];
  areas: string[];
  howItWorks: string;
  details: {
    duration: string;
    downtime: string;
    onset: string;
    longevity: string;
    sessions: string;
  };
  prices: PriceItem[];
  priceNote?: string;
  timelyBookingUrl: string;
  showBeforeAfter: boolean;
  beforeAfter: BeforeAfter[];
  faqs: Faq[];
  safety: DetailSection[];
  related: string[]; // treatment slugs
  seo: Seo;
};

export type Concern = {
  title: string;
  slug: string;
  label: string; // hotspot label, e.g. "Face"
  /** hotspot position on the portrait, in % of width/height */
  x: number;
  y: number;
  /** which side of the dot the label + line sits */
  side: "left" | "right";
  description: string;
  treatments: string[]; // treatment slugs, in display order
};

export type Promotion = {
  title: string;
  description: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  disclaimer?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export type LegalPage = { title: string; slug: string; updated: string; body: string };

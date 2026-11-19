/**
 * SEED / FALLBACK CONTENT
 * -----------------------------------------------------------------------------
 * Used when Sanity is not configured (no NEXT_PUBLIC_SANITY_PROJECT_ID), and as
 * the source for `npm run seed:sanity`, which uploads all of this into Sanity.
 *
 * Everything here is PLACEHOLDER copy, pricing, contact detail and imagery.
 * Replace it in the CMS before launch – see README.md.
 *
 * NZ compliance note: botulinum toxin and most dermal filler / biostimulator
 * products are prescription medicines. Copy deliberately avoids brand names and
 * outcome guarantees. Have final copy reviewed against the Medicines Act 1981
 * and the ASA Therapeutic & Health Advertising Code before publishing.
 */
import type {
  Concern,
  LegalPage,
  Promotion,
  SiteSettings,
  Treatment,
  TreatmentCategory,
  DetailSection,
} from "@/lib/types";

const ph = (name: string, alt: string) => ({ src: `/placeholders/${name}.svg`, alt });

const TIMELY = "https://bookings.gettimely.com/linjectables/book";

export const siteSettings: SiteSettings = {
  clinicName: "LINJECTABLES",
  tagline: "Aesthetic injectables, Auckland",
  address: {
    street: "Level 1, 123 Placeholder Street",
    suburb: "Ponsonby",
    city: "Auckland",
    postcode: "1011",
    country: "NZ",
  },
  geo: { lat: -36.8566, lng: 174.7465 },
  phone: "09 000 0000",
  email: "hello@linjectables.co.nz",
  instagram: "https://www.instagram.com/linjectables",
  googleMapsUrl: "https://maps.google.com/?q=Ponsonby+Auckland",
  mapEmbedQuery: "Ponsonby, Auckland, New Zealand",
  parkingInfo:
    "Two-hour metered street parking is available on Placeholder Street and the surrounding side streets. A public car park is a two-minute walk away on Example Road.",
  accessInfo:
    "The clinic is on level one with lift access from the main lobby. Please let us know when booking if you need any assistance on arrival.",
  openingHours: [
    { label: "Monday", hours: "Closed", days: ["Monday"] },
    { label: "Tuesday – Friday", hours: "10am – 7pm", days: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { label: "Saturday", hours: "9am – 4pm", days: ["Saturday"], opens: "09:00", closes: "16:00" },
    { label: "Sunday", hours: "By appointment", days: [] },
  ],
  timelyBookingUrl: TIMELY,
  bookingMode: "overlay",
  partners: [
    { name: "Partner One" },
    { name: "Partner Two" },
    { name: "Partner Three" },
    { name: "Partner Four" },
    { name: "Partner Five" },
    { name: "Partner Six" },
    { name: "Partner Seven" },
  ],
  hero: {
    eyebrow: "Auckland, New Zealand",
    headline: "Natural results.\nExpert hands.",
    subheadline: "Considered, medically led injectable treatments in the heart of Auckland.",
    videoUrl: "",
    poster: ph("hero", "Placeholder – soft-lit portrait for the homepage hero video"),
  },
  intro: {
    eyebrow: "Our philosophy",
    text:
      "We believe the best work is the work no one notices – only that you look rested, refreshed and entirely like yourself. Every treatment plan is personalised, every dose is deliberate, and every recommendation is grounded in evidence-informed aesthetic medicine.",
  },
  injector: {
    eyebrow: "Meet your injector",
    name: "Dr Placeholder Lin",
    title: "Founder & Aesthetic Injector",
    qualifications: [
      "MBChB (Placeholder)",
      "Member, NZ Society of Cosmetic Medicine (placeholder)",
      "Advanced Facial Anatomy Certification",
    ],
    experience: "8+ years in aesthetic medicine",
    bio:
      "Placeholder biography. Share your clinical background, training, and the moment you fell in love with aesthetic medicine. Clients want to know who is holding the needle – make it personal.",
    approach:
      "My approach is conservative and anatomy-led. I would rather you leave wanting a touch more than a touch less. We start with a thorough consultation, build a plan around your goals and your budget, and review every result together.",
    image: ph("injector", "Placeholder – professional portrait of the lead injector"),
  },
  experience: {
    eyebrow: "The clinic",
    heading: "A calm space, designed around you",
    text:
      "Soft light, quiet rooms and unhurried appointments. Our Ponsonby clinic was designed so that every visit feels considered – from your first consultation to your review.",
    images: [
      ph("clinic-1", "Placeholder – clinic reception"),
      ph("clinic-2", "Placeholder – treatment room"),
      ph("clinic-3", "Placeholder – consultation area detail"),
      ph("clinic-4", "Placeholder – product shelf detail"),
      ph("clinic-5", "Placeholder – waiting lounge"),
    ],
  },
  cta: {
    heading: "Begin with a conversation",
    text: "Every journey starts with a one-on-one consultation to understand your goals.",
  },
  enquiry: {
    eyebrow: "Treat yourself",
    heading: "Let us take care of you",
    image: ph("enquiry", "Placeholder – black and white portrait"),
  },
  concernsImage: ph("concerns-model", "Placeholder – model portrait with treatment areas marked"),
  seo: {
    title: "LINJECTABLES | Aesthetic Injectables Clinic Auckland",
    description:
      "Medically led anti-wrinkle, dermal filler, skin booster and biostimulator treatments in Auckland. Natural results from an experienced injector. Book a consultation.",
  },
};

export const categories: TreatmentCategory[] = [
  { title: "Anti-Wrinkle", slug: "anti-wrinkle", tag: "Most popular", subtitle: "Soften expression lines for a rested look", image: ph("cat-anti-wrinkle", "Placeholder – anti-wrinkle treatment"), order: 1 },
  { title: "Dermal Fillers", slug: "dermal-fillers", tag: "Signature", subtitle: "Restore volume, contour and balance", image: ph("cat-dermal-fillers", "Placeholder – dermal filler treatment"), order: 2 },
  { title: "Skin Boosters", slug: "skin-boosters", tag: "Glow", subtitle: "Deep hydration for luminous skin", image: ph("cat-skin-boosters", "Placeholder – skin booster treatment"), order: 3 },
  { title: "Collagen Biostimulators", slug: "collagen-biostimulators", tag: "Long-term", subtitle: "Rebuild your skin's own collagen", image: ph("cat-collagen-biostimulators", "Placeholder – biostimulator treatment"), order: 4 },
  { title: "Micro-Needling", slug: "micro-needling", tag: "Texture", subtitle: "Refine texture, pores and scarring", image: ph("cat-micro-needling", "Placeholder – micro-needling treatment"), order: 5 },
  { title: "Fat-Dissolving Injections", slug: "fat-dissolving", tag: "Contour", subtitle: "Target stubborn pockets of fat", image: ph("cat-fat-dissolving", "Placeholder – fat-dissolving treatment"), order: 6 },
];

/* ---------- shared safety copy (edit per treatment in the CMS) ---------- */
const suitability = (extra = ""): DetailSection => ({
  title: "Suitability",
  body:
    "Treatment is not suitable during pregnancy or breastfeeding, if you have an active skin infection in the area, or with certain medical conditions and medications. A full medical history is taken at your consultation and treatment only proceeds if it is safe and appropriate for you." +
    (extra ? `\n\n${extra}` : ""),
});
const aftercare = (body: string): DetailSection => ({ title: "Aftercare", body });
const risks = (body: string): DetailSection => ({ title: "Side effects & risks", body });

const ba = (n: 1 | 2 | 3, caption: string) => ({
  before: ph(`ba-before-${n}`, `Placeholder – before treatment, example ${n}`),
  after: ph(`ba-after-${n}`, `Placeholder – after treatment, example ${n}`),
  caption,
});

export const treatments: Treatment[] = [
  {
    title: "Anti-Wrinkle Injections",
    slug: "anti-wrinkle",
    category: "anti-wrinkle",
    shortDescription: "Soften dynamic lines on the forehead, frown and crow's feet for a fresh, rested look.",
    heroImage: ph("t-anti-wrinkle", "Placeholder – anti-wrinkle treatment hero"),
    intro:
      "Anti-wrinkle injections use a prescription muscle-relaxing medicine to soften the expression lines that form when we frown, squint or raise our brows. Done well, you still look like you – just less tired.",
    addresses: "Forehead lines, frown lines (the '11s'), crow's feet, bunny lines, a gummy smile, chin dimpling, jaw clenching and teeth grinding.",
    benefits: ["Softens dynamic lines", "Helps prevent deeper creases", "Quick, minimal-downtime appointment", "Natural, movement-preserving results"],
    areas: ["Forehead", "Frown lines", "Crow's feet", "Bunny lines", "Masseter / jaw", "Chin", "Gummy smile"],
    howItWorks:
      "Tiny, precise doses are placed into specific facial muscles to temporarily reduce their activity. With less muscle contraction, the overlying skin creases less and lines soften. Dosing is tailored to your anatomy and how expressive you'd like to remain.",
    details: { duration: "30 minutes", downtime: "None to minimal", onset: "3–14 days", longevity: "3–4 months", sessions: "1, with a 2-week review" },
    prices: [
      { name: "Consultation", price: 0, unit: "Complimentary with treatment" },
      { name: "One area", price: 199, from: true, unit: "e.g. frown lines" },
      { name: "Two areas", price: 349, from: true },
      { name: "Three areas", price: 449, from: true },
      { name: "Masseter / jaw slimming", price: 499, from: true },
    ],
    priceNote: "Final pricing is confirmed at consultation and depends on the dose required.",
    timelyBookingUrl: TIMELY,
    showBeforeAfter: true,
    beforeAfter: [ba(1, "Frown lines – 2 weeks after"), ba(2, "Forehead – 2 weeks after"), ba(3, "Crow's feet – 2 weeks after")],
    faqs: [
      { question: "Does it hurt?", answer: "Most clients describe a quick pinch. We use very fine needles and the appointment is over in minutes." },
      { question: "Will I look frozen?", answer: "Not with our approach. We dose conservatively to soften lines while keeping natural expression, and review you at two weeks." },
      { question: "When will I see results?", answer: "You'll start to notice a difference from day 3, with the full result at around 14 days." },
      { question: "How often will I need treatment?", answer: "Results typically last 3–4 months. Many clients find results last longer with regular treatment." },
    ],
    safety: [
      risks("Common, temporary effects include redness, small bumps at injection points, mild bruising and occasionally a headache. Less commonly, a temporary droop of the brow or eyelid can occur. All risks are discussed in detail at consultation."),
      suitability(),
      aftercare("Stay upright for 4 hours, avoid touching or massaging the area, and skip strenuous exercise, saunas and alcohol for 24 hours."),
    ],
    related: ["dermal-fillers", "skin-boosters", "collagen-biostimulators"],
    seo: { title: "Anti-Wrinkle Injections Auckland | LINJECTABLES", description: "Natural-looking anti-wrinkle injections in Auckland for forehead lines, frown lines and crow's feet. Medically led, consultation-first. Book online." },
  },
  {
    title: "Dermal Fillers",
    slug: "dermal-fillers",
    category: "dermal-fillers",
    shortDescription: "Hyaluronic acid filler to restore volume, define contours and bring balance to the face.",
    heroImage: ph("t-dermal-fillers", "Placeholder – dermal filler treatment hero"),
    intro:
      "Dermal fillers are smooth hyaluronic acid gels – a substance naturally found in your skin – used to restore lost volume, support structure and enhance definition with subtle, balanced results.",
    addresses: "Volume loss in the cheeks and temples, lip shape and hydration, under-eye hollows, nose-to-mouth folds, jawline and chin definition.",
    benefits: ["Immediate, visible results", "Reversible hyaluronic acid", "Restores structure and support", "Tailored to facial proportions"],
    areas: ["Lips", "Cheeks", "Chin", "Jawline", "Temples", "Tear troughs", "Nasolabial folds"],
    howItWorks:
      "Using a fine needle or blunt cannula, filler is placed at precise depths to replace lost volume and support the tissues. Most fillers contain local anaesthetic for comfort. Because hyaluronic acid can be dissolved, treatment is adjustable.",
    details: { duration: "45–60 minutes", downtime: "1–3 days of possible swelling", onset: "Immediate; settles over 2 weeks", longevity: "6–18 months depending on area", sessions: "1, with optional review" },
    prices: [
      { name: "Lip filler", price: 450, from: true, unit: "per 1ml" },
      { name: "Cheek, chin or jawline", price: 650, from: true, unit: "per 1ml" },
      { name: "Tear trough", price: 650, from: true, unit: "per 1ml" },
      { name: "Filler dissolving", price: 250, from: true, unit: "per session" },
    ],
    timelyBookingUrl: TIMELY,
    showBeforeAfter: true,
    beforeAfter: [ba(1, "Lips – 1ml, 2 weeks after"), ba(2, "Cheeks – 2ml, immediately after"), ba(3, "Chin – 1ml, 2 weeks after")],
    faqs: [
      { question: "How long does swelling last?", answer: "Lips can be swollen for 2–3 days; other areas usually settle within 24–48 hours." },
      { question: "Can filler be reversed?", answer: "Yes. Hyaluronic acid fillers can be dissolved with an enzyme if needed." },
      { question: "How much filler will I need?", answer: "It depends on your goals and anatomy. We'll recommend a plan at consultation, and never push volume for its own sake." },
    ],
    safety: [
      risks("Swelling, tenderness and bruising are common and temporary. Rare but serious risks include infection and vascular occlusion. Your injector is trained in complication management and you'll receive direct after-hours contact details."),
      suitability(),
      aftercare("Avoid makeup for 12 hours, and avoid strenuous exercise, alcohol, saunas and facial massage for 24–48 hours. Sleep on your back the first night if possible."),
    ],
    related: ["anti-wrinkle", "collagen-biostimulators", "skin-boosters"],
    seo: { title: "Dermal Fillers Auckland | Lip, Cheek & Jaw Filler | LINJECTABLES", description: "Subtle, balanced dermal filler treatments in Auckland – lips, cheeks, chin, jawline and tear troughs. Book a consultation with an experienced injector." },
  },
  {
    title: "Skin Boosters",
    slug: "skin-boosters",
    category: "skin-boosters",
    shortDescription: "Micro-injections of hydrating actives for dewy, plump, luminous skin.",
    heroImage: ph("t-skin-boosters", "Placeholder – skin booster treatment hero"),
    intro:
      "Skin boosters deliver hydrating and regenerative ingredients directly into the skin, improving hydration, elasticity and glow from within. Think of it as a deep drink of water for your complexion.",
    addresses: "Dehydrated or dull skin, fine crepey lines, rough texture, early laxity, and skin quality on the face, neck, décolletage and hands.",
    benefits: ["Improves hydration and glow", "Smooths fine lines", "Refines texture", "No change to facial shape"],
    areas: ["Face", "Under eyes", "Neck", "Décolletage", "Hands"],
    howItWorks:
      "A series of tiny injections place a fine layer of product just beneath the skin's surface. The actives attract and bind water and support the skin's own repair processes over the following weeks.",
    details: { duration: "45 minutes", downtime: "Small bumps for 24–48 hours", onset: "2–4 weeks", longevity: "6–9 months after a course", sessions: "Course of 2–3, 4 weeks apart" },
    prices: [
      { name: "Skin booster – face", price: 450, from: true, unit: "per session" },
      { name: "Skin booster – course of 3", price: 1200, from: true, unit: "course of 3" },
      { name: "Neck or décolletage", price: 500, from: true, unit: "per session" },
    ],
    timelyBookingUrl: TIMELY,
    showBeforeAfter: true,
    beforeAfter: [ba(2, "Full face – after course of 3"), ba(3, "Under eyes – 4 weeks after")],
    faqs: [
      { question: "Will it change the shape of my face?", answer: "No. Skin boosters improve skin quality, not volume or contour." },
      { question: "How many sessions do I need?", answer: "We usually recommend a course of 2–3 sessions, then maintenance every 6–9 months." },
    ],
    safety: [
      risks("Small raised bumps, redness and pinpoint bruising are expected for 24–48 hours. Infection and allergic reaction are rare."),
      suitability(),
      aftercare("Avoid makeup for 12 hours and active skincare (retinoids, acids) for 48 hours. Wear SPF daily."),
    ],
    related: ["micro-needling", "collagen-biostimulators", "dermal-fillers"],
    seo: { title: "Skin Boosters Auckland | Hydration Injections | LINJECTABLES", description: "Skin booster injections in Auckland for deep hydration, glow and fine lines. Personalised courses from an experienced injector." },
  },
  {
    title: "Collagen Biostimulators",
    slug: "collagen-biostimulators",
    category: "collagen-biostimulators",
    shortDescription: "Stimulate your own collagen for gradual, long-lasting firmness and lift.",
    heroImage: ph("t-collagen-biostimulators", "Placeholder – collagen biostimulator treatment hero"),
    intro:
      "Collagen biostimulators are injectable treatments that encourage your skin to produce its own new collagen. Results build gradually over months for firmer, thicker, more resilient skin.",
    addresses: "Early skin laxity, thinning skin, loss of firmness along the jawline and cheeks, and overall skin quality.",
    benefits: ["Builds your own collagen", "Gradual, natural-looking change", "Long-lasting results", "Improves firmness and thickness"],
    areas: ["Mid-face", "Jawline", "Temples", "Neck", "Décolletage"],
    howItWorks:
      "The product is placed in the deeper layers of the skin, where it triggers a controlled regenerative response. Fibroblasts are stimulated to produce new collagen over the following 2–3 months.",
    details: { duration: "60 minutes", downtime: "1–3 days of mild swelling", onset: "6–12 weeks", longevity: "Up to 2 years after a course", sessions: "Course of 2–3, 6 weeks apart" },
    prices: [
      { name: "Biostimulator – single session", price: 850, from: true, unit: "per vial" },
      { name: "Biostimulator – course of 2", price: 1600, from: true, unit: "course of 2" },
    ],
    timelyBookingUrl: TIMELY,
    showBeforeAfter: false,
    beforeAfter: [],
    faqs: [
      { question: "When will I see results?", answer: "Collagen production takes time. Most clients notice a change from 6–8 weeks, with improvement continuing for several months." },
      { question: "Is it the same as filler?", answer: "No. Filler adds volume immediately; biostimulators encourage your skin to rebuild its own support gradually." },
    ],
    safety: [
      risks("Swelling, tenderness and bruising are common and temporary. Nodules can rarely form; careful technique and post-treatment massage reduce this risk."),
      suitability(),
      aftercare("Follow the '5-5-5' massage protocol if advised: 5 minutes, 5 times a day, for 5 days. Avoid strenuous exercise for 24 hours."),
    ],
    related: ["skin-boosters", "dermal-fillers", "micro-needling"],
    seo: { title: "Collagen Biostimulators Auckland | LINJECTABLES", description: "Collagen-stimulating injectable treatments in Auckland for firmer, thicker skin and gradual, natural-looking lift." },
  },
  {
    title: "Micro-Needling",
    slug: "micro-needling",
    category: "micro-needling",
    shortDescription: "Collagen induction therapy to refine texture, pores and acne scarring.",
    heroImage: ph("t-micro-needling", "Placeholder – micro-needling treatment hero"),
    intro:
      "Medical micro-needling creates controlled micro-channels in the skin to trigger its natural healing response, boosting collagen and elastin for smoother, more even skin.",
    addresses: "Acne scarring, enlarged pores, uneven texture, fine lines, mild pigmentation and stretch marks.",
    benefits: ["Refines texture and pores", "Softens acne scarring", "Boosts collagen and elastin", "Enhances serum absorption"],
    areas: ["Full face", "Neck", "Décolletage", "Acne scarring", "Stretch marks"],
    howItWorks:
      "After numbing cream, a medical-grade device glides across the skin creating thousands of micro-channels at a depth tailored to your concern. The skin responds by producing fresh collagen over the following weeks.",
    details: { duration: "60 minutes", downtime: "24–72 hours of redness", onset: "4–6 weeks", longevity: "Long-lasting with maintenance", sessions: "Course of 3–6, 4 weeks apart" },
    prices: [
      { name: "Micro-needling – face", price: 299, from: true, unit: "per session" },
      { name: "Micro-needling – course of 3", price: 799, from: true, unit: "course of 3" },
      { name: "Add neck & décolletage", price: 120, from: true },
    ],
    timelyBookingUrl: TIMELY,
    showBeforeAfter: true,
    beforeAfter: [ba(1, "Acne scarring – after 4 sessions"), ba(3, "Texture – after 3 sessions")],
    faqs: [
      { question: "Is it painful?", answer: "Numbing cream is applied beforehand. Most clients feel a light vibrating, scratchy sensation." },
      { question: "When can I wear makeup?", answer: "We recommend waiting 24 hours to let the micro-channels close." },
    ],
    safety: [
      risks("Redness, tightness and mild flaking are expected for a few days. Infection, breakouts and pigment changes are uncommon."),
      suitability("Not suitable over active acne, cold sores or eczema in the treatment area."),
      aftercare("Use gentle skincare only for 48 hours, no makeup for 24 hours, and strict daily SPF for 2 weeks."),
    ],
    related: ["skin-boosters", "collagen-biostimulators", "anti-wrinkle"],
    seo: { title: "Micro-Needling Auckland | Acne Scars & Texture | LINJECTABLES", description: "Medical micro-needling in Auckland for acne scarring, pores and skin texture. Personalised treatment courses." },
  },
  {
    title: "Fat-Dissolving Injections",
    slug: "fat-dissolving",
    category: "fat-dissolving",
    shortDescription: "Injectable treatment to reduce small, stubborn pockets of fat.",
    heroImage: ph("t-fat-dissolving", "Placeholder – fat-dissolving treatment hero"),
    intro:
      "Fat-dissolving injections use a compound that breaks down fat cell membranes, allowing the body to clear them naturally. Ideal for small, diet-resistant areas such as under the chin.",
    addresses: "Submental fullness (double chin), jowls, bra-line fat, and small pockets on the abdomen or flanks.",
    benefits: ["Non-surgical contouring", "Targets specific areas", "Permanent removal of treated fat cells", "No general anaesthetic"],
    areas: ["Under chin", "Jowls", "Bra line", "Abdomen", "Flanks"],
    howItWorks:
      "A series of small injections deliver the solution into the fat layer. Over the following weeks, the destroyed fat cells are cleared by your lymphatic system. Most areas need 2–4 sessions for the best result.",
    details: { duration: "30–45 minutes", downtime: "3–7 days of swelling", onset: "4–8 weeks", longevity: "Permanent for treated cells", sessions: "2–4, 6 weeks apart" },
    prices: [
      { name: "Under chin", price: 400, from: true, unit: "per session" },
      { name: "Body area", price: 450, from: true, unit: "per session" },
    ],
    timelyBookingUrl: TIMELY,
    showBeforeAfter: false,
    beforeAfter: [],
    faqs: [
      { question: "Is it a weight-loss treatment?", answer: "No. It is designed for small, stubborn areas in people who are close to their goal weight." },
      { question: "How swollen will I be?", answer: "Swelling is expected and can be significant for 3–5 days, especially under the chin. Plan around social events." },
    ],
    safety: [
      risks("Swelling, bruising, tenderness and numbness are common and temporary. Rare risks include nerve irritation, skin irregularities and infection."),
      suitability("Not suitable for significant excess weight or skin laxity, where other options may be better."),
      aftercare("Apply cool compresses, avoid strenuous exercise for 48 hours, and wear compression if advised for body areas."),
    ],
    related: ["anti-wrinkle", "dermal-fillers", "collagen-biostimulators"],
    seo: { title: "Fat-Dissolving Injections Auckland | Double Chin | LINJECTABLES", description: "Fat-dissolving injections in Auckland for double chin and small stubborn areas. Non-surgical contouring with an experienced injector." },
  },
];

export const concerns: Concern[] = [
  { title: "Facial volume & contour", slug: "face", label: "Face", x: 50, y: 52, side: "right", description: "With time, the face loses volume and structural support, which can lead to flattening, hollowing and less defined contours. Treatments can restore balance and lift in a natural way.", treatments: ["dermal-fillers", "collagen-biostimulators", "anti-wrinkle"] },
  { title: "Skin quality", slug: "skin", label: "Skin", x: 38, y: 58, side: "left", description: "Dullness, dehydration, fine lines, enlarged pores and uneven texture. We focus on improving the health and quality of the skin itself.", treatments: ["skin-boosters", "micro-needling", "collagen-biostimulators"] },
  { title: "Eyes", slug: "eyes", label: "Eyes", x: 60, y: 41, side: "right", description: "Crow's feet, under-eye hollows and crepey skin can make us look tired. Gentle, precise treatments refresh the eye area.", treatments: ["anti-wrinkle", "skin-boosters", "dermal-fillers"] },
  { title: "Forehead & frown lines", slug: "forehead", label: "Forehead", x: 47, y: 27, side: "left", description: "Dynamic lines from frowning and raising the brows can deepen over time. Softening them gives a calmer, rested appearance.", treatments: ["anti-wrinkle", "skin-boosters"] },
  { title: "Lips", slug: "lips", label: "Lips", x: 51, y: 70, side: "left", description: "Lips naturally lose volume and definition with age. Subtle enhancement can restore hydration, shape and balance.", treatments: ["dermal-fillers", "skin-boosters"] },
  { title: "Jawline & neck", slug: "neck", label: "Jaw & Neck", x: 58, y: 84, side: "right", description: "Loss of jawline definition, fullness under the chin and neck lines. Contouring and skin-tightening treatments can redefine this area.", treatments: ["fat-dissolving", "dermal-fillers", "collagen-biostimulators", "anti-wrinkle"] },
];

export const promotions: Promotion[] = [
  {
    title: "New client consultation",
    description: "Complimentary 30-minute consultation for all new clients throughout December.",
    active: true,
    endDate: "2026-12-31",
    disclaimer: "Placeholder disclaimer. Treatments involving prescription medicines require a consultation with a prescriber. Results vary between individuals. Promotion not redeemable for cash.",
    ctaLabel: "Book consultation",
  },
];

export const legalPages: LegalPage[] = [
  {
    title: "Privacy Policy",
    slug: "privacy-policy",
    updated: "2026-11-01",
    body: "PLACEHOLDER – have this reviewed by a professional before launch.\n\nLINJECTABLES respects your privacy and complies with the Privacy Act 2020 and the Health Information Privacy Code 2020.\n\nInformation we collect: when you make an enquiry or booking we collect your name, contact details and any information you choose to share with us. Clinical records are collected during consultations and stored securely.\n\nHow we use it: to respond to your enquiry, manage your appointments, provide safe care and, with your consent, send occasional updates.\n\nAccess and correction: you may request access to, or correction of, your personal information at any time by contacting us.",
  },
  {
    title: "Terms & Conditions",
    slug: "terms",
    updated: "2026-11-01",
    body: "PLACEHOLDER – have this reviewed by a professional before launch.\n\nBookings & cancellations: we require 24 hours' notice to cancel or reschedule. Late cancellations and no-shows may incur a fee.\n\nConsultations: all injectable treatments require a consultation. Treatment is at the clinician's discretion and may be declined where it is not clinically appropriate.\n\nPricing: prices shown are a guide and are confirmed at consultation. Prices may change without notice.\n\nResults: individual results vary and are not guaranteed.",
  },
];

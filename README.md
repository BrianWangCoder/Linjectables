# LINJECTABLES website

Website for LINJECTABLES, an aesthetic injectables clinic in Auckland.
Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP ScrollTrigger · Lenis**, with **Sanity** as the CMS.

> **Everything is placeholder** (copy, prices, address, phone, injector bio, images, partner logos, Timely links) until it is replaced in the CMS. Placeholder images say "PLACEHOLDER" on them.

---

## 1. Quick start (developer)

```bash
npm install
npm run dev          # http://localhost:3000
```

With no environment variables set, the site runs entirely from the built-in seed content in `src/content/seed.ts`. Nothing else is needed to preview it.

```bash
npm run build && npm start   # production build
npm run typecheck
```

Copy `.env.example` → `.env.local` and fill in values as you connect services.

## 2. Connect the CMS (Sanity), one time

1. Create a free project at <https://www.sanity.io/manage>. Note the **Project ID** and use dataset `production`.
2. Under **API → Tokens**, create an **Editor** token. Then put this in `.env.local`:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxx
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_WRITE_TOKEN=sk...          # only needed for seeding
   ```
3. Load all the placeholder content (six categories, six treatments, prices, concerns, promotion, clinic info) into Sanity:
   ```bash
   npm run seed:sanity
   ```
4. Run or deploy the Studio (the owner's editing app):
   ```bash
   cd studio
   npm install
   # studio/.env:  SANITY_STUDIO_PROJECT_ID=xxxxxxx
   npm run dev       # http://localhost:3333
   npm run deploy    # publishes to https://linjectables.sanity.studio
   ```
5. Under **API → CORS origins**, add your site domain(s) and `http://localhost:3333`.
6. **Instant publishing:** pages refresh from the CMS automatically every 60 seconds. To make them update the moment the owner hits Publish, add a webhook under **API → Webhooks**:
   - URL: `https://<your-domain>/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
   - Trigger on: create, update, delete. Method: POST.

If Sanity is unreachable, or a document type is still empty, the site falls back to the seed content, so it never shows a blank page.

## 3. Owner guide: editing content (no code)

Open the Studio (`https://linjectables.sanity.studio`), edit, then press **Publish**. Changes are live within a minute.

| I want to… | Go to |
|---|---|
| Change **address, phone, email, Instagram, opening hours, parking** | *Clinic info, hours & homepage → Clinic & contact* |
| Change the **homepage** hero text/video, intro, injector bio, gallery, partner logos | *Clinic info, hours & homepage → Homepage* |
| **Change a price** | *Treatments & prices → (treatment) → Prices & booking → Price list rows*. The same rows feed the treatment page **and** the Pricing page. |
| **Add a treatment** | *Treatments & prices → + Create*. Fill in title, URL (slug), category and content, then publish. The page appears at `/treatments/<slug>`, in the menu, on the pricing page and in the sitemap automatically. |
| Show/hide **before & after** | *Treatment → Before & after → Show before & after section*. Only upload images with written client consent. |
| Edit **FAQs / side effects / aftercare** | *Treatment → FAQs & safety* |
| Run a **promotion** | *Promotions → + Create*. Set dates and the disclaimer, and tick *Show on website*. It appears at the top of the Pricing page between the start and end dates. |
| Edit **Concerns** page hotspots | *Concerns*. X/Y are percentages across/down the portrait. Pick the treatments in display order. |
| Change the **category cards** (image, pill tag, subtitle, order) | *Treatment categories* |
| Edit **Privacy Policy / Terms** | *Legal pages* |
| Change SEO titles/descriptions | The **SEO** tab on each treatment and on clinic settings |

**Images:** use real photography at about 2000px on the long edge (JPG/WebP). Always fill in the *Alt text*, which helps accessibility and Google. The enquiry portrait is shown in black & white automatically.

**Hero video:** upload a short (8–15s), muted, looping MP4 under 8MB. The poster image shows while it loads and on data-saver or reduced-motion devices.

### ⚠️ NZ advertising compliance

Botulinum toxin, most dermal fillers and biostimulators are **prescription medicines**. NZ law (Medicines Act 1981, s.20 and s.58; ASA Therapeutic & Health Advertising Code) restricts advertising them to the public:
- never name product brands (e.g. say "anti-wrinkle injections", not a brand name);
- don't promise results, and don't use testimonials claiming results;
- promotions on prescription-medicine treatments need care. Use the **Disclaimer** field, and have final copy reviewed.

### Languages (English · 한국어 · 中文)

The site is available in **English** (`/…`), **Korean** (`/ko/…`) and **Simplified Chinese** (`/zh/…`). Visitors switch language with the globe menu (top right of the header), or with the language buttons in the mobile menu. Their choice is remembered for a year.

- **Editing translations:** every document in the Studio has a **한국어 / 中文** (Translations) section. It holds Korean and Chinese versions of the text fields. Any field left empty shows the English text. Prices, Timely links and images are shared across all languages, so a price only ever needs changing once.
- **Price rows, opening hours and before/after captions** are translated in the same order as the English list. If you add an English price row, add the translated name in the same position.
- **Fixed interface text** (buttons, menu labels, form messages) lives in `src/i18n/dictionaries/{en,ko,zh}.ts`.
- The Korean/Chinese placeholder copy is a draft. Have a native speaker, and a clinician for the medical wording, review it before launch. The same NZ advertising rules apply in every language.
- SEO: each language has its own URLs, `hreflang` alternates, a localized title/description and sitemap entries. That helps Korean and Chinese searches in Auckland find the right version.

## 4. Timely booking

- **Main link** (header *Book Now*, mobile *Book Online* bar, homepage CTAs): *Clinic info → Booking → Main Timely booking link*.
- **Per-treatment link**: *Treatment → Prices & booking → Timely booking link*. Used by the *Book treatment* buttons on that page.
- **Per-price-row link** (optional): each price row has its own Timely link, used by its *Book* button on the treatment page and the Pricing page. If it's empty, the treatment's link is used, then the main link.

**How to get a service-specific link:** in Timely, go to **Settings → Online bookings → Booking links / Buttons**. Create a link scoped to a **single service** (or a whole service category), and paste it into the matching field. Timely supports links scoped to a location, staff member, service category or individual service (see Timely help: "Booking links & Buttons").
*Limitation:* Timely doesn't document a public URL parameter for pre-selecting a service, so each service link has to be created in Timely and pasted in. If a service has no dedicated link, use its category link.

**Overlay vs new tab** (*Clinic info → Booking → How booking opens*):
- **Overlay** (default): the Timely page opens in a slide-in drawer, so visitors stay on the site. A "Open in new tab" link is always shown, and phones (<640px) always open a new tab for the best experience.
- **New tab**: always opens Timely in a new tab. Use this if Timely ever blocks embedding.

Every Book button is also a normal link, so it works without JavaScript and with ctrl/cmd-click.

## 5. Enquiry form

The form sits above the footer on every page and posts to `src/app/api/enquiry/route.ts`.

- **Email delivery:** create a [Resend](https://resend.com) account, verify the clinic domain, then set `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL` and `ENQUIRY_FROM_EMAIL`. Without a key, enquiries are only logged to the server console.
- **Spam protection** (always on): a hidden honeypot field, a minimum time-to-submit check and per-IP rate limiting. Optionally add **Cloudflare Turnstile** with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`.
- Validation runs both in the browser and on the server (`src/lib/validate.ts`).

## 6. Deploy (Vercel)

1. Push this repo to GitHub, then go to vercel.com → **New Project** → import it. The framework is detected as Next.js. Set **Root Directory** to the repo root (the `studio/` folder is deployed separately with `sanity deploy`).
2. Add the environment variables from `.env.example`, including `NEXT_PUBLIC_SITE_URL=https://www.your-domain.co.nz`, which sets canonical URLs, the sitemap and Open Graph links.
3. Add the custom domain. Then add the Sanity webhook (step 2.6).

Pages are statically generated with ISR (60s) plus on-demand revalidation, so they're served from the edge.

## 7. SEO

- Per-page titles/descriptions targeting Auckland searches. Treatment SEO fields are editable in the CMS.
- JSON-LD: `MedicalClinic`/`LocalBusiness` (address, geo, hours, phone) site-wide; `Service` + `Offer` (prices) on treatment and pricing pages; `FAQPage` and `BreadcrumbList` on treatment pages.
- `sitemap.xml` (includes every CMS treatment), `robots.txt`, canonical URLs, a generated Open Graph image (`src/app/opengraph-image.tsx`), and one `<h1>` per page.
- `next/image` (AVIF/WebP), self-hosted fonts via `next/font`, and a hero video that only loads on capable connections.

## 8. Motion system

Matches the calm, premium motion language of the reference site. Shared easing is `cubic-bezier(0.22, 1, 0.36, 1)`, with durations of 0.6–1.4s.

| Effect | Where |
|---|---|
| Lenis smooth scroll, synced to GSAP's ticker | `components/motion/SmoothScroll.tsx` |
| Line-by-line mask headline reveal | `RevealText` in `components/motion/Reveal.tsx` |
| Fade-up + staggered children on scroll | `Reveal`, `Stagger`, `StaggerItem` |
| Image clip-wipe + 1.12→1 scale + parallax (softer on mobile) | `components/motion/ImageReveal.tsx` |
| Header slide-in, shrink + background on scroll, hide on scroll down / show on scroll up | `components/layout/Header.tsx` |
| Treatments mega-menu (fade + slide, hover image preview) and full-screen mobile menu with accordion | `Header.tsx` |
| Infinite partner marquee (pauses on hover, faded edges) | `components/home/Marquee.tsx` |
| Pinned horizontal clinic gallery (GSAP ScrollTrigger), native swipe on mobile | `components/home/ClinicGallery.tsx` |
| Scroll-linked word highlight in the philosophy intro | `components/home/Intro.tsx` |
| Card hover zoom + overlay + arrow, pill-button fill, nav underline grow | `TreatmentCard.tsx`, `globals.css` |
| Route fade transitions | `app/template.tsx` |

`prefers-reduced-motion` is honoured everywhere: Framer Motion via `MotionConfig reducedMotion="user"`, Lenis and GSAP pinning are disabled, and CSS animations are neutralised.

## 9. Project structure

```
src/
  middleware.ts           language routing (/ = English, /ko, /zh)
  app/[locale]/           routes (home, treatments, treatments/[slug], concerns, pricing, contact, [legal])
    api/enquiry           form endpoint (Resend)
    api/revalidate        Sanity webhook → instant publish
  components/             layout, motion, home, treatments, concerns, booking, enquiry, ui
  content/seed.ts         placeholder content + fallback (English)
  content/translations/   Korean & Chinese placeholder content
  i18n/                   locale config + UI dictionaries (en, ko, zh)
  lib/content.ts          data layer (Sanity → falls back to seed)
  lib/sanity.ts           client + GROQ queries
studio/                   Sanity Studio (schemas in studio/schemas/index.ts)
scripts/                  seed-sanity.ts, generate-placeholders.mjs
public/placeholders/      generated placeholder artwork
```

## 10. Before launch checklist

- [ ] Replace all placeholder copy, prices, contact details and the injector bio in the CMS
- [ ] Upload real photography (hero video + poster, injector, clinic, category cards, concerns portrait, enquiry portrait)
- [ ] Upload partner logos (transparent SVG/PNG)
- [ ] Create and paste Timely links (main + per service)
- [ ] Set up Resend (and optionally Turnstile); send a test enquiry
- [ ] Have the Privacy Policy, Terms and all treatment copy reviewed (incl. the NZ advertising rules)
- [ ] Set `NEXT_PUBLIC_SITE_URL` and submit `sitemap.xml` in Google Search Console
- [ ] Create or claim the Google Business Profile with the same name, address and phone as the site

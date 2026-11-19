import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Cormorant_Garamond, Noto_Serif_KR, Noto_Serif_SC } from "next/font/google";
import "../globals.css";
import Header, { type MenuItem } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBookBar from "@/components/layout/MobileBookBar";
import EnquirySection from "@/components/enquiry/EnquirySection";
import SmoothScroll from "@/components/motion/SmoothScroll";
import MotionProvider from "@/components/motion/MotionProvider";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { I18nProvider } from "@/components/i18n/I18nProvider";
import JsonLd from "@/components/ui/JsonLd";
import { getCatalogue, getSiteSettings, categoryHref } from "@/lib/content";
import { clinicJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";
import { isLocale, localeMeta, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
// CJK display serifs – only the glyph slices actually used on a page are downloaded.
const notoSerifKR = Noto_Serif_KR({ weight: ["300", "400"], variable: "--font-serif-kr", display: "swap", preload: false });
const notoSerifSC = Noto_Serif_SC({ weight: ["300", "400"], variable: "--font-serif-sc", display: "swap", preload: false });

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const s = await getSiteSettings(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seo.title ?? "LINJECTABLES", template: "%s | LINJECTABLES" },
    description: s.seo.description,
    applicationName: "LINJECTABLES",
    formatDetection: { telephone: true },
  };
}

export const viewport: Viewport = { themeColor: "#f4f4f2", width: "device-width", initialScale: 1 };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const t = getDictionary(locale);
  const [settings, catalogue] = await Promise.all([getSiteSettings(locale), getCatalogue(locale)]);
  const menu: MenuItem[] = catalogue.map((c) => ({ title: c.title, href: categoryHref(c), subtitle: c.subtitle, image: c.image }));

  return (
    <html lang={localeMeta[locale].htmlLang} className={`${inter.variable} ${cormorant.variable} ${notoSerifKR.variable} ${notoSerifSC.variable}`}>
      <body>
        <a href="#main" className="sr-only z-[200] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {t.skip}
        </a>
        <I18nProvider locale={locale} dict={t}>
          <MotionProvider>
            <BookingProvider defaultUrl={settings.timelyBookingUrl} mode={settings.bookingMode}>
              <SmoothScroll />
              <Header menu={menu} />
              <main id="main">{children}</main>
              <EnquirySection settings={settings} />
              <Footer settings={settings} t={t} />
              <MobileBookBar />
            </BookingProvider>
          </MotionProvider>
        </I18nProvider>
        <JsonLd data={clinicJsonLd(settings, locale)} />
      </body>
    </html>
  );
}

import type { Dictionary } from "@/i18n";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** "$199", "From $199" / "$199부터" / "$199 起", or "Complimentary" in the visitor's language. */
export function formatPrice(price: number, from: boolean | undefined, t: Dictionary) {
  if (price === 0) return t.price.complimentary;
  const p = new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD", maximumFractionDigits: 0 }).format(price);
  return from ? t.price.from.replace("{price}", p) : p;
}

export function startingPrice(prices: { price: number }[]) {
  const paid = prices.map((p) => p.price).filter((p) => p > 0);
  return paid.length ? Math.min(...paid) : null;
}

export const paragraphs = (text?: string) => (text ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOCALE_COOKIE, localeMeta, locales, localizeHref, type Locale } from "@/i18n/config";
import { EASE } from "@/components/motion/Reveal";
import { useI18n } from "./I18nProvider";
import { cn } from "@/lib/utils";

/** Remember the choice (1 year) and go to the same page in the new language. */
function switchTo(next: Locale, pathname: string) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  // full navigation so <html lang>, fonts and metadata all update cleanly
  window.location.assign(localizeHref(pathname, next) + window.location.hash);
}

const GlobeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
  </svg>
);

/** Compact dropdown for the header (top-right). */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t.nav.language}: ${localeMeta[locale].label}`}
        className="link-underline flex h-11 items-center gap-1.5 whitespace-nowrap text-[12px] uppercase tracking-[0.16em]"
      >
        <span className="hidden sm:block"><GlobeIcon /></span>
        <span>{localeMeta[locale].short}</span>
        <svg width="9" height="6" viewBox="0 0 9 6" className={cn("transition-transform duration-500 ease-lux", open && "rotate-180")} aria-hidden>
          <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t.nav.language}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="absolute right-0 top-full z-10 mt-2 min-w-[150px] overflow-hidden rounded-2xl border border-line bg-paper py-2 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
          >
            {locales.map((l) => (
              <li key={l} role="option" aria-selected={l === locale}>
                <button
                  lang={localeMeta[l].htmlLang}
                  onClick={() => (l === locale ? setOpen(false) : switchTo(l, pathname))}
                  className="flex w-full items-center justify-between gap-6 px-5 py-2.5 text-left text-sm transition-colors hover:bg-cream"
                >
                  {localeMeta[l].label}
                  {l === locale && <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pill row for the full-screen mobile menu. */
export function LanguagePills() {
  const { locale, t } = useI18n();
  const pathname = usePathname();
  return (
    <div role="group" aria-label={t.nav.language} className="flex gap-2">
      {locales.map((l) => (
        <button
          key={l}
          lang={localeMeta[l].htmlLang}
          aria-pressed={l === locale}
          onClick={() => l !== locale && switchTo(l, pathname)}
          className={cn(
            "rounded-full border px-5 py-2.5 text-sm transition-colors duration-500",
            l === locale ? "border-ink bg-ink text-paper" : "border-ink/25",
          )}
        >
          {localeMeta[l].label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/Reveal";
import { useI18n } from "@/components/i18n/I18nProvider";

type Ctx = { open: (url?: string, label?: string) => void; defaultUrl: string; mode: "overlay" | "newTab" };
const BookingContext = createContext<Ctx | null>(null);

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}

/**
 * Timely booking.
 *  - "overlay" mode opens the Timely booking page in an on-site drawer (iframe),
 *    so visitors never leave the site. A "open in new tab" escape hatch is always shown.
 *  - "newTab" mode simply opens Timely in a new tab.
 * Each Book button passes its own service-specific Timely link; the global
 * buttons fall back to the clinic's main booking link.
 */
export function BookingProvider({ children, defaultUrl, mode }: { children: ReactNode; defaultUrl: string; mode: "overlay" | "newTab" }) {
  const { t } = useI18n();
  const [state, setState] = useState<{ url: string; label: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  const open = useCallback(
    (url?: string, label = t.nav.bookOnline) => {
      const target = url || defaultUrl;
      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      // On very small screens a full Timely tab is the better experience
      if (mode === "newTab" || isMobile) {
        window.open(target, "_blank", "noopener,noreferrer");
        return;
      }
      setLoaded(false);
      setState({ url: target, label });
    },
    [defaultUrl, mode, t],
  );

  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [state, close]);

  return (
    <BookingContext.Provider value={{ open, defaultUrl, mode }}>
      {children}
      <AnimatePresence>
        {state && (
          <motion.div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={state.label} initial="hidden" animate="show" exit="hidden">
            <motion.button
              aria-label={t.booking.closeBooking}
              onClick={close}
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.6, ease: EASE }}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-full max-w-[720px] flex-col bg-paper shadow-2xl"
              variants={{ hidden: { x: "100%" }, show: { x: 0 } }}
              transition={{ duration: 0.9, ease: EASE }}
              data-lenis-prevent
            >
              <div className="flex items-center justify-between border-b border-line px-6 py-4">
                <p className="eyebrow">{state.label}</p>
                <div className="flex items-center gap-5">
                  <a href={state.url} target="_blank" rel="noopener noreferrer" className="link-underline text-xs uppercase tracking-[0.18em]">
                    {t.booking.openNewTab}
                  </a>
                  <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper" aria-label={t.booking.close}>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.2" /></svg>
                  </button>
                </div>
              </div>
              <div className="relative flex-1">
                {!loaded && (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="eyebrow animate-pulse text-stone">{t.booking.loading}</span>
                  </div>
                )}
                <iframe
                  src={state.url}
                  title={t.booking.iframeTitle}
                  className="h-full w-full"
                  onLoad={() => setLoaded(true)}
                  allow="payment"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BookingContext.Provider>
  );
}

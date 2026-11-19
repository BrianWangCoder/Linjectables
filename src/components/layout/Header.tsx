"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import Link from "@/components/i18n/LocaleLink";
import LanguageSwitcher, { LanguagePills } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/components/i18n/I18nProvider";
import BookButton from "@/components/booking/BookButton";
import { EASE } from "@/components/motion/Reveal";
import { stripLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { Img } from "@/lib/types";

export type MenuItem = { title: string; href: string; subtitle: string; image: Img };

export default function Header({ menu }: { menu: MenuItem[] }) {
  const { t } = useI18n();
  const pathname = stripLocale(usePathname());
  const overHero = pathname === "/";
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const NAV = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.treatments, href: "/treatments", mega: true },
    { label: t.nav.concerns, href: "/concerns" },
    { label: t.nav.pricing, href: "/pricing" },
    { label: t.nav.contact, href: "/contact" },
  ];

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    if (megaOpen || mobileOpen || y < 240) return setHidden(false);
    if (y > prev + 2) setHidden(true);
    else if (y < prev - 2) setHidden(false);
  });

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setHidden(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const solid = scrolled || !overHero || megaOpen;
  const light = !solid && !mobileOpen; // white text over hero

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-700 ease-lux",
          solid ? "bg-paper/90 text-ink backdrop-blur-md" : "bg-transparent",
          light ? "text-white" : "text-ink",
          scrolled && !megaOpen && "shadow-[0_1px_0_rgba(0,0,0,0.06)]",
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
        onMouseLeave={closeMega}
      >
        <div className={cn("container-lux flex items-center justify-between transition-[height] duration-700 ease-lux", scrolled ? "h-16 lg:h-[72px]" : "h-20 lg:h-24")}>
          <Link href="/" aria-label={t.nav.home} className="relative z-10">
            <Logo className={cn("transition-[font-size] duration-700 ease-lux", scrolled ? "text-[15px] sm:text-[17px] lg:text-[19px]" : "text-[16px] sm:text-[18px] lg:text-[22px]")} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-9 xl:gap-10">
              {NAV.map((item) =>
                item.mega ? (
                  <li key={item.href} onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <button
                      className="link-underline flex items-center gap-1.5 text-[12px] uppercase tracking-[0.2em]"
                      aria-expanded={megaOpen}
                      aria-controls="mega-menu"
                      onClick={() => setMegaOpen((v) => !v)}
                      onFocus={openMega}
                    >
                      {item.label}
                      <svg width="9" height="6" viewBox="0 0 9 6" className={cn("transition-transform duration-500 ease-lux", megaOpen && "rotate-180")} aria-hidden>
                        <path d="M1 1l3.5 3.5L8 1" stroke="currentColor" fill="none" />
                      </svg>
                    </button>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-underline text-[12px] uppercase tracking-[0.2em]"
                      aria-current={pathname === item.href ? "page" : undefined}
                      onFocus={() => setMegaOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-5">
            <LanguageSwitcher />
            <BookButton variant={light ? "outline-light" : "dark"} className="hidden !py-3 sm:inline-flex" label={t.nav.bookNow} />
            <button
              className="relative z-10 grid h-11 w-11 place-items-center lg:hidden"
              aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="relative block h-3 w-7">
                <span className={cn("absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-lux", mobileOpen && "translate-y-[6px] rotate-45")} />
                <span className={cn("absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-lux", mobileOpen && "-translate-y-[5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>

        {/* Treatments mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              id="mega-menu"
              className="absolute inset-x-0 top-full hidden border-t border-line bg-paper text-ink lg:block"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              onKeyDown={(e) => e.key === "Escape" && setMegaOpen(false)}
            >
              <div className="container-lux grid grid-cols-12 gap-10 py-12">
                <div className="col-span-3">
                  <p className="eyebrow text-stone">{t.mega.eyebrow}</p>
                  <p className="display mt-4 text-3xl leading-tight">{t.mega.heading}</p>
                  <Link href="/treatments" className="link-underline mt-8 inline-block text-[12px] uppercase tracking-[0.2em]">
                    {t.mega.viewAll}
                  </Link>
                </div>
                <ul className="col-span-5 grid content-start gap-1">
                  {menu.map((m, i) => (
                    <motion.li key={m.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.05 + i * 0.04 }}>
                      <Link
                        href={m.href}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        className="group flex items-baseline justify-between gap-4 border-b border-line py-3.5"
                      >
                        <span className="display text-2xl transition-transform duration-500 ease-lux group-hover:translate-x-2">{m.title}</span>
                        <span className="text-right text-xs text-stone transition-opacity duration-500 group-hover:opacity-100 lg:opacity-0">{m.subtitle}</span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="relative col-span-4 aspect-[4/5] max-h-[380px] overflow-hidden rounded-2xl">
                  <AnimatePresence mode="popLayout">
                    {menu[active] && (
                      <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: EASE }}>
                        <Image src={menu[active].image.src} alt={menu[active].image.alt} fill sizes="400px" className="object-cover" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && <MobileMenu menu={menu} onClose={() => setMobileOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function MobileMenu({ menu, onClose }: { menu: MenuItem[]; onClose: () => void }) {
  const { t } = useI18n();
  const [treatmentsOpen, setTreatmentsOpen] = useState(false);
  const item = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } };
  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto bg-paper pt-24 text-ink lg:hidden"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.8, ease: EASE }}
      data-lenis-prevent
    >
      <motion.nav
        aria-label="Mobile"
        className="container-lux pb-32"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
      >
        <motion.div variants={item} className="border-b border-line">
          <Link href="/#about" onClick={onClose} className="display block py-4 text-4xl">{t.nav.about}</Link>
        </motion.div>
        <motion.div variants={item} className="border-b border-line">
          <button className="display flex w-full items-center justify-between py-4 text-left text-4xl" aria-expanded={treatmentsOpen} onClick={() => setTreatmentsOpen((v) => !v)}>
            {t.nav.treatments}
            <span className={cn("text-2xl transition-transform duration-500 ease-lux", treatmentsOpen && "rotate-45")} aria-hidden>+</span>
          </button>
          <AnimatePresence initial={false}>
            {treatmentsOpen && (
              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.6, ease: EASE }} className="overflow-hidden">
                {menu.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} onClick={onClose} className="flex items-baseline justify-between py-2.5 pl-1 text-lg">
                      {m.title} <span className="text-stone">→</span>
                    </Link>
                  </li>
                ))}
                <li className="pb-5 pt-2">
                  <Link href="/treatments" onClick={onClose} className="eyebrow link-underline">{t.mega.viewAll}</Link>
                </li>
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
        {[
          [t.nav.concerns, "/concerns"],
          [t.nav.pricing, "/pricing"],
          [t.nav.contact, "/contact"],
        ].map(([l, h]) => (
          <motion.div key={h} variants={item} className="border-b border-line">
            <Link href={h} onClick={onClose} className="display block py-4 text-4xl">{l}</Link>
          </motion.div>
        ))}
        <motion.div variants={item} className="mt-10">
          <p className="eyebrow mb-4 text-stone">{t.nav.language}</p>
          <LanguagePills />
        </motion.div>
        <motion.div variants={item} className="mt-10">
          <BookButton className="w-full" label={t.nav.bookNow} />
        </motion.div>
      </motion.nav>
    </motion.div>
  );
}

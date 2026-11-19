"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // smooth in-page anchor links (e.g. About → /#about)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname === location.pathname && url.hash) {
        const el = document.querySelector(url.hash);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: -40 });
          history.replaceState(null, "", url.hash);
        }
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  // reset scroll on route change, or jump to a hash target (e.g. arriving at /#about)
  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    const go = () => {
      if (target) {
        window.__lenis ? window.__lenis.scrollTo(target as HTMLElement, { offset: -40, immediate: true }) : target.scrollIntoView();
      } else {
        window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0);
      }
      ScrollTrigger.refresh();
    };
    const id = requestAnimationFrame(go);
    // re-align once fonts/images have settled the layout (hash targets only)
    const t = target ? setTimeout(go, 400) : undefined;
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(t);
    };
  }, [pathname]);

  return null;
}

import Image from "next/image";
import type { Partner } from "@/lib/types";

/**
 * Infinite logo marquee: the list is rendered twice and translated -50%,
 * so the loop is seamless. Pauses on hover; edges fade via a CSS mask.
 */
export default function Marquee({ partners }: { partners: Partner[] }) {
  const items = partners.length < 6 ? [...partners, ...partners] : partners;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-16 pr-16 sm:gap-24 sm:pr-24" aria-hidden={hidden || undefined}>
      {items.map((p, i) => (
        <li key={`${p.name}-${i}`} className="shrink-0 opacity-55 grayscale transition-opacity duration-500 hover:opacity-100">
          {p.logo?.src ? (
            <Image src={p.logo.src} alt={hidden ? "" : p.logo.alt || p.name} width={160} height={48} className="h-9 w-auto object-contain sm:h-11" />
          ) : (
            <span className="display whitespace-nowrap text-2xl uppercase tracking-[0.25em] sm:text-3xl">{p.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group mask-fade-x relative overflow-hidden">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: `${items.length * 5}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

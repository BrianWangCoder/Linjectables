import Link from "@/components/i18n/LocaleLink";
import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/Icons";
import type { Img } from "@/lib/types";

export default function TreatmentCard({
  href,
  image,
  tag,
  label,
  title,
  subtitle,
  priority,
}: {
  href: string;
  image: Img;
  tag?: string;
  label: string;
  title: string;
  subtitle: string;
  priority?: boolean;
}) {
  return (
    <Link href={href} className="group block focus-visible:outline-offset-8">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[22px] bg-sand">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1400ms] ease-lux group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0 transition-colors duration-700 ease-lux group-hover:bg-ink/15" />
        {tag && (
          <span className="absolute left-5 top-5 rounded-full bg-paper/90 px-3.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-ink backdrop-blur">
            {tag}
          </span>
        )}
        <span className="absolute right-5 top-5 grid h-11 w-11 scale-75 place-items-center rounded-full bg-paper text-ink opacity-0 transition-all duration-700 ease-lux group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          <ArrowUpRight />
        </span>
        <span className="absolute bottom-5 left-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white">{label}</span>
      </div>
      <h3 className="display mt-5 text-[1.75rem] leading-tight">{title}</h3>
      <p className="mt-1.5 text-sm text-stone">{subtitle}</p>
    </Link>
  );
}

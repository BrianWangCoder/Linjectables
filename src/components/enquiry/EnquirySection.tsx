import EnquiryForm from "./EnquiryForm";
import ImageReveal from "@/components/motion/ImageReveal";
import { RevealText, Reveal } from "@/components/motion/Reveal";
import type { SiteSettings } from "@/lib/types";

/** Universal enquiry block that sits directly above the footer on every page. */
export default function EnquirySection({ settings }: { settings: SiteSettings }) {
  const e = settings.enquiry;
  return (
    <section id="enquire" aria-label={settings.enquiry.heading} className="bg-paper">
      <div className="grid lg:grid-cols-2">
        <ImageReveal image={e.image} grayscale className="aspect-[4/5] lg:aspect-auto lg:min-h-[760px]" parallax={40} sizes="(min-width:1024px) 50vw, 100vw" />
        <div className="flex items-center px-5 py-20 sm:px-12 lg:px-20 xl:px-28">
          <div className="w-full max-w-xl">
            <Reveal>
              <p className="eyebrow text-stone">{e.eyebrow}</p>
            </Reveal>
            <RevealText as="h2" text={e.heading} className="mt-5 text-4xl font-semibold uppercase leading-[1.02] tracking-[-0.01em] sm:text-5xl" />
            <div className="mt-12">
              <EnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

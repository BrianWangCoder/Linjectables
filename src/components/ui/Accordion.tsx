"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState, type ReactNode } from "react";
import { EASE } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export type AccordionItem = { id?: string; title: ReactNode; content: ReactNode; meta?: ReactNode };

/** Accessible accordion (button + region) with smooth height animation. */
export default function Accordion({
  items,
  defaultOpen = [],
  multiple = true,
  className,
  titleClassName = "display text-2xl sm:text-[1.75rem]",
}: {
  items: AccordionItem[];
  defaultOpen?: number[];
  multiple?: boolean;
  className?: string;
  titleClassName?: string;
}) {
  const [open, setOpen] = useState<number[]>(defaultOpen);
  const base = useId();
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));

  return (
    <div className={cn("border-t border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const bid = `${base}-b${i}`;
        const pid = `${base}-p${i}`;
        return (
          <div key={item.id ?? i} id={item.id} className="scroll-mt-28 border-b border-line">
            <h3>
              <button
                id={bid}
                aria-expanded={isOpen}
                aria-controls={pid}
                onClick={() => toggle(i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className={cn("transition-transform duration-500 ease-lux group-hover:translate-x-1", titleClassName)}>{item.title}</span>
                <span className="flex shrink-0 items-center gap-5">
                  {item.meta}
                  <span className="relative grid h-10 w-10 place-items-center rounded-full border border-ink/20 transition-colors duration-500 group-hover:bg-ink group-hover:text-paper" aria-hidden>
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className={cn("absolute h-3.5 w-px bg-current transition-transform duration-500 ease-lux", isOpen && "rotate-90 scale-y-0")} />
                  </span>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={pid}
                  role="region"
                  aria-labelledby={bid}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.7, ease: EASE }, opacity: { duration: 0.5, ease: EASE } }}
                  className="overflow-hidden"
                >
                  <div className="pb-8">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

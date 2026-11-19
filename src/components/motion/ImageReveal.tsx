"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/types";
import { cn } from "@/lib/utils";
import { EASE } from "./Reveal";

/**
 * Image that wipes in with a clip-path mask while scaling 1.12 → 1,
 * with optional scroll parallax (softened on small screens, off for reduced motion).
 * The un-clipped outer element observes the viewport; the clip animates on an inner layer.
 */
export default function ImageReveal({
  image,
  className,
  imgClassName,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  parallax = 0,
  direction = "up",
  grayscale = false,
}: {
  image: Img;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** parallax travel in px (0 = off) */
  parallax?: number;
  direction?: "up" | "left";
  grayscale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setSmall(mq.matches);
    const on = () => setSmall(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const travel = reduce ? 0 : small ? parallax * 0.4 : parallax;
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  const hidden = direction === "up" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={reduce ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        className="absolute inset-0 overflow-hidden"
        variants={{ hidden: { clipPath: hidden }, show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.4, ease: EASE } } }}
      >
        <motion.div className="absolute inset-x-0 -inset-y-[8%]" style={{ y }}>
          <motion.div
            className="relative h-full w-full"
            variants={{ hidden: { scale: 1.12 }, show: { scale: 1, transition: { duration: 1.8, ease: EASE } } }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              priority={priority}
              className={cn("object-cover", grayscale && "grayscale", imgClassName)}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

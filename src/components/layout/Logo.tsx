import { cn } from "@/lib/utils";

/** Thin, wide-tracked wordmark. Swap for an SVG logo file when one exists. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("display block whitespace-nowrap uppercase leading-none tracking-[0.32em] font-light", className)}>
      Linjectables
    </span>
  );
}

"use client";

import type { ReactNode } from "react";
import { useBooking } from "./BookingProvider";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * Renders a real <a href> to Timely (works without JS, crawlable, right-click-able)
 * and upgrades to the on-site booking drawer on click.
 */
export default function BookButton({
  url,
  label,
  children,
  className,
  variant = "dark",
}: {
  url?: string;
  label?: string;
  children?: ReactNode;
  className?: string;
  variant?: "dark" | "light" | "outline" | "outline-light" | "none";
}) {
  const { open, defaultUrl } = useBooking();
  const { t } = useI18n();
  const text = label ?? t.nav.bookOnline;
  const href = url || defaultUrl;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        open(href, text);
      }}
      className={cn(variant !== "none" && "btn", variant !== "none" && `btn-${variant}`, className)}
    >
      {children ?? text}
    </a>
  );
}

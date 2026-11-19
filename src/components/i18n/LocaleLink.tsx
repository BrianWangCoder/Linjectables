"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { localizeHref } from "@/i18n/config";
import { useI18n } from "./I18nProvider";

/** Drop-in replacement for next/link that keeps the visitor in their chosen language. */
export default function LocaleLink({ href, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const { locale } = useI18n();
  return <Link href={localizeHref(href, locale)} {...props} />;
}

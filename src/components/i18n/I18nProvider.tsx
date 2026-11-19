"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

const I18nContext = createContext<{ locale: Locale; t: Dictionary } | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}

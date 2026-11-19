import en, { type Dictionary } from "./dictionaries/en";
import ko from "./dictionaries/ko";
import zh from "./dictionaries/zh";
import type { Locale } from "./config";

export type { Dictionary };
const dictionaries: Record<Locale, Dictionary> = { en, ko, zh };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale] ?? en;

/** "Book {title}" + { title: "Fillers" } → "Book Fillers" */
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));

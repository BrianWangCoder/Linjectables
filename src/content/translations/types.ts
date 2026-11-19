import type { Concern, LegalPage, Promotion, SiteSettings, Treatment, TreatmentCategory } from "@/lib/types";

export type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

/**
 * Per-language overrides layered on top of the English content.
 * Arrays of objects listed in INDEX_MERGE_KEYS (prices, opening hours…) are merged
 * item-by-item, so translating a price row's name never touches its price.
 * Any field left out falls back to English.
 */
export type ContentTranslation = {
  siteSettings?: DeepPartial<SiteSettings>;
  categories?: Record<string, DeepPartial<TreatmentCategory>>;
  treatments?: Record<string, DeepPartial<Treatment>>;
  concerns?: Record<string, DeepPartial<Concern>>;
  /** by position, matching the English promotions list */
  promotions?: DeepPartial<Promotion>[];
  legalPages?: Record<string, DeepPartial<LegalPage>>;
};

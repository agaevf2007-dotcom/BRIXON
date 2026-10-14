import { en } from "@/locales/en";
import { ru } from "@/locales/ru";
import type { Locale } from "@/types/i18n";

export const dictionaries = { ru, en };

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

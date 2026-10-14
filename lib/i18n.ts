import type { Locale, Localized } from "@/types/i18n";

export function loc<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function getByPath(source: unknown, path: string): string {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);

  return typeof value === "string" ? value : path;
}

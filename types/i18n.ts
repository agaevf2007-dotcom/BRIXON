export type Locale = "ru" | "en";

export type Localized<T = string> = Record<Locale, T>;

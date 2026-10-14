"use client";

import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types/i18n";

export function LanguageSwitcher({ light }: { light?: boolean }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label={t("language.switchTo")}
      className={cn(
        "inline-flex items-center rounded-full border px-1 py-1 text-xs tracking-[0.14em]",
        light ? "border-white/25 text-white" : "border-ink/10 text-ink",
      )}
    >
      {(["ru", "en"] as Locale[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors cursor-pointer",
            locale === code
              ? light
                ? "bg-white text-ink"
                : "bg-ink text-white"
              : light
                ? "text-white/70 hover:text-white"
                : "text-muted hover:text-ink",
          )}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

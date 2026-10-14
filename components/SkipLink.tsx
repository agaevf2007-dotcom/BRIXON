"use client";

import { useLocale } from "@/context/LocaleContext";

export function SkipLink() {
  const { t } = useLocale();
  return (
    <a href="#main" className="skip-link">
      {t("skip")}
    </a>
  );
}

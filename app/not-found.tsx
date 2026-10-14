"use client";

import { Button } from "@/components/Button";
import { useLocale } from "@/context/LocaleContext";

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-5 py-24 sm:px-8 lg:px-12">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-4 max-w-xl text-4xl tracking-tight md:text-6xl">{t("notFound.title")}</h1>
      <p className="mt-5 max-w-md text-muted">{t("notFound.text")}</p>
      <Button href="/" className="mt-10 w-fit">
        {t("notFound.home")}
      </Button>
    </div>
  );
}

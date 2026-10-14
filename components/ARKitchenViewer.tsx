"use client";

import { Button } from "@/components/Button";
import { useLocale } from "@/context/LocaleContext";
import { canUseKitchenAR } from "@/lib/ar-device";
import { loc } from "@/lib/i18n";
import type { ProductModel3D } from "@/types/product";
import { ScanLine } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ViewerElement = HTMLElement & { activateAR?: () => Promise<void> | void };

export function ARKitchenViewer({
  model,
  name,
}: {
  model: ProductModel3D;
  name: string;
}) {
  const { locale, t } = useLocale();
  const viewerRef = useRef<ViewerElement | null>(null);
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canUseKitchenAR()) return;
    setAllowed(true);
    void import("@google/model-viewer").then(() => setReady(true));
  }, []);

  if (!allowed) return null;

  return (
    <section className="mt-8 rounded-[1.75rem] bg-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <ScanLine className="mt-0.5 size-5 shrink-0 text-accent" />
        <div>
          <h2 className="text-xl tracking-tight">{t("product.arTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("product.arHint")}</p>
        </div>
      </div>

      {ready ? (
        <model-viewer
          ref={viewerRef}
          src={model.glb}
          alt={name}
          ar
          ar-modes="webxr scene-viewer quick-look"
          ar-placement="floor"
          camera-controls
          touch-action="pan-y"
          shadow-intensity="1"
          className="mt-5 block h-[320px] w-full rounded-[1.5rem] bg-canvas"
          style={{ width: "100%", height: "320px" }}
        />
      ) : (
        <div className="mt-5 flex h-[180px] items-center justify-center rounded-[1.5rem] bg-canvas text-sm text-muted">
          {t("product.arLoading")}
        </div>
      )}

      <Button
        className="mt-4 w-full"
        disabled={!ready}
        onClick={() => {
          void viewerRef.current?.activateAR?.();
        }}
      >
        {t("product.arCta")}
      </Button>
      <p className="mt-3 text-xs leading-relaxed text-muted">{loc(model.source, locale)}</p>
    </section>
  );
}

"use client";

import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const { t } = useLocale();

  return (
    <div
      className={cn(
        "inline-flex h-12 items-center rounded-full border border-ink/10 bg-surface",
        className,
      )}
    >
      <button
        type="button"
        className="grid size-12 place-items-center rounded-full transition-colors hover:bg-canvas cursor-pointer disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={t("common.decrease")}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="grid size-12 place-items-center rounded-full transition-colors hover:bg-canvas cursor-pointer disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t("common.increase")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

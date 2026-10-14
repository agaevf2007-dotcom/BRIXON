"use client";

import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function StarRating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const icon = size === "md" ? "size-4" : "size-3.5";
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => {
          const filled = index + 1 <= Math.round(value);
          return (
            <Star
              key={index}
              className={cn(icon, filled ? "fill-ink text-ink" : "text-ink/20")}
            />
          );
        })}
      </div>
      <p className="text-sm text-muted">
        <span className="text-ink">{value.toFixed(1)}</span>
        {typeof count === "number" ? ` · ${count} ${t("common.reviews")}` : null}
      </p>
    </div>
  );
}

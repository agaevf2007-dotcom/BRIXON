"use client";

import { StarRating } from "@/components/StarRating";
import { useLocale } from "@/context/LocaleContext";
import { getReviewsForProduct } from "@/data/reviews";
import { loc } from "@/lib/i18n";

export function ProductReviews({
  productId,
  rating,
  count,
}: {
  productId: string;
  rating: number;
  count: number;
}) {
  const items = getReviewsForProduct(productId);
  const { locale, t } = useLocale();

  return (
    <section className="mt-24 border-t border-ink/8 pt-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="text-3xl tracking-tight md:text-5xl">{t("product.reviews")}</h2>
        <StarRating value={rating} count={count} size="md" />
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {items.map((review) => (
          <article key={review.id} className="rounded-[1.75rem] bg-white p-7">
            <StarRating value={review.rating} />
            <h3 className="mt-4 text-xl tracking-tight">{loc(review.title, locale)}</h3>
            <p className="mt-3 leading-relaxed text-muted">{loc(review.text, locale)}</p>
            <p className="mt-6 text-sm text-muted">
              {review.name} · {loc(review.date, locale)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

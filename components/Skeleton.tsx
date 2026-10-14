export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-[1.75rem] bg-ink/6" />
      <div className="mt-5 h-3 w-24 rounded-full bg-ink/8" />
      <div className="mt-3 h-6 w-3/4 rounded-full bg-ink/8" />
      <div className="mt-3 h-4 w-full rounded-full bg-ink/6" />
      <div className="mt-6 h-5 w-20 rounded-full bg-ink/8" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12">
      <div className="h-10 w-64 animate-pulse rounded-full bg-ink/8" />
      <div className="mt-6 h-5 w-96 max-w-full animate-pulse rounded-full bg-ink/6" />
    </div>
  );
}

"use client";

import { useLocale } from "@/context/LocaleContext";
import { cn, EASE_PREMIUM } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [fullscreen, setFullscreen] = useState(false);
  const reduce = useReducedMotion();
  const { t } = useLocale();
  const visible = images.filter((src) => !hidden.has(src));
  const gallery = visible.length ? visible : images.slice(0, 1);
  const total = gallery.length;
  const current = gallery[Math.min(active, Math.max(0, total - 1))] ?? gallery[0];

  const reject = useCallback((src: string) => {
    setHidden((prev) => {
      if (prev.has(src)) return prev;
      const next = new Set(prev);
      next.add(src);
      return next;
    });
  }, []);

  useEffect(() => {
    if (active >= total) setActive(Math.max(0, total - 1));
  }, [active, total]);

  const go = useCallback(
    (step: number) => {
      setActive((index) => (index + step + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, go]);

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
        <div className="order-2 hidden gap-3 overflow-x-auto no-scrollbar lg:order-1 lg:flex lg:flex-col">
          {gallery.map((image, index) => (
            <Thumb
              key={image + index}
              image={image}
              active={active === index}
              name={name}
              index={index}
              onClick={() => setActive(index)}
              onReject={() => reject(image)}
              tView={t("product.view")}
            />
          ))}
        </div>

        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[2rem] bg-white lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: EASE_PREMIUM }}
            >
              <Image
                src={current}
                alt={`${name} — ${t("product.view")} ${active + 1}`}
                fill
                priority
                className="object-contain p-6"
                sizes="(min-width: 1024px) 50vw, 100vw"
                onError={() => reject(current)}
                onLoad={(event) => {
                  if (event.currentTarget.naturalWidth < 48) reject(current);
                }}
              />
            </motion.div>
          </AnimatePresence>

          {total > 1 ? (
            <>
              <NavButton
                label={t("product.prev")}
                className="left-3"
                onClick={() => go(-1)}
              >
                <ChevronLeft className="size-5" />
              </NavButton>
              <NavButton
                label={t("product.next")}
                className="right-3"
                onClick={() => go(1)}
              >
                <ChevronRight className="size-5" />
              </NavButton>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full bg-white/90 text-ink cursor-pointer"
            aria-label={t("product.fullscreen")}
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2 lg:hidden">
        {gallery.map((image, index) => (
          <button
            key={`dot-${image}-${index}`}
            type="button"
            aria-label={`${t("product.view")} ${index + 1}`}
            aria-current={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "size-2 rounded-full transition-colors cursor-pointer",
              active === index ? "bg-ink" : "bg-ink/20",
            )}
          />
        ))}
      </div>

      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar lg:hidden">
        {gallery.map((image, index) => (
          <Thumb
            key={`m-${image}-${index}`}
            image={image}
            active={active === index}
            name={name}
            index={index}
            onClick={() => setActive(index)}
            onReject={() => reject(image)}
            tView={t("product.view")}
          />
        ))}
      </div>

      {fullscreen
        ? createPortal(
            <div className="fixed inset-0 z-[90] flex flex-col bg-night/95 p-4 sm:p-8">
              <div className="mb-4 flex items-center justify-between text-white">
                <p className="text-sm text-white/70">
                  {active + 1} / {total}
                </p>
                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="grid size-11 place-items-center rounded-full hover:bg-white/10 cursor-pointer"
                  aria-label={t("product.closeFullscreen")}
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="relative min-h-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    className="absolute inset-0"
                    initial={reduce ? false : { opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                  >
                    <Image
                      src={current}
                      alt={`${name} — ${t("product.view")} ${active + 1}`}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      onError={() => reject(current)}
                    />
                  </motion.div>
                </AnimatePresence>
                <NavButton label={t("product.prev")} className="left-2 sm:left-6" onClick={() => go(-1)} light>
                  <ChevronLeft className="size-6" />
                </NavButton>
                <NavButton label={t("product.next")} className="right-2 sm:right-6" onClick={() => go(1)} light>
                  <ChevronRight className="size-6" />
                </NavButton>
              </div>
              <div className="mt-4 flex justify-center gap-3 overflow-x-auto pb-2">
                {gallery.map((image, index) => (
                  <Thumb
                    key={`fs-${image}-${index}`}
                    image={image}
                    active={active === index}
                    name={name}
                    index={index}
                    onClick={() => setActive(index)}
                    onReject={() => reject(image)}
                    tView={t("product.view")}
                  />
                ))}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function Thumb({
  image,
  active,
  name,
  index,
  onClick,
  onReject,
  tView,
}: {
  image: string;
  active: boolean;
  name: string;
  index: number;
  onClick: () => void;
  onReject?: () => void;
  tView: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${tView} ${index + 1} — ${name}`}
      aria-current={active}
      className={cn(
        "relative size-20 shrink-0 overflow-hidden rounded-2xl border bg-white transition-all cursor-pointer",
        active ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        className="object-contain p-1"
        sizes="80px"
        onError={onReject}
        onLoad={(event) => {
          if (event.currentTarget.naturalWidth < 48) onReject?.();
        }}
      />
    </button>
  );
}

function NavButton({
  children,
  label,
  onClick,
  className,
  light,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full cursor-pointer",
        light ? "bg-white/10 text-white hover:bg-white/20" : "bg-white/90 text-ink hover:bg-white",
        className,
      )}
    >
      {children}
    </button>
  );
}

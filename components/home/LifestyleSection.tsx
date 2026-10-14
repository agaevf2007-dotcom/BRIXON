"use client";

import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { images } from "@/data/images";
import { EASE_PREMIUM } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

export function LifestyleSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { t } = useLocale();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-6%", "6%"]);

  return (
    <section ref={ref} className="bg-white">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-28">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[5/4] lg:aspect-[4/5]">
          <motion.div className="absolute inset-0" style={{ y }}>
            <Image
              src={images.lifestyleKitchen}
              alt={t("home.lifestyleTitle")}
              fill
              className="object-cover scale-110"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </motion.div>
        </div>
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("home.philosophy")}</p>
          <h2 className="mt-4 text-4xl leading-[1.05] tracking-tight md:text-6xl">
            {t("home.lifestyleTitle")}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{t("home.lifestyleText")}</p>
          <Button href="/about" className="mt-10" variant="secondary">
            {t("home.ourPhilosophy")}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}

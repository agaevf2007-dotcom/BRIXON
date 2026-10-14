"use client";

import { Button } from "@/components/Button";
import { images } from "@/data/images";
import { EASE_PREMIUM } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

export function Hero() {
  const reduce = useReducedMotion();
  const { dict, t } = useLocale();

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-night text-white">
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_PREMIUM }}
      >
        <Image
          src={images.heroKitchen}
          alt={t("slogan")}
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-night/70 via-night/30 to-night/10" />
      </motion.div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <h1 className="max-w-4xl text-[12vw] font-medium leading-[0.9] tracking-[-0.04em] sm:text-[9vw] lg:text-[6.4rem]">
          {dict.home.heroLines.map((line, index) => (
            <span key={`${line}-${index}`} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.35 + index * 0.12,
                  ease: EASE_PREMIUM,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-6 max-w-md text-base text-white/75 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE_PREMIUM }}
        >
          {t("home.heroSubtitle")}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: EASE_PREMIUM }}
        >
          <Button href="/catalog" variant="invert" size="lg">
            {t("home.explore")}
          </Button>
          <Button
            href="/about"
            variant="ghost"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {t("home.discover")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

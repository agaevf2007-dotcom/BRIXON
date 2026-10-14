"use client";

import { Button } from "@/components/Button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";
import { images } from "@/data/images";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

const chapterImages = [
  images.studio,
  images.lifestyleKitchen,
  images.materials,
  images.phone,
  images.nature,
];

export function AboutContent() {
  const { dict } = useLocale();

  return (
    <>
      <AboutHero />
      <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 lg:px-12">
        {dict.about.chapters.map((chapter, index) => (
          <Chapter
            key={chapter.title}
            title={chapter.title}
            text={chapter.text}
            image={chapterImages[index]}
            reverse={index % 2 === 1}
            showCta={index === 1}
            cta={dict.about.explore}
          />
        ))}
      </div>
    </>
  );
}

function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { t } = useLocale();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0px", "0px"] : ["0px", "80px"]);

  return (
    <section ref={ref} className="relative min-h-[88svh] overflow-hidden bg-night text-white">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={images.luxuryInterior}
          alt={t("about.kicker")}
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-night/50" />
      </motion.div>
      <div className="relative mx-auto flex min-h-[88svh] max-w-[1440px] flex-col justify-end px-5 py-20 sm:px-8 lg:px-12">
        <p className="text-xs uppercase tracking-[0.22em] text-white/65">{t("about.kicker")}</p>
        <h1 className="mt-5 max-w-4xl text-5xl leading-[0.95] tracking-tight md:text-7xl">
          {t("about.hero1")}
          <span className="block">{t("about.hero2")}</span>
        </h1>
      </div>
    </section>
  );
}

function Chapter({
  title,
  text,
  image,
  reverse,
  showCta,
  cta,
}: {
  title: string;
  text: string;
  image: string;
  reverse?: boolean;
  showCta?: boolean;
  cta: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);

  return (
    <article
      ref={ref}
      className={`grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-20 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
    >
      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
        <motion.div className="absolute inset-0" style={{ y }}>
          <Image src={image} alt="" fill className="object-cover scale-110" sizes="(min-width: 1024px) 50vw, 100vw" />
        </motion.div>
      </div>
      <ScrollReveal>
        <h2 className="text-3xl tracking-tight md:text-5xl">{title}</h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{text}</p>
        {showCta ? (
          <Button href="/catalog" variant="secondary" className="mt-8">
            {cta}
          </Button>
        ) : null}
      </ScrollReveal>
    </article>
  );
}

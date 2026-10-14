"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";
import { images } from "@/data/images";
import Image from "next/image";

const imageKeys = [images.phone, images.quiet, images.energy, images.care] as const;

export function TechnologySection() {
  const { dict, t } = useLocale();

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <ScrollReveal>
        <p className="text-xs uppercase tracking-[0.22em] text-muted">{t("home.intelligence")}</p>
        <h2 className="mt-4 max-w-3xl text-4xl leading-[1.05] tracking-tight md:text-6xl">
          {t("home.techTitle")}
        </h2>
      </ScrollReveal>
      <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
        {dict.home.tech.map((card, index) => (
          <ScrollReveal key={card.title} delay={index * 0.06}>
            <article className="overflow-hidden rounded-[2rem] bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src={imageKeys[index]}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div className="p-7 md:p-9">
                <h3 className="text-2xl tracking-tight md:text-3xl">{card.title}</h3>
                <p className="mt-3 text-muted">{card.text}</p>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

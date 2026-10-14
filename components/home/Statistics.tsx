"use client";

import { CountUp } from "@/components/CountUp";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "@/context/LocaleContext";

export function Statistics() {
  const { dict } = useLocale();

  return (
    <section className="border-y border-ink/8 bg-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-10 px-5 py-16 sm:px-8 lg:grid-cols-4 lg:px-12 lg:py-24">
        {dict.home.stats.map((stat, index) => (
          <ScrollReveal key={stat.label} delay={index * 0.08}>
            <p className="text-5xl tracking-tight md:text-6xl">
              <CountUp to={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-3 text-sm text-muted">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

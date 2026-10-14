"use client";

import { cn, EASE_PREMIUM } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

type AnimatedTextProps = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
  inView?: boolean;
};

export function AnimatedText({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = "h1",
  inView = false,
}: AnimatedTextProps) {
  const Tag = as;
  const reduce = useReducedMotion();

  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={cn("block", lineClassName)}
            initial={reduce ? false : { y: "110%" }}
            animate={inView ? undefined : reduce ? undefined : { y: 0 }}
            whileInView={inView && !reduce ? { y: 0 } : undefined}
            viewport={inView ? { once: true, amount: 0.6 } : undefined}
            transition={{
              duration: 0.9,
              delay: delay + index * 0.12,
              ease: EASE_PREMIUM,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

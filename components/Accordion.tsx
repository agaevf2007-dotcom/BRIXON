"use client";

import { cn, EASE_PREMIUM } from "@/lib/utils";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

export function Accordion({
  items,
  className,
}: {
  items: { question: string; answer: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className={cn("divide-y divide-ink/10 border-y border-ink/10", className)}>
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={`${item.question}-${index}`}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              <span className="text-lg tracking-tight md:text-xl">{item.question}</span>
              <Plus
                className={cn(
                  "size-5 shrink-0 transition-transform duration-300",
                  isOpen && "rotate-45",
                )}
                aria-hidden
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 text-muted leading-relaxed">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

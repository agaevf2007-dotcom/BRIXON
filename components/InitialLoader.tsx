"use client";

import { EASE_PREMIUM } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function InitialLoader() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const seen = sessionStorage.getItem("brixon-loaded");
    if (seen) return;
    setVisible(true);
    const hide = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("brixon-loaded", "1");
    }, 1500);
    return () => window.clearTimeout(hide);
  }, [reduce]);

  useEffect(() => {
    document.body.style.overflow = visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE_PREMIUM }}
        >
          <div className="text-center">
            <motion.p
              className="text-sm font-semibold tracking-[0.42em]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE_PREMIUM }}
            >
              BRIXON
            </motion.p>
            <motion.span
              className="mx-auto mt-6 block h-px w-16 origin-left bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_PREMIUM }}
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

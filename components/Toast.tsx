"use client";

import { useToast } from "@/context/ToastContext";
import { EASE_PREMIUM } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export function Toast() {
  const { toasts, dismissToast } = useToast();
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed bottom-6 right-4 z-[70] flex w-[min(100%-2rem,360px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: EASE_PREMIUM }}
            className="pointer-events-auto rounded-2xl border border-ink/8 bg-white/95 p-4 shadow-[0_18px_50px_rgba(17,17,17,0.08)] backdrop-blur-md"
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium tracking-tight">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-muted">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-full hover:bg-canvas cursor-pointer"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
              >
                <X className="size-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

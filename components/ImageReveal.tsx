"use client";

import { cn, EASE_PREMIUM } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

type ImageRevealProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
};

export function ImageReveal({
  src,
  alt,
  className,
  imageClassName,
  sizes,
  priority,
  fill = true,
  width,
  height,
}: ImageRevealProps) {
  const [loaded, setLoaded] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("relative overflow-hidden bg-ink/5", className)}
      initial={
        reduce
          ? false
          : { opacity: 0, clipPath: "inset(8% 8% 8% 8%)", scale: 1.04 }
      }
      animate={
        loaded || reduce
          ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
          : undefined
      }
      transition={{ duration: 1.1, ease: EASE_PREMIUM }}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        priority={priority}
        className={cn("object-cover", imageClassName)}
        onLoad={() => setLoaded(true)}
      />
    </motion.div>
  );
}

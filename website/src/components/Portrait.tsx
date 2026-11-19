"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/** Portrait that is unveiled with a slow vertical wipe the first time it is seen. */
export function Portrait({ src, alt, sizes, priority = false, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative aspect-[3/4] overflow-hidden bg-ink-2 ${className}`}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(100% 0 0 0)" }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div className="absolute inset-0" initial={reduce ? false : { scale: 1.12 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}>
        <Image src={`/media/${src}`} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </motion.div>
    </motion.div>
  );
}

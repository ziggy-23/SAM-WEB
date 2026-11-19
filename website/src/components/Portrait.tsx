"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * The portrait, rendered as a wax seal (see scripts/make-wax-seal.py).
 * It appears as if being pressed: slightly larger and tilted, then settling into the page.
 */
export function Portrait({ src, alt, sizes, priority = false, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`relative aspect-square ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.12, rotate: -6 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: [0.22, 1.2, 0.36, 1] }}
    >
      <Image src={`/media/${src}`} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
    </motion.div>
  );
}

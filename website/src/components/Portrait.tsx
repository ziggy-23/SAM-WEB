"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * The portrait: a single-line drawing on a transparent background.
 * It is revealed top to bottom, as if being drawn, and warms to the accent colour on hover.
 */
export function Portrait({ src, alt, sizes, priority = false, className = "" }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const reduce = useReducedMotion();
  const accent = src.replace(/(\.\w+)$/, "-accent$1");
  return (
    <motion.div
      className={`group relative aspect-[811/1200] ${className}`}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 2.4, ease: [0.45, 0, 0.2, 1] }}
    >
      <Image src={`/media/${src}`} alt={alt} fill sizes={sizes} priority={priority} className="object-contain transition-opacity duration-700 group-hover:opacity-0" />
      <Image src={`/media/${accent}`} alt="" aria-hidden fill sizes={sizes} className="object-contain opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
    </motion.div>
  );
}

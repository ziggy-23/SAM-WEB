"use client";
import { motion } from "motion/react";

/**
 * Tiny drawings in a child's hand — one to four wobbly strokes each.
 * They draw themselves once, then sit faintly in the background.
 */
const DOODLES: Record<string, string[]> = {
  flag: ["M12 42 L13 8", "M13 9 C19 6, 23 13, 30 9 C33 8, 35 9, 36 10 C33 14, 35 18, 36 20 C30 23, 25 16, 14 21", "M6 42 C11 40, 17 43, 22 41"],
  scale: ["M24 8 L24 40", "M16 41 C20 39, 28 40, 32 41", "M9 15 C16 12, 32 12, 39 14", "M9 15 L5 26 C8 30, 14 30, 16 26 L9 15 M39 14 L33 25 C36 29, 42 29, 44 25 L39 14"],
  pencil: ["M30 8 L40 18 L20 38 L10 40 L12 30 Z", "M6 45 C10 42, 13 47, 17 44 S24 43, 29 45"],
  data: ["M10 40 L10 30 M18 40 L18 22 M26 40 L26 27 M34 40 L34 14", "M6 41 C16 40, 30 42, 42 40", "M40 5 L41 9 L45 10 L41 11 L40 15 L39 11 L35 10 L39 9 Z"],
  camera: ["M8 16 C8 14, 9 13, 11 13 L17 13 L20 9 L28 9 L31 13 L38 13 C40 13, 41 14, 41 16 L41 35 C41 37, 40 38, 38 38 L11 38 C9 38, 8 37, 8 35 Z", "M24.5 18 C30 18, 32.5 22, 32 26 C31.5 31, 27 33, 24 33 C19 33, 16.5 29, 17 25 C17.5 21, 20 18, 24.5 18", "M35 17 L37.5 17"],
  runner: ["M30 7 C32 7, 33.5 8.5, 33.5 10.5 C33.5 12.5, 32 14, 30 14 C28 14, 26.5 12.5, 26.5 10.5 C26.5 8.5, 28 7, 30 7", "M28 15 L23 26 L15 31 M23 26 L29 33 L26 42 M27 17 L20 20 L15 18 M27 17 L33 22 L37 19", "M5 22 L11 22 M3 28 L9 28"],
  ball: ["M24 10 C32 10, 37 16, 37 23 C37 31, 31 36, 24 36 C16 36, 11 30, 11 23 C11 15, 17 10, 24 10", "M24 17 L29 21 L27 27 L21 27 L19 21 Z", "M3 17 C6 16, 8 17, 9 19 M2 24 L7 24"],
  drums: ["M10 27 C10 23, 34 23, 34 27 C34 31, 10 31, 10 27", "M10 27 L11 38 C16 42, 28 42, 33 38 L34 27", "M15 22 L7 10 M29 22 L36 11", "M41 6 L41 15 M41 6 C43 7, 45 8, 45 11 M39.4 15.6 C40.6 14.6, 42 15.2, 41.6 16.4 C41 17.6, 39 17.4, 39.4 15.6"],
  globe: ["M20 14 C27 14, 32 19.5, 32 26 C32 32.5, 27 38, 20 38 C13 38, 8 32.5, 8 26 C8 19.5, 13 14, 20 14", "M20 14 C14 20, 14 32, 20 38 M20 14 C26 20, 26 32, 20 38 M8.5 26 L31.5 26", "M29 4 C40 3, 46 6, 45 11 C44 15, 37 16, 33 15 L28 19 L30 14 C26 12, 25 5, 29 4", "M33 9.6 L33.1 9.6 M37 9.6 L37.1 9.6 M41 9.6 L41.1 9.6"],
  pan: ["M6 34 C6 40, 30 40, 30 34 C30 31, 6 31, 6 34", "M30 34 L45 30", "M12 13 C12 10, 25 9, 25 12 C25 15, 12 16, 12 13", "M8 26 C7 21, 9 18, 11 16 M28 25 C30 21, 29 17, 26 15"],
};

export function Doodle({ name, className = "" }: { name?: string; className?: string }) {
  const paths = name ? DOODLES[name] : undefined;
  if (!paths) return null;
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths.map((d, i) => (
        <motion.path key={i} d={d} initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.4 + i * 0.35, ease: "easeInOut" }} />
      ))}
    </svg>
  );
}

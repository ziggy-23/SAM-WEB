"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Globe } from "./Globe";
import { formatCoord } from "@/lib/utils";

type Stop = { id: string; city: string; country: string; lat: number; lon: number };
const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ headline, subline, stops }: { headline: string; subline: string; stops: Stop[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const globeY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const first = stops[0], last = stops[stops.length - 1];

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden pt-[var(--nav-h)]" aria-labelledby="hero-title">
      <motion.div style={{ y: globeY, opacity: fade }} className="pointer-events-none absolute right-[-45%] top-[30%] w-[135%] md:right-[-16%] md:top-[8%] md:w-[78%] lg:right-[-12%] lg:w-[60%]">
        <div className="opacity-40 md:opacity-100">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: EASE }}>
            <Globe stops={stops} />
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ y: textY }} className="wrap relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-between pb-8 pt-10 md:pt-14">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="t-meta flex flex-wrap gap-x-6 gap-y-1"
        >
          <span>Personal archive</span>
          <span className="hidden text-faint sm:inline">—</span>
          <span>{formatCoord(first.lat, first.lon)} <span className="text-orange">→</span> {formatCoord(last.lat, last.lon)}</span>
        </motion.div>

        <div className="grid-swiss items-end">
          <h1 id="hero-title" className="col-span-4 md:col-span-8 lg:col-span-9">
            <span className="sr-only">SAM — </span>
            <span aria-hidden className="t-display -ml-[0.06em] flex text-[clamp(8rem,31vw,30rem)]">
              {"SAM".split("").map((ch, i) => (
                <span key={i} className="-my-[0.1em] inline-block overflow-hidden py-[0.1em]">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? { opacity: 0 } : { y: "100%" }}
                    animate={reduce ? { opacity: 1 } : { y: "0%" }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.1 + i * 0.09 }}
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          </h1>
        </div>

        <div className="grid-swiss mt-6 gap-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 1.2, ease: EASE }}
            className="t-headline col-span-4 text-[clamp(1.5rem,2.6vw,2.6rem)] md:col-span-6 lg:col-span-6"
          >
            {headline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
            className="col-span-4 flex flex-col justify-end gap-6 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10"
          >
            <p className="max-w-[28ch] text-sm text-muted">{subline}</p>
            <a href="#intro" className="t-meta group flex items-center gap-3 text-text">
              <span className="relative block h-8 w-px overflow-hidden bg-line-2">
                <motion.span
                  className="absolute inset-x-0 top-0 h-3 bg-orange"
                  animate={reduce ? undefined : { y: [-12, 32] }}
                  transition={{ duration: 1.8, repeat: 3, ease: "easeInOut", delay: 2 }}
                />
              </span>
              Begin
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

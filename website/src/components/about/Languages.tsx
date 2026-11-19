"use client";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";

type Lang = { name: string; native: string; dir?: "ltr" | "rtl"; level: string | null; percent?: number };

const FILL_S = 2.8;

/** A small burst at the end of a completed bar. */
function Spark() {
  return (
    <motion.span className="pointer-events-none absolute -right-1 top-1/2 size-0" initial="hidden" animate="show" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <motion.span
          key={deg}
          className="absolute left-0 top-0 h-px w-2.5 origin-left bg-orange"
          style={{ rotate: deg }}
          variants={{ hidden: { x: 0, opacity: 0, scaleX: 0.2 }, show: { x: [0, 10, 16], opacity: [0, 1, 0], scaleX: [0.2, 1, 0.4] } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      ))}
      <motion.svg viewBox="0 0 20 20" className="absolute -left-2.5 -top-2.5 size-5 text-orange"
        initial={{ scale: 0, rotate: -40, opacity: 0 }} animate={{ scale: [0, 1.3, 1], rotate: 0, opacity: [0, 1, 1] }} transition={{ duration: 0.7, ease: "easeOut" }}>
        <path d="M10 1 L11.6 8.4 L19 10 L11.6 11.6 L10 19 L8.4 11.6 L1 10 L8.4 8.4 Z" fill="currentColor" />
      </motion.svg>
    </motion.span>
  );
}

function Lock() {
  return (
    <svg viewBox="0 0 12 14" className="size-3.5 text-stone/70" fill="none" stroke="currentColor" strokeWidth={1.3} aria-hidden>
      <rect x="1.5" y="6" width="9" height="7" rx="1" />
      <path d="M3.5 6 V4.2 a2.5 2.5 0 0 1 5 0 V6" />
    </svg>
  );
}

function Bar({ percent, delay }: { percent: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [done, setDone] = useState(false);
  const complete = percent >= 100;
  return (
    <div ref={ref} className="relative w-full" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={complete ? "Native" : "Proficiency"}>
      <div className="relative h-[22px] border border-line-2 p-[3px]">
        <motion.div
          className={`relative h-full overflow-hidden ${complete ? "bg-orange" : "bg-beige/85"}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : undefined}
          transition={{ duration: FILL_S * (0.4 + percent / 170), delay, ease: [0.33, 0, 0.2, 1] }}
          onAnimationComplete={() => inView && setDone(true)}
        >
          {/* a light that passes once along a completed bar */}
          {complete && done && (
            <motion.span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              initial={{ left: "-35%" }} animate={{ left: "110%" }} transition={{ duration: 1.1, ease: "easeInOut" }} />
          )}
        </motion.div>
        {!complete && (
          <span className="absolute right-1.5 top-1/2 -translate-y-1/2"><Lock /></span>
        )}
      </div>
      <AnimatePresence>{complete && done && <Spark />}</AnimatePresence>
    </div>
  );
}

/** Languages in their own script, with an English label, a level and a progress bar. */
export function Languages({ items, arabicClass }: { items: Lang[]; arabicClass: string }) {
  return (
    <ul className="mt-6 border-b hairline">
      {items.map((l, i) => {
        const isAr = l.dir === "rtl";
        return (
          <li key={l.name} className="group grid-swiss items-center gap-y-3 border-t hairline py-5 md:py-6">
            <span lang={isAr ? "ar" : undefined} dir={l.dir}
              className={`col-span-4 text-left text-[clamp(2.2rem,5vw,4.5rem)] leading-none transition-colors group-hover:text-beige md:col-span-4 lg:col-span-6 ${isAr ? arabicClass : "t-headline"}`}>
              {l.native}
            </span>
            <span className="col-span-4 flex items-baseline justify-between gap-3 md:col-span-3 md:block lg:col-span-2">
              <span className="block text-sm text-text">{l.name}</span>
              <span className="t-meta block">{l.level ?? ""}</span>
            </span>
            <span className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
              {l.percent !== undefined && <Bar percent={l.percent} delay={0.15 + i * 0.12} />}
            </span>
          </li>
        );
      })}
      <li className="grid-swiss items-center gap-y-3 border-t hairline py-5">
        <span className="col-span-4 font-serif text-xl italic text-muted md:col-span-7 lg:col-span-8">More coming...</span>
        <span className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
          <span className="relative block h-[22px] overflow-hidden border border-line-2 p-[3px]" role="progressbar" aria-label="More languages to come" aria-busy="true">
            <span className="relative block h-full overflow-hidden">
              <span className="loading-sweep absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-orange/80 to-transparent" />
            </span>
          </span>
        </span>
      </li>
    </ul>
  );
}

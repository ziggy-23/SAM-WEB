"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { pad } from "@/lib/utils";

type Lang = { name: string; native: string; dir?: "ltr" | "rtl"; level: string | null; percent?: number };

function Bar({ percent, delay }: { percent: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  return (
    <div ref={ref} className="relative h-[5px] w-full bg-ink-3" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Proficiency">
      <motion.div
        className={`absolute inset-y-0 left-0 ${percent === 100 ? "bg-orange" : "bg-beige"}`}
        initial={{ width: 0 }} animate={inView ? { width: `${percent}%` } : undefined}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* tick marks at each CEFR step */}
      {[16.6, 33.3, 50, 66.6, 83.3].map((t) => <span key={t} className="absolute inset-y-0 w-px bg-ink" style={{ left: `${t}%` }} aria-hidden />)}
    </div>
  );
}

/** Languages in their own script, with an English label and a proficiency bar. */
export function Languages({ items, arabicClass }: { items: Lang[]; arabicClass: string }) {
  return (
    <ul className="mt-6 border-b hairline">
      {items.map((l, i) => {
        const isAr = l.dir === "rtl";
        return (
          <li key={l.name} className="group grid-swiss items-center gap-y-3 border-t hairline py-5 md:py-6">
            <span className="col-span-1 font-mono text-xs text-faint">{pad(i + 1)}</span>
            <span lang={isAr ? "ar" : undefined} dir={l.dir}
              className={`col-span-3 text-left text-[clamp(2.2rem,5vw,4.5rem)] leading-none transition-colors group-hover:text-beige md:col-span-4 lg:col-span-5 ${isAr ? arabicClass : "t-headline"}`}>
              {l.native}
            </span>
            <span className="col-span-4 flex items-baseline justify-between gap-3 md:col-span-3 md:block lg:col-span-2">
              <span className="block text-sm text-text">{l.name}</span>
              <span className="t-meta block">{l.level ?? "—"}</span>
            </span>
            <span className="col-span-4 flex items-center gap-4 md:col-span-8 md:col-start-2 lg:col-span-4 lg:col-start-9">
              {l.percent !== undefined && <><Bar percent={l.percent} delay={0.1 + i * 0.08} /><span className="t-meta w-10 shrink-0 text-right">{l.percent}%</span></>}
            </span>
          </li>
        );
      })}
      <li className="grid-swiss items-center gap-y-3 border-t hairline py-5 md:py-6">
        <span className="col-span-1 font-mono text-xs text-faint">{pad(items.length + 1)}</span>
        <span className="t-headline col-span-3 text-[clamp(2.2rem,5vw,4.5rem)] leading-none text-faint md:col-span-4 lg:col-span-5">More to come</span>
        <span className="col-span-4 md:col-span-3 lg:col-span-2">
          <span className="block text-sm text-muted">Next language</span>
          <span className="t-meta block">loading…</span>
        </span>
        <span className="col-span-4 flex items-center gap-4 md:col-span-8 md:col-start-2 lg:col-span-4 lg:col-start-9">
          <span className="relative h-[5px] w-full overflow-hidden bg-ink-3" role="progressbar" aria-label="More languages to be learned" aria-busy="true">
            <span className="loading-sweep absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-orange to-transparent" />
          </span>
          <span className="t-meta w-10 shrink-0 text-right">…</span>
        </span>
      </li>
    </ul>
  );
}

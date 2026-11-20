"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const ORANGE = "#c58b60";
const DRAW = { duration: 0.9, ease: [0.65, 0, 0.35, 1] as const };

type Verdict = "no" | "partial" | "yes";

/** A hand-drawn verdict mark: a cross, a half-tick or a tick. */
function VerdictMark({ verdict, show, delay }: { verdict: Verdict; show: boolean; delay: number }) {
  const paths: Record<Verdict, string[]> = {
    no: ["M6 7 C 14 15, 22 24, 30 31", "M29 6 C 21 14, 14 23, 7 31"],
    partial: ["M5 20 C 10 21, 14 25, 16 28", "M16 28 C 18 22, 22 18, 26 16", "M27 15 L 33 13"],
    yes: ["M5 19 C 10 21, 14 26, 15 30", "M15 30 C 19 20, 25 11, 33 5"],
  };
  return (
    <svg viewBox="0 0 38 38" className="size-9 shrink-0 overflow-visible" aria-hidden>
      {paths[verdict].map((d, i) => (
        <motion.path key={i} d={d} fill="none" stroke={verdict === "yes" ? "#8f9a78" : ORANGE} strokeWidth={2.2} strokeLinecap="round"
          strokeDasharray={verdict === "partial" && i === 2 ? "2 4" : undefined}
          initial={{ pathLength: 0 }} animate={show ? { pathLength: 1 } : undefined} transition={{ ...DRAW, delay: delay + i * 0.35 }} />
      ))}
    </svg>
  );
}

const VERDICT_LABEL: Record<Verdict, string> = { no: "Not achieved", partial: "Partly achieved", yes: "Achieved" };

/** A list of stated objectives, each marked by hand as achieved, partly achieved or not. */
export function Scorecard({ title, items, source }: { title?: string; items: { goal: string; verdict: Verdict; note?: string }[]; source?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const hits = items.filter((i) => i.verdict === "yes").length;
  return (
    <figure ref={ref} className="border-t border-line-2 pt-3">
      {title && (
        <figcaption className="mb-4 flex items-baseline justify-between gap-3">
          <span className="font-sans text-sm font-medium text-text">{title}</span>
          <span className="t-hand text-2xl text-orange">{hits} / {items.length}</span>
        </figcaption>
      )}
      <ol className="divide-y divide-line">
        {items.map((it, i) => (
          <motion.li key={it.goal} className="flex items-start gap-4 py-3"
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 0.15 + i * 0.45 }}>
            <VerdictMark verdict={it.verdict} show={inView} delay={0.3 + i * 0.45} />
            <div>
              <p className="text-[0.9rem] text-text">{it.goal}</p>
              <p className="t-meta mt-1"><span className={it.verdict === "yes" ? "text-moss" : "text-orange"}>{VERDICT_LABEL[it.verdict]}</span>{it.note && <> · {it.note}</>}</p>
            </div>
          </motion.li>
        ))}
      </ol>
      {source && <p className="t-meta mt-3 text-faint">{source}</p>}
    </figure>
  );
}

/** Possible outcomes; the one marked `likely` gets a hand-drawn ring and a note. */
export function Scenarios({ title, items }: { title?: string; items: { label: string; text: string; likely?: boolean }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <figure className="border-t border-line-2 pt-3">
      {title && <figcaption className="mb-5 font-sans text-sm font-medium text-text">{title}</figcaption>}
      <ol ref={ref} className="space-y-5">
        {items.map((it, i) => (
          <motion.li key={it.label} className="relative px-4 py-3"
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: it.likely ? 1 : 0.7, y: 0 } : undefined} transition={{ delay: i * 0.3, duration: 0.6 }}>
            {it.likely && (
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-1 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] overflow-visible" aria-hidden>
                <motion.path d="M50 2 C 82 0, 99 12, 98 30 C 97 52, 55 61, 20 55 C -1 50, 0 12, 28 5 C 40 2, 56 1, 66 3" fill="none" stroke={ORANGE} strokeWidth={1.4} vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 1.2, delay: items.length * 0.3 + 0.2 }} />
              </svg>
            )}
            <p className={`t-meta ${it.likely ? "text-orange" : ""}`}>{it.label}</p>
            <p className="mt-1 text-sm text-muted">{it.text}</p>
            {it.likely && (
              <motion.span className="t-hand absolute -right-2 -top-6 rotate-[-4deg] text-xl text-orange"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: items.length * 0.3 + 1.2 }}>
                most likely?
              </motion.span>
            )}
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}

/** A large pull quote with a drawn underline under the attribution. */
export function PullQuote({ children, by }: { children: React.ReactNode; by?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <figure ref={ref} className="relative">
      <span aria-hidden className="t-display absolute -left-2 -top-10 text-[6rem] leading-none text-orange/40">“</span>
      <blockquote className="t-headline text-[clamp(1.6rem,2.4vw,2.2rem)] italic leading-tight text-text">{children}</blockquote>
      {by && (
        <figcaption className="t-meta relative mt-5 inline-block">
          {by}
          <svg viewBox="0 0 100 8" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-2 w-full overflow-visible" aria-hidden>
            <motion.path d="M0 5 C 25 2, 50 7, 75 4 S 98 3, 100 5" fill="none" stroke={ORANGE} strokeWidth={1.6} vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={DRAW} />
          </svg>
        </figcaption>
      )}
    </figure>
  );
}

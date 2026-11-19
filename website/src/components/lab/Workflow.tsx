"use client";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { T } from "../Text";

/**
 * Interactive workflow diagram. Select a node to read what happens at that step.
 * When `illustrative` is true the diagram is clearly labelled as a drawing,
 * not a connection to a live system.
 */
export function Workflow({ steps, illustrative = true }: { steps: { title: string; text: string }[]; illustrative?: boolean }) {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <div ref={ref} className="border hairline bg-ink/80">
      {illustrative && <p className="t-meta border-b hairline px-5 py-3 italic">An illustration of the process, not a live system.</p>}
      <div className="p-5 md:p-8">
        <div role="tablist" aria-label="Workflow steps" className="relative flex flex-col gap-3 md:flex-row md:items-start md:gap-0">
          {steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-1 items-center md:flex-col md:items-stretch">
              {i < steps.length - 1 && (
                <svg className="absolute left-[11px] top-6 h-[calc(100%)] w-px md:left-[calc(50%+14px)] md:top-[11px] md:h-px md:w-[calc(100%-28px)]" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
                  <motion.line x1="0" y1="0" x2="100" y2="0" className="hidden md:block" stroke="#8f9a78" strokeWidth="2" strokeDasharray="4 5" vectorEffect="non-scaling-stroke"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 0.3 + i * 0.3 }} />
                  <motion.line x1="0" y1="0" x2="0" y2="100" className="md:hidden" stroke="#8f9a78" strokeWidth="2" strokeDasharray="4 5" vectorEffect="non-scaling-stroke"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 0.3 + i * 0.3 }} />
                </svg>
              )}
              <motion.button
                type="button" role="tab" aria-selected={active === i} aria-controls="workflow-panel" id={`wf-${i}`}
                onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}
                initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ delay: i * 0.3, duration: 0.6 }}
                className="group relative z-10 flex items-center gap-4 text-left md:flex-col md:items-center md:gap-3 md:text-center"
              >
                <span className={`grid size-[23px] shrink-0 place-items-center border bg-ink transition-colors ${active === i ? "border-orange" : "border-moss/70 group-hover:border-moss"}`}>
                  <span className={`size-[7px] transition-colors ${active === i ? "bg-orange" : "bg-transparent"}`} />
                </span>
                <span className={`block text-[0.9rem] transition-colors ${active === i ? "text-text" : "text-muted"}`}>{s.title}</span>
              </motion.button>
            </div>
          ))}
        </div>
        <div id="workflow-panel" role="tabpanel" aria-labelledby={`wf-${active}`} className="mt-8 border-t hairline pt-5 font-serif text-lg text-text/90">
          <T>{steps[active]?.text}</T>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter({ metric }: { metric: { label: string; before: number; after: number; unit: string; note?: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const max = Math.max(metric.before, metric.after);
  const change = Math.round(((metric.after - metric.before) / metric.before) * 100);
  const hours = /hour/i.test(metric.unit);
  const fmt = (v: number) => (hours ? `≈ ${v} hours` : String(v));
  return (
    <div ref={ref} className="border hairline bg-ink/80 p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-6">
        <p className="font-serif text-2xl">{metric.label}</p>
        <p className="t-display text-5xl text-orange">{change > 0 ? "+" : "−"}{Math.abs(change)}%</p>
      </div>
      {([["Before", metric.before, "bg-stone"], ["After", metric.after, "bg-beige"]] as const).map(([l, v, c], i) => (
        <div key={l} className="mt-6">
          <div className="mb-2 flex justify-between text-sm"><span className="text-muted">{l}</span><span className="text-text">{fmt(v)}</span></div>
          <div className="h-[6px] bg-ink-3">
            <motion.div className={`h-full ${c}`} initial={{ width: 0 }} animate={inView ? { width: `${(v / max) * 100}%` } : undefined} transition={{ duration: 1.3, delay: 0.2 + i * 0.3, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      ))}
      {metric.note && <p className="t-meta mt-6"><T>{metric.note}</T></p>}
    </div>
  );
}

/** A quiet section label for the lab pages. */
export function Label({ children }: { children: React.ReactNode }) {
  return <p className="t-eyebrow">{children}</p>;
}

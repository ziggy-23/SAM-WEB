"use client";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { T } from "../Text";
import { pad } from "@/lib/utils";

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
      <div className="t-meta flex items-center justify-between border-b hairline px-4 py-2.5">
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-clay" /><span className="size-2 rounded-full bg-olive-2" /><span className="size-2 rounded-full bg-stone/40" />
          <span className="ml-2">workflow</span>
        </span>
        {illustrative && <span className="text-orange">ILLUSTRATIVE DIAGRAM — not a live system</span>}
      </div>

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
                <span>
                  <span className="block font-mono text-[0.65rem] text-faint">{pad(i + 1)}</span>
                  <span className={`block font-mono text-[0.8rem] transition-colors ${active === i ? "text-text" : "text-muted"}`}>{s.title}</span>
                </span>
              </motion.button>
            </div>
          ))}
        </div>
        <div id="workflow-panel" role="tabpanel" aria-labelledby={`wf-${active}`} className="mt-8 border-t border-dashed border-line-2 pt-5 font-mono text-sm text-muted">
          <span className="text-moss">&gt; step {pad(active + 1)}:</span> <T>{steps[active]?.text}</T>
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
  return (
    <div ref={ref} className="border hairline bg-ink/80 p-5 md:p-7">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-sm text-text">{metric.label}</p>
        <p className="font-mono text-2xl text-orange">{change > 0 ? "+" : ""}{change}%</p>
      </div>
      <p className="t-meta">{metric.unit}</p>
      {[["Before", metric.before, "bg-stone"], ["After", metric.after, "bg-moss"]].map(([l, v, c], i) => (
        <div key={l as string} className="mt-5">
          <div className="t-meta mb-1.5 flex justify-between"><span>{l}</span><span className="text-text">{v}</span></div>
          <div className="h-2 bg-ink-3">
            <motion.div className={`h-full ${c}`} initial={{ width: 0 }} animate={inView ? { width: `${((v as number) / max) * 100}%` } : undefined} transition={{ duration: 1.3, delay: 0.2 + i * 0.3, ease: [0.16, 1, 0.3, 1] }} />
          </div>
        </div>
      ))}
      {metric.note && <p className="t-meta mt-5 text-faint"><T>{metric.note}</T></p>}
    </div>
  );
}

/** Blinking-cursor terminal line used as a section header in the lab. */
export function Prompt({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-moss md:text-sm">
      <span className="text-faint">sam@lab</span>:<span className="text-beige">~</span>$ {children}
      <span className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-moss/80 motion-reduce:animate-none" aria-hidden />
    </p>
  );
}

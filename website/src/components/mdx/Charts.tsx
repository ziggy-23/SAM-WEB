"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

function Frame({ title, unit, illustrative, source, children }: { title?: string; unit?: string; illustrative?: boolean; source?: string; children: React.ReactNode }) {
  return (
    <figure className="border-t border-line-2 pt-3">
      {(title || illustrative) && (
        <figcaption className="mb-4 flex items-start justify-between gap-3">
          <span>
            {title && <span className="block font-sans text-sm font-medium text-text">{title}</span>}
            {unit && <span className="t-meta block">{unit}</span>}
          </span>
          {illustrative && <span className="placeholder-chip shrink-0 !text-[0.6rem]" title="These values are invented for demonstration">ILLUSTRATIVE</span>}
        </figcaption>
      )}
      {children}
      <p className="t-meta mt-3 text-faint">{source ? `Source: ${source}` : illustrative ? "Illustrative values — not real data." : "Source: [ADD SOURCE]"}</p>
    </figure>
  );
}

type Bar = { label: string; value: number; highlight?: boolean };

/** Horizontal bar chart — the house style for comparisons. */
export function BarChart({ data, title, unit, source, illustrative, max }: { data: Bar[]; title?: string; unit?: string; source?: string; illustrative?: boolean; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const top = max ?? Math.max(...data.map((d) => d.value));
  return (
    <Frame title={title} unit={unit} source={source} illustrative={illustrative}>
      <div ref={ref} className="space-y-3" role="list">
        {data.map((d, i) => (
          <div key={d.label} role="listitem" aria-label={`${d.label}: ${d.value}`}>
            <div className="mb-1 flex justify-between text-[0.8rem]">
              <span className="text-muted">{d.label}</span>
              <span className={`font-mono ${d.highlight ? "text-orange" : "text-text"}`}>{d.value}</span>
            </div>
            <div className="h-[6px] bg-ink-3">
              <motion.div
                className={`h-full ${d.highlight ? "bg-orange" : "bg-stone"}`}
                initial={{ width: 0 }}
                animate={inView ? { width: `${(d.value / top) * 100}%` } : undefined}
                transition={{ duration: 1.2, ease: EASE, delay: 0.2 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Small line chart that draws itself; the last value is circled. */
export function LineChart({ data, labels = [], title, unit, source, illustrative }: { data: number[]; labels?: string[]; title?: string; unit?: string; source?: string; illustrative?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const w = 300, h = 150, pad = 14;
  const min = Math.min(...data), max = Math.max(...data);
  const x = (i: number) => pad + (i / (data.length - 1)) * (w - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / (max - min || 1)) * (h - pad * 2 - 14);
  const d = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join("");
  const last = data.length - 1;
  return (
    <Frame title={title} unit={unit} source={source} illustrative={illustrative}>
      <svg ref={ref} viewBox={`0 0 ${w} ${h}`} className="w-full overflow-visible" role="img" aria-label={`${title ?? "Line chart"}: values ${data.join(", ")}`}>
        {[0, 0.5, 1].map((f) => (
          <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2 - 14)} y2={pad + f * (h - pad * 2 - 14)} stroke="rgba(233,230,222,0.07)" />
        ))}
        <text x={pad} y={pad - 4} className="fill-faint font-mono" fontSize={9}>{max}</text>
        <text x={pad} y={h - 26} className="fill-faint font-mono" fontSize={9}>{min}</text>
        <motion.path d={d} fill="none" stroke="#d8d0bd" strokeWidth={1.5} strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 1.6, ease: "easeInOut" }} />
        <motion.ellipse cx={x(last)} cy={y(data[last])} rx={11} ry={9} fill="none" stroke="#c58b60" strokeWidth={1.4}
          initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 0.7, delay: 1.6 }} />
        <circle cx={x(last)} cy={y(data[last])} r={2.5} fill="#c58b60" />
        {labels.map((l, i) => l && <text key={i} x={x(i)} y={h - 4} textAnchor={i === 0 ? "start" : i === last ? "end" : "middle"} className="fill-faint font-mono" fontSize={9}>{l}</text>)}
      </svg>
    </Frame>
  );
}

/** A vertical flowchart; boxes and arrows appear in sequence. */
export function Flow({ steps, title }: { steps: string[]; title?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <figure>
      {title && <figcaption className="mb-3 font-sans text-sm font-medium">{title}</figcaption>}
      <ol ref={ref} className="flex flex-col items-start">
        {steps.map((s, i) => (
          <motion.li key={s} className="flex flex-col items-start"
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : undefined} transition={{ delay: i * 0.35, duration: 0.6, ease: EASE }}>
            <span className={`border px-3 py-2 font-sans text-[0.85rem] ${i === steps.length - 1 ? "border-orange text-text" : "border-line-2 text-muted"}`}>
              <span className="mr-2 font-mono text-[0.65rem] text-faint">{String(i + 1).padStart(2, "0")}</span>{s}
            </span>
            {i < steps.length - 1 && (
              <svg width="24" height="28" viewBox="0 0 24 28" className="ml-4" aria-hidden>
                <motion.path d="M12 2 C 10 10, 14 16, 12 24 M7 19 L12 25 L17 19" fill="none" stroke="#c58b60" strokeWidth={1.4} strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ delay: i * 0.35 + 0.25, duration: 0.5 }} />
              </svg>
            )}
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}

/** A highlighted figure with a hand-drawn ring. */
export function Stat({ value, label, source }: { value: string; label: string; source?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <div ref={ref}>
      <div className="relative inline-block px-4 py-2">
        <span className="t-display text-[3.4rem] leading-none">{value}</span>
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="pointer-events-none absolute -inset-2 [&_path]:[stroke-width:1.5px] h-[calc(100%+1rem)] w-[calc(100%+1rem)] overflow-visible" aria-hidden>
          <motion.path d="M48 3 C 80 1, 99 14, 97 32 C 95 52, 50 60, 18 52 C -2 46, 0 14, 26 6 C 36 3, 52 2, 62 4" fill="none" stroke="#c58b60" strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ duration: 1.2, delay: 0.3 }} />
        </svg>
      </div>
      <p className="mt-4 max-w-[26ch] text-sm text-muted">{label}</p>
      {source && <p className="t-meta mt-2 text-faint">Source: {source}</p>}
    </div>
  );
}

/** A compact vertical timeline. */
export function Timeline({ items }: { items: { label: string; text: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <ol ref={ref} className="relative border-l border-line-2 pl-5">
      <motion.span className="absolute -left-px top-0 w-px bg-orange" initial={{ height: 0 }} animate={inView ? { height: "100%" } : undefined} transition={{ duration: 1.8, ease: "easeInOut" }} aria-hidden />
      {items.map((it, i) => (
        <motion.li key={i} className="relative pb-5 last:pb-0" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : undefined} transition={{ delay: 0.2 + i * 0.4 }}>
          <span className="absolute -left-[1.6rem] top-[0.4rem] size-[7px] border border-orange bg-ink" aria-hidden />
          <p className="t-meta text-orange">{it.label}</p>
          <p className="mt-1 text-sm text-muted">{it.text}</p>
        </motion.li>
      ))}
    </ol>
  );
}

"use client";
import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DRAW = { duration: 1.1, ease: [0.65, 0, 0.35, 1] as const };

/** Handwritten note in the analyst's marker. */
export function Scribble({ children, rotate = -2, inline = false }: { children: React.ReactNode; rotate?: number; inline?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <motion.span
      ref={ref}
      className={`t-hand block text-[1.55rem] ${inline ? "my-6 ml-4 max-w-sm" : "max-w-[18rem]"}`}
      style={{ rotate }}
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.6 }}
      animate={inView ? { clipPath: "inset(0 0% 0 0)", opacity: 1 } : undefined}
      transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
    >
      {children}
    </motion.span>
  );
}

/** Builds a slightly irregular, hand-drawn path around a box of w × h pixels. */
function handPath(kind: "underline" | "circle" | "box", w: number, h: number) {
  if (kind === "underline") {
    const y = h + 3;
    return `M-2 ${y} C ${w * 0.25} ${y - 3}, ${w * 0.5} ${y + 3}, ${w * 0.75} ${y - 1} S ${w + 2} ${y - 2}, ${w + 4} ${y}`;
  }
  if (kind === "box") {
    return `M-5 -3 L ${w + 6} -5 L ${w + 4} ${h + 5} L -4 ${h + 3} Z`;
  }
  const cx = w / 2, cy = h / 2, rx = w / 2 + 10, ry = h / 2 + 6;
  return `M${cx - rx * 0.1} ${cy - ry} C ${cx + rx * 0.7} ${cy - ry * 1.08}, ${cx + rx * 1.02} ${cy - ry * 0.4}, ${cx + rx} ${cy + ry * 0.1}
    C ${cx + rx * 0.96} ${cy + ry * 0.9}, ${cx - rx * 0.3} ${cy + ry * 1.1}, ${cx - rx * 0.85} ${cy + ry * 0.6}
    C ${cx - rx * 1.1} ${cy + ry * 0.1}, ${cx - rx * 0.8} ${cy - ry * 0.95}, ${cx + rx * 0.25} ${cy - ry * 1.02}`;
}

/** Marks words in the text with a drawn underline, circle or box. */
export function Mark({ children, kind = "underline" }: { children: React.ReactNode; kind?: "underline" | "circle" | "box" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25% 0px -25% 0px" });
  const [size, setSize] = useState<[number, number] | null>(null);
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => setSize([el.offsetWidth, el.offsetHeight]));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      {size && (
        <svg aria-hidden width={size[0]} height={size[1]} className="pointer-events-none absolute left-0 top-0 overflow-visible">
          <motion.path
            d={handPath(kind, size[0], size[1])}
            fill="none" stroke="#c58b60" strokeWidth={kind === "underline" ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={DRAW}
          />
        </svg>
      )}
    </span>
  );
}

/** A hand-drawn arrow. direction: "down" | "left" | "right" | "curve". */
export function Arrow({ direction = "curve", label, className = "" }: { direction?: "down" | "left" | "right" | "curve"; label?: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const paths: Record<string, [string, string]> = {
    curve: ["M10 10 C 40 0, 90 20, 80 70", "M70 60 L 80 72 L 90 58"],
    down: ["M50 5 C 45 30, 55 55, 50 85", "M40 74 L 50 88 L 60 74"],
    left: ["M95 50 C 70 40, 40 60, 8 50", "M20 40 L 6 50 L 20 60"],
    right: ["M5 50 C 30 40, 60 60, 92 50", "M80 40 L 94 50 L 80 60"],
  };
  const [shaft, head] = paths[direction];
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg ref={ref} viewBox="0 0 100 100" className="size-16 overflow-visible" aria-hidden>
        <motion.path d={shaft} fill="none" stroke="#c58b60" strokeWidth={2} strokeLinecap="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={DRAW} />
        <motion.path d={head} fill="none" stroke="#c58b60" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : undefined} transition={{ ...DRAW, delay: 0.9, duration: 0.4 }} />
      </svg>
      {label && <span className="t-hand text-xl">{label}</span>}
    </span>
  );
}

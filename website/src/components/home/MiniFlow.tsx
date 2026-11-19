"use client";
import { motion } from "motion/react";

/** A small animated node diagram for the lab preview. Purely illustrative. */
export function MiniFlow({ steps }: { steps: string[] }) {
  const w = 640, h = 140, gap = w / steps.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label={`Illustrative workflow: ${steps.join(" → ")}`}>
      {steps.slice(0, -1).map((_, i) => (
        <motion.line
          key={i}
          x1={gap * i + gap / 2 + 9} x2={gap * (i + 1) + gap / 2 - 9} y1={60} y2={60}
          stroke="#8f9a78" strokeWidth={1} strokeDasharray="3 4"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.35, duration: 0.6 }}
        />
      ))}
      {steps.map((s, i) => (
        <motion.g key={s} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + i * 0.35, duration: 0.6 }}>
          <rect x={gap * i + gap / 2 - 8} y={52} width={16} height={16} fill="#111210" stroke={i === 2 ? "#c58b60" : "#8f9a78"} />
          {i === 2 && <rect x={gap * i + gap / 2 - 3} y={57} width={6} height={6} fill="#c58b60" />}
          <text x={gap * i + gap / 2} y={98} textAnchor="middle" className="fill-muted font-sans" fontSize={12}>{s}</text>
        </motion.g>
      ))}
      {/* a pulse travelling along the line once */}
      <motion.circle r={3} cy={60} fill="#c58b60" initial={{ cx: gap / 2, opacity: 0 }} whileInView={{ cx: [gap / 2, w - gap / 2], opacity: [0, 1, 1, 0] }} viewport={{ once: true }} transition={{ delay: 2.2, duration: 2.4, ease: "easeInOut" }} />
    </svg>
  );
}

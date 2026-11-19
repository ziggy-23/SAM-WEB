"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { T } from "../Text";

/** Interests as one sentence, each term opening a short personal note. */
export function Interests({ items }: { items: { label: string; note?: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const current = open !== null ? items[open] : null;
  return (
    <div>
      <p className="t-headline text-[clamp(1.9rem,4vw,3.6rem)] leading-[1.15]">
        <span className="text-muted">Beyond the CV — </span>
        {items.map((it, i) => (
          <span key={it.label}>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls="interest-note"
              onClick={() => setOpen(open === i ? null : i)}
              onMouseEnter={() => setOpen(i)}
              className={`relative italic transition-colors ${open === i ? "text-orange" : "text-text hover:text-beige"}`}
            >
              {it.label.toLowerCase()}
              <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-orange transition-transform duration-500 ${open === i ? "scale-x-100" : "scale-x-0"}`} aria-hidden />
            </button>
            <span className="text-muted">{i < items.length - 2 ? ", " : i === items.length - 2 ? " and " : "."}</span>
          </span>
        ))}
      </p>
      <div id="interest-note" className="mt-8 min-h-[4.5rem]" aria-live="polite">
        <AnimatePresence mode="wait">
          {current && (
            <motion.p key={current.label} initial={{ opacity: 0, x: -8, rotate: -1 }} animate={{ opacity: 1, x: 0, rotate: -1.5 }} exit={{ opacity: 0 }}
              className="t-hand max-w-xl text-[1.6rem]">
              {current.label} — <T>{current.note}</T>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

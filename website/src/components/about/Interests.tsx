"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { T } from "../Text";
import { Doodle } from "./Doodles";

type Interest = { label: string; note?: string; icon?: string; href?: string; linkLabel?: string };

const STRINGS = [44, 78, 30, 96, 58, 36, 84, 50, 70, 40];
// Tag colours, and how the highlighted words read on each.
const SWATCH = [
  { bg: "bg-beige", text: "text-ink", hi: "text-clay" },
  { bg: "bg-clay", text: "text-text", hi: "text-beige" },
  { bg: "bg-ink-3 border border-line-2", text: "text-text", hi: "text-orange" },
  { bg: "bg-olive-2", text: "text-text", hi: "text-beige" },
  { bg: "bg-espresso border border-line-2", text: "text-text", hi: "text-orange" },
];
const ROWS = 9;

const wordsOf = (label: string) => label.split(/\s*(?:,|&|\band\b)\s*/i).map((w) => w.trim().toUpperCase()).filter(Boolean);

/** The label repeated across the tag in staggered rows, like bricks. The middle rows highlight one word each. */
function Bricks({ label, hi }: { label: string; hi: string }) {
  const words = wordsOf(label);
  const seq = (n: number, from = 0) => Array.from({ length: n }, (_, i) => words[(from + i) % words.length]).join("  ");
  const k = words.length;
  const top = Math.floor((ROWS - k) / 2);
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-[0.32rem] overflow-hidden py-6 text-[0.6rem] font-medium uppercase leading-none tracking-[0.12em]" aria-hidden>
      {Array.from({ length: ROWS }, (_, r) => {
        const j = r - top;
        if (j >= 0 && j < k) {
          // A highlighted row: the j-th word sits in the centre, the sentence continues on either side.
          return (
            <div key={r} className="grid grid-cols-[1fr_auto_1fr] items-center gap-[0.5em] whitespace-nowrap">
              <span className="flex justify-end overflow-hidden opacity-35"><span>{seq(12, (((j - 12) % k) + k) % k)}</span></span>
              <span className={`text-[0.66rem] font-semibold opacity-100 ${hi}`}>{words[j]}</span>
              <span className="overflow-hidden opacity-35">{seq(12, j + 1)}</span>
            </div>
          );
        }
        return (
          <div key={r} className="whitespace-nowrap opacity-35" style={{ marginLeft: r % 2 ? "-2.2em" : "-0.6em" }}>
            {seq(14, r % k)}
          </div>
        );
      })}
    </div>
  );
}

/** "Beyond the CV": interests hanging like tags on a wire. Select one to read about it. */
export function Interests({ items }: { items: Interest[] }) {
  const [open, setOpen] = useState<number>(0);
  const current = items[open];
  return (
    <div>
      <ul className="flex flex-wrap" aria-label="Interests">
        {items.map((it, i) => {
          const on = open === i;
          const sw = SWATCH[i % SWATCH.length];
          return (
            <li key={it.label} className="relative flex w-1/2 flex-col items-center border-t border-line-2 px-1.5 pb-14 sm:w-auto md:px-4">
              <span className="absolute -top-[3px] size-[5px] rounded-full bg-stone" aria-hidden />
              <div
                className="swing relative flex flex-col items-center"
                style={{ animationDuration: `${3.6 + (i % 4) * 0.7}s`, animationDelay: `-${i * 0.9}s`, ...(on ? { animationPlayState: "paused" } : {}) }}
              >
                <span className="w-px bg-line-2" style={{ height: `min(${STRINGS[i % STRINGS.length]}px, 14vw)` }} aria-hidden />
                <motion.button
                  type="button"
                  aria-pressed={on}
                  aria-controls="interest-note"
                  aria-label={it.label}
                  onClick={() => setOpen(i)}
                  whileHover={{ rotate: i % 2 ? 4 : -4, y: 2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`tag relative h-[7.5rem] w-full max-w-[12rem] transition-[filter] sm:h-[8.5rem] sm:w-[12rem] ${on ? "bg-orange text-ink" : `${sw.bg} ${sw.text} hover:brightness-110`}`}
                >
                  <Bricks label={it.label} hi={on ? "text-ink" : sw.hi} />
                  <span className="absolute left-1/2 top-2 size-2.5 -translate-x-1/2 rounded-full border border-current bg-inherit opacity-70" aria-hidden />
                </motion.button>
                <Doodle name={it.icon} className="pointer-events-none absolute -bottom-9 -right-4 size-11 text-stone/50 sm:-right-6 sm:size-12" />
              </div>
            </li>
          );
        })}
      </ul>

      <div id="interest-note" className="mt-2 min-h-[9rem] border-t hairline pt-8" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={current.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.45 }}
            className="grid-swiss gap-y-4">
            <p className="t-headline col-span-4 text-2xl text-beige md:col-span-3">{current.label}</p>
            <div className="col-span-4 md:col-span-5 lg:col-span-7 lg:col-start-5">
              <p className="max-w-[42ch] font-serif text-[clamp(1.3rem,2.1vw,1.8rem)] leading-snug"><T>{current.note}</T></p>
              {current.href && (
                <Link href={current.href} className="group mt-6 inline-flex items-center gap-3 border-b border-orange pb-1 text-base text-text">
                  {current.linkLabel ?? "Read more"}
                  <span className="transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

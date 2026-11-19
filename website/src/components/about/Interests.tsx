"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { T } from "../Text";
import { pad } from "@/lib/utils";

// Each tag gets its own string length, colour and swing, so the row feels hung by hand.
const STRINGS = [44, 78, 30, 96, 58, 36, 84, 50, 70, 40];
const SWATCH = [
  "bg-beige text-ink",
  "bg-clay text-text",
  "bg-ink-3 text-text border border-line-2",
  "bg-olive-2 text-text",
  "bg-espresso text-text border border-line-2",
];

/** "Beyond the CV": interests hanging like tags on a wire. Select one to read about it. */
export function Interests({ items }: { items: { label: string; note?: string }[] }) {
  const [open, setOpen] = useState<number>(0);
  const current = items[open];
  return (
    <div>
      <ul className="flex flex-wrap" aria-label="Interests">
        {items.map((it, i) => {
          const on = open === i;
          return (
            <li key={it.label} className="relative flex w-1/2 flex-col items-center border-t border-line-2 px-1.5 pb-8 sm:w-auto md:px-3 md:pb-10">
              <span className="absolute -top-[3px] size-[5px] rounded-full bg-stone" aria-hidden />
              <div
                className="swing flex flex-col items-center"
                style={{ animationDuration: `${3.6 + (i % 4) * 0.7}s`, animationDelay: `-${i * 0.9}s`, ...(on ? { animationPlayState: "paused" } : {}) }}
              >
                <span className="w-px bg-line-2" style={{ height: `clamp(18px, ${STRINGS[i % STRINGS.length] / 16}rem, ${STRINGS[i % STRINGS.length]}px)`, maxHeight: "min(100px, 14vw)" }} aria-hidden />
                <motion.button
                  type="button"
                  aria-pressed={on}
                  aria-controls="interest-note"
                  onClick={() => setOpen(i)}
                  whileHover={{ rotate: i % 2 ? 4 : -4, y: 2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`tag relative flex w-full min-w-0 max-w-[11rem] flex-col items-start gap-1.5 px-3 pb-3 pt-6 sm:w-auto sm:min-w-[7.5rem] sm:gap-2 sm:px-4 sm:pb-4 text-left transition-[box-shadow,filter] ${on ? "bg-orange text-ink" : `${SWATCH[i % SWATCH.length]} hover:brightness-110`}`}
                >
                  <span className="absolute left-1/2 top-2 size-2 -translate-x-1/2 rounded-full border border-current opacity-60" aria-hidden />
                  <span className="font-mono text-[0.6rem] opacity-60">{pad(i + 1)}</span>
                  <span className="text-[0.72rem] font-medium uppercase sm:text-[0.82rem] leading-tight tracking-[0.06em]">{it.label}</span>
                </motion.button>
              </div>
            </li>
          );
        })}
      </ul>

      <div id="interest-note" className="mt-6 min-h-[9rem] border-t hairline pt-8" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div key={current.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.45 }}
            className="grid-swiss gap-y-4">
            <p className="col-span-4 text-sm font-medium uppercase tracking-[0.08em] text-orange md:col-span-3">{pad(open + 1)} — {current.label}</p>
            <p className="col-span-4 max-w-[40ch] font-serif text-[clamp(1.35rem,2.2vw,1.9rem)] leading-snug md:col-span-5 lg:col-span-7 lg:col-start-5"><T>{current.note}</T></p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

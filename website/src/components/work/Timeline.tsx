"use client";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { T } from "../Text";

type Entry = {
  slug: string; organisation: string; role: string; location: string; start: string; end: string;
  summary: string; tools: string[]; highlights: { value: string; label: string }[]; verified: boolean;
};

/** Career timeline: a rail that fills as you scroll; each role expands in place. */
export function Timeline({ entries }: { entries: Entry[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [open, setOpen] = useState<string | null>(entries[0]?.slug ?? null);

  return (
    <ol ref={ref} className="relative">
      <span className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[calc(25%-1px)]" aria-hidden />
      <motion.span style={{ scaleY: fill }} className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-orange md:left-[calc(25%-1px)]" aria-hidden />
      {entries.map((e, i) => {
        const isOpen = open === e.slug;
        return (
          <li key={e.slug} className="relative grid grid-cols-[1.5rem_1fr] md:grid-cols-[25%_1fr]">
            <div className="hidden pr-8 pt-9 text-right md:block">
              <p className="t-meta"><T>{e.start}</T></p>
              <p className="t-meta text-faint">— <T>{e.end}</T></p>
            </div>
            <span className={`absolute left-0 top-10 z-10 size-[15px] border bg-ink transition-colors md:left-[calc(25%-8px)] ${isOpen ? "border-orange" : "border-line-2"}`} aria-hidden>
              <span className={`absolute inset-[4px] transition-colors ${isOpen ? "bg-orange" : ""}`} />
            </span>
            <div className="col-start-2 border-b hairline pb-8 pl-6 pt-7 md:pl-12">
              <button
                type="button" aria-expanded={isOpen} aria-controls={`exp-${e.slug}`}
                onClick={() => setOpen(isOpen ? null : e.slug)}
                className="group flex w-full items-start justify-between gap-6 text-left"
              >
                <span>
                  <span className="t-headline block text-[clamp(2rem,4.2vw,4rem)] transition-colors group-hover:text-beige">{e.organisation}</span>
                  <span className="mt-2 block text-lg text-text/90"><T>{e.role}</T></span>
                  <span className="t-meta mt-2 block"><T>{e.location}</T><span className="md:hidden"> · <T>{e.start}</T> – <T>{e.end}</T></span></span>
                </span>
                <span className={`mt-4 grid size-9 shrink-0 place-items-center border hairline text-lg transition-transform duration-500 ${isOpen ? "rotate-45 border-orange text-orange" : "text-muted"}`} aria-hidden>+</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`exp-${e.slug}`}
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-8 pt-8 md:grid-cols-2">
                      <div>
                        <p className="font-serif text-xl leading-snug"><T>{e.summary}</T></p>
                        {!e.verified && <p className="t-meta mt-4 text-orange">Details awaiting verification.</p>}
                      </div>
                      <div className="space-y-6">
                        {e.highlights.map((h) => (
                          <div key={h.label} className="border-l border-orange pl-4">
                            <p className="t-display text-5xl">{h.value}</p>
                            <p className="mt-2 text-sm text-muted"><T>{h.label}</T></p>
                          </div>
                        ))}
                        {e.tools.length > 0 && (
                          <ul className="flex flex-wrap gap-1.5">{e.tools.map((t) => <li key={t} className="t-meta border hairline px-2 py-0.5"><T>{t}</T></li>)}</ul>
                        )}
                      </div>
                    </div>
                    <Link href={`/work/${e.slug}`} className="t-meta link-draw mt-8 inline-block text-text">Read the full story →</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

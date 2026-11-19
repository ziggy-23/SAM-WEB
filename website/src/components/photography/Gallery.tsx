"use client";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import type { Collection, Photo } from "@/lib/content";
import { PhotoFrame, aspectToRatio } from "../PhotoFrame";
import { Lightbox } from "./Lightbox";
import { T } from "../Text";
import { pad } from "@/lib/utils";

type Block =
  | { kind: "bleed"; items: number[] }
  | { kind: "single"; items: number[]; side: "left" | "right" }
  | { kind: "pair"; items: number[] }
  | { kind: "tall"; items: number[]; side: "left" | "right" }
  | { kind: "duo"; items: number[] }
  | { kind: "overlap"; items: number[] };

/**
 * Turns an ordered list of photographs into a varied editorial rhythm:
 * panoramas go full-bleed, verticals pair up or sit beside whitespace,
 * horizontals alternate sides. Order in photos.json is respected.
 */
function compose(photos: Photo[]): Block[] {
  const blocks: Block[] = [];
  let side: "left" | "right" = "left";
  for (let i = 0; i < photos.length; i++) {
    const r = aspectToRatio(photos[i].aspect);
    const next = photos[i + 1] ? aspectToRatio(photos[i + 1].aspect) : null;
    if (r >= 1.7) blocks.push({ kind: "bleed", items: [i] });
    else if (r < 1 && next !== null && next < 1.2) { blocks.push({ kind: "pair", items: [i, i + 1] }); i++; }
    else if (r < 1 && next !== null && next >= 1.2 && next < 1.7) { blocks.push({ kind: "duo", items: [i, i + 1] }); i++; }
    else if (r >= 1 && r < 1.7 && next !== null && next >= 1 && next < 1.7 && blocks.length % 2 === 1) { blocks.push({ kind: "overlap", items: [i, i + 1] }); i++; }
    else if (r < 1) { blocks.push({ kind: "tall", items: [i], side }); side = side === "left" ? "right" : "left"; }
    else { blocks.push({ kind: "single", items: [i], side }); side = side === "left" ? "right" : "left"; }
  }
  return blocks;
}

function Caption({ p, n }: { p: Photo; n: number }) {
  const meta = [p.location, p.date].filter(Boolean).join(" · ");
  return (
    <div className="mt-3 flex gap-4">
      <span className="font-mono text-[0.65rem] text-faint">{pad(n)}</span>
      <div>
        {p.title && <p className="text-sm text-text/90"><T>{p.title}</T></p>}
        {p.caption && <p className="mt-1 max-w-[46ch] font-serif text-[0.95rem] italic text-muted"><T>{p.caption}</T></p>}
        {meta && <p className="t-meta mt-1">{meta}</p>}
      </div>
    </div>
  );
}

function Item({ p, n, onOpen, sizes, priority, caption = true }: { p: Photo; n: number; onOpen: () => void; sizes: string; priority?: boolean; caption?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [30, -30]);
  return (
    <motion.figure
      ref={ref} style={{ y }}
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "0px 0px -10% 0px" }} transition={{ duration: 1.2 }}
    >
      <button type="button" onClick={onOpen} className="group block w-full cursor-zoom-in overflow-hidden text-left" aria-label={`Open photograph ${n}${p.title && !p.title.startsWith("[") ? `: ${p.title}` : ""}`}>
        <motion.div initial={reduce ? false : { scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="transition-[filter] duration-700 group-hover:brightness-110">
          <PhotoFrame photo={p} sizes={sizes} priority={priority} />
        </motion.div>
      </button>
      {caption && <figcaption><Caption p={p} n={n} /></figcaption>}
    </motion.figure>
  );
}

export function Gallery({ photos, collections }: { photos: Photo[]; collections: Collection[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const shown = useMemo(() => photos.filter((p) => !filter || p.collection === filter), [photos, filter]);
  const blocks = useMemo(() => compose(shown), [shown]);
  const active = collections.find((c) => c.id === filter);

  return (
    <>
      <nav aria-label="Collections" className="wrap sticky top-[var(--nav-h)] z-30 -mt-px flex gap-1 overflow-x-auto border-y hairline bg-void/95 py-3 no-scrollbar">
        {[{ id: null as string | null, title: "All" }, ...collections].map((c) => {
          const count = c.id ? photos.filter((p) => p.collection === c.id).length : photos.length;
          return (
            <button key={c.id ?? "all"} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}
              className={`t-meta shrink-0 px-3 py-1.5 transition-colors ${filter === c.id ? "bg-text !text-void" : "hover:text-text"}`}>
              {c.title} <span className="opacity-50">{count}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div key={filter ?? "all"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          {active && (
            <header className="wrap grid-swiss pt-20">
              <h2 className="t-display col-span-4 text-[clamp(3.5rem,10vw,10rem)] italic md:col-span-6">{active.title}</h2>
              <div className="col-span-4 self-end md:col-span-2 lg:col-span-3 lg:col-start-10">
                <p className="t-meta">{active.country}</p>
                {active.placeholder && <p className="placeholder-chip mt-2 inline-block !text-[0.6rem]">PLACEHOLDER COLLECTION</p>}
                {active.intro && <p className="mt-3 text-sm text-muted"><T>{active.intro}</T></p>}
              </div>
            </header>
          )}

          <div className="space-y-24 pt-20 md:space-y-40 md:pt-28">
            {blocks.map((b, bi) => {
              const idx = (i: number) => photos.indexOf(shown[i]) + 1;
              const openAt = (i: number) => () => setOpen(i);
              if (b.kind === "bleed") {
                const i = b.items[0];
                return (
                  <div key={bi}>
                    <Item p={shown[i]} n={idx(i)} onOpen={openAt(i)} sizes="100vw" priority={bi === 0} caption={false} />
                    <div className="wrap"><Caption p={shown[i]} n={idx(i)} /></div>
                  </div>
                );
              }
              if (b.kind === "pair") {
                const [a, c] = b.items;
                return (
                  <div key={bi} className="wrap grid-swiss items-end gap-y-16">
                    <div className="col-span-4 md:col-span-4 lg:col-span-4 lg:col-start-2"><Item p={shown[a]} n={idx(a)} onOpen={openAt(a)} sizes="(min-width:1024px) 33vw, 100vw" /></div>
                    <div className="col-span-3 col-start-2 md:col-span-3 md:col-start-6 lg:col-span-3 lg:col-start-8 lg:mb-32"><Item p={shown[c]} n={idx(c)} onOpen={openAt(c)} sizes="(min-width:1024px) 25vw, 75vw" /></div>
                  </div>
                );
              }
              if (b.kind === "duo") {
                const [a, c] = b.items;
                return (
                  <div key={bi} className="wrap grid-swiss gap-y-16">
                    <div className="col-span-3 md:col-span-3 lg:col-span-3 lg:col-start-2"><Item p={shown[a]} n={idx(a)} onOpen={openAt(a)} sizes="(min-width:1024px) 25vw, 75vw" /></div>
                    <div className="col-span-4 md:col-span-5 md:mt-40 lg:col-span-6 lg:col-start-6 lg:mt-56"><Item p={shown[c]} n={idx(c)} onOpen={openAt(c)} sizes="(min-width:1024px) 50vw, 100vw" /></div>
                  </div>
                );
              }
              if (b.kind === "overlap") {
                const [a, c] = b.items;
                return (
                  <div key={bi} className="wrap grid-swiss">
                    <div className="col-span-4 md:col-span-6 lg:col-span-7 lg:col-start-2"><Item p={shown[a]} n={idx(a)} onOpen={openAt(a)} sizes="(min-width:1024px) 58vw, 100vw" /></div>
                    <div className="relative z-10 col-span-3 col-start-2 -mt-10 md:col-span-4 md:col-start-5 md:-mt-48 lg:col-span-4 lg:col-start-8 lg:-mt-64">
                      <div className="bg-void p-2 md:p-3"><Item p={shown[c]} n={idx(c)} onOpen={openAt(c)} sizes="(min-width:1024px) 33vw, 75vw" /></div>
                    </div>
                  </div>
                );
              }
              const i = b.items[0];
              if (b.kind === "tall") {
                return (
                  <div key={bi} className="wrap grid-swiss">
                    <div className={`col-span-4 md:col-span-4 lg:col-span-4 ${b.side === "left" ? "lg:col-start-3" : "md:col-start-5 lg:col-start-8"}`}>
                      <Item p={shown[i]} n={idx(i)} onOpen={openAt(i)} sizes="(min-width:1024px) 33vw, 100vw" />
                    </div>
                  </div>
                );
              }
              return (
                <div key={bi} className="wrap grid-swiss">
                  <div className={`col-span-4 md:col-span-7 lg:col-span-8 ${b.side === "left" ? "" : "md:col-start-2 lg:col-start-5"}`}>
                    <Item p={shown[i]} n={idx(i)} onOpen={openAt(i)} sizes="(min-width:1024px) 66vw, 100vw" />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {open !== null && <Lightbox photos={shown} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
      </AnimatePresence>
    </>
  );
}

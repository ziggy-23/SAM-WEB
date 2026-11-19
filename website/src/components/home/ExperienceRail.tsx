"use client";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { T } from "../Text";
import { pad } from "@/lib/utils";

type Item = { slug: string; organisation: string; role: string; location: string; start: string; end: string; summary: string };

function Card({ e, i }: { e: Item; i: number }) {
  return (
    <Link
      href={`/work/${e.slug}`}
      className="group relative flex h-full w-[78vw] shrink-0 snap-start flex-col justify-between border-l hairline py-2 pl-6 pr-4 md:w-[44vw] lg:w-[30vw]"
    >
      <div>
        <p className="font-mono text-xs text-orange">{pad(i + 1)}</p>
        <h3 className="t-headline mt-10 text-[clamp(2rem,3.2vw,3.25rem)] transition-colors group-hover:text-beige">{e.organisation}</h3>
        <p className="mt-3 text-[0.95rem] text-text/90"><T>{e.role}</T></p>
      </div>
      <div className="mt-12 space-y-3">
        <p className="max-w-[40ch] text-sm text-muted"><T>{e.summary}</T></p>
        <p className="t-meta flex flex-wrap gap-x-3 gap-y-1">
          <span><T>{e.location}</T></span>
        </p>
        <span className="t-meta inline-flex items-center gap-2 text-text">
          Read the full story
          <span className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
        </span>
      </div>
      <span className="absolute -left-px top-0 h-0 w-px bg-orange transition-[height] duration-700 ease-out group-hover:h-full" aria-hidden />
    </Link>
  );
}

/**
 * Selected experience — on large screens the section pins and its cards travel
 * horizontally as you scroll down. On touch screens (and with reduced motion)
 * it becomes a native swipeable rail.
 */
export function ExperienceRail({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setPinned(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduce]);

  if (!pinned) {
    return (
      <div className="no-scrollbar -mx-[var(--margin)] flex snap-x snap-mandatory gap-0 overflow-x-auto px-[var(--margin)] pb-4" role="list" aria-label="Selected experience">
        {items.map((e, i) => <div role="listitem" key={e.slug} className="h-[26rem]"><Card e={e} i={i} /></div>)}
      </div>
    );
  }
  return <PinnedRail items={items} />;
}

function PinnedRail({ items }: { items: Item[] }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const update = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [items.length]);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${distance}px)` }} className="relative -mx-[var(--margin)]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex h-[30rem] px-[var(--margin)]" role="list" aria-label="Selected experience">
          {items.map((e, i) => <div role="listitem" key={e.slug}><Card e={e} i={i} /></div>)}
          <div className="w-[12vw] shrink-0" />
        </motion.div>
        <div className="mx-[var(--margin)] mt-10 h-px bg-line">
          <motion.div style={{ width: bar }} className="h-px bg-orange" />
        </div>
      </div>
    </div>
  );
}

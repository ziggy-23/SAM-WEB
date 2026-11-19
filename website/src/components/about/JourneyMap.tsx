"use client";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "../Text";
import { formatCoord, pad } from "@/lib/utils";

type Stop = { id: string; city: string; country: string; lat: number; lon: number; description: string };
type MapData = {
  width: number; height: number;
  shapes: { name: string; d: string }[];
  graticule: string;
  points: { id: string; x: number; y: number }[];
  legs: [number, number][][];
  seas: { name: string; at: [number, number] }[];
};

const LEG_MS = 1900;
const DWELL_MS = 2600;

function pointOnPolyline(pts: [number, number][], t: number): [number, number] {
  const f = Math.min(pts.length - 1, Math.max(0, t * (pts.length - 1)));
  const i = Math.floor(f), r = f - i;
  const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
  return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const polyline = (pts: [number, number][]) => "M" + pts.map((p) => p.join(",")).join("L");

/**
 * An animated map of the places that shaped the biography.
 * The sequence is a storytelling device — it does not claim a chronology.
 */
export function JourneyMap({ stops, map }: { stops: Stop[]; map: MapData }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { amount: 0.4 });
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [travel, setTravel] = useState<{ leg: number; t: number } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [visited, setVisited] = useState(1);
  const started = useRef(false);
  const activeRef = useRef(0);
  activeRef.current = active;

  // Start the tour the first time the map scrolls into view.
  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      if (reduce) setVisited(stops.length);
      else setPlaying(true);
    }
  }, [inView, reduce, stops.length]);

  // The tour: travel along a leg, dwell at the city, continue.
  useEffect(() => {
    if (!playing) return;
    let raf = 0, timer: ReturnType<typeof setTimeout>;
    const runLeg = (leg: number) => {
      if (leg >= map.legs.length) { setPlaying(false); return; }
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / LEG_MS);
        setTravel({ leg, t: ease(t) });
        if (t < 1) raf = requestAnimationFrame(tick);
        else {
          setTravel(null);
          setActive(leg + 1);
          setVisited((v) => Math.max(v, leg + 2));
          timer = setTimeout(() => runLeg(leg + 1), DWELL_MS);
        }
      };
      raf = requestAnimationFrame(tick);
    };
    const a = activeRef.current;
    timer = setTimeout(() => runLeg(a), a === 0 ? 900 : DWELL_MS / 2);
    return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [playing, map.legs.length]);

  const select = useCallback((i: number) => {
    setPlaying(false);
    setTravel(null);
    setActive(i);
    setVisited(stops.length);
  }, [stops.length]);

  const replay = () => { setActive(0); setVisited(1); setTravel(null); setPlaying(true); };

  const shown = hover ?? active;
  const stop = stops[shown];
  const dot = travel ? pointOnPolyline(map.legs[travel.leg], travel.t) : [map.points[active].x, map.points[active].y];

  return (
    <div ref={wrap} className="relative">
      <div className="relative overflow-hidden border hairline bg-[#0e0f0d]">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto w-full" role="img" aria-labelledby="journey-title journey-desc">
          <title id="journey-title">{`Map of places: ${stops.map((s) => s.city).join(", ")}`}</title>
          <desc id="journey-desc">A point travels between the cities on a map of the Mediterranean and the Middle East. Use the city buttons below the map to explore each place.</desc>
          <defs>
            <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
              <stop offset="60%" stopColor="#0e0f0d" stopOpacity="0" />
              <stop offset="100%" stopColor="#0e0f0d" stopOpacity="0.85" />
            </radialGradient>
          </defs>
          <path d={map.graticule} fill="none" stroke="rgba(233,230,222,0.045)" strokeWidth={0.6} />
          <g>
            {map.shapes.map((s) => (
              <path key={s.name} d={s.d} fill="#1b1c18" stroke="rgba(233,230,222,0.13)" strokeWidth={0.5} strokeLinejoin="round" />
            ))}
          </g>
          {map.seas.map((s) => (
            <text key={s.name} x={s.at[0]} y={s.at[1]} textAnchor="middle" className="fill-stone/50 font-serif italic" fontSize={14} letterSpacing={2}>{s.name}</text>
          ))}
          {/* all legs, faint */}
          {map.legs.map((l, i) => (
            <path key={i} d={polyline(l)} fill="none" stroke="rgba(197,139,96,0.22)" strokeWidth={1} strokeDasharray="2 5" />
          ))}
          {/* travelled legs */}
          {map.legs.map((l, i) => {
            const done = i < visited - 1;
            const current = travel?.leg === i;
            if (!done && !current) return null;
            return (
              <path
                key={`t${i}`} d={polyline(l)} fill="none" stroke="#c58b60" strokeWidth={1.4}
                pathLength={1} strokeDasharray="1 1" strokeDashoffset={current ? 1 - travel!.t : 0}
              />
            );
          })}
          {/* cities */}
          {map.points.map((p, i) => {
            const s = stops[i];
            const on = i === shown;
            const reached = i < visited;
            const left = s.id === "paris" || s.id === "barcelona";
            return (
              <g key={p.id} className="cursor-pointer" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => select(i)} aria-hidden>
                <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                <circle cx={p.x} cy={p.y} r={on ? 11 : 7} fill="none" stroke="#c58b60" strokeOpacity={on ? 0.6 : reached ? 0.3 : 0.12} style={{ transition: "all .5s" }} />
                <circle cx={p.x} cy={p.y} r={3} fill={reached ? "#c58b60" : "#6f6d65"} />
                <text x={p.x + (left ? -16 : 16)} y={p.y + 4} textAnchor={left ? "end" : "start"} fontSize={13} letterSpacing={1.5}
                  className={`font-mono uppercase transition-[fill] duration-500 ${on ? "fill-text" : reached ? "fill-muted" : "fill-faint"}`}>
                  {s.city}
                </text>
              </g>
            );
          })}
          {/* the traveller */}
          <g transform={`translate(${dot[0]},${dot[1]})`} aria-hidden>
            <circle r={9} fill="#c58b60" opacity={0.18} />
            <circle r={4} fill="#e9e6de" />
          </g>
          <rect width={map.width} height={map.height} fill="url(#vignette)" pointerEvents="none" />
        </svg>

        {/* corner metadata, satellite style */}
        <div className="pointer-events-none absolute left-3 top-3 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint md:left-5 md:top-4">
          Conic conformal · Natural Earth 1:50m
        </div>
        <div className="pointer-events-none absolute right-3 top-3 font-mono text-[0.6rem] tracking-[0.1em] text-muted md:right-5 md:top-4">
          {formatCoord(stop.lat, stop.lon)}
        </div>

        {/* Desktop info card */}
        <div className="absolute bottom-5 left-5 hidden w-[22rem] md:block" aria-live="polite">
          <StopCard stop={stop} index={shown} total={stops.length} />
        </div>
      </div>

      {/* Mobile info card */}
      <div className="mt-4 md:hidden" aria-live="polite">
        <StopCard stop={stop} index={shown} total={stops.length} />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2" role="group" aria-label="Choose a city">
        {stops.map((s, i) => (
          <button
            key={s.id} type="button" aria-pressed={i === active}
            onClick={() => select(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)} onBlur={() => setHover(null)}
            className={`t-meta border px-3 py-1.5 transition-colors ${i === active ? "border-orange text-text" : "border-line text-muted hover:border-line-2 hover:text-text"}`}
          >
            <span className="mr-2 text-faint">{pad(i + 1)}</span>{s.city}
          </button>
        ))}
        <button type="button" onClick={playing ? () => setPlaying(false) : replay} className="t-meta ml-auto px-2 py-1.5 text-orange link-draw">
          {playing ? "Pause" : "↻ Replay journey"}
        </button>
      </div>
      <p className="t-meta mt-3 text-faint">The sequence is a storytelling device, not a chronology of exact dates or routes.</p>
    </div>
  );
}

function StopCard({ stop, index, total }: { stop: Stop; index: number; total: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={stop.id}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="border hairline bg-ink/90 p-5"
      >
        <p className="t-meta flex justify-between"><span className="text-orange">{pad(index + 1)} / {pad(total)}</span><span>{stop.country}</span></p>
        <p className="t-headline mt-3 text-4xl">{stop.city}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted"><T>{stop.description}</T></p>
      </motion.div>
    </AnimatePresence>
  );
}

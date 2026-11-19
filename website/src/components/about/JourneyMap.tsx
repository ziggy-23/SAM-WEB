"use client";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { T } from "../Text";


type Stop = { id: string; city: string; country: string; lat: number; lon: number; title?: string; description: string };
type MapData = {
  width: number; height: number;
  shapes: { name: string; d: string }[];
  graticule: string;
  points: { id: string; x: number; y: number }[];
  legs: [number, number][][];
  seas: { name: string; at: [number, number] }[];
};

const LEG_MS = 2600;
const DWELL_MS = 2600;

function pointOnPolyline(pts: [number, number][], t: number): [number, number] {
  const f = Math.min(pts.length - 1, Math.max(0, t * (pts.length - 1)));
  const i = Math.floor(f), r = f - i;
  const a = pts[i], b = pts[Math.min(i + 1, pts.length - 1)];
  return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
}
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const polyline = (pts: [number, number][]) => "M" + pts.map((p) => p.join(",")).join("L");
/** The first fraction `t` of a polyline — used to draw a leg progressively. */
function partial(pts: [number, number][], t: number): [number, number][] {
  if (t >= 1) return pts;
  const f = t * (pts.length - 1);
  const i = Math.floor(f);
  return [...pts.slice(0, i + 1), pointOnPolyline(pts, t)];
}
// Irregular, hand-inked dashes — like a route on an old sea chart.
const DOTS = { stroke: "#c9a27a", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeDasharray: "7 6 3 7 10 5 2 8 6 6 4 9", fill: "none" };

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
  const [arrivals, setArrivals] = useState(0);
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
          setArrivals((n) => n + 1);
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
    setArrivals((n) => n + 1);
  }, [stops.length]);

  const replay = () => { setActive(0); setVisited(1); setTravel(null); setPlaying(true); };

  const shown = hover ?? active;
  const stop = stops[shown];
  const dot = travel ? pointOnPolyline(map.legs[travel.leg], travel.t) : [map.points[active].x, map.points[active].y];

  return (
    <div ref={wrap} className="relative">
      <div className="relative overflow-hidden border hairline bg-[#100f0c]">
        <svg viewBox={`0 0 ${map.width} ${map.height}`} className="block h-auto w-full" role="img" aria-labelledby="journey-title journey-desc">
          <title id="journey-title">{`Map of places: ${stops.map((s) => s.city).join(", ")}`}</title>
          <desc id="journey-desc">A point travels between the cities on a map of the Mediterranean and the Middle East. Use the city buttons below the map to explore each place.</desc>
          <defs>
            <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
              <stop offset="55%" stopColor="#100f0c" stopOpacity="0" />
              <stop offset="100%" stopColor="#100f0c" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <path d={map.graticule} fill="none" stroke="rgba(216,200,170,0.05)" strokeWidth={0.6} strokeDasharray="2 4" />
          <g>
            {map.shapes.map((s) => (
              <path key={s.name} d={s.d} fill="#201d17" stroke="rgba(216,200,170,0.16)" strokeWidth={0.6} strokeLinejoin="round" />
            ))}
          </g>
          {map.seas.map((s) => (
            <text key={s.name} x={s.at[0]} y={s.at[1]} textAnchor="middle" className="fill-[#8f8572]/60 font-serif italic" fontSize={16} letterSpacing={3}>{s.name}</text>
          ))}
          {/* The leg just completed fades away while the next one is drawn. */}
          {travel && travel.leg > 0 && (
            <motion.path key={`prev-${travel.leg}`} d={polyline(map.legs[travel.leg - 1])} {...DOTS}
              initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.4, ease: "easeOut" }} />
          )}
          {/* The current leg, drawn dot by dot behind the traveller. */}
          {travel ? (
            <path d={polyline(partial(map.legs[travel.leg], travel.t))} {...DOTS} />
          ) : active > 0 ? (
            <path d={polyline(map.legs[active - 1])} {...DOTS} />
          ) : null}
          {/* cities */}
          {map.points.map((p, i) => {
            const s = stops[i];
            const on = i === shown;
            const reached = i < visited;
            const left = s.id === "paris" || s.id === "barcelona";
            return (
              <g key={p.id} className="cursor-pointer" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => select(i)} aria-hidden>
                <circle cx={p.x} cy={p.y} r={22} fill="transparent" />
                <circle cx={p.x} cy={p.y} r={on ? 11 : 7} fill="none" stroke="#c9a27a" strokeOpacity={on ? 0.5 : reached ? 0.25 : 0.1} style={{ transition: "all .5s" }} />
                <circle cx={p.x} cy={p.y} r={3} fill={reached ? "#c9a27a" : "#6f6d65"} />
                <text x={p.x + (left ? -14 : 14)} y={p.y + 6} textAnchor={left ? "end" : "start"} fontSize={21}
                  className={`font-serif italic transition-[fill] duration-500 ${on ? "fill-text" : reached ? "fill-beige/70" : "fill-stone/70"}`}>
                  {s.city}
                </text>
              </g>
            );
          })}
          {/* Landing: an inked X, and a soft ripple through the ink. */}
          {!travel && arrivals > 0 && (
            <g key={`land-${arrivals}`}>
              {[0, 0.3].map((d) => (
                <motion.circle key={d} cx={map.points[active].x} cy={map.points[active].y} fill="none" stroke="#c9a27a"
                  initial={{ r: 5, opacity: 0.7, strokeWidth: 1.4 }} animate={{ r: 40, opacity: 0, strokeWidth: 0.4 }}
                  transition={{ duration: 2.2, delay: d, ease: [0.16, 1, 0.3, 1] }} />
              ))}
              {[[-9, -8, 8, 9], [8, -9, -8, 8]].map(([x1, y1, x2, y2], k) => (
                <motion.path key={k} d={`M${map.points[active].x + x1},${map.points[active].y + y1} q ${(x2 - x1) / 2 + 2},${(y2 - y1) / 2 - 1} ${x2 - x1},${y2 - y1}`}
                  fill="none" stroke="#c9a27a" strokeWidth={2} strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15 + k * 0.3 }} />
              ))}
            </g>
          )}
          {/* the traveller */}
          <g transform={`translate(${dot[0]},${dot[1]})`} aria-hidden>
            <motion.g key={`boom-${arrivals}`} initial={{ scale: travel ? 1 : 1.9 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }}>
              <circle r={9} fill="#c58b60" opacity={0.18} />
              <circle r={3.5} fill="#e9dcc4" />
            </motion.g>
          </g>
          {/* A faint compass rose, as on old charts. */}
          <g transform={`translate(${map.width - 92},${map.height - 96})`} stroke="#c9a27a" strokeOpacity={0.28} fill="none" strokeWidth={1} aria-hidden>
            <circle r={34} strokeDasharray="2 3" />
            <circle r={24} />
            <path d="M0,-46 L5,-5 L0,0 L-5,-5 Z M0,46 L5,5 L0,0 L-5,5 Z M-46,0 L-5,-5 L0,0 L-5,5 Z M46,0 L5,-5 L0,0 L5,5 Z" fill="#c9a27a" fillOpacity={0.08} />
            <text y={-52} textAnchor="middle" fontSize={13} className="fill-[#c9a27a]/40 font-serif italic" stroke="none">N</text>
          </g>
          <rect width={map.width} height={map.height} fill="url(#vignette)" pointerEvents="none" />
        </svg>

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
            className={`border px-3 py-1.5 font-serif text-[0.95rem] italic transition-colors ${i === active ? "border-orange text-text" : "border-line text-muted hover:border-line-2 hover:text-text"}`}
          >
            {s.city}
          </button>
        ))}
        <button type="button" onClick={playing ? () => setPlaying(false) : replay} className="ml-auto px-2 py-1.5 text-sm text-orange link-draw">
          {playing ? "Pause" : "Replay the journey"}
        </button>
      </div>
      
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
        <p className="t-eyebrow">{stop.country}</p>
        <p className="t-headline mt-3 text-4xl">{stop.city}</p>
        {stop.title && <p className="mt-1 font-serif text-lg italic text-beige">{stop.title}</p>}
        <p className="mt-3 text-sm leading-relaxed text-muted"><T>{stop.description}</T></p>
      </motion.div>
    </AnimatePresence>
  );
}

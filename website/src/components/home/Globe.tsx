"use client";
import { useEffect, useRef } from "react";
import { geoDistance, geoGraticule10, geoInterpolate, geoOrthographic, geoPath } from "d3-geo";

type Stop = { id: string; city: string; lat: number; lon: number };

const CENTER: [number, number] = [22, 33]; // Eastern Mediterranean
const START: [number, number] = [95, 18];
const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Dotted globe for the homepage hero.
 * It rotates once into place, draws the journey between cities, then stays still —
 * responding only, and very slightly, to the pointer. Nothing loops in the background.
 */
export function Globe({ stops }: { stops: Stop[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: [number, number][] = [];
    let size = 0;
    let raf = 0;
    let disposed = false;
    const t0 = performance.now();
    const ROT_MS = reduce ? 0 : 2600;
    const ARC_MS = reduce ? 0 : 2400;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let visible = true;

    const projection = geoOrthographic().clipAngle(90).precision(0.5);
    const graticule = geoGraticule10();
    const legs = stops.slice(1).map((s, i) => geoInterpolate([stops[i].lon, stops[i].lat], [s.lon, s.lat]));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = r.width;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.translate([r.width / 2, r.height / 2]).scale(r.width / 2 - 2);
      draw(performance.now());
    };

    function draw(now: number) {
      const tRot = ROT_MS ? Math.min(1, (now - t0) / ROT_MS) : 1;
      const e = easeOut(tRot);
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      const lon = START[0] + (CENTER[0] - START[0]) * e + pointer.x * 6;
      const lat = START[1] + (CENTER[1] - START[1]) * e - pointer.y * 4;
      projection.rotate([-lon, -lat, 0]);
      const centre: [number, number] = [lon, lat];
      const w = size, h = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, w, h);

      const path = geoPath(projection, ctx);
      // Sphere
      ctx.beginPath(); path({ type: "Sphere" });
      ctx.fillStyle = "rgba(25,26,22,0.55)"; ctx.fill();
      ctx.strokeStyle = "rgba(233,230,222,0.16)"; ctx.lineWidth = 1; ctx.stroke();
      // Graticule
      ctx.beginPath(); path(graticule);
      ctx.strokeStyle = "rgba(233,230,222,0.05)"; ctx.lineWidth = 0.6; ctx.stroke();

      // Land dots, fading towards the horizon
      const r = Math.max(1, size / 420);
      for (const d of dots) {
        const dist = geoDistance(d, centre);
        if (dist > 1.53) continue;
        const p = projection(d);
        if (!p) continue;
        const a = 0.14 + 0.72 * Math.cos(dist);
        ctx.fillStyle = `rgba(216,208,189,${a.toFixed(3)})`;
        ctx.fillRect(p[0] - r / 2, p[1] - r / 2, r, r);
      }

      // Journey arcs, drawn progressively after the rotation lands
      const tArc = ARC_MS ? Math.max(0, Math.min(1, (now - t0 - ROT_MS * 0.7) / ARC_MS)) : 1;
      if (tArc > 0) {
        const total = legs.length * tArc;
        ctx.beginPath();
        legs.forEach((leg, i) => {
          const f = Math.max(0, Math.min(1, total - i));
          if (f <= 0) return;
          const pts: [number, number][] = [];
          for (let k = 0; k <= 40 * f; k++) pts.push(leg(k / 40));
          path({ type: "LineString", coordinates: pts });
        });
        ctx.strokeStyle = "rgba(197,139,96,0.9)"; ctx.lineWidth = 1.1; ctx.stroke();
      }

      // Cities
      ctx.font = `italic 400 ${Math.max(11, size / 48)}px ${getComputedStyle(document.body).getPropertyValue("--font-serif") || "serif"}`;
      stops.forEach((s, i) => {
        if (geoDistance([s.lon, s.lat], centre) > 1.45) return;
        const p = projection([s.lon, s.lat]);
        if (!p) return;
        const appear = ARC_MS ? Math.max(0, Math.min(1, (tArc * legs.length - (i - 1)) * 2)) : 1;
        if (appear <= 0) return;
        ctx.globalAlpha = appear;
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.6, 0, Math.PI * 2);
        ctx.fillStyle = "#c58b60"; ctx.fill();
        ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(197,139,96,0.35)"; ctx.stroke();
        ctx.fillStyle = "rgba(233,230,222,0.8)";
        const left = s.id === "paris" || s.id === "barcelona";
        ctx.textAlign = left ? "right" : "left";
        ctx.fillText(s.city, p[0] + (left ? -10 : 10), p[1] + 4);
        ctx.globalAlpha = 1;
      });

      const settling = Math.abs(pointer.tx - pointer.x) > 0.001 || Math.abs(pointer.ty - pointer.y) > 0.001;
      const animating = now - t0 < ROT_MS + ARC_MS * 1.1 || settling;
      if (animating && visible && !disposed) raf = requestAnimationFrame(draw);
      else raf = 0;
    }

    const kick = () => { if (!raf && !disposed) raf = requestAnimationFrame(draw); };
    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) kick(); });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    fetch("/data/globe-dots.json")
      .then((r) => r.json())
      .then((d) => { dots = d; kick(); })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [stops]);

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full"
      role="img"
      aria-label={`A dotted globe centred on the Eastern Mediterranean, tracing a line between ${stops.map((s) => s.city).join(", ")}.`}
    />
  );
}

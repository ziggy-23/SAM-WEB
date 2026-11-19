/**
 * Server-side cartography. Country outlines come from Natural Earth via the
 * `world-atlas` package; they are projected here at build time so the browser
 * only receives finished SVG paths (no map library is shipped to visitors).
 */
import fs from "node:fs";
import path from "node:path";
import { feature } from "topojson-client";
import { geoConicConformal, geoGraticule, geoPath, type GeoProjection } from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";

type Countries = FeatureCollection<Geometry, { name: string }>;
const cache: Record<string, Countries> = {};

function countries(res: "50m" | "110m" = "50m"): Countries {
  if (!cache[res]) {
    const file = path.join(process.cwd(), "node_modules", "world-atlas", `countries-${res}.json`);
    const topo = JSON.parse(fs.readFileSync(file, "utf8"));
    cache[res] = feature(topo, topo.objects.countries) as unknown as Countries;
  }
  return cache[res];
}

export type MapShape = { name: string; d: string; highlight?: boolean };

function project(projection: GeoProjection, width: number, height: number, res: "50m" | "110m", highlight: string[] = []) {
  const p = geoPath(projection).digits(1);
  const shapes: MapShape[] = [];
  for (const f of countries(res).features) {
    const d = p(f);
    if (d) shapes.push({ name: f.properties.name, d, highlight: highlight.includes(f.properties.name) });
  }
  const graticule = p(geoGraticule().step([5, 5])()) ?? "";
  return { width, height, shapes, graticule, path: p };
}

/** Map of the Mediterranean & Middle East with the journey projected onto it. */
export function journeyMap(stops: { id: string; lat: number; lon: number }[]) {
  const width = 1000, height = 640;
  const projection = geoConicConformal()
    .parallels([25, 45])
    .rotate([-23, 0])
    .center([0, 37])
    .scale(920)
    .translate([width / 2, height / 2])
    .clipExtent([[0, 0], [width, height]]);
  const base = project(projection, width, height, "50m");
  const points = stops.map((s) => {
    const [x, y] = projection([s.lon, s.lat])!;
    return { id: s.id, x: +x.toFixed(1), y: +y.toFixed(1) };
  });
  // Hand-drawn legs: a gentle curve between cities (alternating sides), with a
  // slight wobble so the route looks inked by hand on an old chart.
  const legs = points.slice(1).map((b, i) => {
    const a = points[i];
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
    const nx = -dy / len, ny = dx / len, side = i % 2 ? -1 : 1;
    const cx = (a.x + b.x) / 2 + nx * len * 0.22 * side, cy = (a.y + b.y) / 2 + ny * len * 0.22 * side;
    return Array.from({ length: 81 }, (_, k) => {
      const t = k / 80, u = 1 - t;
      const w = Math.sin(t * Math.PI) * (Math.sin(t * 17 + i * 2.1) * 2.2 + Math.sin(t * 41 + i) * 0.9);
      const x = u * u * a.x + 2 * u * t * cx + t * t * b.x + nx * w;
      const y = u * u * a.y + 2 * u * t * cy + t * t * b.y + ny * w;
      return [+x.toFixed(1), +y.toFixed(1)] as [number, number];
    });
  });
  const label = (lon: number, lat: number) => projection([lon, lat])!.map((v) => +v.toFixed(1)) as [number, number];
  const seas = [
    { name: "Mediterranean Sea", at: label(17.5, 34.6) },
    { name: "Red Sea", at: label(38.6, 20.8) },
    { name: "Atlantic Ocean", at: label(-14, 36.5) },
    { name: "Black Sea", at: label(34.5, 43.4) },
  ];
  return { width, height, shapes: base.shapes, graticule: base.graticule, points, legs, seas };
}

/** Small regional map used inside articles: highlights the named countries. */
export function regionMap(highlight: string[], opts: { center?: [number, number]; scale?: number } = {}) {
  const width = 420, height = 300;
  const projection = geoConicConformal()
    .parallels([25, 45])
    .rotate([-(opts.center?.[0] ?? 33), 0])
    .center([0, opts.center?.[1] ?? 31])
    .scale(opts.scale ?? 720)
    .translate([width / 2, height / 2])
    .clipExtent([[0, 0], [width, height]]);
  const base = project(projection, width, height, "50m", highlight);
  return { width, height, shapes: base.shapes, graticule: base.graticule };
}

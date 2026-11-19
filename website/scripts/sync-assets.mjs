// Copies ../assets into public/media so Next.js can serve them, and
// pre-computes the dotted-globe data used by the homepage hero.
// Runs automatically before `npm run dev` and `npm run build`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, "..");
const assets = path.resolve(site, "..", "assets");
const media = path.join(site, "public", "media");
const data = path.join(site, "public", "data");

function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let n = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue; // skip .gitkeep etc.
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) n += copyDir(a, b);
    else {
      const sa = fs.statSync(a);
      if (!fs.existsSync(b) || fs.statSync(b).mtimeMs < sa.mtimeMs) fs.copyFileSync(a, b);
      n++;
    }
  }
  return n;
}

fs.rmSync(media, { recursive: true, force: true });
const copied = copyDir(assets, media);
console.log(`[sync-assets] ${copied} asset file(s) copied to public/media`);

// Dotted globe: sample land at an even spacing and keep the points on land.
fs.mkdirSync(data, { recursive: true });
const dotsFile = path.join(data, "globe-dots.json");
if (!fs.existsSync(dotsFile)) {
  const topo = JSON.parse(
    fs.readFileSync(path.join(site, "node_modules/world-atlas/land-110m.json"), "utf8"),
  );
  const land = feature(topo, topo.objects.land);
  const dots = [];
  const step = 1.6;
  for (let lat = -58; lat <= 84; lat += step) {
    const lonStep = step / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (geoContains(land, [lon, lat])) dots.push([+lon.toFixed(2), +lat.toFixed(2)]);
    }
  }
  fs.writeFileSync(dotsFile, JSON.stringify(dots));
  console.log(`[sync-assets] generated ${dots.length} globe dots`);
}

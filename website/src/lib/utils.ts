/** Matches "[ADD …]", "[VERIFY …]", "[TO VERIFY]" style placeholders in content. */
export const PLACEHOLDER_RE = /\[(?:ADD|VERIFY|TO VERIFY|PLACEHOLDER)[^\]]*\]/g;

export const isPlaceholder = (s?: string | null) => !s || /^\s*\[(?:ADD|VERIFY|TO VERIFY|PLACEHOLDER)[^\]]*\]\s*$/.test(s);
export const hasPlaceholder = (s?: string | null) => !!s && new RegExp(PLACEHOLDER_RE.source).test(s);

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", opts);
}

export const pad = (n: number, w = 2) => String(n).padStart(w, "0");

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function formatCoord(lat: number, lon: number) {
  const la = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? "N" : "S"}`;
  const lo = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? "E" : "W"}`;
  return `${la} ${lo}`;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

import { ImageResponse } from "next/og";

export const alt = "SAM — Exploring the intersections of politics, economics, technology and the world around us.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** The default social-sharing image, generated at build time. */
export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#111210", color: "#e9e6de", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, fontFamily: "serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#a09e94", fontFamily: "monospace" }}>PERSONAL ARCHIVE — 33.89°N 35.50°E → 41.39°N 2.17°E</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24 }}>
          <div style={{ fontSize: 300, lineHeight: 0.8, letterSpacing: -12 }}>SAM</div>
          <div style={{ width: 40, height: 40, background: "#c58b60", marginBottom: 18 }} />
        </div>
        <div style={{ fontSize: 40, maxWidth: 900, lineHeight: 1.2 }}>Exploring the intersections of politics, economics, technology and the world around us.</div>
      </div>
    ),
    size,
  );
}

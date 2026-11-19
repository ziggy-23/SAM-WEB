import { regionMap } from "@/lib/geo";
import { Reveal } from "../motion/Reveal";

export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-swiss">
      <div className="col-span-4 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] font-light leading-[1.35] text-text md:col-span-8 lg:col-span-8 lg:col-start-2 xl:col-start-3 [&_p]:m-0">
        {children}
      </div>
    </div>
  );
}

export function DemoNotice() {
  return (
    <div className="grid-swiss my-10">
      <aside className="col-span-4 border border-dashed border-orange/50 p-5 md:col-span-8 lg:col-span-8 lg:col-start-2 xl:col-start-3">
        <p className="t-eyebrow !text-orange">Demonstration article</p>
        <p className="mt-2 text-sm text-muted">
          This page was written to demonstrate the article format. It is not an article by Houssam Mehfara. The mechanisms described are generic and every number shown is invented for illustration.
        </p>
      </aside>
    </div>
  );
}

export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-orange bg-ink-2 px-6 py-5 font-sans text-base [&_p]:mb-0">
      {title && <p className="t-eyebrow !mb-2 !text-orange">{title}</p>}
      {children}
    </aside>
  );
}

/** Small map: highlights countries by their Natural Earth name, e.g. "Lebanon". */
export function RegionMap({ highlight = [], caption, center, scale }: { highlight?: string[]; caption?: string; center?: [number, number]; scale?: number }) {
  const m = regionMap(highlight, { center, scale });
  return (
    <Reveal as="div">
      <figure>
        <svg viewBox={`0 0 ${m.width} ${m.height}`} className="w-full border hairline bg-[#0b0c0a]" role="img" aria-label={`Map highlighting ${highlight.join(", ")}`}>
          <path d={m.graticule} fill="none" stroke="rgba(233,230,222,0.05)" />
          {m.shapes.map((s) => (
            <path key={s.name} d={s.d} fill={s.highlight ? "rgba(197,139,96,0.55)" : "#22231e"} stroke={s.highlight ? "#c58b60" : "rgba(233,230,222,0.14)"} strokeWidth={0.6} />
          ))}
        </svg>
        <figcaption className="t-meta mt-2">{caption ?? highlight.join(" · ")}</figcaption>
      </figure>
    </Reveal>
  );
}

export function Figure({ src, alt, caption, source }: { src: string; alt: string; caption?: string; source?: string }) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src.startsWith("/") || src.startsWith("http") ? src : `/media/${src}`} alt={alt} loading="lazy" className="w-full" />
      {(caption || source) && <figcaption className="t-meta mt-3">{caption}{source && <span className="text-faint"> — Source: {source}</span>}</figcaption>}
    </figure>
  );
}

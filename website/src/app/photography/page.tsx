import type { Metadata } from "next";
import { getCollections, getPhotos } from "@/lib/content";
import { Gallery } from "@/components/photography/Gallery";
import { SplitWords, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Photography",
  description: "A photographic archive — cities, travel and things seen along the way.",
  alternates: { canonical: "/photography" },
};

export default function Photography() {
  const photos = getPhotos();
  const placeholders = photos.filter((p) => !p.src).length;
  return (
    <div className="-mb-32 bg-void pb-40">
      <header className="wrap grid-swiss gap-y-8 pb-16 pt-[calc(var(--nav-h)+4rem)] md:pb-24 md:pt-[calc(var(--nav-h)+8rem)]">
        <p className="t-eyebrow col-span-4 md:col-span-8 lg:col-span-12"><span className="text-orange">03</span><span className="mx-2 text-faint">/</span>Photography</p>
        <h1 className="t-display col-span-4 text-[clamp(3.75rem,11vw,12rem)] italic md:col-span-8 lg:col-span-10">
          <SplitWords text="Things seen along the way." stagger={0.07} />
        </h1>
        <Reveal delay={0.5} className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-10">
          <p className="text-sm text-muted">An archive to be explored slowly, by scrolling. Select any frame to view it full-screen; use the arrow keys to move through it.</p>
          {placeholders > 0 && (
            <p className="t-meta mt-4 text-orange">{placeholders} of {photos.length} frames are placeholders awaiting real photographs.</p>
          )}
        </Reveal>
      </header>
      <Gallery photos={photos} collections={getCollections()} />
    </div>
  );
}

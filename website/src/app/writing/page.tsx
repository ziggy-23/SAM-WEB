import type { Metadata } from "next";
import Link from "next/link";
import { getTaxonomy, getWritings } from "@/lib/content";
import { Archive } from "@/components/writing/Archive";
import { SplitWords, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Writing & Research",
  description: "Articles, geopolitical analysis, political economy commentary and academic research — plus a reading list of external pieces worth your time.",
  alternates: { canonical: "/writing" },
};

export default function WritingIndex() {
  const tax = getTaxonomy();
  const items = getWritings().map(({ body, references, related, ...w }) => ({ ...w, subtitle: w.subtitle ?? "" }));
  return (
    <div className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
      <header className="grid-swiss gap-y-8 pb-16 md:pb-24">
        <p className="t-eyebrow col-span-4 md:col-span-8 lg:col-span-12">Writing & Research</p>
        <h1 className="t-display col-span-4 text-[clamp(3.5rem,9vw,9rem)] md:col-span-8 lg:col-span-9">
          <SplitWords text="An independent archive." />
        </h1>
        <Reveal delay={0.3} className="col-span-4 self-end md:col-span-5 lg:col-span-3">
          <p className="text-muted">Original articles, geopolitical analysis and academic work on international relations and political economy — written to be read, not merely filed.</p>
          <Link href="/writing/reading" className="t-meta link-draw mt-5 inline-block text-text">The reading list — pieces by others →</Link>
        </Reveal>
      </header>
      <Archive items={items} categories={tax.categories} types={tax.types} />
    </div>
  );
}

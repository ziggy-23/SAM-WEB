import type { Metadata } from "next";
import Link from "next/link";
import { getReadingList } from "@/lib/content";
import { SplitWords, Reveal } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { isPlaceholder, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reading list",
  description: "External articles, publications and research worth reading — with a short note on why.",
  alternates: { canonical: "/writing/reading" },
};

export default function Reading() {
  const items = getReadingList();
  return (
    <div className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
      <nav className="t-meta" aria-label="Breadcrumb"><Link href="/writing" className="link-draw">Writing & Research</Link><span className="mx-2 text-faint">/</span>Reading list</nav>
      <header className="grid-swiss mt-8 gap-y-8 pb-16">
        <h1 className="t-display col-span-4 text-[clamp(3.5rem,9vw,9rem)] md:col-span-8 lg:col-span-8">
          <SplitWords text="Worth reading." />
        </h1>
        <Reveal delay={0.3} className="col-span-4 self-end text-muted md:col-span-5 lg:col-span-4">
          <p>Pieces by other people that sharpened my thinking. Each links to the original publication — with a note on why it matters.</p>
        </Reveal>
      </header>
      <ol className="border-b hairline">
        {items.map((r, i) => {
          const hasLink = r.url && !isPlaceholder(r.url);
          return (
            <Reveal as="li" key={i} className="grid-swiss gap-y-3 border-t hairline py-8">
              <span className="col-span-1 font-mono text-xs text-faint">{pad(i + 1)}</span>
              <div className="col-span-3 md:col-span-4 lg:col-span-6">
                {r.template && <p className="placeholder-chip mb-3 inline-block !text-[0.6rem]">TEMPLATE ENTRY — replace in content/reading-list/recommendations.json</p>}
                <h2 className="t-headline text-[clamp(1.6rem,2.6vw,2.4rem)]">
                  {hasLink ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="hover:text-beige"><T>{r.title}</T> <span className="text-orange">↗</span></a> : <T>{r.title}</T>}
                </h2>
                <p className="t-meta mt-3"><T>{r.author}</T> · <T>{r.publication}</T> · <T>{r.date}</T></p>
              </div>
              <div className="col-span-4 col-start-1 md:col-span-3 md:col-start-6 lg:col-span-5 lg:col-start-8">
                <p className="t-eyebrow mb-2">Why it&apos;s interesting</p>
                <p className="font-serif text-lg leading-snug text-text/90"><T>{r.why}</T></p>
                <p className="mt-3 flex flex-wrap gap-2">{r.tags.map((t) => <span key={t} className="t-meta"><T>{`#${t}`}</T></span>)}</p>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </div>
  );
}

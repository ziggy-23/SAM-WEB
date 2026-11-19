import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInterestPage, getInterestPages } from "@/lib/content";
import { Mdx } from "@/lib/mdx";
import { Doodle } from "@/components/about/Doodles";
import { Reveal, SplitWords } from "@/components/motion/Reveal";

/*
 * "My takes on…" pages. They are deliberately not in the navigation or the sitemap:
 * the only way in is through the interest tags under "Beyond the CV" on the About page.
 */
export function generateStaticParams() {
  return getInterestPages().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getInterestPage((await params).slug);
  return p ? { title: `My takes on ${p.title.toLowerCase()}`, description: p.lede, robots: { index: false, follow: true } } : {};
}

export default async function InterestTakes({ params }: { params: Promise<{ slug: string }> }) {
  const p = getInterestPage((await params).slug);
  if (!p) notFound();
  const others = getInterestPages().filter((o) => o.slug !== p.slug);
  return (
    <article className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
      <Link href="/about#interests" className="t-meta link-draw">← Beyond the CV</Link>
      <div className="grid-swiss mt-12 items-end gap-y-8">
        <h1 className="t-display col-span-4 text-[clamp(3.25rem,8vw,8rem)] md:col-span-6 lg:col-span-9">
          <span className="mb-3 block text-[0.4em] italic leading-tight tracking-normal text-muted"><SplitWords text="My takes on" /></span>
          <SplitWords text={p.title.toLowerCase()} delay={0.2} />
        </h1>
        <div className="col-span-2 col-start-3 md:col-span-2 md:col-start-7 lg:col-span-3 lg:col-start-10">
          <Doodle name={p.icon} className="w-full max-w-[12rem] text-beige/60" />
        </div>
      </div>
      {p.lede && (
        <Reveal as="p" delay={0.3} className="mt-14 max-w-[34ch] font-serif text-[clamp(1.4rem,2.4vw,2.1rem)] leading-snug text-beige">{p.lede}</Reveal>
      )}
      <div className="grid-swiss mt-16">
        <div className="prose-sam col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-2"><Mdx source={p.body} /></div>
      </div>
      <nav className="mt-28 border-t hairline pt-8" aria-label="Other interests">
        <p className="t-eyebrow mb-5">More takes</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {others.map((o) => (
            <li key={o.slug}><Link href={`/interests/${o.slug}`} className="link-draw font-serif text-xl italic">{o.title}</Link></li>
          ))}
        </ul>
      </nav>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelated, getTaxonomy, getWriting, getWritings } from "@/lib/content";
import { Mdx } from "@/lib/mdx";
import { ReadingProgress } from "@/components/writing/ReadingProgress";
import { SplitWords, Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/JsonLd";
import { T } from "@/components/Text";
import { formatDate, SITE_URL } from "@/lib/utils";

export function generateStaticParams() {
  return getWritings().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const w = getWriting((await params).slug);
  if (!w) return {};
  return {
    title: w.title,
    description: w.summary,
    alternates: { canonical: `/writing/${w.slug}` },
    openGraph: { type: "article", title: w.title, description: w.summary, publishedTime: w.date, tags: w.tags },
    robots: w.demo || w.draft ? { index: false } : undefined,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const w = getWriting((await params).slug);
  if (!w) notFound();
  const types = getTaxonomy().types;
  const related = getRelated(w);
  const storytelling = w.body.includes("<Step");

  return (
    <article>
      <ReadingProgress />
      <JsonLd data={{
        "@context": "https://schema.org", "@type": w.type === "article" ? "Article" : "ScholarlyArticle",
        headline: w.title, description: w.summary, datePublished: w.date, url: `${SITE_URL}/writing/${w.slug}`,
        author: w.demo ? undefined : { "@type": "Person", name: "Houssam Mehfara" }, keywords: w.tags.join(", "),
      }} />

      <header className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
        <div className="grid-swiss gap-y-6">
          <nav className="t-meta col-span-4 md:col-span-8 lg:col-span-12" aria-label="Breadcrumb">
            <Link href="/writing" className="link-draw">Writing & Research</Link>
            <span className="mx-2 text-faint">/</span>
            <Link href={`/writing?category=${encodeURIComponent(w.category)}`} className="link-draw">{w.category}</Link>
          </nav>
          <h1 className="t-display col-span-4 text-[clamp(3.25rem,9vw,9.5rem)] md:col-span-8 lg:col-span-11">
            <SplitWords text={w.title} stagger={0.05} />
          </h1>
          {w.subtitle && (
            <Reveal delay={0.4} as="p" className="col-span-4 max-w-[42ch] font-serif text-[clamp(1.25rem,1.8vw,1.6rem)] text-muted md:col-span-6 lg:col-span-6 lg:col-start-2 xl:col-start-3">
              <T>{w.subtitle}</T>
            </Reveal>
          )}
          <Reveal delay={0.5} className="col-span-4 flex flex-wrap gap-x-6 gap-y-1 border-t hairline pt-4 t-meta md:col-span-8 lg:col-span-12">
            <span className="text-orange">{types[w.type] ?? w.type}</span>
            <time dateTime={w.date}>{formatDate(w.date, { year: "numeric", month: "long", day: "numeric" })}</time>
            <span>{w.readingMinutes} min read</span>
            <span>{w.demo ? "Demonstration — not authored by Houssam Mehfara" : "By Houssam Mehfara"}</span>
            {w.pdf && <a className="link-draw text-text" href={`/media/${w.pdf}`}>PDF ↓</a>}
          </Reveal>
        </div>
      </header>

      {w.cover && (
        <div className="wrap mt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/media/${w.cover}`} alt="" className="w-full" />
        </div>
      )}

      <div className="wrap mt-16 md:mt-24">
        {storytelling ? (
          <Mdx source={w.body} />
        ) : (
          <div className="grid-swiss">
            <div className="prose-sam col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-2 xl:col-start-3"><Mdx source={w.body} /></div>
          </div>
        )}
      </div>

      <footer className="wrap mt-24">
        <div className="grid-swiss gap-y-10 border-t hairline pt-10">
          {w.references.length > 0 && (
            <section className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-2 xl:col-start-3" aria-label="References">
              <h2 className="t-eyebrow mb-4">References</h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-muted marker:font-mono marker:text-faint">
                {w.references.map((r, i) => <li key={i}><T>{r}</T></li>)}
              </ol>
            </section>
          )}
          <section className="col-span-4 md:col-span-8 lg:col-span-3 lg:col-start-10" aria-label="Tags">
            <h2 className="t-eyebrow mb-4">Filed under</h2>
            <ul className="flex flex-wrap gap-1.5">
              {w.tags.map((t) => (
                <li key={t}><Link href={`/writing?q=${encodeURIComponent(t)}`} className="t-meta border hairline px-2 py-1 hover:border-orange hover:text-text">#{t}</Link></li>
              ))}
            </ul>
          </section>
        </div>

        {related.length > 0 && (
          <section className="mt-20" aria-label="Related">
            <h2 className="t-eyebrow mb-6">Continue reading</h2>
            <div className="grid gap-[var(--gutter)] md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/writing/${r.slug}`} className="group border-t hairline pt-5">
                  <p className="t-meta">{types[r.type] ?? r.type} · {formatDate(r.date)}</p>
                  <p className="t-headline mt-2 text-2xl group-hover:text-beige"><T>{r.title}</T></p>
                </Link>
              ))}
            </div>
          </section>
        )}
        <Link href="/writing" className="t-meta link-draw mt-16 inline-block">← Back to the archive</Link>
      </footer>
    </article>
  );
}

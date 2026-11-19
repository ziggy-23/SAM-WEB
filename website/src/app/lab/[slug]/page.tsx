import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperience, getLabProject, getLabProjects } from "@/lib/content";
import { Mdx } from "@/lib/mdx";
import { BeforeAfter, Label, Workflow } from "@/components/lab/Workflow";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";

export function generateStaticParams() {
  return getLabProjects().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getLabProject((await params).slug);
  return p ? { title: `${p.title} — Lab`, description: p.summary, alternates: { canonical: `/lab/${p.slug}` } } : {};
}

export default async function LabProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getLabProject((await params).slug);
  if (!p) notFound();
  const exp = p.relatedExperience ? getExperience(p.relatedExperience) : undefined;
  const meta: [string, React.ReactNode][] = [
    ["Status", <span key="s" className={p.verified ? "text-moss" : "text-orange"}>{p.status ?? (p.verified ? "verified" : "draft")}</span>],
    ["Year", <T key="y">{p.year}</T>],
    ["Context", p.context],
    ["Tools", p.tools.map((t, i) => <span key={i}>{i > 0 && ", "}<T>{t}</T></span>)],
  ];

  return (
    <div className="-mb-32 min-h-screen bg-ink-2 pb-40 dot-grid">
      <header className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+6rem)]">
        <nav className="t-meta" aria-label="Breadcrumb"><Link href="/lab" className="link-draw">← The laboratory</Link></nav>
        <h1 className="t-display mt-10 max-w-[14ch] text-[clamp(3rem,8vw,8rem)]"><SplitWords text={p.title} /></h1>
        <Reveal delay={0.3} as="p" className="mt-8 max-w-[52ch] font-serif text-[clamp(1.2rem,1.7vw,1.5rem)] text-muted"><T>{p.summary}</T></Reveal>

        <Reveal delay={0.4}>
          <dl className="mt-12 grid border hairline bg-ink/80 text-sm md:grid-cols-4">
            {meta.map(([k, v]) => (
              <div key={k} className="border-b hairline px-4 py-3 md:border-b-0 md:border-r md:last:border-r-0">
                <dt className="t-eyebrow">{k}</dt>
                <dd className="mt-1 text-text">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </header>

      <section className="wrap mt-20 grid-swiss gap-y-10" aria-label="Problem and motivation">
        {[["The problem", p.problem], ["Why I built it", p.why]].map(([f, v]) => v && (
          <Reveal key={f} className="col-span-4 md:col-span-4 lg:col-span-5 [&:nth-child(2)]:lg:col-start-7">
            <Label>{f}</Label>
            <p className="mt-4 font-serif text-xl leading-snug"><T>{v}</T></p>
          </Reveal>
        ))}
      </section>

      {p.workflow && (
        <section className="wrap mt-20" aria-label="Workflow">
          <Reveal><Label>How it works</Label></Reveal>
          <Reveal className="mt-5"><Workflow steps={p.workflow.steps} illustrative={p.workflow.illustrative} /></Reveal>
        </section>
      )}

      {p.metrics.length > 0 && (
        <section className="wrap mt-20" aria-label="Results">
          <Reveal><Label>Results</Label></Reveal>
          <div className="mt-5 grid gap-[var(--gutter)] md:grid-cols-2">
            {p.metrics.map((m) => <Reveal key={m.label}><BeforeAfter metric={m} /></Reveal>)}
          </div>
        </section>
      )}

      {p.media.length > 0 && (
        <section className="wrap mt-20 space-y-10" aria-label="Media">
          <Label>Media</Label>
          {p.media.map((m, i) => (
            <figure key={i}>
              {m.type === "video" ? (
                <video src={`/media/${m.src}`} controls playsInline preload="metadata" className="w-full border hairline" />
              ) : m.type === "embed" ? (
                <iframe src={m.src} title={m.caption ?? "Embedded demonstration"} className="aspect-video w-full border hairline" loading="lazy" sandbox="allow-scripts allow-same-origin" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/media/${m.src}`} alt={m.caption ?? ""} loading="lazy" className="w-full border hairline" />
              )}
              <figcaption className="t-meta mt-2">{m.caption}{m.illustrative && <span className="ml-2 text-orange">· illustrative</span>}</figcaption>
            </figure>
          ))}
        </section>
      )}

      <section className="wrap mt-24" aria-label="Write-up">
        <div className="grid-swiss">
          <div className="prose-sam col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-3 [&_h2]:mt-14">
            <Mdx source={p.body} />
          </div>
        </div>
      </section>

      <footer className="wrap mt-24 flex flex-wrap justify-between gap-6 border-t hairline pt-8 t-meta">
        <Link href="/lab" className="link-draw">← All lab projects</Link>
        {exp && <Link href={`/work/${exp.slug}`} className="link-draw text-text">Related experience: {exp.organisation} →</Link>}
      </footer>
    </div>
  );
}

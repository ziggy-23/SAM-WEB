import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperience, getProject, getProjects } from "@/lib/content";
import { Detail } from "@/components/work/Detail";
import { T } from "@/components/Text";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.title} — Project`, description: p.summary.replace(/\[[^\]]*\]/g, "").trim() || undefined, alternates: { canonical: `/work/projects/${p.slug}` } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const exp = p.relatedExperience ? getExperience(p.relatedExperience) : undefined;
  return (
    <Detail
      crumb={{ href: "/work#projects", label: "← Projects & achievements" }}
      eyebrow={<span className="text-orange">{p.kind}</span>}
      title={p.title}
      facts={[["Type", p.kind], ["Year", <T key="y">{p.year}</T>], ["Context", exp ? <Link key="c" href={`/work/${exp.slug}`} className="link-draw">{exp.organisation}</Link> : "Independent"], ["Status", "—"]]}
      body={`<Lede>${p.summary}</Lede>\n\n${p.body}`}
      aside={
        <>
          {p.labProject && <Link href={`/lab/${p.labProject}`} className="block border hairline bg-ink-2 p-5 font-mono text-sm text-moss hover:border-moss">→ Open the lab write-up</Link>}
          {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="link-draw t-meta text-text">External link ↗</a>}
        </>
      }
      footer={<Link href="/work#projects" className="link-draw">← All projects</Link>}
    />
  );
}

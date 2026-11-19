import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExperience, getExperiences, getLabProject, getProject } from "@/lib/content";
import { Detail } from "@/components/work/Detail";
import { T } from "@/components/Text";
import { isPlaceholder } from "@/lib/utils";

export function generateStaticParams() {
  return getExperiences().map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = getExperience((await params).slug);
  return e ? { title: `${e.organisation} — Experience`, description: e.summary.replace(/\[[^\]]*\]/g, "").trim() || undefined, alternates: { canonical: `/work/${e.slug}` } } : {};
}

export default async function ExperiencePage({ params }: { params: Promise<{ slug: string }> }) {
  const e = getExperience((await params).slug);
  if (!e) notFound();
  const all = [...getExperiences()].reverse();
  const i = all.findIndex((x) => x.slug === e.slug);
  const next = all[(i + 1) % all.length];
  const related = e.relatedProjects.map((s) => getProject(s) ?? getLabProject(s)).filter(Boolean);

  return (
    <Detail
      crumb={{ href: "/work", label: "← Projects & Experience" }}
      eyebrow={<><span className="text-orange">Experience</span>{!e.verified && <span className="ml-3 placeholder-chip">AWAITING VERIFICATION</span>}</>}
      title={e.organisation}
      facts={[["Role", <T key="r">{e.role}</T>], ["Location", <T key="l">{e.location}</T>], ["From", <T key="s">{e.start}</T>], ["To", <T key="t">{e.end}</T>]]}
      body={e.body}
      aside={
        <>
          {e.highlights.map((h) => (
            <div key={h.label} className="border-l border-orange pl-5">
              <p className="t-display text-6xl">{h.value}</p>
              <p className="mt-3 text-sm text-muted"><T>{h.label}</T></p>
            </div>
          ))}
          {e.listen && (
            isPlaceholder(e.listen)
              ? <p className="placeholder-chip inline-block">EPISODE LINK COMING SOON</p>
              : <a href={e.listen} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 border border-orange px-5 py-4 transition-colors hover:bg-orange hover:text-ink">
                  <span className="grid size-9 place-items-center rounded-full border border-current" aria-hidden>▶</span>
                  <span><span className="block text-sm">Listen to the episode</span><span className="t-meta group-hover:!text-ink">BBC World Service ↗</span></span>
                </a>
          )}
          {e.partners.length > 0 && (
            <div><p className="t-eyebrow mb-3">Clients & partners</p><ul className="divide-y divide-line border-y hairline">{e.partners.map((t) => <li key={t} className="py-2 font-serif text-[1.05rem]">{t}</li>)}</ul></div>
          )}
          {e.tools.length > 0 && (
            <div><p className="t-eyebrow mb-3">Tools</p><ul className="flex flex-wrap gap-1.5">{e.tools.map((t) => <li key={t} className="t-meta border hairline px-2 py-1"><T>{t}</T></li>)}</ul></div>
          )}
          {e.skills.length > 0 && (
            <div><p className="t-eyebrow mb-3">Skills developed</p><ul className="space-y-1 text-sm text-muted">{e.skills.map((s, k) => <li key={k}><T>{s}</T></li>)}</ul></div>
          )}
          {related.length > 0 && (
            <div><p className="t-eyebrow mb-3">Related projects</p>
              <ul className="space-y-2">{e.relatedProjects.map((s) => {
                const p = getProject(s);
                return p ? <li key={s}><Link className="link-draw font-serif text-lg" href={`/work/projects/${s}`}>{p.title} →</Link></li> : null;
              })}</ul>
            </div>
          )}
        </>
      }
      footer={<><Link href="/work" className="link-draw">← All experience</Link><Link href={`/work/${next.slug}`} className="link-draw text-text">Next: {next.organisation} →</Link></>}
    />
  );
}

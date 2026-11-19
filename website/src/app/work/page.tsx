import type { Metadata } from "next";
import Link from "next/link";
import { getEducation, getExperiences, getProjects } from "@/lib/content";
import { Timeline } from "@/components/work/Timeline";
import { SectionHead } from "@/components/SectionHead";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects & Experience",
  description: "A full professional history — research journalism, diplomacy, regional institutions and consulting — and selected projects.",
  alternates: { canonical: "/work" },
};

export default function Work() {
  // Higher `order` = more recent. Displayed newest first.
  const entries = [...getExperiences()].reverse().map(({ body, ...e }) => e);
  const projects = getProjects();
  const education = getEducation();
  return (
    <div className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
      <header className="grid-swiss gap-y-8 pb-20">
        <p className="t-eyebrow col-span-4 md:col-span-8 lg:col-span-12"><span className="text-orange">05</span><span className="mx-2 text-faint">/</span>Projects & Experience</p>
        <h1 className="t-display col-span-4 text-[clamp(3.5rem,9vw,9rem)] md:col-span-8 lg:col-span-9">
          <SplitWords text="More than two pages." />
        </h1>
        <Reveal delay={0.3} className="col-span-4 self-end md:col-span-5 lg:col-span-3">
          <p className="text-muted">A CV, unabridged. Every role has room to tell its story — select one to expand it, or open the full account.</p>
          <p className="t-meta mt-4">{entries.length} roles · {projects.length} projects · {education.length} institutions</p>
        </Reveal>
      </header>

      <section aria-label="Professional timeline">
        <SectionHead index="A" label="Timeline" />
        <div className="mt-6"><Timeline entries={entries} /></div>
      </section>

      <section id="projects" className="mt-32 scroll-mt-24" aria-label="Projects and achievements">
        <SectionHead index="B" label="Projects & achievements" title="Work that stands on its own." />
        <div className="mt-12 grid gap-x-[var(--gutter)] gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1}>
              <Link href={`/work/projects/${p.slug}`} className="group block border-t hairline pt-5">
                <p className="t-meta flex justify-between"><span className="text-orange">{pad(i + 1)}</span><span>{p.kind}</span></p>
                <h3 className="t-headline mt-8 text-[2.1rem] transition-colors group-hover:text-beige"><T>{p.title}</T></h3>
                <p className="mt-3 text-sm text-muted"><T>{p.summary}</T></p>
                <p className="t-meta mt-6"><T>{p.year}</T></p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-32" aria-label="Education">
        <SectionHead index="C" label="Education" href="/about" cta="More in About" />
        <ul className="mt-6">
          {education.map((e) => (
            <li key={e.institution} className="grid-swiss items-baseline gap-y-1 border-b hairline py-5">
              <span className="t-headline col-span-4 text-2xl md:col-span-3 lg:col-span-4">{e.institution}</span>
              <span className="col-span-4 text-muted md:col-span-3 lg:col-span-5">{e.degree}</span>
              <span className="t-meta col-span-4 md:col-span-2 md:text-right lg:col-span-3"><T>{e.dates}</T></span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getLabProjects } from "@/lib/content";
import { MiniFlow } from "@/components/home/MiniFlow";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";

export const metadata: Metadata = {
  title: "Data & AI Lab",
  description: "Experiments with AI, automation workflows, data analysis and research tools.",
  alternates: { canonical: "/lab" },
};

export default function Lab() {
  const projects = getLabProjects();
  return (
    <div className="-mb-32 min-h-screen bg-ink-2 pb-40 dot-grid">
      <header className="wrap pb-16 pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
        <p className="t-eyebrow">Data, AI & automation</p>
        <div className="grid-swiss mt-10 gap-y-8">
          <h1 className="t-display col-span-4 text-[clamp(3.5rem,9vw,9rem)] md:col-span-8 lg:col-span-8">
            <SplitWords text="The laboratory." />
          </h1>
          <Reveal delay={0.3} className="col-span-4 self-end md:col-span-5 lg:col-span-4">
            <p className="text-muted">Where analysis turns into tools: AI-assisted workflows, automation, data pipelines and small research instruments. Each project explains the problem, the build and what was learned.</p>
          </Reveal>
        </div>
      </header>

      <section className="wrap space-y-24" aria-label="Projects">
        {projects.map((p) => (
          <Reveal key={p.slug} className="grid-swiss items-center gap-y-8 border-t hairline pt-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <p className="t-meta">{p.context}{p.year ? ` · ${p.year}` : ""}</p>
              <h2 className="t-headline mt-4 text-[clamp(2.25rem,4vw,3.75rem)]">{p.title}</h2>
              <p className="mt-4 max-w-[46ch] text-muted"><T>{p.summary}</T></p>
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1">{p.tools.map((t) => <li key={t} className="text-sm text-moss"><T>{t}</T></li>)}</ul>
              <Link href={`/lab/${p.slug}`} className="link-draw mt-8 inline-block text-text">Read the project →</Link>
            </div>
            {p.workflow && (
              <div className="col-span-4 border hairline bg-ink/80 p-5 md:col-span-8 lg:col-span-6 lg:col-start-7">
                <MiniFlow steps={p.workflow.steps.map((s) => s.title)} />
                {p.workflow.illustrative && <p className="t-meta mt-3 italic">An illustration of the process, not a live system.</p>}
              </div>
            )}
          </Reveal>
        ))}
      </section>

      <section className="wrap mt-32" aria-label="About this lab">
        <div className="grid-swiss gap-y-8 border-t hairline pt-10">
          <p className="t-eyebrow col-span-4 md:col-span-4 lg:col-span-4">A few principles</p>
          <ul className="col-span-4 space-y-4 font-serif text-lg text-text/90 md:col-span-4 lg:col-span-6 lg:col-start-7">
            <li>Every result shown here is either measured or clearly marked as unverified.</li>
            <li>Diagrams marked as illustrations are drawings, not connected to a live AI system.</li>
            <li>Demonstrations, when added, will say exactly what is real and what is simulated.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

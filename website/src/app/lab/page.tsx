import type { Metadata } from "next";
import Link from "next/link";
import { getLabProjects } from "@/lib/content";
import { Prompt } from "@/components/lab/Workflow";
import { MiniFlow } from "@/components/home/MiniFlow";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { pad } from "@/lib/utils";

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
        <p className="t-eyebrow"><span className="text-orange">04</span><span className="mx-2 text-faint">/</span>Data, AI & automation</p>
        <div className="grid-swiss mt-10 gap-y-8">
          <h1 className="t-display col-span-4 text-[clamp(3.5rem,9vw,9rem)] md:col-span-8 lg:col-span-8">
            <SplitWords text="The laboratory." />
          </h1>
          <Reveal delay={0.3} className="col-span-4 self-end md:col-span-5 lg:col-span-4">
            <p className="text-muted">Where analysis turns into tools: AI-assisted workflows, automation, data pipelines and small research instruments. Each project file explains the problem, the build and what was learned.</p>
          </Reveal>
        </div>
      </header>

      <section className="wrap" aria-label="Projects">
        <Reveal><Prompt>ls -l projects/</Prompt></Reveal>
        <div className="mt-6 overflow-x-auto border hairline bg-ink/80">
          <table className="w-full min-w-[640px] font-mono text-sm">
            <thead>
              <tr className="t-meta border-b hairline text-left">
                <th scope="col" className="px-4 py-3 font-normal">#</th>
                <th scope="col" className="px-4 py-3 font-normal">project</th>
                <th scope="col" className="px-4 py-3 font-normal">status</th>
                <th scope="col" className="px-4 py-3 font-normal">year</th>
                <th scope="col" className="px-4 py-3 font-normal">context</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.slug} className="group border-b hairline last:border-0 hover:bg-ink-3">
                  <td className="px-4 py-4 text-faint">{pad(i + 1)}</td>
                  <td className="px-4 py-4"><Link href={`/lab/${p.slug}`} className="text-text after:absolute group-hover:text-orange">{p.slug}/</Link></td>
                  <td className="px-4 py-4 text-moss">{p.verified ? "verified" : "draft — to verify"}</td>
                  <td className="px-4 py-4 text-muted"><T>{p.year}</T></td>
                  <td className="px-4 py-4 text-muted">{p.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="wrap mt-24 space-y-24" aria-label="Project previews">
        {projects.map((p, i) => (
          <Reveal key={p.slug} className="grid-swiss items-center gap-y-8 border-t hairline pt-10">
            <div className="col-span-4 md:col-span-8 lg:col-span-5">
              <p className="font-mono text-xs text-faint">{pad(i + 1)} · {p.context}</p>
              <h2 className="t-headline mt-4 text-[clamp(2.25rem,4vw,3.75rem)]">{p.title}</h2>
              <p className="mt-4 max-w-[46ch] text-muted"><T>{p.summary}</T></p>
              <ul className="mt-6 flex flex-wrap gap-1.5">{p.tools.map((t) => <li key={t} className="border border-moss/40 px-2 py-0.5 font-mono text-[0.7rem] text-moss"><T>{t}</T></li>)}</ul>
              <Link href={`/lab/${p.slug}`} className="t-meta link-draw mt-8 inline-block text-text">cat {p.slug}/README →</Link>
            </div>
            {p.workflow && (
              <div className="col-span-4 border hairline bg-ink/80 p-5 md:col-span-8 lg:col-span-6 lg:col-start-7">
                <MiniFlow steps={p.workflow.steps.map((s) => s.title)} />
                {p.workflow.illustrative && <p className="t-meta mt-3 text-orange">Illustrative diagram — not a live system.</p>}
              </div>
            )}
          </Reveal>
        ))}
      </section>

      <section className="wrap mt-32" aria-label="About this lab">
        <div className="grid-swiss gap-y-8 border-t hairline pt-10">
          <div className="col-span-4 md:col-span-4 lg:col-span-4">
            <Prompt>cat PRINCIPLES.md</Prompt>
          </div>
          <ol className="col-span-4 space-y-4 font-mono text-sm text-muted md:col-span-4 lg:col-span-6 lg:col-start-7">
            <li><span className="text-moss">01</span> &nbsp;Every result shown here is either measured or clearly marked as unverified.</li>
            <li><span className="text-moss">02</span> &nbsp;Diagrams labelled <span className="text-orange">illustrative</span> are drawings — not connected to a live AI system.</li>
            <li><span className="text-moss">03</span> &nbsp;Demonstrations, when added, will say exactly what is real and what is simulated.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}

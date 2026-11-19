import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ExperienceRail } from "@/components/home/ExperienceRail";
import { MiniFlow } from "@/components/home/MiniFlow";
import { SectionHead } from "@/components/SectionHead";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { PhotoFrame } from "@/components/PhotoFrame";
import { Portrait } from "@/components/Portrait";
import { T } from "@/components/Text";
import { JsonLd, personLd } from "@/components/JsonLd";
import {
  getExperiences, getJourney, getLabProjects, getPhotos, getProfile, getProjects, getWritings, getTaxonomy,
} from "@/lib/content";
import { formatDate } from "@/lib/utils";

export default function Home() {
  const profile = getProfile();
  const stops = getJourney();
  const experiences = [...getExperiences()].reverse(); // most recent entry (highest order) first
  const writings = getWritings().slice(0, 4);
  const types = getTaxonomy().types;
  const lab = getLabProjects()[0];
  const photos = getPhotos();
  const projects = getProjects().slice(0, 4);

  return (
    <>
      <JsonLd data={personLd(profile)} />
      <Hero headline={profile.headline} subline={profile.subline} stops={stops} />

      {/* A — About */}
      <section id="intro" className="wrap pt-24 md:pt-40" aria-label="A little about me">
        <SectionHead index="01" label="A little about me" href="/about" cta="Full biography" />
        <div className="grid-swiss mt-14 gap-y-12">
          <p className="t-headline col-span-4 text-[clamp(1.75rem,3.3vw,3.4rem)] md:col-span-8 lg:col-span-8">
            <SplitWords text={profile.shortIntro} stagger={0.018} />
          </p>
          <Reveal delay={0.2} className="col-span-4 md:col-span-4 lg:col-span-3 lg:col-start-10">
            {profile.portrait && (
              <div className="mb-10 w-2/3 md:w-full">
                <Portrait src={profile.portrait} alt={`Portrait of ${profile.fullName}`} sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 66vw" />
              </div>
            )}
            <p className="t-eyebrow mb-4">Areas of interest</p>
            <ul className="divide-y divide-line border-y hairline">
              {profile.focusAreas.map((f, i) => (
                <li key={f} className="flex items-baseline gap-3 py-2 text-sm text-muted">
{f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* B — Experience */}
      <section className="wrap pt-28 md:pt-44" aria-label="Selected experience">
        <SectionHead index="02" label="Selected experience" title={<>Work across newsrooms, ministries, <em className="text-beige">regional institutions</em> and consulting.</>} href="/work" cta="Full career" />
        <div className="mt-12">
          <ExperienceRail items={experiences.map(({ slug, organisation, role, location, start, end, summary }) => ({ slug, organisation, role, location, start, end, summary }))} />
        </div>
      </section>

      {/* C — Writing */}
      <section className="wrap pt-24 md:pt-36" aria-label="Latest writing">
        <SectionHead index="03" label="Writing & research" title="Notes on power, money and the systems in between." href="/writing" cta="The archive" />
        <div className="mt-12 grid-swiss gap-y-10">
          {writings[0] && (
            <Reveal className="col-span-4 md:col-span-8 lg:col-span-7">
              <Link href={`/writing/${writings[0].slug}`} className="group block border-t hairline pt-6">
                <p className="t-meta flex flex-wrap gap-3">
                  <span className="text-orange">{types[writings[0].type] ?? writings[0].type}</span>
                  <span>{writings[0].category}</span>
                  {writings[0].demo && <span className="placeholder-chip">DEMONSTRATION</span>}
                </p>
                <h3 className="t-display mt-6 text-[clamp(3rem,7vw,7rem)] transition-colors group-hover:text-beige">{writings[0].title}</h3>
                <p className="mt-6 max-w-[52ch] font-serif text-lg text-muted">{writings[0].subtitle}</p>
                <p className="t-meta mt-6">{formatDate(writings[0].date)} · {writings[0].readingMinutes} min read</p>
              </Link>
            </Reveal>
          )}
          <div className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9">
            {writings.slice(1).map((w, i) => (
              <Reveal key={w.slug} delay={i * 0.1}>
                <Link href={`/writing/${w.slug}`} className="group block border-t hairline py-5">
                  <p className="t-meta">{types[w.type] ?? w.type} · {formatDate(w.date)}</p>
                  <h3 className="t-headline mt-2 text-2xl group-hover:text-beige"><T>{w.title}</T></h3>
                </Link>
              </Reveal>
            ))}
            <Reveal className="border-y hairline py-6">
              <p className="t-eyebrow">Also in the archive</p>
              <p className="mt-3 text-sm text-muted">Academic work, policy briefs and a reading list of external pieces worth your time.</p>
              <div className="mt-4 flex gap-6 text-sm">
                <Link href="/writing?type=research" className="link-draw">Research →</Link>
                <Link href="/writing/reading" className="link-draw">Reading list →</Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* D — Lab */}
      {lab && (
        <section className="mt-28 border-y hairline bg-ink-2 dot-grid md:mt-40" aria-label="Data and AI">
          <div className="wrap py-20 md:py-28">
            <SectionHead index="04" label="Data, AI & automation" title={<>A small laboratory for <em className="text-beige">building</em> things, not only analysing them.</>} href="/lab" cta="Enter the lab" />
            <div className="grid-swiss mt-14 gap-y-10">
              <Reveal className="col-span-4 md:col-span-8 lg:col-span-5">
                <p className="t-meta">{lab.context}</p>
                <h3 className="t-headline mt-4 text-[clamp(2rem,3.4vw,3.2rem)]">{lab.title}</h3>
                <p className="mt-4 max-w-[48ch] text-muted"><T>{lab.summary}</T></p>
                <Link href={`/lab/${lab.slug}`} className="link-draw mt-6 inline-block text-text">Read the project →</Link>
              </Reveal>
              <Reveal delay={0.15} className="col-span-4 border hairline bg-ink/70 p-5 md:col-span-8 lg:col-span-6 lg:col-start-7">
                <p className="t-meta mb-4 italic">An illustration of the process</p>
                <MiniFlow steps={lab.workflow?.steps.map((s) => s.title) ?? []} />
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* E — Photography */}
      <section className="bg-void pb-28 pt-24 md:pb-40 md:pt-36" aria-label="Photography">
        <div className="wrap">
          <SectionHead index="05" label="Photography" title={<span className="italic">Things seen along the way.</span>} href="/photography" cta="Enter the archive" />
          <div className="mt-16 grid grid-cols-12 gap-[var(--gutter)]">
            {photos[0] && <Reveal className="col-span-12 md:col-span-8"><PhotoFrame photo={photos[0]} sizes="(min-width: 768px) 66vw, 100vw" /></Reveal>}
            {photos[1] && <Reveal delay={0.15} className="col-span-7 col-start-6 -mt-16 md:col-span-3 md:col-start-10 md:mt-32"><PhotoFrame photo={photos[1]} sizes="25vw" /></Reveal>}
            {photos[3] && <Reveal delay={0.1} className="col-span-6 md:col-span-3 md:col-start-3 md:-mt-24"><PhotoFrame photo={photos[3]} sizes="25vw" /></Reveal>}
            <Reveal delay={0.2} className="col-span-12 self-end md:col-span-4 md:col-start-7">
              <p className="t-hand text-2xl -rotate-2">placeholder frames — real photographs coming</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* F — Projects */}
      <section className="wrap pt-24 md:pt-36" aria-label="Selected projects">
        <SectionHead index="06" label="Selected projects" title="Projects and achievements." href="/work#projects" cta="All projects" />
        <ol className="mt-12">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.06}>
              <Link href={`/work/projects/${p.slug}`} className="group grid-swiss items-baseline border-t hairline py-6 transition-colors hover:bg-ink-2">
                <span className="t-headline col-span-4 text-2xl md:col-span-5 md:text-3xl lg:col-span-5"><T>{p.title}</T></span>
                <span className="t-meta col-span-4 mt-2 md:col-span-3 md:mt-0 lg:col-span-2">{p.kind}</span>
                <span className="col-span-4 mt-2 text-sm text-muted md:col-span-8 lg:col-span-5 lg:mt-0"><T>{p.summary}</T></span>
              </Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* G — Contact */}
      <section className="wrap pt-28 md:pt-44" aria-label="Contact">
        <div className="grid-swiss border-t hairline pt-10">
          <p className="t-eyebrow col-span-4 md:col-span-2">Contact</p>
          <div className="col-span-4 md:col-span-6 lg:col-span-9 lg:col-start-4">
            <p className="t-display text-[clamp(3.25rem,9vw,9.5rem)]">
              <SplitWords text="Let's talk." />
            </p>
            <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
              <p className="max-w-[44ch] text-muted">For conversations about research, writing, policy, data — or photography.</p>
              <Link href="/contact" className="group inline-flex items-center gap-3 border-b border-orange pb-1 text-lg">
                Get in touch <span className="transition-transform duration-500 group-hover:translate-x-2">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

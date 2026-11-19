import type { Metadata } from "next";
import { Noto_Naskh_Arabic } from "next/font/google";
import { getEducation, getJourney, getProfile } from "@/lib/content";
import { journeyMap } from "@/lib/geo";
import { JourneyMap } from "@/components/about/JourneyMap";
import { Interests } from "@/components/about/Interests";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { SectionHead } from "@/components/SectionHead";
import { JsonLd, personLd } from "@/components/JsonLd";
import { PhotoFrame } from "@/components/PhotoFrame";
import { pad } from "@/lib/utils";

const arabic = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400"], preload: false, display: "swap" });

export const metadata: Metadata = {
  title: "About",
  description: "Houssam Mehfara — Sam — Lebanese, trained in political studies and international relations, working across politics, economics, research and technology.",
  alternates: { canonical: "/about" },
};

export default function About() {
  const p = getProfile();
  const stops = getJourney();
  const map = journeyMap(stops);
  const education = getEducation();

  return (
    <>
      <JsonLd data={personLd(p)} />
      {/* Opening */}
      <header className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
        <p className="t-eyebrow"><span className="text-orange">01</span><span className="mx-2 text-faint">/</span>About</p>
        <div className="grid-swiss mt-10 gap-y-10">
          <h1 className="t-display col-span-4 text-[clamp(4rem,12vw,12.5rem)] md:col-span-8 lg:col-span-9">
            <SplitWords text="Hello, I'm Sam." />
          </h1>
          <Reveal delay={0.4} className="relative col-span-4 self-end md:col-span-4 lg:col-span-3">
            <p className="font-serif text-xl text-muted">
              Officially <span className="text-text">{p.fullName}</span>.
            </p>
            <p className="t-hand absolute -top-12 left-6 -rotate-3 text-2xl md:-top-14">Houssam on paper ↓</p>
          </Reveal>
        </div>
      </header>

      {/* Biography */}
      <section className="wrap mt-24 md:mt-36" aria-label="Biography">
        <div className="grid-swiss gap-y-12">
          <Reveal className="col-span-4 md:col-span-3 lg:col-span-4">
            {p.portrait ? (
              <PhotoFrame photo={{ id: "portrait", src: p.portrait, aspect: "4:5", collection: "", alt: `Portrait of ${p.fullName}`, tags: [] }} sizes="33vw" />
            ) : (
              <div className="relative aspect-[4/5] border border-dashed border-line-2 bg-ink-2">
                <span className="placeholder-chip absolute left-4 top-4">ADD PORTRAIT — assets/portraits/</span>
                <span className="t-meta absolute bottom-4 left-4 text-faint">4:5 · optional</span>
              </div>
            )}
          </Reveal>
          <div className="col-span-4 md:col-span-5 lg:col-span-6 lg:col-start-6">
            <div className="prose-sam">
              {p.bio.map((para, i) => (
                <Reveal key={i} delay={i * 0.05} as="p" className={i === 0 ? "!text-[1.45em] !leading-snug text-text" : ""}><T>{para}</T></Reveal>
              ))}
            </div>
            <Reveal className="mt-12 border-t hairline pt-6">
              <p className="t-eyebrow mb-4">Interests, academically and professionally</p>
              <ul className="flex flex-wrap gap-2">
                {p.focusAreas.map((f) => (
                  <li key={f} className="t-meta border hairline px-2.5 py-1 text-muted">{f}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="wrap mt-32 md:mt-48" aria-label="Places">
        <SectionHead index="A" label="Geography" title={<>Five cities, <em className="text-beige">one</em> line of thought.</>} />
        <Reveal className="mt-12">
          <JourneyMap stops={stops} map={map} />
        </Reveal>
      </section>

      {/* Education */}
      <section className="wrap mt-32 md:mt-48" aria-label="Education">
        <SectionHead index="B" label="Education" title="Political studies, international relations, political economy." />
        <ol className="relative mt-16 grid gap-y-14 md:grid-cols-3 md:gap-x-[var(--gutter)]">
          <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line md:block" aria-hidden />
          {education.map((e, i) => (
            <Reveal as="li" key={e.institution} delay={i * 0.15} className="relative pl-6 md:pl-0">
              <span className="absolute left-0 top-[1px] block size-[10px] border border-orange bg-ink md:relative md:mb-8" aria-hidden />
              <p className="t-meta"><T>{e.dates}</T></p>
              <p className="t-headline mt-3 text-[clamp(2.2rem,3.5vw,3.25rem)]">{e.short}</p>
              <p className="mt-1 text-sm text-muted">{e.institution} · {e.city}</p>
              <p className="mt-5 font-serif text-xl">{e.degree}</p>
              {e.detail && <p className="mt-2 max-w-[36ch] text-sm text-muted"><T>{e.detail}</T></p>}
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Languages */}
      <section className="wrap mt-32 md:mt-48" aria-label="Languages">
        <SectionHead index="C" label="Languages" title="Seven languages, in their own words." />
        <ul className="mt-12 border-b hairline">
          {p.languages.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 0.05} className="group grid-swiss items-baseline border-t hairline py-4 md:py-5">
              <span className="col-span-1 font-mono text-xs text-faint">{pad(i + 1)}</span>
              <span
                lang={l.name === "Arabic" ? "ar" : undefined}
                dir={l.dir}
                className={`col-span-3 text-[clamp(2.25rem,5.5vw,5rem)] leading-none transition-colors group-hover:text-beige md:col-span-5 lg:col-span-6 ${l.name === "Arabic" ? `${arabic.className} text-left` : "t-headline"}`}
              >
                {l.native}
              </span>
              <span className="t-meta col-span-2 col-start-2 md:col-span-1 md:col-start-auto">{l.name}</span>
              <span className="t-meta col-span-2 text-right md:col-span-1 lg:col-span-4">
                {l.level ? l.level : <span className="text-faint">level to be confirmed</span>}
              </span>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Interests */}
      <section className="wrap mt-32 md:mt-48" aria-label="Personal interests">
        <SectionHead index="D" label="Off the record" />
        <div className="grid-swiss mt-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-10">
            <Interests items={p.interests} />
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Naskh_Arabic } from "next/font/google";
import { getEducation, getJourney, getProfile } from "@/lib/content";
import { journeyMap } from "@/lib/geo";
import { JourneyMap } from "@/components/about/JourneyMap";
import { Interests } from "@/components/about/Interests";
import { Languages } from "@/components/about/Languages";
import { Reveal, SplitWords } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { SectionHead } from "@/components/SectionHead";
import { JsonLd, personLd } from "@/components/JsonLd";
import { Portrait } from "@/components/Portrait";
import { formatCoord } from "@/lib/utils";

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
              <figure className="lg:sticky lg:top-28">
                <Portrait src={p.portrait} alt={`Portrait of ${p.fullName}`} sizes="(min-width:1024px) 33vw, (min-width:768px) 40vw, 100vw" priority />
                <figcaption className="t-meta mt-3 flex justify-between"><span>{p.fullName}</span><span className="text-faint">Sam</span></figcaption>
              </figure>
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

      {/* Places */}
      <section className="wrap mt-32 md:mt-48" aria-label="Places that stayed with me">
        <SectionHead index="B" label="Places that stayed with me" />
        <ol className="mt-4">
          {stops.map((st, i) => (
            <Reveal as="li" key={st.id} className="grid-swiss items-start gap-y-4 border-b hairline py-12 md:py-16">
              <div className={`col-span-4 md:col-span-3 lg:col-span-4 ${i % 2 ? "lg:col-start-2" : ""}`}>
                <p className="t-meta"><span className="text-orange">{String(i + 1).padStart(2, "0")}</span> · {formatCoord(st.lat, st.lon)}</p>
                <h3 className="t-display mt-4 text-[clamp(3rem,6vw,5.5rem)]">{st.city}</h3>
                {st.title && <p className="mt-2 font-serif text-xl italic text-beige">{st.title}</p>}
              </div>
              <p className={`col-span-4 max-w-[46ch] self-end font-serif text-[1.15rem] leading-relaxed text-text/90 md:col-span-5 lg:col-span-5 ${i % 2 ? "lg:col-start-7" : "lg:col-start-7"}`}>{st.essay}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Education */}
      <section className="wrap mt-32 md:mt-48" aria-label="Education">
        <SectionHead index="C" label="Education" title="Political studies, international relations, political economy." />
        <ol className="relative mt-16 grid gap-y-14 md:grid-cols-3 md:gap-x-[var(--gutter)]">
          <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-line md:block" aria-hidden />
          {education.map((e, i) => (
            <Reveal as="li" key={e.slug} delay={i * 0.15} className="group relative pl-6 md:pl-0">
              <span className="absolute left-0 top-[1px] block size-[10px] border border-orange bg-ink md:relative md:mb-8" aria-hidden />
              <p className="t-meta"><T>{e.dates}</T></p>
              <p className="t-headline mt-3 text-[clamp(2.2rem,3.5vw,3.25rem)]">{e.short}</p>
              <p className="mt-1 text-sm text-muted">{e.institution} · {e.city}</p>
              <p className="mt-5 font-serif text-xl">{e.degree}</p>
              {e.detail && <p className="mt-2 max-w-[36ch] text-sm text-muted"><T>{e.detail}</T></p>}
              <Link href={`/education/${e.slug}`} className="t-meta link-draw mt-5 inline-block text-text">The story &amp; what I learned →</Link>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Languages */}
      <section className="wrap mt-32 md:mt-48" aria-label="Languages">
        <SectionHead index="D" label="Languages" />
        <Languages items={p.languages} arabicClass={arabic.className} />
      </section>

      {/* Interests */}
      <section className="wrap mt-32 md:mt-48" aria-label="Beyond the CV">
        <div className="border-t hairline pt-5">
          <p className="t-eyebrow"><span className="text-orange">E</span><span className="mx-2 text-faint">/</span>Interests</p>
          <h2 className="mt-8 text-[clamp(3rem,9vw,8.5rem)] font-semibold uppercase leading-[0.9] tracking-[-0.03em]">Beyond the CV</h2>
          <p className="t-meta mt-4">Pick one ↓</p>
        </div>
        <div className="mt-10">
          <Interests items={p.interests} />
        </div>
      </section>
    </>
  );
}

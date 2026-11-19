import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEducation, getEducationEntry } from "@/lib/content";
import { Detail } from "@/components/work/Detail";
import { T } from "@/components/Text";

export function generateStaticParams() {
  return getEducation().map((e) => ({ slug: e.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const e = getEducationEntry((await params).slug);
  return e ? { title: `${e.short} — Education`, description: `${e.degree}, ${e.institution}.`, alternates: { canonical: `/education/${e.slug}` } } : {};
}

export default async function EducationPage({ params }: { params: Promise<{ slug: string }> }) {
  const e = getEducationEntry((await params).slug);
  if (!e) notFound();
  const all = getEducation();
  const next = all[(all.findIndex((x) => x.slug === e.slug) + 1) % all.length];
  return (
    <Detail
      crumb={{ href: "/work#education", label: "← Education" }}
      eyebrow={<span className="text-orange">Education</span>}
      title={e.short}
      facts={[["Institution", e.institution], ["Programme", e.degree], ["City", e.city], ["Dates", <T key="d">{e.dates}</T>]]}
      body={e.body}
      aside={e.detail ? <div className="border-l border-orange pl-5"><p className="t-eyebrow mb-3">In brief</p><p className="font-serif text-lg leading-snug">{e.detail}</p></div> : undefined}
      footer={<><Link href="/work#education" className="link-draw">← All education</Link><Link href={`/education/${next.slug}`} className="link-draw text-text">Next: {next.short} →</Link></>}
    />
  );
}

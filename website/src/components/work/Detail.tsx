import Link from "next/link";
import { SplitWords, Reveal } from "../motion/Reveal";
import { Mdx } from "@/lib/mdx";

/** Shared layout for an experience or project detail page. */
export function Detail({ crumb, eyebrow, title, facts, body, aside, footer }: {
  crumb: { href: string; label: string }; eyebrow: React.ReactNode; title: string;
  facts: [string, React.ReactNode][]; body: string; aside?: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <article className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+6rem)]">
      <nav className="t-meta" aria-label="Breadcrumb"><Link href={crumb.href} className="link-draw">{crumb.label}</Link></nav>
      <p className="t-eyebrow mt-10">{eyebrow}</p>
      <h1 className="t-display mt-4 text-[clamp(3.5rem,10vw,10rem)]"><SplitWords text={title} /></h1>
      <Reveal delay={0.3}>
        <dl className="mt-10 grid grid-cols-2 border-y hairline md:grid-cols-4">
          {facts.map(([k, v]) => (
            <div key={k} className="border-r hairline py-4 pr-4 last:border-r-0 md:px-4 md:first:pl-0">
              <dt className="t-meta text-faint">{k}</dt>
              <dd className="mt-1 text-sm text-text">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
      <div className="grid-swiss mt-16 gap-y-12">
        <div className="prose-sam col-span-4 md:col-span-8 lg:col-span-7 [&_h2]:mt-14 [&_h2:first-child]:mt-0">
          <Mdx source={body} />
        </div>
        {aside && <aside className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9"><div className="space-y-10 lg:sticky lg:top-28">{aside}</div></aside>}
      </div>
      {footer && <footer className="mt-24 flex flex-wrap justify-between gap-6 border-t hairline pt-8 t-meta">{footer}</footer>}
    </article>
  );
}

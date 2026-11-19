import Link from "next/link";
import { Reveal } from "./motion/Reveal";

/** The numbered section header used across the homepage and index pages. */
export function SectionHead({ label, title, href, cta, className = "" }: {
  index?: string; label: string; title?: React.ReactNode; href?: string; cta?: string; className?: string;
}) {
  return (
    <Reveal className={`grid-swiss items-end border-t hairline pt-5 ${className}`}>
      <p className="t-eyebrow col-span-2 md:col-span-2">{label}</p>
      {title && <h2 className="t-headline col-span-4 mt-6 text-[clamp(2rem,4.4vw,4.25rem)] md:col-span-6 md:col-start-3 md:mt-0 lg:col-span-7 lg:col-start-4">{title}</h2>}
      {href && (
        <Link href={href} className="t-meta link-draw col-span-2 mt-6 justify-self-start text-text md:col-span-8 md:mt-0 md:justify-self-end lg:col-span-2 lg:col-start-11">
          {cta ?? "View all"} <span aria-hidden>→</span>
        </Link>
      )}
    </Reveal>
  );
}

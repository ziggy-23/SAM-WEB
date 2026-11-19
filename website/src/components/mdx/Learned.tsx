import { Reveal } from "../motion/Reveal";

/**
 * The signature section of every experience and education page:
 * not what I did, but what it changed. Optional `quote` is set large as a pull-quote.
 */
export function Learned({ quote, children }: { quote?: string; children: React.ReactNode }) {
  return (
    <section className="not-prose relative my-20 border-t border-orange pt-10" aria-label="What I learned">
      <p className="t-eyebrow !text-orange">What I learned</p>
      {quote && (
        <Reveal as="p" className="t-headline mt-6 max-w-[24ch] text-[clamp(1.8rem,3vw,2.7rem)] italic leading-[1.12] text-beige">
          &ldquo;{quote}&rdquo;
        </Reveal>
      )}
      <div className="mt-10 font-serif text-[1.08em] leading-[1.7] [&_p]:mb-5 [&_p]:max-w-[38em] [&_p:first-child]:text-text">{children}</div>
    </section>
  );
}

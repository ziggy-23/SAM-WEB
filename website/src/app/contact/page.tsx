import type { Metadata } from "next";
import { getSite } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";
import { SplitWords, Reveal } from "@/components/motion/Reveal";
import { T } from "@/components/Text";
import { isPlaceholder } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about research, writing, policy, data or photography.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const { contact } = getSite();
  const email = isPlaceholder(contact.email) ? undefined : contact.email;
  return (
    <div className="wrap pt-[calc(var(--nav-h)+4rem)] md:pt-[calc(var(--nav-h)+7rem)]">
      <p className="t-eyebrow">Contact</p>
      <h1 className="t-display mt-8 text-[clamp(4rem,13vw,13rem)]"><SplitWords text="Say hello." /></h1>
      <div className="grid-swiss mt-16 gap-y-16 md:mt-24">
        <Reveal className="col-span-4 md:col-span-8 lg:col-span-4">
          <p className="max-w-[36ch] font-serif text-2xl leading-snug">For conversations about research, writing, policy, data — or photography.</p>
          <dl className="mt-12 divide-y divide-line border-y hairline">
            <div className="flex items-baseline justify-between gap-4 py-4">
              <dt className="t-eyebrow">Email</dt>
              <dd>{email ? <a className="link-draw" href={`mailto:${email}`}>{email}</a> : <T>{contact.email}</T>}</dd>
            </div>
            {contact.links.map((l) => (
              <div key={l.label} className="flex items-baseline justify-between gap-4 py-4">
                <dt className="t-eyebrow">{l.label}</dt>
                <dd>{isPlaceholder(l.url) ? <T>{l.url}</T> : <a className="link-draw" href={l.url} target="_blank" rel="me noopener">{l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")} ↗</a>}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal delay={0.15} className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
          <ContactForm fallbackEmail={email} />
        </Reveal>
      </div>
    </div>
  );
}

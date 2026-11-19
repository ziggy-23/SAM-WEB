import type { Profile } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function personLd(p: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.fullName,
    alternateName: p.preferredName,
    url: SITE_URL,
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "American University of Beirut" },
      { "@type": "CollegeOrUniversity", name: "Institut Barcelona d'Estudis Internacionals" },
    ],
    knowsAbout: p.focusAreas,
  };
}

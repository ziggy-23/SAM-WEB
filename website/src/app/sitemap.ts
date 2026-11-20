import type { MetadataRoute } from "next";
import { getEducation, getExperiences, getLabProjects, getProjects, getSections, getWritings } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority = 0.7) => ({ url: `${SITE_URL}${path}`, lastModified: now, priority });
  const s = getSections();
  return [
    page("/", 1), page("/about", 0.9), page("/lab", 0.8), page("/work", 0.9), page("/contact", 0.5),
    ...(s.articles ? [page("/writing", 0.9)] : []),
    ...(s.reading ? [page("/writing/reading", 0.6)] : []),
    ...(s.photography ? [page("/photography", 0.8)] : []),
    ...getWritings({ includeDrafts: false }).filter((w) => !w.demo).map((w) => ({ url: `${SITE_URL}/writing/${w.slug}`, lastModified: new Date(w.date), priority: 0.8 })),
    ...getExperiences().map((e) => page(`/work/${e.slug}`, 0.6)),
    ...getEducation().map((e) => page(`/education/${e.slug}`, 0.6)),
    ...getProjects().map((p) => page(`/work/projects/${p.slug}`, 0.6)),
    ...getLabProjects().map((p) => page(`/lab/${p.slug}`, 0.6)),
  ];
}

/**
 * Content layer.
 *
 * Everything personal on this website lives in the top-level `content/` folder
 * (one level above `website/`). This file reads those files at build time and
 * validates them with zod, so a typo in a content file produces a clear error
 * instead of a broken page.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const CONTENT_DIR = path.join(process.cwd(), "..", "content");
const isProd = process.env.NODE_ENV === "production";

function readJson<T>(rel: string, schema: z.ZodType<T>): T {
  const file = path.join(CONTENT_DIR, rel);
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Invalid content in content/${rel}:\n${z.prettifyError(parsed.error)}`);
  }
  return parsed.data;
}

function readMdxDir<T>(dir: string, schema: z.ZodType<T>) {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [] as { slug: string; data: T; body: string }[];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, f), "utf8"));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/${dir}/${f}:\n${z.prettifyError(parsed.error)}`);
      }
      return { slug: f.replace(/\.mdx?$/, ""), data: parsed.data, body: content };
    });
}

/* ------------------------------------------------------------------ site */

const SiteSchema = z.object({
  title: z.string(),
  description: z.string(),
  contact: z.object({
    email: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string(), kind: z.string().optional() })),
  }),
});
export const getSite = () => readJson("site.json", SiteSchema);

/* ------------------------------------------------------------- biography */

const ProfileSchema = z.object({
  fullName: z.string(),
  preferredName: z.string(),
  headline: z.string(),
  subline: z.string(),
  shortIntro: z.string(),
  bio: z.array(z.string()),
  focusAreas: z.array(z.string()),
  interests: z.array(z.object({ label: z.string(), note: z.string().optional(), icon: z.string().optional() })),
  languages: z.array(
    z.object({
      name: z.string(), native: z.string(), dir: z.enum(["ltr", "rtl"]).optional(),
      level: z.string().nullable(), percent: z.number().min(0).max(100).optional(),
    }),
  ),
  portrait: z.string().nullable(),
});
export type Profile = z.infer<typeof ProfileSchema>;
export const getProfile = () => readJson("biography/profile.json", ProfileSchema);

const StopSchema = z.object({
  id: z.string(),
  city: z.string(),
  country: z.string(),
  lat: z.number(),
  lon: z.number(),
  title: z.string().optional(),
  description: z.string(),
  essay: z.string().optional(),
});
export type JourneyStop = z.infer<typeof StopSchema>;
export const getJourney = () => readJson("biography/journey.json", z.object({ stops: z.array(StopSchema) })).stops;

const EducationSchema = z.object({
  institution: z.string(),
  short: z.string(),
  city: z.string(),
  degree: z.string(),
  detail: z.string().optional(),
  dates: z.string(),
  order: z.number().default(99),
});
export type Education = z.infer<typeof EducationSchema> & { slug: string; body: string };
export const getEducation = (): Education[] =>
  readMdxDir("education", EducationSchema)
    .map((e) => ({ ...e.data, slug: e.slug, body: e.body }))
    .sort((a, b) => a.order - b.order);
export const getEducationEntry = (slug: string) => getEducation().find((e) => e.slug === slug);

/* ------------------------------------------------------------ experience */

const ExperienceSchema = z.object({
  organisation: z.string(),
  role: z.string(),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  order: z.number(),
  verified: z.boolean().default(false),
  summary: z.string(),
  tools: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  highlights: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  relatedProjects: z.array(z.string()).default([]),
  partners: z.array(z.string()).default([]),
  listen: z.string().optional(),
  media: z.array(z.object({ src: z.string(), caption: z.string().optional() })).default([]),
});
export type Experience = z.infer<typeof ExperienceSchema> & { slug: string; body: string };
export const getExperiences = (): Experience[] =>
  readMdxDir("experience", ExperienceSchema)
    .map((e) => ({ ...e.data, slug: e.slug, body: e.body }))
    .sort((a, b) => a.order - b.order);
export const getExperience = (slug: string) => getExperiences().find((e) => e.slug === slug);

/* -------------------------------------------------------------- projects */

const ProjectSchema = z.object({
  title: z.string(),
  kind: z.string(),
  summary: z.string(),
  year: z.string().optional(),
  order: z.number().default(99),
  relatedExperience: z.string().optional(),
  labProject: z.string().optional(),
  link: z.string().optional(),
});
export type Project = z.infer<typeof ProjectSchema> & { slug: string; body: string };
export const getProjects = (): Project[] =>
  readMdxDir("projects", ProjectSchema)
    .map((e) => ({ ...e.data, slug: e.slug, body: e.body }))
    .sort((a, b) => a.order - b.order);
export const getProject = (slug: string) => getProjects().find((p) => p.slug === slug);

/* ----------------------------------------------------------- AI projects */

const LabSchema = z.object({
  title: z.string(),
  summary: z.string(),
  context: z.string().optional(),
  status: z.string().optional(),
  verified: z.boolean().default(false),
  order: z.number().default(99),
  year: z.string().optional(),
  tools: z.array(z.string()).default([]),
  relatedExperience: z.string().optional(),
  problem: z.string().optional(),
  why: z.string().optional(),
  metrics: z
    .array(z.object({ label: z.string(), before: z.number(), after: z.number(), unit: z.string(), note: z.string().optional() }))
    .default([]),
  workflow: z
    .object({ illustrative: z.boolean().default(true), steps: z.array(z.object({ title: z.string(), text: z.string() })) })
    .optional(),
  media: z
    .array(
      z.object({
        type: z.enum(["image", "video", "embed"]),
        src: z.string(),
        caption: z.string().optional(),
        illustrative: z.boolean().optional(),
      }),
    )
    .default([]),
});
export type LabProject = z.infer<typeof LabSchema> & { slug: string; body: string };
export const getLabProjects = (): LabProject[] =>
  readMdxDir("ai-projects", LabSchema)
    .map((e) => ({ ...e.data, slug: e.slug, body: e.body }))
    .sort((a, b) => a.order - b.order);
export const getLabProject = (slug: string) => getLabProjects().find((p) => p.slug === slug);

/* --------------------------------------------------- writing & research */

const TaxonomySchema = z.object({ categories: z.array(z.string()), types: z.record(z.string(), z.string()) });
export const getTaxonomy = () => readJson("articles/categories.json", TaxonomySchema);

const WritingSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.coerce.string(),
  type: z.string().default("article"),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string().nullable().optional(),
  summary: z.string(),
  references: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  demo: z.boolean().default(false),
  externalUrl: z.string().optional(),
  pdf: z.string().optional(),
});
export type Writing = z.infer<typeof WritingSchema> & {
  slug: string;
  body: string;
  readingMinutes: number;
  source: "articles" | "research";
};

function readingTime(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function getWritings({ includeDrafts = !isProd } = {}): Writing[] {
  const all = (["articles", "research"] as const).flatMap((source) =>
    readMdxDir(source, WritingSchema).map((e) => ({
      ...e.data,
      slug: e.slug,
      body: e.body,
      source,
      readingMinutes: readingTime(e.body),
    })),
  );
  return all
    .filter((w) => includeDrafts || !w.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
export const getWriting = (slug: string) => getWritings().find((w) => w.slug === slug);

export function getRelated(w: Writing, n = 3) {
  const others = getWritings().filter((o) => o.slug !== w.slug);
  const explicit = w.related.map((s) => others.find((o) => o.slug === s)).filter(Boolean) as Writing[];
  const scored = others
    .filter((o) => !explicit.includes(o))
    .map((o) => ({ o, s: (o.category === w.category ? 2 : 0) + o.tags.filter((t) => w.tags.includes(t)).length }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.o);
  return [...explicit, ...scored].slice(0, n);
}

const ReadingSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      author: z.string(),
      publication: z.string(),
      date: z.string(),
      url: z.string(),
      why: z.string(),
      tags: z.array(z.string()).default([]),
      template: z.boolean().optional(),
    }),
  ),
});
export type Recommendation = z.infer<typeof ReadingSchema>["items"][number];
export const getReadingList = () => readJson("reading-list/recommendations.json", ReadingSchema).items;

/* ----------------------------------------------------------- photography */

const PhotoSchema = z.object({
  id: z.string(),
  src: z.string().nullable(),
  aspect: z.string().regex(/^\d+(\.\d+)?:\d+(\.\d+)?$/).default("3:2"),
  collection: z.string(),
  title: z.string().nullable().optional(),
  caption: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  alt: z.string(),
});
export type Photo = z.infer<typeof PhotoSchema>;
const CollectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  country: z.string().optional(),
  placeholder: z.boolean().optional(),
  intro: z.string().optional(),
});
export type Collection = z.infer<typeof CollectionSchema>;
export const getPhotos = () => readJson("photography/photos.json", z.object({ photos: z.array(PhotoSchema) })).photos;
export const getCollections = () =>
  readJson("photography/collections.json", z.object({ collections: z.array(CollectionSchema) })).collections;

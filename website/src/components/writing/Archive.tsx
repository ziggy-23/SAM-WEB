"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { T } from "../Text";
import { formatDate, pad } from "@/lib/utils";

export type ArchiveItem = {
  slug: string; title: string; subtitle?: string; date: string; type: string; category: string;
  tags: string[]; summary: string; readingMinutes: number; demo: boolean; draft: boolean;
};

const RESEARCH_TYPES = ["research", "thesis", "policy-brief", "report", "paper"];
type Sort = "newest" | "oldest" | "title";

export function Archive({ items, categories, types }: { items: ArchiveItem[]; categories: string[]; types: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "writing" | "research">("all");
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");

  // Read initial filters from the URL (?q=…&type=research&category=…) and keep them in sync.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setQ(p.get("q") ?? "");
    const t = p.get("type");
    if (t === "research" || t === "writing") setKind(t);
    setCat(p.get("category"));
    const s = p.get("sort");
    if (s === "oldest" || s === "title") setSort(s);
  }, []);
  useEffect(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (kind !== "all") p.set("type", kind);
    if (cat) p.set("category", cat);
    if (sort !== "newest") p.set("sort", sort);
    const qs = p.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, kind, cat, sort]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items
      .filter((i) => kind === "all" || (kind === "research") === RESEARCH_TYPES.includes(i.type))
      .filter((i) => !cat || i.category === cat)
      .filter((i) => !needle || [i.title, i.subtitle, i.summary, i.category, ...i.tags].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title) : sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  }, [items, q, kind, cat, sort]);

  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, items.filter((i) => i.category === c).length])), [items, categories]);

  return (
    <div className="grid-swiss gap-y-10">
      {/* Filters */}
      <aside className="col-span-4 md:col-span-8 lg:col-span-3" aria-label="Filter the archive">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)]">
          <label className="block">
            <span className="t-eyebrow">Search</span>
            <span className="mt-2 flex items-center border-b border-line-2 focus-within:border-orange">
              <svg viewBox="0 0 16 16" className="size-3.5 text-muted" aria-hidden><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" /><path d="M11 11l4 4" stroke="currentColor" /></svg>
              <input
                type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Titles, topics, tags…"
                className="w-full bg-transparent px-2 py-2.5 font-serif text-lg placeholder:text-faint focus:outline-none"
              />
            </span>
          </label>

          <fieldset className="mt-8">
            <legend className="t-eyebrow">Type</legend>
            <div className="mt-3 flex border hairline">
              {(["all", "writing", "research"] as const).map((k) => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}
                  className={`t-meta flex-1 px-2 py-2 capitalize transition-colors ${kind === k ? "bg-beige !text-ink" : "hover:text-text"}`}>
                  {k === "writing" ? "Articles" : k}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <legend className="t-eyebrow">Category</legend>
            <ul className="mt-3 flex flex-wrap gap-1.5 lg:flex-col lg:gap-0">
              {categories.map((c) => (
                <li key={c}>
                  <button type="button" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}
                    className={`group flex w-full items-baseline justify-between gap-3 border px-2.5 py-1 text-left text-sm transition-colors lg:border-0 lg:px-0 lg:py-1.5 ${cat === c ? "border-orange text-orange" : "border-line text-muted hover:text-text"}`}>
                    <span className="flex items-center gap-2">
                      <span className={`hidden h-px bg-orange transition-all lg:inline-block ${cat === c ? "w-4" : "w-0 group-hover:w-2"}`} />
                      {c}
                    </span>
                    <span className="font-mono text-[0.65rem] text-faint">{counts[c] || ""}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <label className="mt-8 block">
            <span className="t-eyebrow">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="t-meta mt-2 w-full border-b border-line-2 bg-ink py-2 text-text focus:outline-none">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
        </div>
      </aside>

      {/* Results */}
      <div className="col-span-4 md:col-span-8 lg:col-span-9">
        <p className="t-meta mb-4" aria-live="polite">{results.length} {results.length === 1 ? "entry" : "entries"}{cat ? ` in ${cat}` : ""}{q ? ` matching “${q}”` : ""}</p>
        <ol className="border-b hairline">
          <AnimatePresence initial={false} mode="popLayout">
            {results.map((w, i) => (
              <motion.li key={w.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                <Link href={`/writing/${w.slug}`} className="group grid grid-cols-12 gap-x-[var(--gutter)] gap-y-2 border-t hairline py-7 transition-colors hover:bg-ink-2/60">
                  <span className="col-span-2 font-mono text-xs text-faint md:col-span-1">{pad(i + 1)}</span>
                  <div className="col-span-10 md:col-span-8">
                    <p className="t-meta flex flex-wrap gap-x-3">
                      <span className="text-orange">{types[w.type] ?? w.type}</span>
                      <span>{w.category}</span>
                      {w.demo && <span className="placeholder-chip !text-[0.6rem]">DEMONSTRATION</span>}
                      {w.draft && <span className="placeholder-chip !text-[0.6rem]">DRAFT — HIDDEN IN PRODUCTION</span>}
                    </p>
                    <h3 className="t-headline mt-3 text-[clamp(1.75rem,3vw,2.75rem)] transition-colors group-hover:text-beige"><T>{w.title}</T></h3>
                    {w.subtitle && <p className="mt-2 max-w-[60ch] font-serif text-lg text-muted"><T>{w.subtitle}</T></p>}
                  </div>
                  <div className="col-span-10 col-start-3 flex items-end justify-between md:col-span-3 md:col-start-auto md:flex-col md:items-end">
                    <span className="t-meta">{formatDate(w.date)}</span>
                    <span className="t-meta">{w.readingMinutes} min</span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        {results.length === 0 && (
          <div className="border-t hairline py-16 text-center">
            <p className="t-hand text-3xl">nothing here yet…</p>
            <button type="button" className="t-meta link-draw mt-4" onClick={() => { setQ(""); setCat(null); setKind("all"); }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

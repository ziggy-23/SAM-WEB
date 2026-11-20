import Link from "next/link";
import { NAV } from "@/lib/nav";
import { getHiddenNav, getSite } from "@/lib/content";
import { isPlaceholder } from "@/lib/utils";

export function Footer() {
  const site = getSite();
  const links = site.contact.links.filter((l) => !isPlaceholder(l.url));
  const year = new Date().getFullYear();
  const hidden = getHiddenNav();
  return (
    <footer className="mt-32 border-t hairline">
      <div className="wrap grid-swiss gap-y-10 py-14">
        <div className="col-span-4 md:col-span-4">
          <p className="t-display text-[clamp(4.5rem,11vw,9rem)] text-text/90">SAM</p>
          <p className="mt-4 max-w-xs font-serif text-lg italic leading-snug text-muted">A personal archive of ideas, experiences, research, projects and visual observations.</p>
        </div>
        <nav aria-label="Footer" className="col-span-2 md:col-span-2 lg:col-start-7">
          <p className="t-eyebrow mb-4">Index</p>
          <ul className="space-y-1.5 text-sm">
            {NAV.filter((n) => !hidden.includes(n.href)).map((n) => (
              <li key={n.href}><Link className="link-draw text-muted hover:text-text" href={n.href}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="col-span-2 md:col-span-2 lg:col-start-10">
          <p className="t-eyebrow mb-4">Elsewhere</p>
          <ul className="space-y-1.5 text-sm">
            {links.length === 0 && <li className="text-faint">Links coming soon</li>}
            {links.map((l) => (
              <li key={l.label}><a className="link-draw text-muted hover:text-text" href={l.url} rel="me noopener" target="_blank">{l.label} ↗</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-4 border-t hairline py-6 t-meta">
        <span>© {year} Houssam Mehfara</span>
        <span className="hidden md:inline">No ads. No trackers.</span>
        <a href="#main" className="link-draw">Back to top ↑</a>
      </div>
    </footer>
  );
}

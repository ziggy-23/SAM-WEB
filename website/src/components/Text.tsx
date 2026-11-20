import { Fragment } from "react";
import { PLACEHOLDER_RE, PUBLIC } from "@/lib/utils";

/**
 * Renders a content string, turning any "[ADD …]" / "[VERIFY …]" placeholder
 * into a visible dashed chip so unverified content is never mistaken for fact.
 */
export function T({ children }: { children?: string | null }) {
  if (!children) return null;
  if (PUBLIC) {
    const clean = children.replace(new RegExp(PLACEHOLDER_RE.source, "g"), "").replace(/\s{2,}/g, " ").trim();
    return clean ? <>{clean}</> : null;
  }
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of children.matchAll(new RegExp(PLACEHOLDER_RE.source, "g"))) {
    if (m.index! > last) parts.push(children.slice(last, m.index));
    parts.push(
      <span key={m.index} className="placeholder-chip" title="Placeholder — content to be added or verified">
        {m[0].slice(1, -1)}
      </span>,
    );
    last = m.index! + m[0].length;
  }
  if (last < children.length) parts.push(children.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}

/** For use inside MDX: <TODO>ADD SOMETHING</TODO> */
export function Todo({ children }: { children?: React.ReactNode }) {
  if (PUBLIC) return null;
  return (
    <span className="placeholder-chip" title="Placeholder — content to be added or verified">
      {children}
    </span>
  );
}

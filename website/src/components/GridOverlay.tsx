"use client";
import { useEffect, useState } from "react";

/** Press "G" anywhere (outside a text field) to reveal the 12-column grid the site is built on. */
export function GridOverlay() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable]") || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.toLowerCase() === "g") setOn((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!on) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
      <div className="wrap grid-swiss h-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`h-full bg-orange/[0.06] outline outline-1 outline-orange/20 ${i >= 4 ? "hidden md:block" : ""} ${i >= 8 ? "md:hidden lg:block" : ""}`} />
        ))}
      </div>
      <p className="t-meta fixed bottom-4 left-4 bg-ink px-2 py-1 text-orange">Grid · 4 / 8 / 12 columns — press G to hide</p>
    </div>
  );
}

"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo } from "@/lib/content";
import { PhotoFrame, aspectToRatio } from "../PhotoFrame";
import { T } from "../Text";

/** Fullscreen viewer: ← → to navigate, Esc to close, swipe on touch screens. */
export function Lightbox({ photos, index, onClose, onIndex }: { photos: Photo[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  const [dir, setDir] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const photo = photos[index];
  const go = (d: number) => { setDir(d); onIndex((index + d + photos.length) % photos.length); };

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    dialog.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; prevFocus?.focus(); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        // keep focus inside the dialog
        const f = dialog.current?.querySelectorAll<HTMLElement>("button");
        if (!f?.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Preload neighbours so navigation feels instant.
  const neighbours = [photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]].filter((p) => p.src);

  const ratio = aspectToRatio(photo.aspect);
  const hasMeta = photo.caption || photo.location || photo.date || (photo.title && !photo.title.startsWith("[ADD"));

  return createPortal(
    <motion.div
      ref={dialog}
      role="dialog" aria-modal="true" aria-label={`Photograph ${index + 1} of ${photos.length}`} tabIndex={-1}
      className="fixed inset-0 z-[80] flex flex-col bg-void/[0.97] outline-none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
    >
      <div className="wrap flex h-16 shrink-0 items-center justify-between t-meta">
        <span>{index + 1} of {photos.length}</span>
        <button type="button" onClick={onClose} className="link-draw text-text">Close (Esc)</button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={photo.id}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25}
            onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1); }}
            className="relative max-h-full touch-pan-y"
            style={{ aspectRatio: String(ratio), height: ratio < 1.2 ? "100%" : undefined, width: ratio >= 1.2 ? "min(100%, calc((100dvh - 12rem) * " + ratio + "))" : undefined }}
          >
            {photo.src ? (
              <Image src={`/media/${photo.src}`} alt={photo.alt} fill sizes="100vw" quality={90} className="object-contain" priority />
            ) : (
              <PhotoFrame photo={photo} className="h-full" />
            )}
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={() => go(-1)} aria-label="Previous photograph" className="absolute left-2 top-1/2 hidden -translate-y-1/2 p-4 text-2xl text-muted hover:text-text md:block">←</button>
        <button type="button" onClick={() => go(1)} aria-label="Next photograph" className="absolute right-2 top-1/2 hidden -translate-y-1/2 p-4 text-2xl text-muted hover:text-text md:block">→</button>
      </div>

      <div className="wrap flex min-h-24 shrink-0 items-start justify-between gap-6 py-5">
        <div className="max-w-xl" aria-live="polite">
          {hasMeta ? (
            <>
              {photo.title && <p className="font-serif text-lg"><T>{photo.title}</T></p>}
              {photo.caption && <p className="mt-1 text-sm text-muted"><T>{photo.caption}</T></p>}
              <p className="t-meta mt-2">{[photo.location, photo.date].filter(Boolean).join(" · ")}</p>
            </>
          ) : <p className="t-meta text-faint">Untitled</p>}
        </div>
        <div className="flex gap-4 md:hidden">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photograph" className="p-2 text-xl">←</button>
          <button type="button" onClick={() => go(1)} aria-label="Next photograph" className="p-2 text-xl">→</button>
        </div>
      </div>
      <div className="hidden" aria-hidden>
        {neighbours.map((n) => <Image key={n.id} src={`/media/${n.src}`} alt="" width={16} height={16} sizes="100vw" />)}
      </div>
    </motion.div>,
    document.body,
  );
}

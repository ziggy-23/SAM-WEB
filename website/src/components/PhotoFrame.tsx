import Image from "next/image";
import type { Photo } from "@/lib/content";

export function aspectToRatio(aspect: string) {
  const [w, h] = aspect.split(":").map(Number);
  return w / h;
}

/**
 * A photograph, or — until a real photograph is added — a clearly labelled
 * placeholder frame. Placeholders are never filled with stock images.
 */
export function PhotoFrame({ photo, sizes = "100vw", priority = false, className = "", showLabel = true }: {
  photo: Photo; sizes?: string; priority?: boolean; className?: string; showLabel?: boolean;
}) {
  const ratio = aspectToRatio(photo.aspect);
  return (
    <div className={`relative w-full overflow-hidden bg-ink-2 ${className}`} style={{ aspectRatio: String(ratio) }}>
      {photo.src ? (
        <Image src={`/media/${photo.src}`} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div className="absolute inset-0" role="img" aria-label={`Placeholder frame (${photo.aspect}) — photograph to be added`}>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(233,230,222,0.06)" />
            <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(233,230,222,0.06)" />
          </svg>
          <div className="absolute inset-3 border border-dashed border-line-2" />
          {/* crop marks */}
          {["left-2 top-2", "right-2 top-2 rotate-90", "right-2 bottom-2 rotate-180", "left-2 bottom-2 -rotate-90"].map((p) => (
            <span key={p} className={`absolute size-3 border-l border-t border-stone/60 ${p}`} aria-hidden />
          ))}
          {showLabel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
              <span className="placeholder-chip text-[0.7rem]">ADD PHOTOGRAPH</span>
              <span className="t-meta text-faint">{photo.aspect} · {ratio > 1.05 ? "horizontal" : ratio < 0.95 ? "vertical" : "square"}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

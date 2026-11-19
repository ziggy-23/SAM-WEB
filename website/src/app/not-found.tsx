import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[80vh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="t-meta">Error 404 · 00.00°N 00.00°E</p>
      <h1 className="t-display mt-6 text-[clamp(4rem,14vw,14rem)]">Off the map.</h1>
      <p className="t-hand mt-4 -rotate-2 text-3xl">this page doesn&apos;t exist (yet)</p>
      <Link href="/" className="t-meta link-draw mt-10 self-start text-text">← Back to SAM</Link>
    </div>
  );
}

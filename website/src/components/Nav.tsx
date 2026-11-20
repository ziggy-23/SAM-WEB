"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/nav";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.18em] font-serif font-medium tracking-[0.06em] ${className}`}>
      SAM<span className="inline-block size-[0.22em] translate-y-[-0.05em] bg-orange" aria-hidden />
    </span>
  );
}

export function Nav({ hidden: hiddenNav = [] }: { hidden?: string[] }) {
  const items = NAV.filter((n) => !hiddenNav.includes(n.href));
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const faded = hidden && !hover && !open;
  const { scrollY } = useScroll();
  const menuBtn = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 240 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  // Mobile menu: lock scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* The bar never moves. Scrolling down fades its contents away, leaving a clear pane of glass;
          scrolling up (or hovering, or tabbing into it) brings them back. */}
      <header
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocusCapture={() => setHover(true)}
        onBlurCapture={() => setHover(false)}
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-[background-color,border-color] duration-700 ease-out ${
          !scrolled && !open ? "border-transparent bg-transparent backdrop-blur-none"
          : faded ? "border-line bg-ink/10"
          : "border-line bg-ink/80"
        }`}
      >
        <nav aria-label="Primary" className={`wrap flex h-[var(--nav-h)] items-center justify-between transition-opacity duration-700 ease-out ${faded ? "pointer-events-none opacity-0" : "opacity-100"}`}>
          <Link href="/" className="text-[1.375rem] leading-none" aria-label="SAM — home">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-baseline gap-1.5 px-3 py-2 text-[0.8125rem] tracking-[0.01em] transition-colors ${
                      active ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-x-3 -bottom-px h-px bg-orange"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <button
            ref={menuBtn}
            type="button"
            className="t-meta flex items-center gap-2 py-2 text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
            <span className="relative block h-2 w-4" aria-hidden>
              <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1 -rotate-45" : "top-2"}`} />
            </span>
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--nav-h)] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="wrap mt-8 flex flex-1 flex-col">
              {[{ href: "/", label: "Home", index: "00" }, ...items].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b hairline"
                >
                  <Link
                    ref={i === 0 ? firstLink : undefined}
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-baseline justify-between py-4"
                  >
                    <span className="t-headline text-[2.4rem]">{item.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="wrap t-meta pb-8">Politics · Economics · Technology · Photography</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

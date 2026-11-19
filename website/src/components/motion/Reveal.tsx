"use client";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { createElement } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "section" | "li" | "article" | "header" | "p" | "span" };

/** Fades and lifts its content into view once, when it enters the viewport. */
export function Reveal({ children, delay = 0, y = 24, as = "div", ...rest }: Props) {
  const reduce = useReducedMotion();
  const Comp = (motion as unknown as Record<string, typeof motion.div>)[as];
  return createElement(
    Comp,
    {
      initial: reduce ? { opacity: 0 } : { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "0px 0px -12% 0px" },
      transition: { duration: reduce ? 0.2 : 1.1, ease: EASE, delay },
      ...rest,
    },
    children as React.ReactNode,
  );
}

/** Splits a line of text into words that rise in sequence — used for big headlines. */
export function SplitWords({ text, className, delay = 0, stagger = 0.06 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((w, i) => (
        <span key={i} aria-hidden className="-mx-[0.1em] -my-[0.18em] inline-block overflow-hidden px-[0.1em] py-[0.18em] align-top">
          <motion.span
            className="inline-block"
            initial={reduce ? { opacity: 0 } : { y: "105%" }}
            whileInView={reduce ? { opacity: 1 } : { y: "0%" }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

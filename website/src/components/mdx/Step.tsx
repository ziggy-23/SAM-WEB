"use client";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";

/**
 * A storytelling step: a block of text plus an optional element in the margin
 * (a chart, map, note…). When the step reaches the middle of the screen it
 * becomes "active": its text is at full strength and its margin element appears.
 * Steps the reader has moved past recede slightly — never enough to be unreadable.
 */
export function Step({ children, aside }: { children: React.ReactNode; aside?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const active = useInView(ref, { margin: "-38% 0px -38% 0px" });
  const seen = useInView(ref, { once: true, margin: "0px 0px -30% 0px" });
  const dim = !reduce && !active;

  return (
    <section ref={ref} className="grid-swiss relative py-10 md:py-16">
      <motion.div
        className="col-span-4 md:col-span-8 lg:col-span-6 lg:col-start-2 xl:col-span-6 xl:col-start-3"
        initial={false}
        animate={{ opacity: dim ? 0.38 : 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="prose-sam">{children}</div>
      </motion.div>
      {aside && (
        <div className="col-span-4 mt-8 md:col-span-6 md:col-start-2 lg:col-span-4 lg:col-start-9 lg:mt-0 xl:col-span-3 xl:col-start-10">
          <motion.div
            className="lg:sticky lg:top-[28vh]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
            animate={seen ? { opacity: active || reduce ? 1 : 0.45, x: 0 } : undefined}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {aside}
          </motion.div>
        </div>
      )}
    </section>
  );
}

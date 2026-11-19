"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { ContactSchema } from "@/lib/contact-schema";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const MESSAGES: Record<string, string> = {
  not_configured: "The contact form isn't connected to an email service yet.",
  rate_limited: "Too many messages in a short time — please try again in a few minutes.",
  send_failed: "The message couldn't be delivered. Please try again shortly.",
  network: "Network error — please check your connection and try again.",
};

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="t-eyebrow flex justify-between">
        {label}
        <AnimatePresence>
          {error && <motion.span id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="normal-case tracking-normal !text-orange" role="alert">{error}</motion.span>}
        </AnimatePresence>
      </label>
      {children}
      <span className={`absolute bottom-0 left-0 h-px w-full origin-left transition-transform duration-500 ${error ? "scale-x-100 bg-orange" : "scale-x-0 bg-text group-focus-within:scale-x-100"}`} aria-hidden />
    </div>
  );
}

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);

  const input = "mt-2 w-full border-b border-line-2 bg-transparent py-3 font-serif text-xl placeholder:text-faint focus:outline-none";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const payload = { ...data, startedAt: startedAt.current };
    const parsed = ContactSchema.safeParse(payload);
    if (!parsed.success) {
      const f = z.flattenError(parsed.error).fieldErrors;
      setErrors({ name: f.name?.[0], email: f.email?.[0], subject: f.subject?.[0], message: f.message?.[0] });
      const first = (["name", "email", "subject", "message"] as const).find((k) => f[k]);
      if (first) form.querySelector<HTMLElement>(`#c-${first}`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (res.ok) { setStatus("sent"); form.reset(); return; }
      if (json.error === "validation" && json.fields) {
        setErrors(Object.fromEntries(Object.entries(json.fields as Record<string, string[]>).map(([k, v]) => [k, v[0]])));
        setStatus("idle");
        return;
      }
      setErrorCode(json.error ?? "send_failed");
      setStatus("error");
    } catch {
      setErrorCode("network");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="border-t border-orange pt-8" role="status">
        <p className="t-display text-6xl">Thank you.</p>
        <p className="mt-4 text-muted">Your message is on its way. I&apos;ll reply as soon as I can.</p>
        <button type="button" onClick={() => setStatus("idle")} className="t-meta link-draw mt-6 text-text">Send another message</button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-10" aria-describedby={status === "error" ? "form-error" : undefined}>
      <div className="grid gap-10 md:grid-cols-2">
        <Field id="c-name" label="Name" error={errors.name}>
          <input id="c-name" name="name" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-error" : undefined} className={input} placeholder="Your name" />
        </Field>
        <Field id="c-email" label="Email" error={errors.email}>
          <input id="c-email" name="email" type="email" autoComplete="email" required aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-error" : undefined} className={input} placeholder="you@example.com" />
        </Field>
      </div>
      <Field id="c-subject" label="Subject" error={errors.subject}>
        <input id="c-subject" name="subject" required aria-invalid={!!errors.subject} aria-describedby={errors.subject ? "c-subject-error" : undefined} className={input} placeholder="What is this about?" />
      </Field>
      <Field id="c-message" label="Message" error={errors.message}>
        <textarea id="c-message" name="message" rows={6} required aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-error" : undefined} className={`${input} resize-y`} placeholder="Write as much or as little as you like." />
      </Field>
      {/* Honeypot — hidden from people and screen readers, tempting to bots. */}
      <div aria-hidden className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div id="form-error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="border-l-2 border-orange bg-ink-2 px-5 py-4 text-sm">
              <p>{MESSAGES[errorCode] ?? MESSAGES.send_failed}</p>
              {fallbackEmail && <p className="mt-1 text-muted">You can also write directly to <a className="link-draw text-text" href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" disabled={status === "sending"} className="group inline-flex items-center gap-4 border-b border-orange pb-2 text-xl disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send message"}
        <span className={`inline-block transition-transform duration-500 ${status === "sending" ? "animate-pulse" : "group-hover:translate-x-2"}`}>→</span>
      </button>
    </form>
  );
}

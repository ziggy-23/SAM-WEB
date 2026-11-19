import { NextResponse } from "next/server";
import { z } from "zod";
import { ContactSchema } from "@/lib/contact-schema";

/**
 * Contact form endpoint.
 * Sends the message with Resend (https://resend.com) using server-side
 * environment variables — the API key never reaches the browser.
 * If the variables are missing, it answers 503 so the form can tell the
 * visitor honestly that it is not connected yet.
 */
const hits = new Map<string, number[]>(); // best-effort, per server instance
const WINDOW_MS = 10 * 60 * 1000, MAX_PER_WINDOW = 5;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_json" }, { status: 400 }); }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation", fields: z.flattenError(parsed.error).fieldErrors }, { status: 422 });
  }
  const { name, email, subject, message, website, startedAt } = parsed.data;

  // Spam: honeypot filled, or submitted faster than a human could type → pretend success, send nothing.
  if (website || (startedAt && Date.now() - startedAt < 3000)) return NextResponse.json({ ok: true });

  // Spam: simple rate limit per IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `[SAM] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  }).catch(() => null);

  if (!res || !res.ok) return NextResponse.json({ error: "send_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}

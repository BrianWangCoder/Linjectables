import { NextResponse } from "next/server";
import { validateEnquiry } from "@/lib/validate";

export const runtime = "nodejs";

// naive in-memory rate limit (per serverless instance) – enough to blunt floods
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    message: String(body.message ?? ""),
  };

  // Spam protection 1: honeypot filled, or form submitted inhumanly fast → pretend success
  if (body.company || Number(body.elapsed ?? 0) < 2500) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many enquiries – please call us instead." }, { status: 429 });
  }

  const errors = validateEnquiry(data);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  // Spam protection 2 (optional): Cloudflare Turnstile
  if (process.env.TURNSTILE_SECRET_KEY) {
    const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY, response: String(body.turnstileToken ?? ""), remoteip: ip }),
    }).then((r) => r.json() as Promise<{ success: boolean }>).catch(() => ({ success: false }));
    if (!verify.success) return NextResponse.json({ error: "Please complete the spam check and try again." }, { status: 400 });
  }

  const page = String(body.page ?? "").slice(0, 200);
  const subject = `New website enquiry – ${data.name}`;
  const text = `Name: ${data.name}\nEmail: ${data.email}\nMobile: ${data.phone}\nPage: ${page}\n\n${data.message}`;
  const html = `<h2 style="font-family:Helvetica,Arial,sans-serif;font-weight:400">New website enquiry</h2>
<table style="font-family:Helvetica,Arial,sans-serif;font-size:14px">
<tr><td><b>Name</b></td><td>${esc(data.name)}</td></tr>
<tr><td><b>Email</b></td><td>${esc(data.email)}</td></tr>
<tr><td><b>Mobile</b></td><td>${esc(data.phone)}</td></tr>
<tr><td><b>Page</b></td><td>${esc(page)}</td></tr></table>
<p style="font-family:Helvetica,Arial,sans-serif;font-size:14px;white-space:pre-wrap">${esc(data.message)}</p>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[enquiry] RESEND_API_KEY not set – enquiry logged only:\n" + text);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM_EMAIL || "LINJECTABLES Website <onboarding@resend.dev>",
      to: [process.env.ENQUIRY_TO_EMAIL || "hello@linjectables.co.nz"],
      reply_to: data.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[enquiry] Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "We couldn't send your message right now. Please call or email us directly." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

"use client";

import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type FormEvent } from "react";
import { EASE } from "@/components/motion/Reveal";
import { CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/I18nProvider";

import { validateEnquiry as validate, type EnquiryErrors as Errors } from "@/lib/validate";

const TURNSTILE = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const fields = [
  { name: "name", type: "text", autoComplete: "name" },
  { name: "email", type: "email", autoComplete: "email" },
  { name: "phone", type: "tel", autoComplete: "tel" },
] as const;

export default function EnquiryForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const startedAt = useRef(Date.now());
  const { t } = useI18n();
  /** validation returns field keys; show them in the visitor's language */
  const translate = (errs: Errors): Errors =>
    Object.fromEntries(Object.keys(errs).map((k) => [k, t.form.errors[k as keyof typeof t.form.errors] ?? errs[k as keyof Errors]]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const v = validate(data);
    setErrors(translate(v));
    if (Object.keys(v).length) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(v)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          company: fd.get("company"), // honeypot
          elapsed: Date.now() - startedAt.current,
          turnstileToken: fd.get("cf-turnstile-response"),
          page: window.location.pathname,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.errors ? translate(json.errors) : { form: res.status === 429 ? t.form.errors.rate : res.status === 400 ? t.form.errors.captcha : t.form.errors.server });
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErrors({ form: t.form.errors.network });
      setStatus("error");
    }
  }

  const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } } };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} role="status" className="py-10">
            <span className={cn("grid h-14 w-14 place-items-center rounded-full border", tone === "dark" ? "border-white/40" : "border-ink/30")}>
              <CheckIcon />
            </span>
            <p className="display mt-6 text-3xl">{t.form.thanks}</p>
            <p className="mt-3 max-w-sm opacity-70">{t.form.thanksText}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            className="grid gap-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            exit={{ opacity: 0, y: -10 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          >
            {/* honeypot – hidden from people, irresistible to bots */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            {fields.map((f) => (
              <motion.div key={f.name} variants={item}>
                <label className="sr-only" htmlFor={`enq-${f.name}`}>{t.form[f.name]} ({t.form.required})</label>
                <input
                  id={`enq-${f.name}`}
                  name={f.name}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  placeholder={`${t.form[f.name]}*`}
                  aria-invalid={!!errors[f.name]}
                  aria-describedby={errors[f.name] ? `enq-${f.name}-err` : undefined}
                  className="field"
                  required
                />
                <FieldError id={`enq-${f.name}-err`} msg={errors[f.name]} />
              </motion.div>
            ))}
            <motion.div variants={item}>
              <label className="sr-only" htmlFor="enq-message">{t.form.message} ({t.form.required})</label>
              <textarea
                id="enq-message"
                name="message"
                rows={3}
                placeholder={`${t.form.message}*`}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "enq-message-err" : undefined}
                className="field resize-none"
                required
              />
              <FieldError id="enq-message-err" msg={errors.message} />
            </motion.div>

            {TURNSTILE && (
              <>
                <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
                <div className="cf-turnstile" data-sitekey={TURNSTILE} data-theme={tone === "dark" ? "dark" : "light"} />
              </>
            )}

            <motion.div variants={item} className="flex flex-wrap items-center gap-6 pt-2">
              <button type="submit" disabled={status === "sending"} className={cn("btn min-w-[150px] disabled:opacity-60", tone === "dark" ? "btn-light" : "btn-dark")}>
                {status === "sending" ? t.form.sending : t.form.send}
              </button>
              <p className="text-xs opacity-60">{t.form.note}</p>
            </motion.div>
            {errors.form && (
              <p role="alert" className="text-sm text-red-700">{errors.form}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p id={id} role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2 text-xs text-red-700">
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

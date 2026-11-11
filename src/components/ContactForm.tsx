"use client";

import { useState } from "react";
import { site } from "@/content/site";
import Needed from "./Needed";

/**
 * "Send Us a Message" form (same fields as the old site: Name, Email, message).
 *
 * TODO (mailing): For now, submitting opens the visitor's email app with the
 * message prefilled. Later, swap `handleSubmit` to POST to a Cloudflare Pages
 * Function (functions/api/contact.ts) that sends the email.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (!site.email) {
    return <Needed className="mt-6">The form needs the parish email address before it can send.</Needed>;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = `Website message from ${f.get("name")}`;
    const body = `Name: ${f.get("name")}\nEmail: ${f.get("email")}\n\n${f.get("message") ?? ""}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const input =
    "mt-1 w-full border border-gold/40 paper px-4 py-3 text-ink outline-none focus:border-oxblood focus:ring-1 focus:ring-oxblood";

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-ink-soft">
          Name
          <input name="name" required className={input} autoComplete="name" />
        </label>
        <label className="block text-sm font-semibold text-ink-soft">
          Email
          <input name="email" type="email" required className={input} autoComplete="email" />
        </label>
      </div>
      <label className="block text-sm font-semibold text-ink-soft">
        Message
        <textarea name="message" required rows={5} className={input} />
      </label>
      <button className="bg-oxblood px-7 py-3 text-xs font-semibold uppercase tracking-wider text-parchment hover:bg-oxblood-dark">
        Send
      </button>
      {sent && <p className="text-sm text-stone">Your email app should open with your message ready to send.</p>}
    </form>
  );
}

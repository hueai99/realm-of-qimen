"use client";
import { useState } from "react";

export default function EmailSummaryCard({ reportId, initialEmail, childName, token }: { reportId: string; initialEmail: string; childName: string; token: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  async function send() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/reports/${reportId}/email-summary`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, marketing_consent: consent, token }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not send the email yet.");
      setEmail(result.email); setSent(true); setMessage(`Sent to ${result.email}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "We could not send the email yet."); }
    finally { setBusy(false); }
  }
  return <section className="mt-12 border border-[#d7cbbd] bg-[#fffaf0] p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8">
    <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b3c2b]">Keep a copy</p><h2 className="mt-2 text-2xl">Email {childName}&apos;s summary</h2><p className="mt-2 text-sm leading-6 text-[#665a50]">Check the address before sending so the summary reaches the right inbox.</p></div>
    <button type="button" onClick={() => { setOpen(true); setMessage(""); }} className="mt-5 shrink-0 bg-[#9b3c2b] px-6 py-3 font-semibold text-white sm:mt-0">Email me this summary</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211b16]/75 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="email-summary-title">
      <div className="w-full max-w-lg bg-[#fffaf0] p-7 shadow-2xl sm:p-9">
        <h2 id="email-summary-title" className="text-3xl">Check your email</h2>
        <p className="mt-3 leading-7 text-[#665a50]">We will send {childName}&apos;s Bazi summary to this address. Correct it below if needed.</p>
        <label className="mt-6 block text-sm">Email address<input type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setSent(false); setMessage(""); }} className="mt-2 w-full border border-[#c9bcad] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#9b3c2b]" /></label>
        <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#9b3c2b]" /><span>Keep me updated with helpful parenting insights and report options.</span></label>
        {message && <p role="status" className={`mt-5 text-sm ${sent ? "text-[#496548]" : "text-[#8a4b3c]"}`}>{message}</p>}
        <div className="mt-7 flex flex-wrap gap-3"><button type="button" disabled={busy || sent || !email} onClick={() => void send()} className="bg-[#9b3c2b] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Sending…" : sent ? "Email sent" : "Confirm and send"}</button><button type="button" onClick={() => setOpen(false)} className="border border-[#c9bcad] px-6 py-3">{sent ? "Done" : "Cancel"}</button></div>
      </div>
    </div>}
  </section>;
}

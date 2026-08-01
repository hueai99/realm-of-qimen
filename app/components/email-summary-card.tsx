"use client";
import { useState } from "react";

export default function EmailSummaryCard({ reportId, initialEmail, token }: { reportId: string; initialEmail: string; token: string }) {
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
      setEmail(result.email); setSent(true); setOpen(false);
    } catch (error) { setMessage(error instanceof Error ? error.message : "We could not send the email yet."); }
    finally { setBusy(false); }
  }
  return <div className="mt-10 flex justify-end">
    <button type="button" disabled={sent} onClick={() => { setOpen(true); setMessage(""); }} className="bg-[#9b3c2b] px-6 py-3 font-semibold text-white disabled:opacity-60">{sent ? "Email sent" : "Email this summary"}</button>
    {open && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#211b16]/75 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="email-summary-title">
      <div className="w-full max-w-lg bg-[#fffaf0] p-7 shadow-2xl sm:p-9">
        <h2 id="email-summary-title" className="text-3xl">Email this summary</h2>
        <label className="mt-6 block text-sm">Email address<input type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setSent(false); setMessage(""); }} className="mt-2 w-full border border-[#c9bcad] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#9b3c2b]" /></label>
        <label className="mt-5 flex items-start gap-3 text-sm leading-6"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 accent-[#9b3c2b]" /><span>Keep me updated with helpful parenting insights and report options.</span></label>
        {message && <p role="status" className={`mt-5 text-sm ${sent ? "text-[#496548]" : "text-[#8a4b3c]"}`}>{message}</p>}
        <div className="mt-7 flex flex-wrap gap-3"><button type="button" disabled={busy || sent || !email} onClick={() => void send()} className="bg-[#9b3c2b] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Sending..." : sent ? "Email sent" : "Confirm and send"}</button><button type="button" onClick={() => setOpen(false)} className="border border-[#c9bcad] px-6 py-3">{sent ? "Done" : "Cancel"}</button></div>
      </div>
    </div>}
  </div>;
}

"use client";

import { useState } from "react";

const choices = [
  { value: "very_close", label: "Very closely" },
  { value: "partly", label: "Some parts felt right" },
  { value: "not_accurate", label: "It did not feel accurate" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

type Props = { reportId: string; childName: string; initialEmail: string; emailToken: string };

export default function ReportFeedback({ reportId, childName, initialEmail, emailToken }: Props) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [interestedInMore, setInterestedInMore] = useState(false);
  const [emailCopy, setEmailCopy] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function save(confirmedEmail?: string) {
    setBusy(true); setError("");
    try {
      const feedbackResponse = await fetch(`/api/reports/${reportId}/feedback`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, comment, interested_in_more: interestedInMore, email_summary_requested: emailCopy, email: confirmedEmail }),
      });
      const feedbackResult = await feedbackResponse.json();
      if (!feedbackResponse.ok) throw new Error(feedbackResult.error ?? "We could not save your feedback yet.");
      if (emailCopy) {
        const emailResponse = await fetch(`/api/reports/${reportId}/email-summary`, {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: confirmedEmail, marketing_consent: interestedInMore, token: emailToken }),
        });
        const emailResult = await emailResponse.json();
        if (!emailResponse.ok) throw new Error(emailResult.error ?? "Your feedback was saved, but the summary could not be emailed yet.");
      }
      setConfirmEmail(false); setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not save your feedback yet.");
    } finally { setBusy(false); }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) { setError("Please choose the answer that feels closest."); return; }
    if (interestedInMore || emailCopy) { setConfirmEmail(true); setError(""); return; }
    void save();
  }

  if (submitted) return <section className="border border-[#b9dfe4] bg-[#ffffff] p-6 text-center sm:p-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#007789]">Thank you</p><h2 className="mt-2 text-2xl">Your feedback helps us improve.</h2>{emailCopy && <p className="mt-2 text-[#4e5b6f]">Your request for an emailed copy has been received.</p>}</section>;

  return <section className="border border-[#b9dfe4] bg-[#ffffff] p-6 sm:p-8">
    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#007789]">We would value your feedback</p>
    <h2 className="mt-2 text-3xl">How closely did this summary reflect what you see in {childName}?</h2>
    <form onSubmit={submit} className="mt-6">
      <fieldset className="grid gap-3 sm:grid-cols-2"><legend className="sr-only">Summary accuracy</legend>{choices.map(choice=><label key={choice.value} className={`flex cursor-pointer items-center gap-3 border p-4 transition ${rating===choice.value?"border-[#007789] bg-[#eaf7f9]":"border-[#b9dfe4] bg-[#ffffff]"}`}><input type="radio" name="accuracy" value={choice.value} checked={rating===choice.value} onChange={()=>{setRating(choice.value);setError("")}} className="h-4 w-4 accent-[#007789]"/><span>{choice.label}</span></label>)}</fieldset>
      <label className="mt-6 block">Anything you would like us to know?<textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={1000} rows={4} placeholder="Tell us what felt accurate, unclear, or missing." className="mt-2 w-full resize-y border border-[#b9dfe4] bg-[#ffffff] px-4 py-3 outline-none focus:border-[#007789]"/></label>
      <div className="mt-5 space-y-4 border-t border-[#d2e9ec] pt-5 leading-7">
        {emailToken&&<label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={emailCopy} onChange={e=>setEmailCopy(e.target.checked)} className="mt-1 h-4 w-4 accent-[#007789]"/><span>Email me a copy of this Bazi summary.</span></label>}
        <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" checked={interestedInMore} onChange={e=>setInterestedInMore(e.target.checked)} className="mt-1 h-4 w-4 accent-[#007789]"/><span>I would like to learn more about what Bazi can reveal about my child.</span></label>
      </div>
      {error&&!confirmEmail&&<p role="alert" className="mt-4 text-sm text-[#8a3f45]">{error}</p>}
      <button type="submit" disabled={busy} className="mt-5 bg-[#007789] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy?"Sending...":"Send feedback"}</button>
    </form>
    {confirmEmail&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#004f5b]/75 px-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-email-title"><div className="w-full max-w-lg bg-[#ffffff] p-7 shadow-2xl sm:p-9"><h2 id="confirm-email-title" className="text-3xl">Confirm your email</h2><p className="mt-3 leading-7 text-[#4e5b6f]">Please check that this is the best email address to use.</p><label className="mt-6 block text-sm">Email address<input type="email" required value={email} onChange={e=>{setEmail(e.target.value);setError("")}} className="mt-2 w-full border border-[#9bcbd2] bg-[#ffffff] px-4 py-3 outline-none focus:border-[#007789]"/></label>{error&&<p role="alert" className="mt-5 text-sm text-[#8a3f45]">{error}</p>}<div className="mt-7 flex gap-3"><button type="button" disabled={busy||!email} onClick={()=>void save(email)} className="bg-[#007789] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy?"Sending...":"Confirm and continue"}</button><button type="button" disabled={busy} onClick={()=>{setConfirmEmail(false);setError("")}} className="border border-[#9bcbd2] px-6 py-3">Back</button></div></div></div>}
  </section>;
}

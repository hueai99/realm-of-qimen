"use client";

import { useState } from "react";

const choices = [
  { value: "very_close", label: "Very closely" },
  { value: "partly", label: "Some parts felt right" },
  { value: "not_accurate", label: "It did not feel accurate" },
  { value: "unsure", label: "I am not sure yet" },
] as const;

export default function ReportFeedback({ reportId, childName }: { reportId: string; childName: string }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) { setError("Please choose the answer that feels closest."); return; }
    setBusy(true); setError("");
    try {
      const response = await fetch(`/api/reports/${reportId}/feedback`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "We could not save your feedback yet.");
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "We could not save your feedback yet.");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) return <section className="border border-[#d7cbbd] bg-[#fffaf0] p-6 text-center sm:p-8">
    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b3c2b]">Thank you</p>
    <h2 className="mt-2 text-2xl">Your feedback helps us improve.</h2>
  </section>;

  return <section className="border border-[#d7cbbd] bg-[#fffaf0] p-6 sm:p-8">
    <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b3c2b]">We would value your feedback</p>
    <h2 className="mt-2 text-3xl">How closely did this summary reflect what you see in {childName}?</h2>
    <form onSubmit={(event) => void submit(event)} className="mt-6">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Summary accuracy</legend>
        {choices.map((choice) => <label key={choice.value} className={`flex cursor-pointer items-center gap-3 border p-4 transition ${rating === choice.value ? "border-[#9b3c2b] bg-[#f7eee3]" : "border-[#d7cbbd] bg-[#fffdf8]"}`}>
          <input type="radio" name="accuracy" value={choice.value} checked={rating === choice.value} onChange={() => { setRating(choice.value); setError(""); }} className="h-4 w-4 accent-[#9b3c2b]" />
          <span>{choice.label}</span>
        </label>)}
      </fieldset>
      <label className="mt-6 block">Anything you would like us to know?
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={1000} rows={4} placeholder="Tell us what felt accurate, unclear, or missing." className="mt-2 w-full resize-y border border-[#d7cbbd] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#9b3c2b]" />
      </label>
      {error && <p role="alert" className="mt-4 text-sm text-[#8a4b3c]">{error}</p>}
      <button type="submit" disabled={busy} className="mt-5 bg-[#9b3c2b] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? "Sending..." : "Send feedback"}</button>
    </form>
  </section>;
}

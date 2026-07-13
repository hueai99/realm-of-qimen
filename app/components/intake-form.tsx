"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntakeForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/generate-report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      const raw = await response.text();
      const result = raw ? JSON.parse(raw) : {};
      if (!response.ok) throw new Error(result.error ?? "Could not create your report");
      router.push(`/report/${result.report_id}`);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong"); setBusy(false); }
  }
  const cls = "mt-2 w-full rounded-sm border border-[#c9bcad] bg-[#fffdf8] px-4 py-3 outline-none focus:border-[#9b3c2b]";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const thisYear = new Date().getFullYear();
  return <form action={submit} className="rounded-sm border border-[#d7cbbd] bg-[#fffaf0] p-6 shadow-[0_20px_50px_rgba(71,49,32,.09)] sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[.25em] text-[#9b3c2b]">Create a reading</p><h2 className="mb-7 mt-2 text-3xl">Child details</h2>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Child&apos;s name<input required name="subject_name" maxLength={80} className={cls} /></label>
      <label className="text-sm sm:col-span-2">Parent&apos;s email<input required type="email" name="email" className={cls} /></label>
      <fieldset className="text-sm"><legend>Date of birth</legend><div className="grid grid-cols-[.7fr_1fr_1.1fr] gap-2"><select required name="birth_day" defaultValue="" aria-label="Birth day" className={cls}><option value="" disabled>DD</option>{Array.from({length:31},(_,i)=><option key={i+1} value={String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")}</option>)}</select><select required name="birth_month" defaultValue="" aria-label="Birth month" className={cls}><option value="" disabled>MMM</option>{months.map((month,i)=><option key={month} value={String(i+1).padStart(2,"0")}>{month}</option>)}</select><select required name="birth_year" defaultValue="" aria-label="Birth year" className={cls}><option value="" disabled>YYYY</option>{Array.from({length:100},(_,i)=>thisYear-i).map(year=><option key={year} value={year}>{year}</option>)}</select></div></fieldset>
      <label className="text-sm">Local time of birth<input required type="time" name="birth_time" className={cls} /></label>
      <label className="text-sm sm:col-span-2">City and country of birth<input required name="birth_place" maxLength={120} className={cls} placeholder="e.g. Kuala Lumpur, Malaysia" /></label>
      <label className="text-sm">Gender<select required name="gender" defaultValue="" className={cls}><option value="" disabled>Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
      <input type="hidden" name="question_type" value="child_potential" />
      <label className="text-sm sm:col-span-2">What would you most like help with? <span className="text-[#877b70]">(optional)</span><textarea name="parenting_concern" maxLength={600} rows={4} className={cls} /></label>
    </div>
    {busy && <div className="mt-6 space-y-3 border-y border-[#d7cbbd] py-5 text-sm leading-6 text-[#665a50]" aria-live="polite">
      <p className="font-semibold text-[#211b16]">Preparing a thoughtful reflection…</p>
      <p><strong>A reflection, not a prediction.</strong> Bazi is a traditional way of reflecting on temperament and natural tendencies. It is not a religion, fixed destiny, or replacement for your values and knowledge of your child.</p>
      <p><strong>Why some details may not fit.</strong> No chart captures a whole person. Birth-time accuracy, age, environment, experiences, and personal choices all matter. Keep what feels useful and set aside what does not.</p>
    </div>}
    {error && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <button disabled={busy} className="mt-7 w-full bg-[#9b3c2b] px-5 py-4 font-semibold text-white disabled:opacity-60">{busy ? "Preparing the personality blueprint…" : "Create the personality blueprint"}</button>
  </form>;
}

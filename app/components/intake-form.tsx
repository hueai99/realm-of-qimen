"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IntakeForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [readyReportId, setReadyReportId] = useState("");
  async function submit(formData: FormData) {
    const enteredName = String(formData.get("subject_name") ?? "").trim();
    const childName = enteredName === enteredName.toLowerCase() ? enteredName.replace(/[A-Za-z]/, (letter) => letter.toUpperCase()) : enteredName;
    setSubmittedName(childName); setReadyReportId(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/generate-report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      const raw = await response.text();
      const result = raw ? JSON.parse(raw) : {};
      if (!response.ok) throw new Error(result.error ?? "Could not create your report");
      setReadyReportId(result.report_id); setBusy(false);
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
      <label className="text-sm sm:col-span-2">Parent&apos;s mobile number<input required type="tel" name="phone" inputMode="tel" maxLength={30} className={cls} placeholder="e.g. +65 9123 4567" /></label>
      <fieldset className="text-sm"><legend>Date of birth</legend><div className="grid grid-cols-[.7fr_1fr_1.1fr] gap-2"><select required name="birth_day" defaultValue="" aria-label="Birth day" className={cls}><option value="" disabled>DD</option>{Array.from({length:31},(_,i)=><option key={i+1} value={String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")}</option>)}</select><select required name="birth_month" defaultValue="" aria-label="Birth month" className={cls}><option value="" disabled>MMM</option>{months.map((month,i)=><option key={month} value={String(i+1).padStart(2,"0")}>{month}</option>)}</select><select required name="birth_year" defaultValue="" aria-label="Birth year" className={cls}><option value="" disabled>YYYY</option>{Array.from({length:100},(_,i)=>thisYear-i).map(year=><option key={year} value={year}>{year}</option>)}</select></div></fieldset>
      <label className="text-sm">Local time of birth<input required type="time" name="birth_time" className={cls} /></label>
      <label className="text-sm sm:col-span-2">City and country of birth<input required name="birth_place" maxLength={120} className={cls} placeholder="e.g. Kuala Lumpur, Malaysia" /></label>
      <label className="text-sm">Gender<select required name="gender" defaultValue="" className={cls}><option value="" disabled>Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
      <input type="hidden" name="question_type" value="child_potential" />
      <label className="text-sm sm:col-span-2">What would you most like help with? <span className="text-[#877b70]">(optional)</span><textarea name="parenting_concern" maxLength={600} rows={4} className={cls} /></label>
    </div>
    {(busy || readyReportId) && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#211b16]/75 px-5 py-8 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="w-full max-w-2xl rounded-sm bg-[#fffaf0] p-7 shadow-2xl sm:p-10">
        <div className="text-center">
          {busy && <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#d7cbbd] border-t-[#9b3c2b]" aria-hidden="true" />}
          <p className={`${busy ? "mt-6" : ""} text-xs font-bold uppercase tracking-[.22em] text-[#9b3c2b]`}>{busy ? "Your details have been received" : "Report prepared"}</p>
          <h2 className="mt-3 text-3xl">{busy ? `Preparing ${submittedName}'s personality summary…` : `${submittedName}'s personality summary is ready.`}</h2>
          {busy && <p className="mt-3 leading-7 text-[#665a50]">Please keep this page open while the report is prepared.</p>}
          <div className="mt-7 space-y-4 border-t border-[#d7cbbd] pt-6 text-left leading-7 text-[#665a50]">
            <p>Bazi&apos;s Four Pillars system took shape in China more than 1,000 years ago and is still used today to understand a person&apos;s natural patterns and tendencies.</p>
            <p>A Bazi chart turns the year, month, day, and hour of birth into eight Chinese characters. Each pair offers a different view of personality, emotions, relationships, learning, and growth.</p>
            <p>A Bazi chart may not describe everything seen in a child today. Age, upbringing, experiences, surroundings, and personal choices all influence how these qualities appear. Bazi offers another way to understand a child—not a fixed description of who he or she must become.</p>
          </div>
          <button type="button" disabled={busy} onClick={() => readyReportId && router.push(`/report/${readyReportId}`)} className="mt-7 bg-[#9b3c2b] px-8 py-4 font-semibold text-white disabled:cursor-wait disabled:bg-[#b9afa5]">{busy ? "Preparing report…" : "Click to read"}</button>
        </div>
      </div>
    </div>}
    {error && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <button disabled={busy} className="mt-7 w-full bg-[#9b3c2b] px-5 py-4 font-semibold text-white disabled:opacity-60">{busy ? "Preparing the personality blueprint…" : "Create the personality blueprint"}</button>
  </form>;
}

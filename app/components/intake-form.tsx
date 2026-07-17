"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const countries = [
  ["Singapore", "+65"], ["Malaysia", "+60"], ["Indonesia", "+62"], ["Thailand", "+66"],
  ["Philippines", "+63"], ["Vietnam", "+84"], ["Brunei", "+673"], ["China", "+86"],
  ["Hong Kong", "+852"], ["Taiwan", "+886"], ["Japan", "+81"], ["South Korea", "+82"],
  ["India", "+91"], ["Australia", "+61"], ["New Zealand", "+64"], ["United Kingdom", "+44"],
  ["United States", "+1"], ["Canada", "+1"], ["United Arab Emirates", "+971"], ["Other", "+"],
] as const;

export default function IntakeForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [readyReportId, setReadyReportId] = useState("");
  const [birthCountry, setBirthCountry] = useState("Singapore");
  const [phoneCode, setPhoneCode] = useState("Singapore|+65");
  async function submit(formData: FormData) {
    const enteredName = String(formData.get("subject_name") ?? "").trim();
    const enteredPhone = String(formData.get("phone_number") ?? "").trim();
    if (!/^[\d\s()-]{6,24}$/.test(enteredPhone)) { setError("Please check your handphone number."); return; }
    const year = Number(formData.get("birth_year")); const month = Number(formData.get("birth_month")); const day = Number(formData.get("birth_day"));
    const enteredDate = new Date(Date.UTC(year, month - 1, day));
    if (enteredDate.getUTCFullYear() !== year || enteredDate.getUTCMonth() !== month - 1 || enteredDate.getUTCDate() !== day) { setError("Please enter a valid date of birth."); return; }
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
  return <form onInput={() => error && setError("")} onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="rounded-sm border border-[#d7cbbd] bg-[#fffaf0] p-6 shadow-[0_20px_50px_rgba(71,49,32,.09)] sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[.25em] text-[#9b3c2b]">Create a reading</p><h2 className="mb-7 mt-2 text-3xl">Child details</h2>
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Child&apos;s name<input required name="subject_name" maxLength={80} className={cls} /></label>
      <label className="text-sm sm:col-span-2">Parent&apos;s name<input required name="parent_name" maxLength={80} className={cls} /></label>
      <label className="text-sm sm:col-span-2">Parent&apos;s email<input required type="email" name="email" className={cls} /></label>
      <fieldset className="text-sm sm:col-span-2"><legend>Parent&apos;s mobile number</legend><div className="grid grid-cols-[8.5rem_1fr] gap-2"><select required name="phone_code" value={phoneCode} onChange={(event) => setPhoneCode(event.target.value)} aria-label="Mobile country code" className={cls}>{countries.map(([country, code]) => <option key={`${country}-${code}`} value={`${country}|${code}`}>{country} {code}</option>)}</select><input required type="tel" name="phone_number" inputMode="tel" minLength={6} maxLength={24} pattern="[0-9 ()-]{6,24}" title="Please check your handphone number." aria-label="Mobile number" className={cls} placeholder="9123 4567" onInvalid={(event) => event.currentTarget.setCustomValidity("Please check your handphone number.")} onInput={(event) => event.currentTarget.setCustomValidity("")} /></div></fieldset>
      <fieldset className="text-sm"><legend>Date of birth</legend><div className="grid grid-cols-[.7fr_1fr_1.1fr] gap-2"><select required name="birth_day" defaultValue="" aria-label="Birth day" className={cls}><option value="" disabled>DD</option>{Array.from({length:31},(_,i)=><option key={i+1} value={String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")}</option>)}</select><select required name="birth_month" defaultValue="" aria-label="Birth month" className={cls}><option value="" disabled>MMM</option>{months.map((month,i)=><option key={month} value={String(i+1).padStart(2,"0")}>{month}</option>)}</select><select required name="birth_year" defaultValue="" aria-label="Birth year" className={cls}><option value="" disabled>YYYY</option>{Array.from({length:100},(_,i)=>thisYear-i).map(year=><option key={year} value={year}>{year}</option>)}</select></div></fieldset>
      <label className="text-sm">Local time of birth<input required type="time" name="birth_time" className={cls} /></label>
      <label className="text-sm">City of birth<input required name="birth_city" maxLength={80} className={cls} placeholder="e.g. Singapore" /></label>
      <label className="text-sm">Country of birth<select required name="birth_country" value={birthCountry} onChange={(event) => setBirthCountry(event.target.value)} className={cls}>{countries.map(([country]) => <option key={country} value={country}>{country}</option>)}</select></label>
      <label className="text-sm">Gender<select required name="gender" defaultValue="" className={cls}><option value="" disabled>Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
      <input type="hidden" name="question_type" value="child_potential" />
      <label className="text-sm sm:col-span-2">Is there anything you would like to understand better about your child? <span className="text-[#877b70]">(optional)</span><textarea name="parenting_concern" maxLength={600} rows={4} className={cls} placeholder="For example: managing exam stress, building confidence, or finding ways to connect." /></label>
    </div>
    {(busy || readyReportId) && <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#211b16]/75 px-5 py-8 backdrop-blur-sm" role="status" aria-live="polite">
      <div className="w-full max-w-2xl rounded-sm bg-[#fffaf0] p-7 shadow-2xl sm:p-10">
        <div>
          <div className="mb-7 border-b border-[#d7cbbd] pb-6 text-center">
            {busy && <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d7cbbd] border-t-[#9b3c2b]" aria-hidden="true" />}
            <p className={`${busy ? "mt-4" : ""} text-xs font-bold uppercase tracking-[.22em] text-[#9b3c2b]`}>{busy ? "Preparing report" : "Report is now ready"}</p>
            <h2 className="mt-2 text-2xl">{busy ? `Preparing ${submittedName}'s personality summary…` : `${submittedName}'s personality summary is ready.`}</h2>
            <button type="button" disabled={busy} onClick={() => readyReportId && router.push(`/report/${readyReportId}`)} className="mt-5 bg-[#9b3c2b] px-8 py-4 font-semibold text-white disabled:cursor-wait disabled:bg-[#b9afa5]">{busy ? "Preparing report…" : "Click to read"}</button>
          </div>
          <div className="space-y-4 text-left leading-7 text-[#665a50]">
            <p>Bazi is a traditional Chinese system practised for more than 1,000 years. It uses the year, month, day, and hour of birth to form four pillars. Each pillar contains two Chinese characters, creating the eight characters known as Bazi. Together, the four pillars offer insights into a person&apos;s natural qualities, emotions, relationships, learning, and growth.</p>
            <p>A Bazi chart may not describe everything seen in a child today. Age, upbringing, experiences, surroundings, and personal choices all influence how these qualities appear. Bazi offers another way to understand a child—not a fixed description of who he or she must become.</p>
          </div>
          <SampleBaziChart />
        </div>
      </div>
    </div>}
    {error && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <button disabled={busy} className="mt-7 w-full bg-[#9b3c2b] px-5 py-4 font-semibold text-white disabled:opacity-60">{busy ? "Preparing the personality blueprint…" : "Create the personality blueprint"}</button>
  </form>;
}

function SampleBaziChart() {
  const sample = [["Hour", "辛", "巳"], ["Day", "庚", "辰"], ["Month", "甲", "午"], ["Year", "丙", "戌"]];
  return <figure className="mt-6"><figcaption className="mb-2 text-center text-xs font-bold uppercase tracking-[.18em] text-[#9b3c2b]">Sample Bazi chart</figcaption><div className="mb-1 grid grid-cols-4 text-center"><span /><span className="text-xs font-bold text-[#9b3c2b]">Day Master ↓</span><span /><span /></div><div className="grid grid-cols-4 gap-px overflow-hidden border border-[#d7cbbd] bg-[#d7cbbd]">{sample.map(([label, stem, branch]) => <div key={label} className="bg-[#fffdf8] px-2 py-3 text-center"><p className="text-[10px] uppercase tracking-wider text-[#877b70]">{label}</p><p className="mt-2 flex h-10 items-center justify-center text-2xl">{label === "Day" ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#9b3c2b] text-white ring-2 ring-[#f1d8ce]">{stem}</span> : stem}</p><p className="mt-1 text-2xl">{branch}</p></div>)}</div></figure>;
}

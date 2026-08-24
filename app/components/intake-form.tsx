"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const countries = [
  ["Singapore", "+65"], ["Malaysia", "+60"], ["Indonesia", "+62"], ["Thailand", "+66"],
  ["Philippines", "+63"], ["Vietnam", "+84"], ["Brunei", "+673"], ["China", "+86"],
  ["Hong Kong", "+852"], ["Taiwan", "+886"], ["Japan", "+81"], ["South Korea", "+82"],
  ["India", "+91"], ["Australia", "+61"], ["New Zealand", "+64"], ["United Kingdom", "+44"],
  ["United States", "+1"], ["Canada", "+1"], ["United Arab Emirates", "+971"], ["Other", "+"],
] as const;

export default function IntakeForm() {
  const router = useRouter();
  const [readingFor, setReadingFor] = useState<"child" | "self" | null>(null);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [readyReportId, setReadyReportId] = useState("");
  const [emailActionToken, setEmailActionToken] = useState("");
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
    setSubmittedName(childName); setReadyReportId(""); setEmailActionToken(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/generate-report", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData.entries())) });
      const raw = await response.text();
      const result = raw ? JSON.parse(raw) : {};
      if (!response.ok) throw new Error(result.error ?? "Could not create your report");
      setReadyReportId(result.report_id); setEmailActionToken(result.email_action_token ?? ""); setBusy(false);
    } catch (e) { setError(e instanceof Error ? e.message : "Something went wrong"); setBusy(false); }
  }
  const cls = "mt-2 w-full rounded-sm border border-[var(--border)] bg-[var(--card)] px-4 py-3 outline-none transition focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal-soft)]";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const thisYear = new Date().getFullYear();
  function moveToNextStep(form: HTMLFormElement) {
    const currentPanel = form.querySelector<HTMLElement>(`[data-step="${step}"]`);
    const fields = Array.from(currentPanel?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") ?? []);
    const invalidField = fields.find((field) => !field.checkValidity());
    if (invalidField) { invalidField.reportValidity(); return; }
    setError("");
    setStep((current) => Math.min(3, current + 1));
  }
  return <form onInput={() => error && setError("")} onSubmit={(event) => { event.preventDefault(); void submit(new FormData(event.currentTarget)); }} className="rounded-sm border border-[var(--border)] bg-[var(--card)] p-6 shadow-[0_20px_50px_rgba(71,49,32,.08)] sm:p-9">
    <p className="text-xs font-semibold uppercase tracking-[.25em] text-[var(--teal-dark)]">Create a reading</p>
    {!readingFor && <section className="mt-5">
      <h2 className="text-2xl sm:text-[1.75rem]">Who is this reading for?</h2>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => setReadingFor("child")} className="border border-[var(--teal)] bg-[var(--teal-soft)] p-5 text-left transition hover:bg-[var(--card)]">
          <span className="block text-xl font-semibold text-[var(--teal-dark)]">My child</span>
          <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">Create a child&apos;s Bazi personality summary.</span>
        </button>
        <button type="button" onClick={() => setReadingFor("self")} className="border border-[var(--border)] p-5 text-left transition hover:border-[var(--teal)]">
          <span className="block text-xl font-semibold text-[var(--teal-dark)]">Myself</span>
          <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">Coming soon</span>
        </button>
      </div>
    </section>}
    {readingFor === "self" && <section className="mt-7 border-l-2 border-[var(--teal)] bg-[var(--teal-soft)] p-5">
      <h2 className="text-2xl">Coming soon</h2>
      <button type="button" onClick={() => setReadingFor(null)} className="mt-5 font-semibold text-[var(--teal-dark)] underline underline-offset-4">Choose another option</button>
    </section>}
    {readingFor === "child" && <>
    <div className="mb-7 mt-5" aria-label={`Step ${step} of 3`}>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-[var(--muted)]"><span>Step {step} of 3 · {step === 1 ? "About your child" : step === 2 ? "About you" : "One last step"}</span><button type="button" onClick={() => { setReadingFor(null); setStep(1); setError(""); }} className="shrink-0 text-[var(--teal-dark)] underline underline-offset-2">Change reading</button></div>
      <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden="true">{[1, 2, 3].map((number) => <span key={number} className={`h-1.5 rounded-full ${number <= step ? "bg-[var(--teal)]" : "bg-[var(--border)]"}`} />)}</div>
    </div>
    <section data-step="1" className={step === 1 ? "block" : "hidden"}>
      <h2 className="mb-2 text-2xl sm:text-[1.75rem]">Tell us about your child</h2>
      <p className="mb-7 text-sm leading-6 text-[var(--muted)]">These birth details are used to prepare the Bazi chart.</p>
      <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Child&apos;s name<input required name="subject_name" maxLength={80} className={cls} /></label>
      <fieldset className="text-sm sm:col-span-2"><legend>Date of birth</legend><div className="grid grid-cols-3 gap-2"><select required name="birth_day" defaultValue="" aria-label="Birth day" className={cls} style={{paddingLeft:10,paddingRight:8}}><option value="" disabled>DD</option>{Array.from({length:31},(_,i)=><option key={i+1} value={String(i+1).padStart(2,"0")}>{String(i+1).padStart(2,"0")}</option>)}</select><select required name="birth_month" defaultValue="" aria-label="Birth month" className={cls} style={{paddingLeft:10,paddingRight:8}}><option value="" disabled>MMM</option>{months.map((month,i)=><option key={month} value={String(i+1).padStart(2,"0")}>{month}</option>)}</select><select required name="birth_year" defaultValue="" aria-label="Birth year" className={cls} style={{paddingLeft:10,paddingRight:8}}><option value="" disabled>YYYY</option>{Array.from({length:100},(_,i)=>thisYear-i).map(year=><option key={year} value={year}>{year}</option>)}</select></div></fieldset>
      <label className="text-sm">Local time of birth<input required type="time" name="birth_time" className={cls} /></label>
      <label className="text-sm">City of birth<input required name="birth_city" maxLength={80} className={cls} placeholder="e.g. Singapore" /></label>
      <label className="text-sm">Country of birth<select required name="birth_country" value={birthCountry} onChange={(event) => setBirthCountry(event.target.value)} className={cls}>{countries.map(([country]) => <option key={country} value={country}>{country}</option>)}</select></label>
      <label className="text-sm">Gender<select required name="gender" defaultValue="" className={cls}><option value="" disabled>Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option></select></label>
      <input type="hidden" name="question_type" value="child_potential" />
      </div>
    </section>
    <section data-step="2" className={step === 2 ? "block" : "hidden"}>
      <h2 className="mb-2 text-2xl sm:text-[1.75rem]">Your contact details</h2>
      <p className="mb-7 text-sm leading-6 text-[var(--muted)]">We use these details to identify the parent requesting the reading and to send the summary if requested.</p>
      <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Parent&apos;s name<input required name="parent_name" maxLength={80} className={cls} /></label>
      <label className="text-sm sm:col-span-2">Parent&apos;s email<input required type="email" name="email" className={cls} /></label>
      <fieldset className="text-sm sm:col-span-2"><legend>Parent&apos;s mobile number</legend><div className="grid gap-2 sm:grid-cols-[12rem_1fr]"><select required name="phone_code" value={phoneCode} onChange={(event) => setPhoneCode(event.target.value)} aria-label="Mobile country code" className={cls}>{countries.map(([country, code]) => <option key={`${country}-${code}`} value={`${country}|${code}`}>{country} {code}</option>)}</select><input required type="tel" name="phone_number" inputMode="tel" minLength={6} maxLength={24} pattern="[0-9 ()-]{6,24}" title="Please check your handphone number." aria-label="Mobile number" className={cls} placeholder="9123 4567" onInvalid={(event) => event.currentTarget.setCustomValidity("Please check your handphone number.")} onInput={(event) => event.currentTarget.setCustomValidity("")} /></div></fieldset>
      </div>
    </section>
    <section data-step="3" className={step === 3 ? "block" : "hidden"}>
      <h2 className="mb-2 text-2xl sm:text-[1.75rem]">Anything you would like help with?</h2>
      <p className="mb-7 text-sm leading-6 text-[var(--muted)]">This is optional. Share one question if there is something you would like the summary to address.</p>
      <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">Is there anything you would like to understand better about your child? <span className="text-[var(--muted)]">(optional)</span><textarea name="parenting_concern" maxLength={600} rows={4} className={cls} placeholder="For example: managing exam stress, building confidence, or finding ways to connect." /></label>
      <label className="flex items-start gap-3 border-t border-[var(--border)] pt-5 text-sm leading-6 sm:col-span-2"><input required type="checkbox" name="privacy_consent" className="mt-1 h-4 w-4 shrink-0 accent-[var(--teal-dark)]"/><span>I confirm that I am the child&apos;s parent, legal guardian, or authorised to provide these details. I agree to the use of this information to prepare and deliver the Bazi summary, as explained in the <Link href="/privacy" target="_blank" className="underline underline-offset-2">Privacy Notice</Link> and <Link href="/terms" target="_blank" className="underline underline-offset-2">Terms &amp; Disclaimer</Link>.</span></label>
      </div>
    </section>
    {(busy || readyReportId) && <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--teal-dark)]/80 px-3 py-3 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:px-5 sm:py-8" role="status" aria-live="polite">
      <div className="mx-auto w-full max-w-2xl rounded-sm bg-[var(--card)] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:p-10">
        <div>
          <div className="mb-7 border-b border-[var(--border)] pb-6 text-center">
            {busy && <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--teal)]" aria-hidden="true" />}
            <p className={`${busy ? "mt-4" : ""} text-xs font-bold uppercase tracking-[.22em] text-[var(--teal-dark)]`}>{busy ? "Preparing report" : "Report is now ready"}</p>
          </div>
          <div className="space-y-4 text-left text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">
            <p>Bazi is a traditional Chinese system practised for more than 1,000 years. It uses the year, month, day, and hour of birth to form four pillars. Each pillar contains two Chinese characters, creating the eight characters known as Bazi. Together, the four pillars offer insights into a person&apos;s natural qualities, emotions, relationships, learning, and growth.</p>
            <p>A Bazi chart may not describe everything seen in a child today. Age, upbringing, experiences, surroundings, and personal choices all influence how these qualities appear. Bazi offers another way to understand a child—not a fixed description of who he or she must become.</p>
          </div>
          <SampleBaziChart />
          <div className="sticky bottom-0 mt-7 border-t border-[var(--border)] bg-[var(--card)] pb-1 pt-5 text-center">
            <h2 className="text-2xl">{busy ? `Preparing ${submittedName}'s personality summary…` : `${submittedName}'s personality summary is ready.`}</h2>
            <button type="button" disabled={busy} onClick={() => readyReportId && router.push(`/report/${readyReportId}${emailActionToken ? `?email_token=${emailActionToken}` : ""}`)} className="mt-5 bg-[var(--teal-dark)] px-8 py-4 font-semibold text-white transition hover:bg-[var(--teal)] disabled:cursor-wait disabled:bg-[var(--muted)]">{busy ? "Preparing report…" : "Click to read"}</button>
          </div>
        </div>
      </div>
    </div>}
    {error && <p role="alert" className="mt-5 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="mt-7 flex items-center gap-3">
      {step > 1 && <button type="button" onClick={() => { setError(""); setStep((current) => Math.max(1, current - 1)); }} className="border border-[var(--border)] px-5 py-4 font-semibold text-[var(--teal-dark)] transition hover:border-[var(--teal)]">Back</button>}
      {step < 3 ? <button type="button" onClick={(event) => moveToNextStep(event.currentTarget.form!)} className="flex-1 bg-[var(--teal-dark)] px-5 py-4 font-semibold text-white transition hover:bg-[var(--teal)]">Continue</button> : <button disabled={busy} className="flex-1 bg-[var(--teal-dark)] px-5 py-4 font-semibold text-white transition hover:bg-[var(--teal)] disabled:opacity-60">{busy ? "Preparing the personality blueprint…" : "Create the personality blueprint"}</button>}
    </div>
    </>}
  </form>;
}

function SampleBaziChart() {
  const sample = [["Hour", "辛", "巳"], ["Day", "庚", "辰"], ["Month", "甲", "午"], ["Year", "丙", "戌"]];
  return <figure className="mt-6"><figcaption className="mb-2 text-center text-xs font-bold uppercase tracking-[.18em] text-[#007789]">Sample Bazi chart</figcaption><div className="mb-1 grid grid-cols-4 text-center"><span /><span className="text-xs font-bold text-[#007789]">Day Master ↓</span><span /><span /></div><div className="grid grid-cols-4 gap-px overflow-hidden border border-[#b9dfe4] bg-[#b9dfe4]">{sample.map(([label, stem, branch]) => <div key={label} className="bg-[#ffffff] px-2 py-3 text-center"><p className="text-[10px] uppercase tracking-wider text-[#60747a]">{label}</p><p className="mt-2 flex h-10 items-center justify-center text-2xl">{label === "Day" ? <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#007789] text-white ring-2 ring-[#d9f1f4]">{stem}</span> : stem}</p><p className="mt-1 text-2xl">{branch}</p></div>)}</div></figure>;
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReportFeedback from "@/app/components/report-feedback";
import type { BaziReport } from "@/lib/types";
import { calculateReading } from "@/lib/bazi";
import { demoDisplayName } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ email_token?: string }> }) {
  const { id } = await params;
  const { email_token: emailToken = "" } = await searchParams;
  const db = await createClient();
  const { data, error } = await db.from("bazi_reports").select("*").eq("id", id).maybeSingle();
  if (error || !data) notFound();
  const storedReport = data as BaziReport;
  const displayedSubjectName = storedReport.is_demo ? demoDisplayName(storedReport.id, storedReport.subject_name) : storedReport.subject_name;
  const currentDemo = storedReport.is_demo ? calculateReading({
    subject_name: displayedSubjectName,
    birth_date: storedReport.birth_date,
    birth_time: storedReport.birth_time,
    gender: storedReport.gender ?? "other",
    question_type: "child_potential",
    variation_seed: Number.parseInt(storedReport.id.replace(/\D/g, "").slice(-6), 10) || 0,
  }) : null;
  const report = currentDemo ? { ...storedReport, ...currentDemo, subject_name: displayedSubjectName, id: storedReport.id, email: storedReport.email, birth_date: storedReport.birth_date, birth_time: storedReport.birth_time, gender: storedReport.gender, birth_place: storedReport.birth_place, is_demo: true } as BaziReport : storedReport;
  await db.from("audit_logs").insert({ actor: "visitor", action: "report.viewed", target_table: "bazi_reports", target_id: id, payload: {} });
  const pillars: Array<[string, string | null | undefined]> = [["Hour", report.hour_pillar ?? "Birth time unknown"], ["Day", report.day_pillar], ["Month", report.month_pillar], ["Year", report.year_pillar]];
  const insights = report.insights?.split("\n").filter(Boolean) ?? [];
  const summary = report.report_content;
  const subjectPronoun = report.gender === "male" ? "he" : report.gender === "female" ? "she" : "they";
  const possessivePronoun = report.gender === "male" ? "his" : report.gender === "female" ? "her" : "their";
  const birthVerb = subjectPronoun === "they" ? "were" : "was";
  const genderLabel = report.gender ? report.gender.charAt(0).toUpperCase() + report.gender.slice(1) : "Not specified";
  const birthCountry = report.birth_place?.split(",").map((part) => part.trim()).filter(Boolean).at(-1);

  return <main className="min-h-screen">
    <article className="mx-auto max-w-5xl px-4 pb-14 pt-3 sm:px-6 sm:pb-20 sm:pt-8">
      <div className="border-b border-[#acd8de] pb-7 sm:pb-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-[#007789]">Your Child&apos;s Bazi Personality Blueprint · Summary Report</p>
        <h1 className="mt-2 text-3xl sm:mt-3 sm:text-5xl">{report.subject_name}</h1>
        <p className="mt-3 text-sm leading-6 text-[#5d6f75] sm:mt-4 sm:text-base">{genderLabel} · Born {new Date(`${report.birth_date}T12:00:00`).toLocaleDateString("en", { dateStyle: "long" })}{report.birth_time ? ` at ${report.birth_time.slice(0, 5)}` : ""}{birthCountry ? ` · ${birthCountry}` : ""}</p>
      </div>
      <section className="my-7 max-w-3xl border-l-2 border-[var(--teal)] bg-[var(--card)] px-5 py-5 sm:my-8 sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#007789]">About this Bazi summary</p>
        <p className="mt-3 leading-7 text-[#4e5b6f]">In Bazi, the Day Master represents the person at the centre of the reading. It comes from the element connected to the day {subjectPronoun} {birthVerb} born and offers a first look at {possessivePronoun} natural temperament—how {subjectPronoun} may respond, make decisions, and approach everyday situations.</p>
        <p className="mt-3 leading-7 text-[#4e5b6f]">This summary looks at {report.subject_name}&apos;s Day Master. It is a starting point rather than the whole story of {possessivePronoun} personality.</p>
      </section>
      <div className="grid grid-cols-4 gap-px overflow-hidden border border-[#acd8de] bg-[#acd8de]">
        {pillars.map(([label, value]) => <PillarCard key={label} label={label} value={value} />)}
      </div>
      {summary ? <div className="mt-12 space-y-12">
        <section>
          <p className="text-xs uppercase tracking-[.2em] text-[#007789]">Personality at a glance</p>
          <h2 className="mt-3 text-2xl leading-tight sm:text-3xl">Getting to know {report.subject_name}</h2>
          <div className="mt-5 max-w-3xl space-y-4 leading-7 sm:leading-8">{readableParagraphs(withoutUnverifiedStrength(summary.personality)).map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}</div>
        </section>
        <PointSection title="Top 3 strengths" points={summary.strengths} />
        <PointSection title="Where a little support can help" points={summary.soft_spots} />
        {summary.day_master_support && <section>
          <h2 className="text-3xl">Helping {report.subject_name} flourish</h2>
          <p className="mt-5 max-w-3xl leading-8">{summary.day_master_support.introduction}</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="border border-[#b9dfe4] bg-[#ffffff] p-6"><h3 className="text-xl">When {subjectPronoun} feels secure</h3><p className="mt-3 leading-7 text-[#4e5b6f]">{summary.day_master_support.secure}</p><p className="mt-3 leading-7 text-[#4e5b6f]">{summary.day_master_support.example}</p></div>
            <div className="border border-[#b9dfe4] bg-[#ffffff] p-6"><h3 className="text-xl">When {subjectPronoun} feels pressured</h3><p className="mt-3 leading-7 text-[#4e5b6f]">{summary.day_master_support.pressure}</p></div>
          </div>
          <div className="mt-5 flex max-w-3xl gap-3 border-l-2 border-[#00a0b8] bg-[#ffffff] p-5 leading-7 text-[#4e5b6f]"><GuidanceIcon /><p>{summary.day_master_support.support}</p></div>
        </section>}
        {summary.concern_response && <section><h2 className="text-3xl">Your concern about {report.subject_name}</h2>{summary.concern_original && <blockquote className="mt-5 max-w-3xl border-l-2 border-[#00a0b8] pl-5 italic leading-8 text-[#4e5b6f]">“{summary.concern_original}”</blockquote>}{summary.concern_tips?.length ? <><h3 className="mt-6 text-xl">What may help</h3><ul className="mt-4 max-w-3xl space-y-3">{summary.concern_tips.map((tip) => <li key={tip} className="flex gap-3 rounded-sm bg-[#ffffff] p-4 leading-7 text-[#4e5b6f]"><GuidanceIcon /> <span>{tip}</span></li>)}</ul></> : null}</section>}
        {summary.day_master_support?.weekly_action && <section className="max-w-3xl border border-[#b9dfe4] bg-[#ffffff] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#007789]">A practical next step</p>
          <h2 className="mt-2 text-xl sm:text-2xl">Try this with {report.subject_name} this week</h2>
          <p className="mt-5 text-base font-semibold sm:text-lg">{summary.day_master_support.weekly_action.situation}</p>
          <p className="mt-3 text-sm leading-6 text-[#4e5b6f] sm:text-base sm:leading-7">{summary.day_master_support.weekly_action.action}</p>
          <div className="mt-5 bg-[#eaf7f9] p-4 text-sm leading-6 text-[#4e5b6f] sm:text-base sm:leading-7"><p className="text-xs font-bold uppercase tracking-wider text-[#007789]">For example</p><p className="mt-2">{summary.day_master_support.weekly_action.example ?? practicalExample(summary.day_master_support.weekly_action.situation, report.subject_name)}</p></div>
          {summary.day_master_support.weekly_action.bazi_link && <div className="mt-5 border-l-2 border-[#00a0b8] pl-4"><p className="text-xs font-bold uppercase tracking-wider text-[#007789]">Why this may suit {report.subject_name}</p><p className="mt-2 leading-7 text-[#4e5b6f]">{summary.day_master_support.weekly_action.bazi_link}</p></div>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="bg-[#eaf7f9] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#007789]">Try saying</p><p className="mt-2 leading-7">“{summary.day_master_support.weekly_action.phrase}”</p></div><div className="bg-[#eaf7f9] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#007789]">Look for</p><p className="mt-2 leading-7">{summary.day_master_support.weekly_action.sign}</p></div></div>
        </section>}
        <section className="border-l-2 border-[#00a0b8] py-2 pl-6"><h2 className="text-3xl">Closing encouragement</h2><div className="mt-5 max-w-3xl space-y-4 leading-8">{summary.closing_encouragement.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
        <ReportFeedback reportId={report.id} childName={report.subject_name} initialEmail={report.email} emailToken={emailToken} />
      </div> : report.insights ? <div className="mt-12"><h2 className="text-3xl">Three reflections</h2><ol className="mt-5 space-y-4">{insights.map((insight, i) => <li key={i} className="border-l border-[#00a0b8] py-2 pl-5 leading-7">{insight.replace(/^\d+\.\s*/, "")}</li>)}</ol></div> : <div className="my-12 border border-amber-300 bg-amber-50 p-6"><h2 className="text-xl">Analysis pending</h2><p className="mt-2 text-sm">We saved this reading and will update it shortly.</p></div>}
    </article>
  </main>;
}

function GuidanceIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 fill-none stroke-[#007789]" strokeWidth="1.7"><path d="M9 18h6M10 22h4M8.2 14.5A7 7 0 1 1 15.8 14.5C14.8 15.3 14.5 16 14.5 17h-5c0-1-.3-1.7-1.3-2.5Z" /></svg>;
}

function withoutUnverifiedStrength(text: string) {
  return text
    .split(/\n\s*\n/)
    .filter((paragraph) => !/\b(?:strong|balanced|weak) day master\b/i.test(paragraph))
    .join("\n\n");
}

function PillarCard({ label, value }: { label: string; value: string | null | undefined }) {
  const [stem, branch] = value?.split(/\s*\/\s*/, 2) ?? [];
  return <div className="min-w-0 bg-[#ffffff] px-1.5 py-3 sm:p-6">
    <div className="min-h-9 text-center sm:flex sm:min-h-5 sm:items-start sm:justify-between sm:gap-2 sm:text-left"><p className="text-[9px] uppercase tracking-wider text-[#007789] sm:text-xs sm:tracking-widest">{label}</p>{label === "Day" && <p className="mt-0.5 text-[8px] font-bold leading-3 text-[#007789] sm:mt-0 sm:text-[10px]">Day Master ↓</p>}</div>
    {stem ? <div className="mt-2 space-y-2 text-center text-[11px] leading-4 sm:mt-5 sm:space-y-3 sm:text-left sm:text-xl sm:leading-7">
      <div className="flex min-h-10 items-center justify-center sm:min-h-12 sm:justify-start">{label === "Day" ? <p className="rounded-sm bg-[#d9f1f4] px-1 py-1 font-semibold text-[#004f5b] ring-1 ring-inset ring-[#00a0b8] sm:px-2">{splitPillarPart(stem)}</p> : <p>{splitPillarPart(stem)}</p>}</div>
      {branch && <p>{splitPillarPart(branch)}</p>}
    </div> : <p className="mt-2 text-center text-[10px] leading-4 text-[#5d6f75] sm:mt-5 sm:text-left sm:text-lg sm:leading-7">Pending</p>}
  </div>;
}

function PointSection({ title, points }: { title: string; points: { heading: string; body: string; guidance?: string }[] }) {
  return <section><h2 className="text-2xl sm:text-3xl">{title}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{points.map((point) => <div key={point.heading} className="border border-[#b9dfe4] bg-[#ffffff] p-5 sm:p-6"><h3 className="text-lg sm:text-xl">{point.heading}</h3><p className="mt-3 whitespace-pre-line leading-7 text-[#4e5b6f]">{point.body}</p>{point.guidance && <div className="mt-5 flex gap-3 border-t border-[#d2e9ec] pt-4 leading-7 text-[#4e5b6f]"><GuidanceIcon /><p className="whitespace-pre-line">{point.guidance}</p></div>}</div>)}</div></section>;
}

function splitPillarPart(value: string) {
  const separator = value.indexOf(" · ");
  if (separator < 0) return value;
  return <>{value.slice(0, separator + 2)}<span className="block sm:inline">{value.slice(separator + 3)}</span></>;
}

function readableParagraphs(value: string) {
  const existing = value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
  if (existing.length > 1) return existing;
  const sentences = value.trim().split(/(?<=[.!?])\s+(?=[A-Z“])/).filter(Boolean);
  if (sentences.length < 4) return existing;
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) paragraphs.push(sentences.slice(index, index + 2).join(" "));
  return paragraphs;
}

function practicalExample(situation: string, name: string) {
  const text = situation.toLowerCase();
  if (/following .* lead|share with you|connect|closer/.test(text)) return `If ${name} chooses drawing, sit nearby and let the activity unfold without correcting or teaching. Follow what ${name} wants to share, even if it is only a small detail about the picture.`;
  if (/obstacle|getting in the way|setback/.test(text)) return `If a school task feels overwhelming, ask ${name} to choose just one question or one five-minute step to try first. Review what helped after the attempt.`;
  if (/several ideas|hard to begin|big idea/.test(text)) return `If ${name} has several ideas for a project, write them down together. Let ${name} choose one idea to test for ten minutes before deciding what to do next.`;
  if (/plan has to change|unfamiliar change/.test(text)) return `If an outing is cancelled, explain what has changed and offer two workable alternatives. Let ${name} choose which new plan to follow.`;
  if (/feeling arrives|held inside|seems quieter/.test(text)) return `If ${name} comes home upset and does not want to talk, acknowledge what you notice without pressing for an answer. Check in again after there has been time to settle.`;
  if (/jumping in|solve a problem/.test(text)) return `If friends disagree, encourage ${name} to hear what each person says before suggesting a solution. One extra question may reveal something that was missed.`;
  if (/repeated checking|finished work/.test(text)) return `Before homework begins, agree on what “finished” will look like. Once those points are complete, encourage ${name} to submit the work without another full round of checking.`;
  return `If ${name} is putting off a task, ask which part feels hardest. Choose one small first step together, then check whether beginning feels easier.`;
}

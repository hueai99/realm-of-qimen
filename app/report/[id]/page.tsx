import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import UpgradeButton from "@/app/components/upgrade-button";
import type { BaziReport } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await createClient();
  const { data, error } = await db.from("bazi_reports").select("*").eq("id", id).maybeSingle();
  if (error || !data) notFound();
  const report = data as BaziReport;
  await db.from("audit_logs").insert({ actor: "visitor", action: "report.viewed", target_table: "bazi_reports", target_id: id, payload: {} });
  const pillars: Array<[string, string | null | undefined]> = [["Hour", report.hour_pillar ?? "Birth time unknown"], ["Day", report.day_pillar], ["Month", report.month_pillar], ["Year", report.year_pillar]];
  const insights = report.insights?.split("\n").filter(Boolean) ?? [];
  const summary = report.report_content;
  const dayMasterStrength = report.chart_data?.day_master_strength ?? report.chart_data?.strength;
  const subjectPronoun = report.gender === "male" ? "he" : report.gender === "female" ? "she" : "they";

  return <main className="min-h-screen">
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <Link href="/" className="font-semibold tracking-wide">REALM OF QIMEN</Link>
      <span className="text-xs uppercase tracking-widest text-[#877b70]">Personality blueprint</span>
    </header>
    <article className="mx-auto max-w-5xl px-6 pb-20 pt-8">
      <div className="border-b border-[#cfc2b4] pb-10">
        <p className="text-xs font-bold uppercase tracking-[.25em] text-[#9b3c2b]">Your Child&apos;s Bazi Personality Blueprint · Summary Report</p>
        <h1 className="mt-3 text-5xl">{report.subject_name}</h1>
        <p className="mt-4 text-[#74685e]">Born {new Date(`${report.birth_date}T12:00:00`).toLocaleDateString("en", { dateStyle: "long" })}{report.birth_time ? ` at ${report.birth_time.slice(0, 5)}` : ""}{report.birth_place ? ` · ${report.birth_place}` : ""}</p>
      </div>
      <section className="my-8 max-w-3xl border-l-2 border-[#b7422d] bg-[#fffaf0] px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#9b3c2b]">About this summary</p>
        <p className="mt-3 leading-7 text-[#665a50]">In Bazi, the Day Master represents the person at the centre of the reading. It comes from the element connected to the day someone was born and offers a first look at natural temperament—how that person may respond, make decisions, and approach everyday situations.</p>
        <p className="mt-3 leading-7 text-[#665a50]">This summary looks at {report.subject_name}&apos;s Day Master. It is a starting point rather than the whole story of {subjectPronoun === "they" ? "their" : subjectPronoun === "he" ? "his" : "her"} personality.</p>
      </section>
      <div className="grid grid-cols-2 gap-px overflow-hidden border border-[#cfc2b4] bg-[#cfc2b4] sm:grid-cols-4">
        {pillars.map(([label, value]) => <PillarCard key={label} label={label} value={value} />)}
      </div>
      {summary ? <div className="mt-12 space-y-12">
        <section>
          <p className="text-xs uppercase tracking-[.2em] text-[#9b3c2b]">Personality at a glance</p>
          <h2 className="mt-3 text-3xl leading-tight">Getting to know {report.subject_name}</h2>
          <div className="mt-5 max-w-3xl space-y-4 leading-8">{summary.personality.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
        <PointSection title="Top 3 strengths" points={summary.strengths} />
        <PointSection title="Where a little support can help" points={summary.soft_spots} />
        {summary.concern_response && <section><h2 className="text-3xl">Making sense of what you&apos;re seeing</h2><p className="mt-5 max-w-3xl leading-8">{summary.concern_response}</p>{summary.concern_tips?.length ? <ul className="mt-5 max-w-3xl space-y-3">{summary.concern_tips.map((tip) => <li key={tip} className="flex gap-3 rounded-sm bg-[#fffaf0] p-4 leading-7 text-[#665a50]"><GuidanceIcon /> <span>{tip}</span></li>)}</ul> : null}</section>}
        <PointSection title={`Small ways to support ${report.subject_name}`} points={summary.parenting_tips} />
        <section className="border-l-2 border-[#b7422d] py-2 pl-6"><h2 className="text-3xl">Closing encouragement</h2><div className="mt-5 max-w-3xl space-y-4 leading-8">{summary.closing_encouragement.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>
      </div> : report.insights ? <div className="mt-12"><h2 className="text-3xl">Three reflections</h2><ol className="mt-5 space-y-4">{insights.map((insight, i) => <li key={i} className="border-l border-[#b7422d] py-2 pl-5 leading-7">{insight.replace(/^\d+\.\s*/, "")}</li>)}</ol></div> : <div className="my-12 border border-amber-300 bg-amber-50 p-6"><h2 className="text-xl">Analysis pending</h2><p className="mt-2 text-sm">We saved this reading and will update it shortly.</p></div>}
      <section className="mt-14 bg-[#211b16] p-8 text-[#f6f0e4] sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="text-xs uppercase tracking-widest text-[#d99a85]">Beyond the Day Master</p><h2 className="mt-2 text-3xl">Discover more of {report.subject_name}&apos;s Bazi story.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#cfc5bd]">The full SGD 98 report brings the wider chart together with more detailed guidance for home, school, relationships, and the years ahead. An online consultation can be added if you would like help understanding the report.</p></div><UpgradeButton reportId={report.id} /></section>
    </article>
  </main>;
}

function GuidanceIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 fill-none stroke-[#9b3c2b]" strokeWidth="1.7"><path d="M9 18h6M10 22h4M8.2 14.5A7 7 0 1 1 15.8 14.5C14.8 15.3 14.5 16 14.5 17h-5c0-1-.3-1.7-1.3-2.5Z" /></svg>;
}

function PillarCard({ label, value }: { label: string; value: string | null | undefined }) {
  const [stem, branch] = value?.split(/\s*\/\s*/, 2) ?? [];
  return <div className="bg-[#fffaf0] px-4 py-5 sm:p-6">
    <p className="text-xs uppercase tracking-widest text-[#9b3c2b]">{label}</p>
    {stem ? <div className="mt-5 space-y-3 text-lg leading-7 sm:text-xl">
      <p>{stem}</p>
      {branch && <p>{branch}</p>}
    </div> : <p className="mt-5 text-lg leading-7 text-[#74685e]">Analysis pending</p>}
  </div>;
}

function PointSection({ title, points }: { title: string; points: { heading: string; body: string; guidance?: string }[] }) {
  return <section><h2 className="text-3xl">{title}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{points.map((point) => <div key={point.heading} className="border border-[#d7cbbd] bg-[#fffaf0] p-6"><h3 className="text-xl">{point.heading}</h3><p className="mt-3 whitespace-pre-line leading-7 text-[#665a50]">{point.body}</p>{point.guidance && <div className="mt-5 flex gap-3 border-t border-[#e2d7ca] pt-4 leading-7 text-[#665a50]"><GuidanceIcon /><p className="whitespace-pre-line">{point.guidance}</p></div>}</div>)}</div></section>;
}

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
  const pillars = [["Hour", report.hour_pillar ?? "Birth time unknown"], ["Day", report.day_pillar], ["Month", report.month_pillar], ["Year", report.year_pillar]];
  const insights = report.insights?.split("\n").filter(Boolean) ?? [];
  const summary = report.report_content;
  const dayMasterStrength = report.chart_data?.day_master_strength ?? report.chart_data?.strength;

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
      <div className="grid gap-px overflow-hidden border border-[#cfc2b4] bg-[#cfc2b4] sm:grid-cols-4">
        {pillars.map(([label, value]) => <div key={label} className="bg-[#fffaf0] p-6"><p className="text-xs uppercase tracking-widest text-[#9b3c2b]">{label}</p><p className="mt-6 text-xl leading-8">{value ?? "Analysis pending"}</p></div>)}
      </div>
      {summary ? <div className="mt-12 space-y-12">
        <section>
          <p className="text-xs uppercase tracking-[.2em] text-[#9b3c2b]">Personality at a glance</p>
          <h2 className="mt-3 text-3xl leading-tight">A gentle view of what comes naturally</h2>
          <p className="mt-5 max-w-3xl leading-8">{summary.personality}</p>
          <p className="mt-4 max-w-3xl border-l border-[#b7422d] pl-4 text-sm leading-6 text-[#74685e]">The strengths and softer spots below are viewed through {report.subject_name}&apos;s {dayMasterStrength ? `${dayMasterStrength} Day Master` : "Day Master"}. In Bazi, a Weak Day Master means these natural qualities may be more subtle, take time to show, and unfold best with trust and encouragement. This is one meaningful part of the chart, rather than the child&apos;s whole story.</p>
        </section>
        <PointSection title="Top 3 strengths" points={summary.strengths} />
        <PointSection title="Soft spots & gentle support" points={summary.soft_spots} />
        {summary.concern_response && <section><h2 className="text-3xl">Your parenting concern</h2><p className="mt-5 max-w-3xl leading-8">{summary.concern_response}</p></section>}
        <PointSection title="Parenting tips overview" points={summary.parenting_tips} />
        <section className="border-l-2 border-[#b7422d] py-2 pl-6"><h2 className="text-3xl">Closing encouragement</h2><p className="mt-5 max-w-3xl leading-8">{summary.closing_encouragement}</p></section>
      </div> : report.insights ? <div className="mt-12"><h2 className="text-3xl">Three reflections</h2><ol className="mt-5 space-y-4">{insights.map((insight, i) => <li key={i} className="border-l border-[#b7422d] py-2 pl-5 leading-7">{insight.replace(/^\d+\.\s*/, "")}</li>)}</ol></div> : <div className="my-12 border border-amber-300 bg-amber-50 p-6"><h2 className="text-xl">Analysis pending</h2><p className="mt-2 text-sm">We saved this reading and will update it shortly.</p></div>}
      <section className="mt-14 bg-[#211b16] p-8 text-[#f6f0e4] sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="text-xs uppercase tracking-widest text-[#d99a85]">Go deeper</p><h2 className="mt-2 text-3xl">Turn understanding into everyday support.</h2><p className="mt-2 text-sm text-[#cfc5bd]">Explore the fuller report for deeper learning, emotional, and parenting guidance.</p></div><UpgradeButton reportId={report.id} /></section>
    </article>
  </main>;
}

function PointSection({ title, points }: { title: string; points: { heading: string; body: string }[] }) {
  return <section><h2 className="text-3xl">{title}</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{points.map((point) => <div key={point.heading} className="border border-[#d7cbbd] bg-[#fffaf0] p-6"><h3 className="text-xl">{point.heading}</h3><p className="mt-3 leading-7 text-[#665a50]">{point.body}</p></div>)}</div></section>;
}

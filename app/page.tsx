import Link from "next/link";
import IntakeForm from "@/app/components/intake-form";
import ServiceIcon from "@/app/components/service-icon";
import { createClient } from "@/lib/supabase/server";
import type { BaziReport } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  let demos: BaziReport[] = [];
  try {
    const db = await createClient();
    const { data } = await db.from("bazi_reports").select("*").eq("is_demo", true).order("created_at");
    demos = (data ?? []) as BaziReport[];
  } catch {}

  return (
    <main className="flex flex-col">
      <section id="bazi" className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:pb-24 lg:pt-20">
        <div className="pt-2 lg:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">Your child&apos;s Bazi personality summary</p>
          <h1 className="mt-5 max-w-2xl text-3xl leading-[1.12] sm:text-6xl sm:leading-[1.02]">Understand your child with greater clarity.</h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">Discover natural strengths, moments that may feel harder, and practical ways to support your child at home.</p>
          <div className="mt-8 flex flex-wrap gap-2 text-xs">
            {['Personalised', 'Private', 'No login required'].map((item) => <span key={item} className="rounded-full bg-[var(--teal-soft)] px-4 py-2 text-[var(--teal-dark)]">{item}</span>)}
          </div>
          <div className="mt-10 max-w-lg border-l-2 border-[var(--terracotta)] pl-5 text-sm leading-6 text-[var(--muted)]">A reflective Bazi experience designed to support—not define—your child.</div>
        </div>
        <IntakeForm />
      </section>

      <section id="services" className="order-first scroll-mt-24 border-y border-[var(--border)] bg-[var(--card)] px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">Realm of Qimen services</p>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="max-w-2xl text-3xl leading-tight sm:text-5xl">Explore the person, the moment, and the space around you.</h2>
            <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">One trusted home for Bazi, Qimen, and Feng Shui as our services grow.</p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <article className="border-t-4 border-[var(--teal)] bg-[var(--paper)] p-6 sm:p-8">
              <ServiceIcon service="bazi" />
              <p className="mt-6 text-xs uppercase tracking-[.18em] text-[var(--teal-dark)]">Understand natural patterns</p>
              <h3 className="mt-2 text-3xl">Bazi</h3>
              <p className="mt-4 min-h-24 text-sm leading-6 text-[var(--muted)]">Explore temperament, strengths, relationships, and the ways a person may grow through different stages of life.</p>
              <div className="mt-7 flex items-center justify-between gap-4">
                <span className="rounded-full bg-[var(--teal-soft)] px-3 py-2 text-xs text-[var(--teal-dark)]">Available</span>
                <Link href="#bazi" className="font-semibold text-[var(--teal-dark)] underline underline-offset-4">Start a child reading</Link>
              </div>
            </article>
            <FutureService service="qimen" eyebrow="Find clarity in a situation" title="Qimen">Consider timing, direction, and strategy when facing an important decision or uncertain situation.</FutureService>
            <FutureService service="fengshui" eyebrow="Understand your surroundings" title="Feng Shui">Explore how a home or workspace may better support the people who live and work within it.</FutureService>
          </div>
        </div>
      </section>

      {demos.length > 0 && <section className="px-6 py-16 sm:py-20"><div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">Explore the format</p><h2 className="mt-3 text-3xl sm:text-4xl">Sample Bazi readings</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">{demos.map((demo) => <Link key={demo.id} href={`/report/${demo.id}`} className="border border-[var(--border)] bg-[var(--card)] p-6 transition hover:-translate-y-1 hover:border-[var(--teal)]"><span className="text-xs uppercase tracking-widest text-[var(--teal-dark)]">{demo.question_type.replace('_', ' ')}</span><h3 className="mt-5 text-2xl">{demo.subject_name}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">{demo.chart_data?.day_master ? `${demo.chart_data.day_master} Day Master` : "Bazi Day Master summary"}</p><span className="mt-6 inline-block text-sm font-semibold text-[var(--teal-dark)] underline underline-offset-4">Read report →</span></Link>)}</div>
      </div></section>}
    </main>
  );
}

function FutureService({ service, eyebrow, title, children }: { service: "qimen" | "fengshui"; eyebrow: string; title: string; children: React.ReactNode }) {
  return <article className="border border-[var(--border)] bg-[var(--paper)] p-6 sm:p-8">
    <ServiceIcon service={service} />
    <p className="mt-6 text-xs uppercase tracking-[.18em] text-[var(--muted)]">{eyebrow}</p><h3 className="mt-2 text-3xl">{title}</h3>
    <p className="mt-4 min-h-24 text-sm leading-6 text-[var(--muted)]">{children}</p><span className="mt-7 inline-block rounded-full border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)]">Coming later</span>
  </article>;
}

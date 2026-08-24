import Link from "next/link";
import IntakeForm from "@/app/components/intake-form";
import ServiceIcon from "@/app/components/service-icon";
import { createClient } from "@/lib/supabase/server";
import type { BaziReport } from "@/lib/types";
import { demoDisplayName } from "@/lib/demo";

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
      <section id="bazi" className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:pb-16 lg:pt-12">
        <div className="pt-1 lg:pt-5">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">Discover more through Bazi</p>
          <h1 className="mt-3 max-w-2xl text-3xl leading-[1.12] sm:mt-4 sm:text-5xl sm:leading-[1.08]">See what a Bazi chart may reveal about you or your child.</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:mt-5 sm:text-lg sm:leading-8">Explore natural strengths, personality patterns, and how someone may respond to people, challenges, and everyday situations.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs sm:mt-6">
            {['Personalised', 'Private', 'No login required'].map((item) => <span key={item} className="rounded-full bg-[var(--teal-soft)] px-4 py-2 text-[var(--teal-dark)]">{item}</span>)}
          </div>
          <div className="mt-6 max-w-lg border-l-2 border-[var(--terracotta)] pl-4 text-sm italic leading-6 text-[var(--muted)] sm:mt-7 sm:pl-5">A thoughtful starting point for deeper understanding—not a fixed definition of who someone is.</div>
        </div>
        <IntakeForm />
      </section>

      <section id="services" className="order-first scroll-mt-24 border-y border-[var(--border)] bg-[var(--card)] px-5 py-6 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">Realm of Qimen services</p>
          <div className="mt-2 flex flex-col justify-between gap-2 sm:mt-3 sm:flex-row sm:items-end sm:gap-4">
            <h2 className="max-w-2xl text-[1.75rem] leading-[1.15] sm:text-4xl sm:leading-[1.15]">Explore the person, the moment, and the space around you.</h2>
            <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">One trusted home for Bazi, Qimen, and Feng Shui as our services grow.</p>
          </div>
          <div className="mt-5 grid gap-3 sm:mt-7 sm:gap-4 lg:grid-cols-3">
            <article className="border-t-4 border-[var(--teal)] bg-[var(--paper)] p-4 sm:p-6">
              <ServiceIcon service="bazi" />
              <p className="mt-3 text-xs uppercase tracking-[.18em] text-[var(--teal-dark)] sm:mt-4">Understand natural patterns</p>
              <h3 className="mt-1 text-2xl sm:mt-2 sm:text-[1.65rem]">Bazi</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:mt-3 sm:min-h-20">Explore temperament, strengths, relationships, and the ways a person may grow through different stages of life.</p>
              <div className="mt-4 flex items-center justify-end sm:mt-5">
                <Link href="#bazi" className="font-semibold text-[var(--teal-dark)] underline underline-offset-4">Start a child reading</Link>
              </div>
            </article>
            <FutureService service="qimen" eyebrow="Find clarity in a situation" title="Qimen">Consider timing, direction, and strategy when facing an important decision or uncertain situation.</FutureService>
            <FutureService service="fengshui" eyebrow="Understand your surroundings" title="Feng Shui">Explore how a home or workspace may better support the people who live and work within it.</FutureService>
          </div>
        </div>
      </section>

      {demos.length > 0 && <section className="px-5 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[.24em] text-[var(--teal-dark)]">See what to expect</p><h2 className="mt-2 text-[1.75rem] leading-tight sm:mt-3 sm:text-4xl">Sample Bazi summaries</h2>
        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4 md:grid-cols-3">{demos.map((demo) => <Link key={demo.id} href={`/report/${demo.id}`} className="border border-[var(--border)] bg-[var(--card)] p-4 transition hover:-translate-y-1 hover:border-[var(--teal)] sm:p-5"><span className="text-xs uppercase tracking-widest text-[var(--teal-dark)]">Sample Bazi Summary</span><h3 className="mt-2 text-xl sm:mt-3 sm:text-2xl">{demoDisplayName(demo.id, demo.subject_name)}</h3><span className="mt-3 inline-block text-sm font-semibold text-[var(--teal-dark)] underline underline-offset-4 sm:mt-4">Read report →</span></Link>)}</div>
      </div></section>}
    </main>
  );
}

function FutureService({ service, eyebrow, title, children }: { service: "qimen" | "fengshui"; eyebrow: string; title: string; children: React.ReactNode }) {
  return <article className="border border-[var(--border)] bg-[var(--paper)] p-4 sm:p-6">
    <ServiceIcon service={service} />
    <p className="mt-3 text-xs uppercase tracking-[.18em] text-[var(--muted)] sm:mt-4">{eyebrow}</p><h3 className="mt-1 text-2xl sm:mt-2 sm:text-[1.65rem]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[var(--muted)] sm:mt-3 sm:min-h-20">{children}</p><span className="mt-4 inline-block rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] sm:mt-5 sm:py-2">Coming later</span>
  </article>;
}

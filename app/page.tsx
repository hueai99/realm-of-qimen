import Link from "next/link";
import Image from "next/image";
import IntakeForm from "@/app/components/intake-form";
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

  return <main>
    <header className="mx-auto flex max-w-6xl items-center px-5 py-4 sm:px-6"><Link href="/" aria-label="Realm of Qimen home"><Image src="/ROQ%20logo.png" alt="Realm of Qimen" width={96} height={96} priority className="h-20 w-20 object-contain sm:h-24 sm:w-24" /></Link></header>
    <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-8 lg:grid-cols-[.9fr_1.1fr] lg:pt-16">
      <div className="pt-2 sm:pt-5"><p className="mb-4 text-[10px] font-bold uppercase leading-5 tracking-[.22em] text-[#007789] sm:mb-5 sm:text-xs sm:tracking-[.28em]">A clearer view of what comes naturally</p><h1 className="max-w-xl text-4xl leading-[1.06] sm:text-6xl sm:leading-[1.02]">Understand what comes naturally to your child.</h1><p className="mt-5 max-w-lg text-base leading-7 text-[#4e5b6f] sm:mt-7 sm:text-lg sm:leading-8">Enter your child&apos;s birth details to receive a personalised Bazi personality summary. Discover three natural strengths, understand moments that may feel harder, and find practical ways to support your child at home. No login required.</p><div className="mt-8 border-l-2 border-[#00a0b8] pl-5 text-sm leading-6 text-[#4e5b6f] sm:mt-10">A reflective Bazi experience—not a substitute for professional advice or a promise about the future.</div></div>
      <IntakeForm />
    </section>
    <section className="bg-[#004f5b] px-6 py-16 text-[#f7fbfb]"><div className="mx-auto max-w-6xl"><p className="text-xs uppercase tracking-[.25em] text-[#8edbe5]">Explore the format</p><h2 className="mb-8 mt-2 text-3xl">Sample readings</h2><div className="grid gap-4 md:grid-cols-3">{demos.map(demo=><Link key={demo.id} href={`/report/${demo.id}`} className="rounded-sm border border-white/15 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"><span className="text-xs uppercase tracking-widest text-[#8edbe5]">{demo.question_type.replace("_"," ")}</span><h3 className="mt-5 text-2xl">{demo.subject_name}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-[#d7eef1]">{demo.element_profile}</p><span className="mt-6 inline-block text-sm underline underline-offset-4">Read report →</span></Link>)}{!demos.length&&<p className="text-[#d7eef1]">Demo readings will appear when the database is connected.</p>}</div></div></section>
  </main>;
}

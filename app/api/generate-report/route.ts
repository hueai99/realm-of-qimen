import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReading } from "@/lib/bazi";
import type { QuestionType } from "@/lib/types";

const allowed = new Set(["career", "wealth", "child_potential", "relationship"]);
export async function POST(request: Request) {
  let body: Record<string, string>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const subject_name = body.subject_name?.trim(); const email = body.email?.trim().toLowerCase(); const birth_date = body.birth_date || `${body.birth_year}-${body.birth_month}-${body.birth_day}`; const birth_time = body.birth_time || null; const birth_place = body.birth_place?.trim(); const parenting_concern = body.parenting_concern?.trim() || null; const gender = body.gender; const question_type = body.question_type as QuestionType;
  if (!subject_name || subject_name.length > 80 || !email || !/^\S+@\S+\.\S+$/.test(email) || !/^\d{4}-\d{2}-\d{2}$/.test(birth_date) || !/^\d{2}:\d{2}$/.test(birth_time ?? "") || !birth_place || birth_place.length > 120 || (parenting_concern?.length ?? 0) > 600 || !allowed.has(question_type) || !["male","female","other"].includes(gender)) return NextResponse.json({ error: "Please check all required fields." }, { status: 422 });
  const db = createAdminClient(); const { data: report, error } = await db.from("bazi_reports").insert({ subject_name, email, birth_date, birth_time, birth_place, parenting_concern, gender, question_type }).select("id").single();
  if (error || !report) return NextResponse.json({ error: "We could not save your reading. Please try again." }, { status: 500 });
  await db.from("audit_logs").insert({ actor: "system", action: "report.requested", target_table: "bazi_reports", target_id: report.id, payload: { question_type } });
  try { const reading = await generateReading({ subject_name, birth_date, birth_time, birth_place, parenting_concern, gender, question_type } as never); await db.from("bazi_reports").update(reading).eq("id", report.id); await db.from("audit_logs").insert({ actor: "system", action: "report.generated", target_table: "bazi_reports", target_id: report.id, payload: { source: reading.insights_source } }); } catch { await db.from("audit_logs").insert({ actor: "system", action: "report.generation_failed", target_table: "bazi_reports", target_id: report.id, payload: {} }); }
  const { error: leadError } = await db.from("leads").insert({ name: subject_name, email, report_id: report.id, conversion_status: "new" }); if (leadError) return NextResponse.json({ error: "Report saved, but the lead could not be created." }, { status: 500 });
  return NextResponse.json({ report_id: report.id }, { status: 201 });
}

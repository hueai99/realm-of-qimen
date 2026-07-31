import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateReading } from "@/lib/bazi";
import type { QuestionType, SummaryReport } from "@/lib/types";

const allowed = new Set(["career", "wealth", "child_potential", "relationship"]);
function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number); const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}
function normaliseName(value: string) {
  const trimmed = value.trim();
  return trimmed === trimmed.toLowerCase() ? trimmed.replace(/[A-Za-z]/, (letter) => letter.toUpperCase()) : trimmed;
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}
async function emailSummary(input: { reportId: string; email: string; parentName: string; childName: string; summary: SummaryReport }) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_FROM_EMAIL) return { status: "not_configured" as const, error: "Email service is not configured" };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://realm-of-qimen.vercel.app";
  const reportUrl = `${appUrl}/report/${input.reportId}`;
  const paragraphs = (value: string) => value.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const reportPoints = (points: SummaryReport["strengths"]) => points.map((point) => `<h3 style="margin-bottom:4px">${escapeHtml(point.heading)}</h3><p style="margin-top:0">${escapeHtml(point.body)}</p>`).join("");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": `summary-${input.reportId}` },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: [input.email],
      subject: `${input.childName}'s Bazi personality summary`,
      html: `<div style="font-family:Georgia,serif;max-width:620px;margin:auto;color:#2b211a;line-height:1.65"><p style="color:#9b3c2b;font-size:12px;letter-spacing:2px;text-transform:uppercase">Realm of Qimen</p><h1>${escapeHtml(input.childName)}'s Bazi personality summary</h1><p>Dear ${escapeHtml(input.parentName)},</p>${paragraphs(input.summary.personality)}<h2>Top 3 strengths</h2>${reportPoints(input.summary.strengths)}<h2>Where support may help</h2>${reportPoints(input.summary.soft_spots)}<h2>Closing encouragement</h2>${paragraphs(input.summary.closing_encouragement)}<p><a href="${reportUrl}" style="display:inline-block;background:#9b3c2b;color:white;padding:12px 22px;text-decoration:none">View the online summary</a></p></div>`,
    }),
  });
  if (response.ok) return { status: "sent" as const, error: null };
  return { status: "failed" as const, error: `Resend returned ${response.status}` };
}
export async function POST(request: Request) {
  let body: Record<string, string>; try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  body.phone_code = (body.phone_code ?? "").split("|").pop() ?? "";
  const subject_name = normaliseName(body.subject_name ?? ""); const parent_name = normaliseName(body.parent_name ?? ""); const email = body.email?.trim().toLowerCase(); const phone = body.phone?.trim() || `${body.phone_code ?? ""}${body.phone_number ?? ""}`.replace(/\s+/g, " ").trim(); const birth_date = body.birth_date || `${body.birth_year}-${body.birth_month}-${body.birth_day}`; const birth_time = body.birth_time || null; const birth_place = body.birth_place?.trim() || [body.birth_city?.trim(), body.birth_country?.trim()].filter(Boolean).join(", "); const parenting_concern = body.parenting_concern?.trim() || null; const gender = body.gender; const question_type = body.question_type as QuestionType; const email_summary_requested = body.email_summary_requested === "true"; const marketing_consent = body.marketing_consent === "true"; const marketing_consent_at = marketing_consent ? new Date().toISOString() : null;
  const invalidField = !subject_name || subject_name.length > 80 ? "child's name"
    : !parent_name || parent_name.length > 80 ? "parent's name"
    : !email || !/^\S+@\S+\.\S+$/.test(email) ? "parent's email"
    : !phone || !/^[+()\d\s-]{7,30}$/.test(phone) ? "mobile number"
    : !isValidDate(birth_date) ? "date of birth"
    : !/^\d{2}:\d{2}$/.test(birth_time ?? "") ? "time of birth"
    : !birth_place || birth_place.length > 120 ? "place of birth"
    : (parenting_concern?.length ?? 0) > 600 ? "parenting concern"
    : !allowed.has(question_type) ? "report type"
    : !["male", "female", "other"].includes(gender) ? "gender"
    : null;
  if (invalidField) return NextResponse.json({ error: `Please check the ${invalidField}.` }, { status: 422 });
  const db = createAdminClient(); const { data: report, error } = await db.from("bazi_reports").insert({ subject_name, parent_name, email, birth_date, birth_time, birth_place, parenting_concern, gender, question_type, email_summary_requested, marketing_consent, marketing_consent_at, email_delivery_status: email_summary_requested ? "pending" : "not_requested" }).select("id").single();
  if (error || !report) return NextResponse.json({ error: "We could not save your reading. Please try again." }, { status: 500 });
  await db.from("audit_logs").insert({ actor: "system", action: "report.requested", target_table: "bazi_reports", target_id: report.id, payload: { question_type } });
  let reading: Awaited<ReturnType<typeof generateReading>>;
  try { reading = await generateReading({ subject_name, birth_date, birth_time, birth_place, parenting_concern, gender, question_type } as never); const { error: updateError } = await db.from("bazi_reports").update(reading).eq("id", report.id); if (updateError) throw updateError; await db.from("audit_logs").insert({ actor: "system", action: "report.generated", target_table: "bazi_reports", target_id: report.id, payload: { source: reading.insights_source } }); } catch (generationError) { await db.from("audit_logs").insert({ actor: "system", action: "report.generation_failed", target_table: "bazi_reports", target_id: report.id, payload: {} }); return NextResponse.json({ error: "We saved the details, but could not prepare the report. Please try again." }, { status: 500 }); }
  const { error: leadError } = await db.from("leads").insert({ name: parent_name, parent_name, email, phone, report_id: report.id, conversion_status: "new", email_summary_requested, marketing_consent, marketing_consent_at }); if (leadError) return NextResponse.json({ error: "Report saved, but the lead could not be created." }, { status: 500 });
  let emailDelivery: "not_requested" | "sent" | "failed" | "not_configured" = "not_requested";
  if (email_summary_requested) {
    const delivery = await emailSummary({ reportId: report.id, email, parentName: parent_name, childName: subject_name, summary: reading.report_content });
    emailDelivery = delivery.status;
    await db.from("bazi_reports").update({ email_delivery_status: delivery.status, email_sent_at: delivery.status === "sent" ? new Date().toISOString() : null, email_delivery_error: delivery.error }).eq("id", report.id);
    await db.from("audit_logs").insert({ actor: "system", action: `summary_email.${delivery.status}`, target_table: "bazi_reports", target_id: report.id, payload: { recipient: email } });
  }
  return NextResponse.json({ report_id: report.id, email_delivery: emailDelivery }, { status: 201 });
}

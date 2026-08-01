import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSummaryEmail } from "@/lib/email-summary";
import type { SummaryReport } from "@/lib/types";
import { isValidEmailActionToken } from "@/lib/email-action-token";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let body: { email?: string; marketing_consent?: boolean; token?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Please check the email address." }, { status: 400 }); }
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Please check the email address." }, { status: 422 });
  const consent = body.marketing_consent === true;
  const consentAt = consent ? new Date().toISOString() : null;
  const db = createAdminClient();
  const { data: report, error } = await db.from("bazi_reports").select("id, subject_name, parent_name, email, report_content, email_delivery_status").eq("id", id).maybeSingle();
  if (error || !report?.report_content) return NextResponse.json({ error: "This summary is not ready to email yet." }, { status: 404 });
  if (!isValidEmailActionToken(body.token ?? "", id)) return NextResponse.json({ error: "Please return to the report you just created before emailing it." }, { status: 403 });
  const summary = report.report_content as SummaryReport;
  const alreadySent = report.email_delivery_status === "sent" && report.email === email;
  const { error: updateError } = await db.from("bazi_reports").update({ email, email_summary_requested: true, marketing_consent: consent, marketing_consent_at: consentAt, email_delivery_status: alreadySent ? "sent" : "pending", email_delivery_error: null }).eq("id", id);
  if (updateError) return NextResponse.json({ error: "We could not save the email address." }, { status: 500 });
  await db.from("leads").update({ email, email_summary_requested: true, marketing_consent: consent, marketing_consent_at: consentAt }).eq("report_id", id);
  if (report.email !== email) await db.from("audit_logs").insert({ actor: "visitor", action: "summary_email.address_updated", target_table: "bazi_reports", target_id: id, payload: { previous_email: report.email, corrected_email: email } });
  if (alreadySent) return NextResponse.json({ status: "sent", email });
  const delivery = await sendSummaryEmail({ reportId: id, email, parentName: report.parent_name ?? "Parent", childName: report.subject_name, summary });
  await db.from("bazi_reports").update({ email_delivery_status: delivery.status, email_sent_at: delivery.status === "sent" ? new Date().toISOString() : null, email_delivery_error: delivery.error }).eq("id", id);
  await db.from("audit_logs").insert({ actor: "visitor", action: `summary_email.${delivery.status}`, target_table: "bazi_reports", target_id: id, payload: { recipient: email, marketing_consent: consent } });
  if (delivery.status !== "sent") return NextResponse.json({ error: "We could not send the email yet. Please check the address and try again." }, { status: 502 });
  return NextResponse.json({ status: "sent", email });
}

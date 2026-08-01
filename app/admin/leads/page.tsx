import { redirect } from "next/navigation";
import LeadsTable, { type LeadDeskRow } from "@/app/components/leads-table";
import { isAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

type AuditEvent = { action: string; target_id: string | null; payload: Record<string, unknown> | null; created_at: string };

export default async function LeadsPage() {
  if (!(await isAdmin())) redirect("/admin");
  const db = createAdminClient();
  const { data: leads, error } = await db
    .from("leads")
    .select("id, name, parent_name, email, phone, report_id, conversion_status, notes, created_at, bazi_reports(id, subject_name, birth_date, birth_time, birth_place, gender, question_type, chart_data, chart_status, report_content, email_summary_requested)")
    .order("created_at", { ascending: false });
  if (error) return <main className="p-8">Could not load leads.</main>;

  const reportIds = (leads ?? []).map((lead) => lead.report_id).filter(Boolean) as string[];
  const { data: auditEvents } = reportIds.length
    ? await db.from("audit_logs").select("action, target_id, payload, created_at").in("target_id", reportIds).in("action", ["summary.feedback_submitted", "premium_report.interest_indicated", "premium_report.requested"]).order("created_at", { ascending: false })
    : { data: [] as AuditEvent[] };
  const eventsByReport = new Map<string, AuditEvent[]>();
  for (const event of (auditEvents ?? []) as AuditEvent[]) {
    if (!event.target_id) continue;
    eventsByReport.set(event.target_id, [...(eventsByReport.get(event.target_id) ?? []), event]);
  }

  const rows: LeadDeskRow[] = (leads ?? []).map((lead) => {
    const relation = lead.bazi_reports;
    const report = (Array.isArray(relation) ? relation[0] : relation) as LeadDeskRow["report"];
    const events = eventsByReport.get(lead.report_id) ?? [];
    const feedback = events.find((event) => event.action === "summary.feedback_submitted");
    const premiumInterest = events.some((event) => ["premium_report.interest_indicated", "premium_report.requested"].includes(event.action));
    return {
      id: lead.id, name: lead.name, parent_name: lead.parent_name, email: lead.email, phone: lead.phone,
      report_id: lead.report_id, conversion_status: lead.conversion_status, notes: lead.notes, created_at: lead.created_at, report,
      feedback: feedback ? {
        rating: String(feedback.payload?.rating ?? ""), comment: String(feedback.payload?.comment ?? ""),
        interested_in_more: Boolean(feedback.payload?.interested_in_more) || premiumInterest,
        email_summary_requested: Boolean(feedback.payload?.email_summary_requested) || Boolean(report?.email_summary_requested),
      } : premiumInterest || report?.email_summary_requested ? { rating: "", comment: "", interested_in_more: premiumInterest, email_summary_requested: Boolean(report?.email_summary_requested) } : null,
    };
  });
  return <LeadsTable initial={rows} />;
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { report_id, event } = await request.json();
  if (event !== "premium_report.requested" || !/^[0-9a-f-]{36}$/i.test(report_id ?? "")) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const db = createAdminClient();
  const [{ data: report }, { data: lead }] = await Promise.all([
    db.from("bazi_reports").select("id, subject_name, parent_name, birth_date, birth_time, birth_place, email").eq("id", report_id).maybeSingle(),
    db.from("leads").select("parent_name, email, phone").eq("report_id", report_id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  await db.from("audit_logs").insert({ actor: "visitor", action: event, target_table: "bazi_reports", target_id: report_id, payload: { email_notification: Boolean(process.env.RESEND_API_KEY && process.env.NOTIFICATION_FROM_EMAIL) } });

  let emailSent = false;
  if (process.env.RESEND_API_KEY && process.env.NOTIFICATION_FROM_EMAIL) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://realm-of-qimen.vercel.app";
    const body = [
      `Child: ${report.subject_name}`,
      `Parent: ${lead?.parent_name ?? report.parent_name ?? "Not provided"}`,
      `Birth date: ${report.birth_date}`,
      `Birth time: ${report.birth_time ?? "Not provided"}`,
      `Birth place: ${report.birth_place ?? "Not provided"}`,
      `Parent email: ${lead?.email ?? report.email}`,
      `Parent mobile: ${lead?.phone ?? "Not provided"}`,
      `Summary report: ${appUrl}/report/${report.id}`,
    ].join("\n");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json", "Idempotency-Key": `premium-request-${report.id}` },
      body: JSON.stringify({ from: process.env.NOTIFICATION_FROM_EMAIL, to: ["realmofqimen@gmail.com"], subject: "Premium report requested", text: body }),
    });
    emailSent = response.ok;
    if (!response.ok) console.error("Premium request email failed", response.status);
  }
  return NextResponse.json({ ok: true, email_sent: emailSent });
}

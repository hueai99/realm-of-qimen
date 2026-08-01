import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ratings = new Set(["very_close", "partly", "not_accurate", "unsure"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  let body: { rating?: string; comment?: string; interested_in_more?: boolean; email_summary_requested?: boolean; email?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid feedback" }, { status: 400 }); }
  const rating = body.rating?.trim() ?? "";
  const comment = body.comment?.trim() ?? "";
  const interestedInMore = body.interested_in_more === true;
  const emailSummaryRequested = body.email_summary_requested === true;
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!ratings.has(rating)) return NextResponse.json({ error: "Please choose the answer that feels closest." }, { status: 422 });
  if (comment.length > 1000) return NextResponse.json({ error: "Please keep your comment below 1,000 characters." }, { status: 422 });
  if ((interestedInMore || emailSummaryRequested) && (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254)) return NextResponse.json({ error: "Please check the email address." }, { status: 422 });

  const db = createAdminClient();
  const { data: report } = await db.from("bazi_reports").select("id, email").eq("id", id).maybeSingle();
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (interestedInMore || emailSummaryRequested) {
    await Promise.all([db.from("bazi_reports").update({ email }).eq("id", id), db.from("leads").update({ email }).eq("report_id", id)]);
  }
  const events = [{
    actor: "visitor",
    action: "summary.feedback_submitted",
    target_table: "bazi_reports",
    target_id: id,
    payload: { rating, comment: comment || null, interested_in_more: interestedInMore, email_summary_requested: emailSummaryRequested, confirmed_email: email || null },
  }];
  if (interestedInMore) events.push({
    actor: "visitor",
    action: "premium_report.interest_indicated",
    target_table: "bazi_reports",
    target_id: id,
    payload: { rating, comment: null, interested_in_more: true, email_summary_requested: emailSummaryRequested, confirmed_email: email || null },
  });
  const { error } = await db.from("audit_logs").insert(events);
  if (error) return NextResponse.json({ error: "We could not save your feedback yet." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

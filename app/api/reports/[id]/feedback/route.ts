import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ratings = new Set(["very_close", "partly", "not_accurate", "unsure"]);

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid report" }, { status: 400 });
  let body: { rating?: string; comment?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid feedback" }, { status: 400 }); }
  const rating = body.rating?.trim() ?? "";
  const comment = body.comment?.trim() ?? "";
  if (!ratings.has(rating)) return NextResponse.json({ error: "Please choose the answer that feels closest." }, { status: 422 });
  if (comment.length > 1000) return NextResponse.json({ error: "Please keep your comment below 1,000 characters." }, { status: 422 });

  const db = createAdminClient();
  const { data: report } = await db.from("bazi_reports").select("id").eq("id", id).maybeSingle();
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  const { error } = await db.from("audit_logs").insert({
    actor: "visitor",
    action: "summary.feedback_submitted",
    target_table: "bazi_reports",
    target_id: id,
    payload: { rating, comment: comment || null },
  });
  if (error) return NextResponse.json({ error: "We could not save your feedback yet." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

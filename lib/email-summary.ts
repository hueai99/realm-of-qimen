import type { SummaryReport } from "@/lib/types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character] ?? character);
}

export async function sendSummaryEmail(input: { reportId: string; email: string; parentName: string; childName: string; summary: SummaryReport }) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_FROM_EMAIL) return { status: "not_configured" as const, error: "Email service is not configured" };
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://realm-of-qimen.vercel.app";
  const reportUrl = `${appUrl}/report/${input.reportId}`;
  const paragraphs = (value: string) => value.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const reportPoints = (points: SummaryReport["strengths"]) => points.map((point) => `<h3 style="margin-bottom:4px">${escapeHtml(point.heading)}</h3><p style="margin-top:0">${escapeHtml(point.body)}</p>`).join("");
  const weeklyAction = input.summary.day_master_support?.weekly_action;
  const actionHtml = weeklyAction ? `<h2>Try this with ${escapeHtml(input.childName)} this week</h2><p><strong>${escapeHtml(weeklyAction.situation)}</strong></p><p>${escapeHtml(weeklyAction.action)}</p>${weeklyAction.bazi_link ? `<p><strong>Why this may suit ${escapeHtml(input.childName)}:</strong> ${escapeHtml(weeklyAction.bazi_link)}</p>` : ""}<p><strong>Try saying:</strong> “${escapeHtml(weeklyAction.phrase)}”</p><p><strong>Look for:</strong> ${escapeHtml(weeklyAction.sign)}</p>` : "";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFICATION_FROM_EMAIL,
      to: [input.email],
      subject: `${input.childName}'s Bazi personality summary`,
      html: `<div style="font-family:Georgia,serif;max-width:620px;margin:auto;color:#2b211a;line-height:1.65"><p style="color:#9b3c2b;font-size:12px;letter-spacing:2px;text-transform:uppercase">Realm of Qimen</p><h1>${escapeHtml(input.childName)}'s Bazi personality summary</h1><p>Dear ${escapeHtml(input.parentName)},</p>${paragraphs(input.summary.personality)}<h2>Top 3 strengths</h2>${reportPoints(input.summary.strengths)}<h2>Where support may help</h2>${reportPoints(input.summary.soft_spots)}${actionHtml}<h2>Closing encouragement</h2>${paragraphs(input.summary.closing_encouragement)}<p><a href="${reportUrl}" style="display:inline-block;background:#9b3c2b;color:white;padding:12px 22px;text-decoration:none">View the online summary</a></p></div>`,
    }),
  });
  if (response.ok) return { status: "sent" as const, error: null };
  return { status: "failed" as const, error: `Resend returned ${response.status}` };
}

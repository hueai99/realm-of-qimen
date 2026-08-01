import { createHmac, timingSafeEqual } from "crypto";

function secret() {
  return process.env.EMAIL_ACTION_SECRET || process.env.RESEND_API_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}

export function createEmailActionToken(reportId: string) {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update(reportId).digest("hex");
}

export function isValidEmailActionToken(token: string, reportId: string) {
  const expected = createEmailActionToken(reportId);
  if (!token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

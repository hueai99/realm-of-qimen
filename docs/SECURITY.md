# Security — Realm of Qimen

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live in Vercel environment variables only — never in client bundle, never in `.env.local` committed to git.
- Client uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` only — anon key has no elevated privileges.
- All AI calls go through `/api/generate-report` (server route) — key never touches the browser.

## Permission Model
- **v1 (demo-first):** permissive RLS policies — any visitor can read all reports, submit forms.
- **Lock-down sprint:** replace with `auth.uid() = user_id` policies on `bazi_reports` and `leads`. Admin route protected by a role check against a hard-coded admin email list (or Supabase custom claim).
- Agent tools inherit the server-side service role only for their specific named operation — no blanket DB access.

## Approved-Tools Rule
- Only named, typed server functions may be called by any automated step.
- No `eval`, no `run_any`, no dynamic SQL construction from user input.
- Every tool call that mutates data writes a row to `audit_logs` before returning.

## Audit Principle
- Every meaningful mutation (report created, lead status changed, insight flagged) produces an `audit_logs` row with actor, action, target, before/after payload.
- Audit rows are append-only — no update or delete permitted on `audit_logs` even for admin.
- If a security concern arises (payments, data deletion, legal), the plan says plainly: **stop and involve a human with the appropriate access** — do not automate it.

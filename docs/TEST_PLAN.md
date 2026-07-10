# Test Plan — Realm of Qimen

## Step 1 — Core Success Scenario (Happy Path)
1. Open `/` — confirm intake form renders, 3 demo report cards visible, no login prompt.
2. Fill form: name="Test Child", email="tester@example.com", birth_date=2015-05-10, birth_time=09:00, gender=female, question_type=child_potential.
3. Submit — confirm loading state appears.
4. Confirm redirect to `/report/[id]`.
5. Confirm four pillars display (Year / Month / Day / Hour), element profile, and at least 3 insight lines.
6. Open Supabase → `bazi_reports` table → confirm new row exists with all pillar fields populated and `insights_review_status = 'unreviewed'`.
7. Open Supabase → `leads` table → confirm row with `email = tester@example.com` and `conversion_status = 'new'`.
8. Click Upgrade CTA → confirm new tab opens to booking link (not a 404, not blank).
9. Open `/admin/leads` → confirm new lead row is visible.
10. Change status to `contacted` → confirm DB row updates and `audit_logs` has a new entry.

## Step 2 — Empty & Error States
- Submit form with missing birth_date → inline error shown, no API call made.
- Submit form with missing email → inline error shown.
- Navigate to `/report/00000000-0000-0000-0000-000000000000` → 404 message shown, not a crash.
- Simulate OpenAI failure (invalid key in test env) → report page shows "Analysis pending — we'll update this shortly" copy, row still exists in DB.

## Step 3 — Demo Rows
- Load `/report/a1b2c3d4-0001-0001-0001-000000000001` without login → full report renders.
- Confirm `is_demo = true` in DB for all three seeded rows.

## Step 4 — Admin
- Load `/admin/leads` with correct passphrase → table renders with at least 3 seeded leads.
- Edit notes field → click elsewhere → reload page → confirm note persisted.
- Stats bar: paid count matches number of rows with `conversion_status = 'paid'`.

## Step 5 — No Secrets Exposed
- Open browser DevTools → Network tab → confirm no response contains `OPENAI_API_KEY` or `service_role` key string.
- Confirm `.env.local` is in `.gitignore` and not committed.

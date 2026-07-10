# Tasks — Realm of Qimen

## Gantt Overview
```
Week 1: Sprint 1 (DB + Core Engine)       ← v1 functional milestone
Week 1: Sprint 2 (Lead Admin)              ← builder can manage leads
Week 2: Sprint 3 (Lock It Down)            ← safe for real user data
Week 2: Sprint 4 (Conversion Polish)       ← money in
```

---

## Sprint 1 — DB + Core Report Engine
**Goal:** A visitor can submit birth details, receive a real Bazi report persisted in the DB, and click the Upgrade CTA.

- [ ] Run migration SQL (tables + seed demo rows)
- [ ] Verify 3 demo reports render at `/report/[id]` without login
- [ ] Build intake form component (name, email, birth_date, birth_time, gender, question_type)
- [ ] Validate form inputs client-side; show inline errors
- [ ] `POST /api/generate-report` — validate → insert pending row → call OpenAI → update row with pillars + insights
- [ ] If OpenAI fails: row stays with empty insights; report page shows "Analysis pending" error state
- [ ] Report page `/report/[id]`: loading skeleton → render four pillars + element profile + insights
- [ ] Handle empty state (no id found → 404 copy), error state (DB fetch failed)
- [ ] Upsert `leads` row on every form submit
- [ ] Upgrade CTA button on report page → opens Calendly/WhatsApp link in new tab (no dead button)
- [ ] Homepage `/` renders intake form + 3 demo report cards (public, no login)

**Definition of Done:** Submit form with real data → report page shows AI-generated content → row exists in `bazi_reports` and `leads` in Supabase → Upgrade CTA opens booking link → confirmed by TEST_PLAN step 1.

---

## Sprint 2 — Lead Admin
**Goal:** Builder can see all leads and manage conversion status.

- [ ] Admin page `/admin/leads` — table: name, email, question_type, conversion_status, created_at, link to report
- [ ] Conversion status dropdown (new / contacted / paid) — updates DB on change + writes audit_log row
- [ ] Inline notes field — saves on blur
- [ ] Stats bar: total leads | contacted | paid | conversion %
- [ ] Empty state: "No leads yet — share the link to get started"
- [ ] Error state if DB fetch fails
- [ ] Protect `/admin/*` with a simple env-var passphrase check (temporary until Auth sprint)

**Definition of Done:** Admin can load `/admin/leads`, see the lead from Sprint 1, flip status to `paid`, add a note, and the DB reflects the change. Stats bar shows correct numbers.

---

## Sprint 3 — Lock It Down (Auth + RLS) ★
**Goal:** Real user data is safe; each user sees only their own reports.

- [ ] Enable Supabase Auth (magic link)
- [ ] Sign-up / log-in page; redirect to `/my-reports` after login
- [ ] `my-reports` page: user's own report history
- [ ] On form submit: attach `auth.uid()` as `user_id` in `bazi_reports` and `leads`
- [ ] Replace v1 permissive RLS policies with owner-scoped policies
- [ ] Admin route: check `auth.uid()` matches admin email list
- [ ] Demo rows remain public (`is_demo = true` bypasses owner check)
- [ ] Test: logged-out visitor can see demo reports only; logged-in user sees own reports only

**Definition of Done:** RLS confirmed in Supabase dashboard — a logged-in test user cannot read another user's report via direct Supabase query.

---

## Sprint 4 — Conversion Polish
**Goal:** Money can flow; paid users get premium content.

- [ ] Stripe payment link for "Premium Report" (manual product, no webhook complexity yet)
- [ ] Stripe webhook → set `bazi_reports.is_premium = true` + `leads.conversion_status = 'paid'` + `leads.paid_at`
- [ ] Premium report section (deeper insights, luck pillars) — visible only when `is_premium = true`
- [ ] Transactional confirmation email on payment (Resend — single template)
- [ ] OG image for report URL (social sharing)

**Definition of Done:** Complete payment on Stripe test mode → premium content unlocks on report page → lead status flips to `paid` in admin → confirmation email arrives.

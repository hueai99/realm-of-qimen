# Architecture — Realm of Qimen

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database:** Supabase (Postgres + RLS)
- **AI:** OpenAI GPT-4o via server-side API route (key never in client bundle)
- **Auth (later):** Supabase Auth — magic link or Google OAuth
- **Payments (later):** Stripe payment link

## Now vs Later
| Now (v1) | Later |
|---|---|
| Public intake form + report | User accounts + per-user history |
| AI Bazi generation (server route) | PDF export |
| Lead capture + admin list | Stripe webhook → auto-status flip |
| Permissive RLS (demo-first) | Owner-scoped RLS (lock-down sprint) |

## Key User Action — Step by Step
1. Visitor fills intake form on `/` → client POSTs to `/api/generate-report`
2. Server route validates input, inserts a pending row in `bazi_reports`
3. Server calls OpenAI with birth data + question type → receives pillars + insights
4. Server writes AI output (value, source, confidence, review_status) back to the row
5. Server upserts a `leads` row (name + email + report_id)
6. API returns `report_id` → client redirects to `/report/[id]`
7. Report page fetches row from Supabase, renders pillars + insights + Upgrade CTA
8. Admin visits `/admin/leads`, sees the new lead, updates conversion_status

## Layer Plan
1. **Data layer first** — tables + RLS + seed data; core works even if AI is off (pillars can be blank, form still saves)
2. **App logic** — form → API route → DB read/write; report page renders stored data
3. **Intelligence on top** — OpenAI call enriches the stored row; if it fails, row still exists with empty insights (error state shown)

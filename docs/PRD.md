# PRD — Realm of Qimen

## Problem
Parents want to understand their child's natural strengths; working adults feel stuck and want direction. Both groups have heard of Bazi but have no low-friction way to get a meaningful, personalised reading without booking a full consultation cold.

## Target Users
- Parents (primary): curious about child's learning style, strengths, career fit.
- Working adults (secondary): seeking clarity on career, wealth, or relationships.

## Core Objects
| Object | Purpose |
|---|---|
| `bazi_reports` | The AI-generated reading for one person |
| `leads` | Every email captured + their conversion state |
| `audit_logs` | Record of every meaningful action |

## MVP Must-Haves (v1)
- [ ] Intake form: subject name, birth date, birth time, gender, question type (career / wealth / child potential), email
- [ ] AI generates four Bazi pillars + element profile + top 3 insights, stored in DB
- [ ] Report page renders at `/report/[id]` — publicly viewable (no login required)
- [ ] Lead row created on every form submission (name + email + report link)
- [ ] Upgrade CTA on report page routes to paid consult booking (Calendly / WhatsApp link)
- [ ] 3 seeded demo reports visible on first load
- [ ] Admin `/admin/leads` page: list of leads, conversion status editable, notes field

## Non-Goals (v1)
- User accounts / login wall
- Automated email sequences
- Stripe payments
- PDF generation
- Multi-language

## Success Criteria
**Scenario:** A parent lands on the site, fills in her child's birth details + email, sees a four-pillar Bazi report with personalised insights, clicks the Upgrade CTA, and her lead record appears in `/admin/leads` with status `new`. The builder can flip that status to `paid` after the consult is booked.

**Definition of Done:** This scenario completes without error, every step persists to the database, the report survives a page refresh, and the admin sees the correct lead — confirmed by the manual test plan.

# Data Model — Realm of Qimen

## `bazi_reports`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | owner scope (set at lock-down sprint) |
| created_at | timestamptz | default now() |
| subject_name | text | person being read |
| birth_date | date | required |
| birth_time | time | nullable (affects hour pillar) |
| gender | text | 'male' / 'female' / 'other' |
| question_type | text | 'career' / 'wealth' / 'child_potential' / 'relationship' |
| email | text | lead contact |
| day_pillar | text | AI-generated — stem + branch |
| month_pillar | text | AI-generated |
| year_pillar | text | AI-generated |
| hour_pillar | text | AI-generated (null if no birth time) |
| element_profile | text | AI-generated summary |
| insights | text | **AI field** — top 3 personalised insights |
| insights_source | text | e.g. `openai/gpt-4o` |
| insights_confidence | numeric | 0–1 |
| insights_review_status | text | default `'unreviewed'`; can be `'reviewed'` / `'rejected'` |
| is_premium | boolean | false = free report; true = paid full report |
| is_demo | boolean | marks seeded demo rows |

## `leads`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | owner scope later |
| created_at | timestamptz | |
| name | text | from intake form |
| email | text | |
| report_id | uuid FK → bazi_reports | |
| conversion_status | text | `'new'` / `'contacted'` / `'paid'` |
| notes | text | admin notes |
| paid_at | timestamptz | set when status flips to paid |

## `audit_logs`
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| actor | text | 'system' / 'admin' / user email |
| action | text | e.g. `lead.status_updated` |
| target_table | text | |
| target_id | uuid | |
| payload | jsonb | before/after values |

## RLS
- v1: permissive select + write for all tables (demo-first)
- Lock-down sprint: `auth.uid() = user_id` for `bazi_reports` and `leads`; `audit_logs` admin-only

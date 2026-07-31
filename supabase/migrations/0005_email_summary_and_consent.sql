alter table bazi_reports
  add column if not exists email_summary_requested boolean not null default false,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz,
  add column if not exists email_delivery_status text not null default 'not_requested',
  add column if not exists email_sent_at timestamptz,
  add column if not exists email_delivery_error text;

alter table leads
  add column if not exists email_summary_requested boolean not null default false,
  add column if not exists marketing_consent boolean not null default false,
  add column if not exists marketing_consent_at timestamptz;

alter table bazi_reports
  drop constraint if exists bazi_reports_email_delivery_status_check;

alter table bazi_reports
  add constraint bazi_reports_email_delivery_status_check
  check (email_delivery_status in ('not_requested', 'pending', 'sent', 'failed', 'not_configured'));

create index if not exists leads_email_lookup_idx on leads (lower(email));

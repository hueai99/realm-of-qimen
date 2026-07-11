alter table bazi_reports
  add column if not exists birth_place text,
  add column if not exists parenting_concern text,
  add column if not exists chart_data jsonb,
  add column if not exists chart_status text not null default 'pending',
  add column if not exists report_content jsonb,
  add column if not exists generation_error text;

alter table bazi_reports drop constraint if exists bazi_reports_chart_status_check;
alter table bazi_reports add constraint bazi_reports_chart_status_check
  check (chart_status in ('pending', 'verified', 'unavailable'));

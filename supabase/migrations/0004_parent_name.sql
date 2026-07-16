alter table bazi_reports
  add column if not exists parent_name text;

alter table leads
  add column if not exists parent_name text;

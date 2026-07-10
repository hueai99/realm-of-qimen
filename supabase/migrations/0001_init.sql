create table if not exists bazi_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  subject_name text not null,
  birth_date date not null,
  birth_time time,
  gender text,
  question_type text,
  email text not null,
  day_pillar text,
  month_pillar text,
  year_pillar text,
  hour_pillar text,
  element_profile text,
  insights text,
  insights_source text,
  insights_confidence numeric,
  insights_review_status text default 'unreviewed',
  is_premium boolean not null default false,
  is_demo boolean not null default false
);

alter table bazi_reports enable row level security;

drop policy if exists "bazi_reports_v1_read" on bazi_reports;
create policy "bazi_reports_v1_read" on bazi_reports for select using (true);

drop policy if exists "bazi_reports_v1_write" on bazi_reports;
create policy "bazi_reports_v1_write" on bazi_reports for all using (true) with check (true);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  report_id uuid references bazi_reports(id),
  conversion_status text not null default 'new',
  notes text,
  paid_at timestamptz
);

alter table leads enable row level security;

drop policy if exists "leads_v1_read" on leads;
create policy "leads_v1_read" on leads for select using (true);

drop policy if exists "leads_v1_write" on leads;
create policy "leads_v1_write" on leads for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  actor text,
  action text not null,
  target_table text,
  target_id uuid,
  payload jsonb
);

alter table audit_logs enable row level security;

drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);

drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into bazi_reports (id, subject_name, birth_date, birth_time, gender, question_type, email, day_pillar, month_pillar, year_pillar, hour_pillar, element_profile, insights, insights_source, insights_confidence, insights_review_status, is_premium, is_demo) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Mei Lin (Demo)', '1990-03-15', '08:30', 'female', 'career', 'demo1@example.com', 'Jia Yin (Wood Tiger)', 'Wu Chen (Earth Dragon)', 'Geng Wu (Metal Horse)', 'Bing Xu (Fire Dog)', 'Dominant Wood with Fire output', 'Your chart shows strong creative and leadership potential. The Wood element fuels your drive, while Fire output indicates you excel at inspiring others. Career peak windows appear in years ending with 3 and 8.', 'openai/gpt-4o', 0.82, 'reviewed', false, true),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Kai Ren (Demo)', '1985-11-22', '14:00', 'male', 'wealth', 'demo2@example.com', 'Yi Mao (Wood Rabbit)', 'Ding Hai (Fire Pig)', 'Yi Chou (Wood Ox)', 'Geng Shen (Metal Monkey)', 'Mixed Wood-Metal clash, Water resource needed', 'Your wealth element is present but obstructed by a Wood-Metal clash. Building savings during Water years (years ending 2 and 3) significantly improves financial flow. Avoid speculative investments in Metal-heavy years.', 'openai/gpt-4o', 0.78, 'reviewed', false, true),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Aisha bt Razif (Demo)', '2012-07-04', '06:15', 'female', 'child_potential', 'demo3@example.com', 'Ji Wei (Earth Goat)', 'Ren Wu (Water Horse)', 'Ren Chen (Water Dragon)', 'Jia Yin (Wood Tiger)', 'Strong Water with Earth resource, analytical mind', 'This child has a natural gift for deep thinking and analysis driven by a Water-dominant chart. She thrives with structured learning environments. Creative arts and sciences are strong pathways. Key development years are ages 10–16.', 'openai/gpt-4o', 0.85, 'reviewed', false, true);

insert into leads (name, email, report_id, conversion_status, notes) values
  ('Mei Lin (Demo)', 'demo1@example.com', 'a1b2c3d4-0001-0001-0001-000000000001', 'paid', 'Converted after seeing career section. Booked premium consult.'),
  ('Kai Ren (Demo)', 'demo2@example.com', 'a1b2c3d4-0002-0002-0002-000000000002', 'contacted', 'Interested in wealth consult, follow up scheduled.'),
  ('Aisha bt Razif (Demo)', 'demo3@example.com', 'a1b2c3d4-0003-0003-0003-000000000003', 'new', 'Parent enquired about child potential reading.');
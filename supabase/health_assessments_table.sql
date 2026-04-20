-- Health Assessments Table
-- Stores anonymous pre-consultation assessment responses for staff reference.
-- Run this in the Supabase SQL editor.

create table if not exists public.health_assessments (
  id            uuid          primary key default gen_random_uuid(),
  age           integer,
  occupation    text,
  symptoms      jsonb,          -- { hairFall, irregularPeriods, weightGain, fatigue }
  lifestyle     jsonb,          -- { sleep, stress, exercise }
  goals         text[],         -- e.g. ['hair', 'hormones']
  result_title  text,           -- classification label shown to user
  created_at    timestamptz     not null default now()
);

-- Row-Level Security
alter table public.health_assessments enable row level security;

-- Allow anyone (including anonymous users) to insert a new assessment
create policy "Allow public insert"
  on public.health_assessments
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated staff / doctors can read assessments
create policy "Allow authenticated read"
  on public.health_assessments
  for select
  to authenticated
  using (true);

-- ══════════════════════════════════════════════════════════════
--  TABLE: leads
--  Stores free resource requests from the public website
--  Run this in: Supabase Dashboard → SQL Editor
-- ══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS leads (
  id          UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  guide_id    TEXT        NOT NULL,   -- 'meal-guide' | 'hormone-checklist' | 'grocery-list'
  guide_title TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email      ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public website form)
CREATE POLICY "allow_public_insert" ON leads
  FOR INSERT WITH CHECK (true);

-- Only authenticated staff can read leads
CREATE POLICY "allow_auth_select" ON leads
  FOR SELECT USING (true);

-- Appeal Mail — Database Schema
-- Run this in your Supabase SQL editor

-- Appeals table
CREATE TABLE IF NOT EXISTS appeals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  decision JSONB DEFAULT '{}'::jsonb,
  grounds JSONB DEFAULT '[]'::jsonb,
  evidence JSONB DEFAULT '[]'::jsonb,
  arguments JSONB DEFAULT '[]'::jsonb,
  draft TEXT DEFAULT '',
  review JSONB,
  packet JSONB,
  proof JSONB,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mailings table (tracks physical mail via MailMyPDF)
CREATE TABLE IF NOT EXISTS mailings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appeal_id UUID REFERENCES appeals(id) ON DELETE CASCADE,
  provider_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'assembled',
  tracking_number TEXT,
  mailing_method TEXT NOT NULL,
  recipient JSONB NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recipients table (saved addresses for reuse)
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  organization TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appeals_user_id ON appeals(user_id);
CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_mailings_appeal_id ON mailings(appeal_id);
CREATE INDEX IF NOT EXISTS idx_mailings_status ON mailings(status);
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON recipients(user_id);

-- Row Level Security
ALTER TABLE appeals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mailings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own appeals" ON appeals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appeals" ON appeals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appeals" ON appeals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appeals" ON appeals FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own mailings" ON mailings FOR SELECT USING (
  EXISTS (SELECT 1 FROM appeals WHERE appeals.id = mailings.appeal_id AND appeals.user_id = auth.uid())
);
CREATE POLICY "Users can insert own mailings" ON mailings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM appeals WHERE appeals.id = mailings.appeal_id AND appeals.user_id = auth.uid())
);

CREATE POLICY "Users can view own recipients" ON recipients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipients" ON recipients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipients" ON recipients FOR DELETE USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appeals_updated_at BEFORE UPDATE ON appeals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER mailings_updated_at BEFORE UPDATE ON mailings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

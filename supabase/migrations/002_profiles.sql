-- Create profiles table for user onboarding data
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  primary_goal TEXT CHECK (primary_goal IN ('focus', 'posture', 'both')),
  daily_target INT CHECK (daily_target IN (25, 50, 90)) DEFAULT 25,
  timezone TEXT DEFAULT 'America/New_York',
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON profiles FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON profiles FOR UPDATE USING (true);

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

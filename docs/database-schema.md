# Supabase Schema

## Table: `sessions`

| Column              | Type      | Description                    |
| ------------------- | --------- | ------------------------------ |
| `id`                | uuid      | Primary key                    |
| `user_id`           | text      | Clerk user ID                  |
| `start_time`        | timestamp | Session start                  |
| `end_time`          | timestamp | Session end                    |
| `notes`             | text      | Session title/name             |
| `posture`           | float[]   | Array of posture scores (0-1)  |
| `focus_duration_mins` | int     | Total session minutes          |
| `created_at`        | timestamp | Record creation time           |

## Table: `biometric_logs`

| Column       | Type                        | Description                         |
| ------------ | --------------------------- | ----------------------------------- |
| `id`         | uuid                        | Primary key                         |
| `session_id` | uuid                        | Foreign key to `sessions`           |
| `timestamp`  | timestamp                   | When this log was recorded          |
| `score`      | float                       | Score value (0-1)                   |
| `type`       | text (posture/pause/resume) | Type of biometric/event measurement |

### Log Types

| Type    | Description                         |
| ------- | ----------------------------------- |
| posture | Posture score captured at intervals |
| pause   | User paused the session             |
| resume  | User resumed the session            |
| fatigue | Fatigue detection score (future)    |

## Table: `profiles`

| Column         | Type      | Description                              |
| -------------- | --------- | ---------------------------------------- |
| `id`           | uuid      | Primary key                              |
| `user_id`      | text      | Clerk user ID (unique)                   |
| `first_name`   | text      | User's first name                        |
| `last_name`    | text      | User's last name                         |
| `primary_goal` | text      | posture (simplified)                     |
| `daily_target` | int       | Target session duration (25/50/90 mins)  |
| `timezone`     | text      | User's timezone (e.g., America/New_York) |
| `onboarded`    | boolean   | Whether user completed onboarding        |
| `created_at`   | timestamp | Profile creation time                    |
| `updated_at`   | timestamp | Last update time                         |

## Table: `user_stats`

| Column              | Type      | Description             |
| ------------------- | --------- | ----------------------- |
| `id`                | uuid      | Primary key             |
| `user_id`           | text      | Clerk user ID (unique)  |
| `current_streak`    | int       | Current day streak      |
| `longest_streak`    | int       | All-time longest streak |
| `total_focus_hours` | float     | Total session hours     |
| `global_rank`       | int       | Leaderboard position    |
| `last_session_date` | date      | Date of last session    |
| `updated_at`        | timestamp | Last update time        |

## SQL Migration

```sql
-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  notes TEXT,
  posture FLOAT[] DEFAULT ARRAY[]::FLOAT[],
  focus_duration_mins INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create biometric_logs table
CREATE TABLE biometric_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  score FLOAT NOT NULL CHECK (score >= 0 AND score <= 1),
  type TEXT NOT NULL CHECK (type IN ('posture', 'pause', 'resume', 'fatigue'))
);

-- Create user_stats table
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  total_focus_hours FLOAT DEFAULT 0,
  global_rank INT DEFAULT 9999,
  last_session_date DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table (for onboarding data)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  primary_goal TEXT DEFAULT 'posture',
  daily_target INT CHECK (daily_target IN (25, 50, 90)) DEFAULT 25,
  timezone TEXT DEFAULT 'America/New_York',
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_start_time ON sessions(start_time);
CREATE INDEX idx_biometric_logs_session_id ON biometric_logs(session_id);
CREATE INDEX idx_biometric_logs_timestamp ON biometric_logs(timestamp);
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE biometric_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies (permissive for development)
CREATE POLICY "Enable read access for all users" ON sessions FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON sessions FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON biometric_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON biometric_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read access for all users" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON user_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON user_stats FOR UPDATE USING (true);
```

## Future: Fatigue Detection

MediaPipe Face Mesh can detect fatigue through:

- **Eye Aspect Ratio (EAR)** — detecting drowsy/closing eyes
- **Blink rate** — slower blinks indicate tiredness
- **Yawn detection** — via mouth landmarks
- **Head drooping** — via head pose estimation

This will be added as a `fatigue` type in `biometric_logs` in a future update.

## Seed Data

See `supabase/seed.sql` for example data to populate your database.

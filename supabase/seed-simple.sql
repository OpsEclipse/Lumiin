-- Lumiin Seed Data (Simple Version)
-- ==================================
--
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID in ALL places below
-- 2. Run the migration first (see docs/database-schema.md)
-- 3. Then run this seed file in the Supabase SQL Editor
--
-- To find your Clerk user ID:
-- - Open browser dev tools while signed into your app
-- - Run: await window.Clerk.user.id
-- - Or check Clerk dashboard > Users

-- =====================
-- USER STATS
-- =====================
INSERT INTO user_stats (user_id, current_streak, longest_streak, total_focus_hours, global_rank, last_session_date, updated_at)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  12,                     -- current streak (days)
  21,                     -- longest streak ever
  48.5,                   -- total focus hours
  842,                    -- global rank
  CURRENT_DATE,           -- last session date
  NOW()                   -- updated at
)
ON CONFLICT (user_id) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  total_focus_hours = EXCLUDED.total_focus_hours,
  global_rank = EXCLUDED.global_rank,
  last_session_date = EXCLUDED.last_session_date,
  updated_at = NOW();

-- =====================
-- SESSIONS
-- =====================

-- Today: Coding session (2 hours ago)
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '15 minutes',
  'Worked on dashboard implementation',
  ARRAY[0.88, 0.90, 0.85, 0.88]::FLOAT[],   -- posture score array
  105    -- minutes
);

-- Today: Writing session (6 hours ago)
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '4 hours',
  'Documentation and planning',
  ARRAY[0.72, 0.75, 0.70, 0.72]::FLOAT[],
  120
);

-- Yesterday: Reading session
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '1 day 3 hours',
  NOW() - INTERVAL '1 day 1 hour',
  'Research and learning',
  ARRAY[0.82, 0.80, 0.85]::FLOAT[],
  90
);

-- Yesterday: Meeting
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '1 day 6 hours',
  NOW() - INTERVAL '1 day 5 hours',
  'Team standup and planning',
  ARRAY[0.65, 0.60, 0.70]::FLOAT[],
  45
);

-- 2 days ago: Coding
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '2 days 4 hours',
  NOW() - INTERVAL '2 days 2 hours',
  'Feature development',
  ARRAY[0.90, 0.88, 0.92, 0.90]::FLOAT[],
  120
);

-- 3 days ago: Coding
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '3 days 5 hours',
  NOW() - INTERVAL '3 days 3 hours',
  'Bug fixes',
  ARRAY[0.85, 0.88, 0.82]::FLOAT[],
  120
);

-- 3 days ago: Writing
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '3 days 8 hours',
  NOW() - INTERVAL '3 days 6 hours',
  'Technical writing',
  ARRAY[0.78, 0.80, 0.75]::FLOAT[],
  120
);

-- 4 days ago: Coding
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '4 days 3 hours',
  NOW() - INTERVAL '4 days 1 hour',
  'API development',
  ARRAY[0.92, 0.90, 0.94]::FLOAT[],
  120
);

-- 5 days ago: Reading
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '5 days 4 hours',
  NOW() - INTERVAL '5 days 3 hours',
  'Weekend reading',
  ARRAY[0.80, 0.75, 0.85]::FLOAT[],
  60
);

-- 6 days ago: Coding
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES (
  'YOUR_CLERK_USER_ID',  -- <-- REPLACE THIS
  NOW() - INTERVAL '6 days 5 hours',
  NOW() - INTERVAL '6 days 3 hours',
  'Weekend project',
  ARRAY[0.75, 0.70, 0.80]::FLOAT[],
  75
);

-- =====================
-- VERIFY DATA
-- =====================
SELECT 'Seed complete! Verify your data:' as message;
SELECT * FROM user_stats WHERE user_id = 'YOUR_CLERK_USER_ID';
SELECT id, start_time, notes, posture, duration_mins
FROM sessions
WHERE user_id = 'YOUR_CLERK_USER_ID'
ORDER BY start_time DESC
LIMIT 10;

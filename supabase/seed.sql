-- Lumiin Seed Data
-- =================
--
-- IMPORTANT: Replace 'YOUR_CLERK_USER_ID' with your actual Clerk user ID.
-- You can find your Clerk user ID by:
-- 1. Opening the browser dev tools while signed in
-- 2. Running: await window.Clerk.user.id
-- Or check the Clerk dashboard under Users
--
-- Example Clerk user ID format: user_2abc123def456

-- Set your Clerk user ID here
DO $$
DECLARE
  v_user_id TEXT := 'YOUR_CLERK_USER_ID'; -- <-- REPLACE THIS
  v_session_id UUID;
  v_now TIMESTAMPTZ := NOW();
BEGIN

-- Insert user stats
INSERT INTO user_stats (user_id, current_streak, longest_streak, total_focus_hours, global_rank, last_session_date, updated_at)
VALUES (v_user_id, 12, 21, 48.5, 842, CURRENT_DATE, v_now)
ON CONFLICT (user_id) DO UPDATE SET
  current_streak = EXCLUDED.current_streak,
  longest_streak = EXCLUDED.longest_streak,
  total_focus_hours = EXCLUDED.total_focus_hours,
  global_rank = EXCLUDED.global_rank,
  last_session_date = EXCLUDED.last_session_date,
  updated_at = v_now;

-- Insert sessions from the past week
-- Today's sessions
-- Insert sessions from the past week
-- Today's sessions
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '2 hours', v_now - INTERVAL '15 minutes', 'Worked on dashboard implementation', ARRAY[0.88, 0.90, 0.85]::FLOAT[], 105),
  (v_user_id, v_now - INTERVAL '6 hours', v_now - INTERVAL '4 hours', 'Documentation and planning', ARRAY[0.72, 0.75, 0.70]::FLOAT[], 120)
RETURNING id INTO v_session_id;

-- Yesterday's sessions
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '1 day' - INTERVAL '3 hours', v_now - INTERVAL '1 day' - INTERVAL '1 hour', 'Research and learning', ARRAY[0.82, 0.80]::FLOAT[], 90),
  (v_user_id, v_now - INTERVAL '1 day' - INTERVAL '6 hours', v_now - INTERVAL '1 day' - INTERVAL '5 hours 15 minutes', 'Team standup and planning', ARRAY[0.65, 0.60]::FLOAT[], 45);

-- 2 days ago
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '2 days' - INTERVAL '4 hours', v_now - INTERVAL '2 days' - INTERVAL '2 hours', 'Feature development', ARRAY[0.90, 0.88, 0.92]::FLOAT[], 120);

-- 3 days ago
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '3 days' - INTERVAL '5 hours', v_now - INTERVAL '3 days' - INTERVAL '3 hours', 'Bug fixes', ARRAY[0.85, 0.88]::FLOAT[], 120),
  (v_user_id, v_now - INTERVAL '3 days' - INTERVAL '8 hours', v_now - INTERVAL '3 days' - INTERVAL '6 hours', 'Technical writing', ARRAY[0.78, 0.80]::FLOAT[], 120);

-- 4 days ago
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '4 days' - INTERVAL '3 hours', v_now - INTERVAL '4 days' - INTERVAL '1 hour', 'API development', ARRAY[0.92, 0.90]::FLOAT[], 120);

-- 5 days ago
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '5 days' - INTERVAL '4 hours', v_now - INTERVAL '5 days' - INTERVAL '3 hours', 'Weekend reading', ARRAY[0.80, 0.75]::FLOAT[], 60);

-- 6 days ago
INSERT INTO sessions (user_id, start_time, end_time, notes, posture, duration_mins)
VALUES
  (v_user_id, v_now - INTERVAL '6 days' - INTERVAL '5 hours', v_now - INTERVAL '6 days' - INTERVAL '3 hours 45 minutes', 'Weekend project', ARRAY[0.75, 0.70]::FLOAT[], 75);

END $$;

-- Verify the data was inserted
SELECT 'User Stats:' as info;
SELECT * FROM user_stats LIMIT 5;

SELECT 'Recent Sessions:' as info;
SELECT id, user_id, start_time, notes, posture, duration_mins
FROM sessions
ORDER BY start_time DESC
LIMIT 10;

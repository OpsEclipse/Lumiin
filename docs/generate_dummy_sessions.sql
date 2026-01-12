-- Instructions: 
-- 1. Replace 'YOUR_USER_ID_HERE' with your actual Clerk User ID (found in Clerk dashboard or 'profiles' table).
-- 2. Run this in the Supabase SQL Editor to populate dummy data.

DO $$
DECLARE
    target_user_id TEXT := 'YOUR_USER_ID_HERE';
BEGIN
    -- 1. (Optional) Clear existing sessions for a clean slate
    -- DELETE FROM sessions WHERE user_id = target_user_id;

    -- 2. Insert dummy sessions for the last 7 days
    INSERT INTO sessions (user_id, notes, start_time, end_time, focus_duration_mins, posture)
    VALUES
    -- Today
    (target_user_id, 'Deep Work Session', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour', 60, ARRAY[0.85, 0.9, 0.88, 0.92]),
    (target_user_id, 'Quick Review', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 30 minutes', 30, ARRAY[0.75, 0.8, 0.78]),
    
    -- Yesterday (-1 day)
    (target_user_id, 'Coding Sprint', NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 2 hours', 60, ARRAY[0.9, 0.95, 0.92]),
    (target_user_id, 'Email Catchup', NOW() - INTERVAL '1 day 7 hours', NOW() - INTERVAL '1 day 6 hours 15 minutes', 45, ARRAY[0.65, 0.7, 0.68]),
    
    -- -2 days
    (target_user_id, 'Project Planning', NOW() - INTERVAL '2 days 4 hours', NOW() - INTERVAL '2 days 3 hours 10 minutes', 50, ARRAY[0.8, 0.82, 0.81]),
    
    -- -3 days
    (target_user_id, 'Reading & Research', NOW() - INTERVAL '3 days 2 hours', NOW() - INTERVAL '3 days 1 hour', 60, ARRAY[0.88, 0.9, 0.89]),
    (target_user_id, 'Documentation', NOW() - INTERVAL '3 days 6 hours', NOW() - INTERVAL '3 days 5 hours', 60, ARRAY[0.7, 0.72, 0.71]),
    (target_user_id, 'Late Night Focus', NOW() - INTERVAL '3 days 14 hours', NOW() - INTERVAL '3 days 13 hours 30 minutes', 30, ARRAY[0.6, 0.55, 0.6]),

    -- -4 days
    (target_user_id, 'Morning Focus', NOW() - INTERVAL '4 days 1 hour', NOW() - INTERVAL '4 days 25 minutes', 35, ARRAY[0.9, 0.92, 0.91]),
    (target_user_id, 'Afternoon Grind', NOW() - INTERVAL '4 days 5 hours', NOW() - INTERVAL '4 days 4 hours', 60, ARRAY[0.75, 0.78, 0.76]),
    
    -- -5 days
    (target_user_id, 'System Design', NOW() - INTERVAL '5 days 3 hours', NOW() - INTERVAL '5 days 2 hours', 60, ARRAY[0.85, 0.88, 0.86]),
    (target_user_id, 'Meeting Prep', NOW() - INTERVAL '5 days 8 hours', NOW() - INTERVAL '5 days 7 hours 45 minutes', 15, ARRAY[0.7, 0.75]),

    -- -6 days
    (target_user_id, 'Weekly Review', NOW() - INTERVAL '6 days 11 hours', NOW() - INTERVAL '6 days 10 hours', 60, ARRAY[0.8, 0.82, 0.81]),
    (target_user_id, 'Planning', NOW() - INTERVAL '6 days 14 hours', NOW() - INTERVAL '6 days 13 hours 30 minutes', 30, ARRAY[0.7, 0.75]);

    -- 3. Update User Stats based on this new data
    -- Just in case the user row doesn't exist, we upsert.
    INSERT INTO user_stats (user_id, total_focus_hours, current_streak, longest_streak, last_session_date, updated_at)
    VALUES (
        target_user_id, 
        (SELECT COALESCE(SUM(focus_duration_mins), 0)::float / 60.0 FROM sessions WHERE user_id = target_user_id), 
        7, -- Setting a dummy streak of 7 since we inserted data for every day 
        7, 
        CURRENT_DATE,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_focus_hours = EXCLUDED.total_focus_hours,
        current_streak = EXCLUDED.current_streak,
        longest_streak = GREATEST(user_stats.longest_streak, EXCLUDED.longest_streak),
        last_session_date = EXCLUDED.last_session_date,
        updated_at = EXCLUDED.updated_at;

END $$;

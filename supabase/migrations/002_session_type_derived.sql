-- Migration: Update sessions table to use is_pomodoro instead of session_type/activity_type
-- Session types (Deep Work/Standard) are now derived from focus_duration_mins:
--   Deep Work: focus_duration_mins > 180 (more than 3 hours)
--   Standard:  focus_duration_mins <= 180
--   Pomodoro:  is_pomodoro = TRUE (future feature)

-- Step 1: Add the new is_pomodoro column
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_pomodoro BOOLEAN DEFAULT FALSE;

-- Step 2: Drop the session_type column if it exists
-- (Uncomment if you have the session_type column)
-- ALTER TABLE sessions DROP COLUMN IF EXISTS session_type;

-- Step 3: Drop the activity_type column if it exists
-- (Uncomment if you have the activity_type column)
-- ALTER TABLE sessions DROP COLUMN IF EXISTS activity_type;

-- Verify the schema
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'sessions';

# Project Lumiin: AI-Native Posture & Study Partner

## Quick Reference

| Document                           | Purpose                        |
| ---------------------------------- | ------------------------------ |
| This file                          | High-level vision & architecture |
| `docs/database-schema.md`          | Supabase schema and SQL        |
| `docs/mediapipe-implementation.md` | CV technical details           |
| `.claude/skills/frontend/`         | Design system & components     |

---

## 1. Vision

Lumiin is a **Posture & Study Accountability Partner** that uses webcam-based computer vision to monitor posture in real-time during work and study sessions. The goal is to help users maintain healthy posture habits while tracking their productivity.

## 2. Tech Stack

- **Framework:** Next.js 16+ (App Router, TypeScript, React Compiler)
- **Authentication:** Clerk
- **Database/Backend:** Supabase (PostgreSQL)
- **Computer Vision:** MediaPipe Pose Landmarker
- **Styling:** Tailwind CSS v4, Framer Motion
- **Charts:** Recharts
- **Icons:** Phosphor Icons

## 3. Core Architectural Rules

- **Privacy First:** No video frames are ever uploaded. All CV inference happens client-side.
- **Lightweight Persistence:** Only numerical posture scores (0.0 to 1.0) are persisted to Supabase.
- **Real-time Sync:** Posture data synced every 30 seconds during active sessions.

## 4. Session Flow

### Setup (`/focus`)
1. Camera permission request
2. 3-second calibration to capture baseline posture metrics
3. Session naming
4. Start session

### Active Session (`/focus/active`)
- Real-time posture detection at 200ms intervals
- Posture score calculated against calibrated baseline
- Logs collected every 5 seconds
- Synced to Supabase every 30 seconds via PUT `/api/sessions`
- Pause/resume functionality

### Summary (`/focus/summary`)
- Final sync of remaining logs
- Displays: duration, posture grade (A-D), posture over time chart, pause count
- Options: start new session or return to dashboard

## 5. Key Components

### Posture Detection
- Uses MediaPipe Pose Landmarker (33 landmarks)
- Tracks: slump (vertical compression), lean (shoulder tilt), turtle neck (forward head)
- Score: 0.0-1.0 based on deviation from baseline
- Weighted: Slump 50%, Turtle 30%, Lean 20%

### Dashboard (`/dashboard`)
- **StatCards:** Current streak, total hours, global rank
- **WeeklyChart:** Duration + posture trends (AreaChart + Line)
- **FocusHeatmap:** Hour-of-day session patterns
- **SessionsTable:** Recent session history

### Analytics (`/dashboard/analytics`)
- **PostureTrendChart:** Daily average posture over selected period
- **HourlyPostureChart:** Best/worst hours for posture (colored bars)
- **FatigueChart:** Posture degradation over session duration
- **RecentAlerts:** AI-generated insights based on patterns

## 6. Scoring

### Posture Score
- Continuous 0-1 based on deviation from calibrated baseline
- Visual indicator: Green (≥75%), Amber (≥50%), Red (<50%)

### Session Points (for leaderboard)
```
Session Points = Duration (minutes) × Average Posture Score
```

## 7. API Endpoints

### POST `/api/sessions`
Creates new session record with empty posture array.

### PUT `/api/sessions`
Updates existing session:
- Merges new posture scores into array
- Updates `focus_duration_mins`
- Updates `user_stats` (streak, total hours)

### GET/POST `/api/profile`
Read/update user profile from `profiles` table.

## 8. Database Tables

| Table           | Purpose                              |
| --------------- | ------------------------------------ |
| `sessions`      | Session records with posture arrays  |
| `biometric_logs`| Detailed timestamped events          |
| `profiles`      | User preferences from onboarding     |
| `user_stats`    | Streaks, hours, rank                 |

See `docs/database-schema.md` for full schema.

## 9. Future Features

### Fatigue Detection
MediaPipe Face Mesh can detect fatigue through:
- Eye Aspect Ratio (EAR) — drowsy eyes
- Blink rate — slower blinks indicate tiredness
- Yawn detection — via mouth landmarks
- Head drooping — via head pose estimation

### Native App
Menubar companion for system-level notifications.

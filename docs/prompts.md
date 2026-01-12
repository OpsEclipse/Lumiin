# Claude Code Prompts for Lumiin

Copy-paste these prompts to implement each slice. Replace `XX` with the slice number.

---

## Starting a New Slice

```
Implement docs/slices/XX-name.md

Rules:
1. Read the slice document first
2. Complete ALL acceptance criteria listed
3. Do NOT implement features from other slices
4. Create only the files listed in "Files to Create"
5. Follow the coding standards in .claude/rules/typescript.md
6. When done, list what was completed
```

---

## Specific Slice Prompts

### Slice 01: Foundation

```
Implement docs/slices/01-foundation.md

This is the first slice. Set up:
- Dependencies (Clerk, Supabase, MediaPipe, Framer Motion, Recharts)
- Clerk authentication with protected routes
- Supabase client and run the migration from docs/database-schema.md
- Dark mode layout with /session placeholder page

Stop after the acceptance criteria are met. Do not start calibration logic.
```

### Slice 02: Calibration

```
Implement docs/slices/02-calibration.md

Prerequisites: Slice 01 must be complete.

Build the calibration flow:
- Webcam permission handling with error states
- MediaPipe Pose Landmarker setup
- CalibrationRitual component with ghost overlay
- 30-frame baseline capture
- Session state context

Refer to docs/mediapipe-implementation.md for landmark indices.
Stop after calibration works. Do not add scoring or persistence.
```

### Slice 03: Real-Time Feedback

```
Implement docs/slices/03-realtime-feedback.md

Prerequisites: Slice 02 must be complete (calibration working).

Build real-time feedback:
- Posture scoring against baseline
- Gaze stability detection (Face Landmarker)
- FocusGlow component with color transitions
- Distraction state detection

Refer to docs/mediapipe-implementation.md for scoring formula.
Stop after visual feedback works. Do not add database persistence.
```

### Slice 04: Persistence (MVP)

```
Implement docs/slices/04-persistence.md

Prerequisites: Slice 03 must be complete (real-time scoring working).

Build session persistence:
- Create session on start, update on end
- Log biometrics every 30 seconds
- SessionTimeline component
- Session history page

This completes the MVP. Stop after sessions are being saved.
```

### Slice 05: Analytics

```
Implement docs/slices/05-analytics.md

Prerequisites: Slice 04 complete with saved session data.

Build the analytics dashboard:
- Fetch aggregated data
- Focus line chart (Recharts)
- Posture area chart
- Stats cards
- Date range selector

Stop after dashboard displays real data.
```

### Slice 06: Social

```
Implement docs/slices/06-social.md

Prerequisites: Slice 05 complete.

Build social features:
- User profiles table and settings page
- LumiinLeaderboard component
- Friend connections
- Weekly challenges (optional)

This is the final planned slice.
```

---

## After Each Slice

Run this to update documentation:

```
/update-docs
```

Then manually check off completed items in `docs/roadmap.md`.

---

## If Something Goes Wrong

```
Stop. Read docs/slices/XX-name.md again.

You are implementing slice XX. The acceptance criteria are:
[paste the criteria from the slice doc]

Show me what's done and what's remaining.
```

---

## Quick Context Reset

If Claude seems confused mid-implementation:

```
Focus on docs/slices/XX-name.md only.

Current task: [specific item from the slice]
Do not add features from future slices.
What files still need to be created or modified?
```

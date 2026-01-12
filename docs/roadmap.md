# Lumiin Development Roadmap

Simple iteration-based development. Each version is a complete, shippable milestone.

---

## Version Overview

| Version | Focus                      | Status         |
| ------- | -------------------------- | -------------- |
| **v1**  | Landing Page & UI          | ✅ Complete    |
| **v2**  | Dashboard & Authentication | ✅ Complete    |
| **v3**  | Session & CV               | 🔄 In Progress |

---

## v1 - Landing Page & UI Foundation ✅

**Goal:** Beautiful landing page with component-based architecture and unified design system.

**Completed:**

- [x] Next.js 16 + React 19 project setup
- [x] Tailwind CSS v4 with custom design tokens
- [x] Brussels Minimalist design system (Amber primary, sharp edges)
- [x] shadcn/ui components installed (button, card, input, table, badge, separator)
- [x] Phosphor Icons integrated
- [x] Landing page components (hero, features, pricing, footer)
- [x] Dark mode default
- [x] Frontend skill documentation

---

## v2 - Dashboard & Authentication ✅

**Goal:** Authenticated dashboard with real data from Supabase.

**Completed:**

- [x] Clerk authentication (replaced mock auth)
- [x] Protected routes middleware
- [x] Dashboard layout with sidebar navigation
- [x] Stat cards (streak, session hours, rank)
- [x] Weekly performance chart (Recharts)
- [x] Session intensity heatmap
- [x] Recent sessions table
- [x] Supabase integration for session data
- [x] User profile page
- [x] Onboarding wizard

**Reference Docs:**

- `docs/dashboard/` - UI specifications
- `docs/database-schema.md` - Supabase tables

---

## v3 - Session & Computer Vision 🔄

**Goal:** Working study/work session with webcam-based posture tracking.

**Tasks:**

- [x] Session setup wizard (camera permission, calibration)
- [x] Active session UI with timer
- [x] Webcam preview with live feed
- [x] Pause/Resume functionality
- [x] Session summary on completion
- [x] API route for saving sessions
- [x] Start Session button in dashboard and sidebar
- [ ] MediaPipe Pose Landmarker integration
- [ ] Real-time posture scoring algorithm
- [ ] PostureGlow visual feedback (corner indicators)
- [ ] Biometric logging to Supabase (at intervals)
- [ ] Calibration flow (baseline capture)

**Reference Docs:**

- `docs/mediapipe-implementation.md` - CV technical details
- `docs/project_overview.md` - Scoring logic

---

## Future Ideas (Post v3)

- Fatigue detection via Face Mesh (eye tracking, yawn detection)
- Leaderboards & social features
- Break reminders with stretches
- Mobile companion app
- Team/workspace dashboards
- Pomodoro timer mode

---

## How to Continue v3

```
Continue implementing v3 of Lumiin - Session & Computer Vision.

Reference:
- docs/roadmap.md (this file) for task list
- docs/mediapipe-implementation.md for CV setup
- docs/project_overview.md for scoring logic

Next steps:
1. Integrate MediaPipe Pose Landmarker
2. Implement real-time posture scoring
3. Add PostureGlow visual feedback
4. Connect biometric logging to Supabase
```

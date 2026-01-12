# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

**Always ask clarifying questions to address ambiguities before implementing.** Don't make assumptions—confirm requirements, approach, or design decisions when unclear.

## Project Overview

**Lumiin** is a posture & study accountability partner that uses webcam-based computer vision (MediaPipe) to monitor posture in real-time. All CV inference happens client-side—no video is ever uploaded.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Architecture

Next.js 16 (App Router) + React 19 with React Compiler enabled.

### Tech Stack
- **Auth:** Clerk (with onboarding flow via profiles table)
- **Database:** Supabase (PostgreSQL with RLS)
- **Computer Vision:** MediaPipe Pose Landmarker (client-side)
- **Styling:** Tailwind CSS v4, Framer Motion
- **Charts:** Recharts
- **Icons:** Phosphor Icons

### Route Structure
```
/                     # Landing page (public)
/sign-in, /sign-up    # Clerk auth (public)
/onboarding           # Post-signup onboarding (protected)
/dashboard            # Overview with stats, weekly chart, heatmap
/dashboard/analytics  # Detailed posture trends, hourly patterns, fatigue
/dashboard/sessions   # Session history table
/dashboard/profile    # User profile settings
/dashboard/settings   # App settings
/focus                # Session setup (camera, calibration)
/focus/active         # Active session with real-time posture tracking
/focus/summary        # Post-session summary
```

**Middleware:** `src/middleware.ts` protects routes and redirects non-onboarded users.

### Key Files
- `src/lib/supabase.ts` - Supabase client + TypeScript types
- `src/lib/mediapipe-utils.ts` - Pose detection, calibration, posture scoring
- `src/lib/dashboard-data.ts` - Dashboard data fetching functions
- `src/lib/analytics-data.ts` - Analytics data aggregation
- `src/app/api/sessions/route.ts` - Session CRUD API (POST creates, PUT updates)
- `src/components/ui/` - shadcn/ui components

### Session Data Flow
1. `/focus` - User calibrates posture baseline (3 seconds)
2. `/focus/active` - Session created via POST `/api/sessions`, posture logged every 5s, synced every 30s via PUT
3. `/focus/summary` - Final sync, displays session metrics from sessionStorage
4. Dashboard reads from Supabase `sessions` table

## TypeScript Conventions

- PascalCase for interfaces, types, classes, components
- camelCase for functions, variables, methods
- SCREAMING_SNAKE_CASE for constants
- kebab-case for file names
- No `any` without explicit justification comment
- Explicit return types on exported functions
- Group imports: external → internal → relative

## UI Development

**When given a screenshot or mockup**, read `.claude/skills/frontend/SKILL.md` first, then:

1. Use shadcn/ui components from `@/components/ui/`
2. Use Phosphor icons from `@phosphor-icons/react`
3. Apply Brussels Minimalist design (Amber `#F59E0B` primary, sharp edges)
4. Follow typography rules (uppercase tracking for labels)

**Add new shadcn components:** `npx shadcn@latest add [component] --yes`

## Database

Schema in `docs/database-schema.md`. Key tables:
- `sessions` - `posture` (float[]), `focus_duration_mins`, timestamps
- `biometric_logs` - Detailed posture/pause/resume events per session
- `profiles` - User onboarding preferences
- `user_stats` - Streaks, total hours, rank

## Skills

| Skill               | Path                                  | Purpose                                      |
| ------------------- | ------------------------------------- | -------------------------------------------- |
| **frontend**        | `.claude/skills/frontend/`            | Design system, shadcn/ui, screenshot-to-code |
| react-useeffect     | `.claude/skills/react-useeffect/`     | When to use/avoid useEffect                  |
| planning-with-files | `.claude/skills/planning-with-files/` | Task breakdown methodology                   |

## Documentation

- `docs/project_overview.md` - Vision, architecture, components
- `docs/database-schema.md` - Supabase schema + SQL migrations
- `docs/mediapipe-implementation.md` - CV landmarks and scoring logic

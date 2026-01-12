# Design System

This document defines the visual foundation for the Lumiin landing page.

---

## Color Palette

### Primary Colors

```css
--primary: #3b82f6; /* Bright focus blue */
--primary-dark: #1d4ed8; /* Hover state */
```

### Background Colors

```css
--background-light: #ffffff;
--background-dark: #0a0a0a;
--surface-light: #f3f4f6;
--surface-dark: #171717;
```

### Text Colors

```css
--text-light: #111827;
--text-dark: #f9fafb;
```

### Accents & Semantic

```css
--accent: #f59e0b; /* Amber accent for highlights */
--success: #22c55e; /* Green for checkmarks/status */
--indigo: #6366f1; /* Used in Review step icon */
```

---

## Typography

### Font Families

| Type    | Font Stack                        | Usage     |
| ------- | --------------------------------- | --------- |
| Display | `'Plus Jakarta Sans', sans-serif` | Headings  |
| Body    | `'Inter', sans-serif`             | Body text |

### Font Weights

- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (Semibold)
- 700 (Bold)
- 800 (Extra Bold)

### Font Sizes (Tailwind Scale)

| Class      | Size     | Usage                      |
| ---------- | -------- | -------------------------- |
| `text-xs`  | 0.75rem  | Helper text, badges        |
| `text-sm`  | 0.875rem | Nav links, body small      |
| `text-lg`  | 1.125rem | Body large, descriptions   |
| `text-xl`  | 1.25rem  | Card titles                |
| `text-3xl` | 1.875rem | Section headings (mobile)  |
| `text-4xl` | 2.25rem  | Section headings (desktop) |
| `text-5xl` | 3rem     | Hero heading (mobile)      |
| `text-7xl` | 4.5rem   | Hero heading (desktop)     |

---

## Border Radius

```css
--radius-default: 0.5rem; /* 8px - buttons, inputs */
--radius-xl: 1rem; /* 16px - cards */
--radius-2xl: 1.5rem; /* 24px - large containers */
--radius-full: 9999px; /* Pill buttons, avatars */
```

**Tailwind classes:**

- `rounded` - Default 8px
- `rounded-lg` - 8px (buttons)
- `rounded-xl` - 12px
- `rounded-2xl` - 16px (cards)
- `rounded-3xl` - 24px (pricing container)
- `rounded-full` - Pill shape

---

## Shadows

### Standard Shadows

```css
shadow-sm      /* Subtle card shadow */
shadow-lg      /* Button shadow */
shadow-xl      /* Hero CTA shadow */
shadow-2xl     /* Laptop mockup, pricing container */
```

### Colored Shadows

```css
shadow-primary/20    /* Blue glow for buttons */
shadow-primary/25    /* Stronger glow for primary CTAs */
shadow-primary/40    /* Hover state enhancement */
```

### Custom Glow

```css
/* FocusGlow bar */
shadow-[0_0_15px_rgba(245,158,11,0.5)]
```

---

## Animations

### Tailwind Animations

| Class           | Effect        | Usage            |
| --------------- | ------------- | ---------------- |
| `animate-ping`  | Outward pulse | Live status dots |
| `animate-pulse` | Opacity pulse | FocusGlow bar    |

### Custom Animation

```css
/* Slow pulse for CV overlay indicators */
@keyframes pulse-slow {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}
animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

**Tailwind config:**

```js
animation: {
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

### Transitions

| Classes                          | Usage                   |
| -------------------------------- | ----------------------- |
| `transition-all duration-300`    | Cards, complex hovers   |
| `transition-colors duration-300` | Text/background changes |
| `transition-transform`           | Icon movements          |

---

## Dark Mode

The page uses Tailwind's class-based dark mode. Apply to root element:

```html
<html class="dark"></html>
```

### Pattern

All color utilities have dark mode variants:

```html
<div
	class="bg-background-light dark:bg-background-dark 
            text-text-light dark:text-text-dark"
></div>
```

### Selection Styling

```css
selection:bg-primary selection:text-white
```

---

## Glassmorphism Pattern

Used for navigation and overlays:

```html
<div
	class="bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
></div>
```

**Key properties:**

- Background with 80% opacity (`/80`)
- `backdrop-blur-md` for frosted glass effect
- Border for definition

---

## Custom Scrollbar

```css
::-webkit-scrollbar {
	width: 8px;
}
::-webkit-scrollbar-track {
	background: transparent;
}
::-webkit-scrollbar-thumb {
	background: #cbd5e1;
	border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb {
	background: #334155;
}
::-webkit-scrollbar-thumb:hover {
	background: #94a3b8;
}
```

---

## Responsive Breakpoints

| Prefix | Min Width | Usage                           |
| ------ | --------- | ------------------------------- |
| `sm:`  | 640px     | Stack to row CTAs               |
| `md:`  | 768px     | Show desktop nav, 3-col grid    |
| `lg:`  | 1024px    | Hero 2-col layout, full pricing |

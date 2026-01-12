# Lumiin Frontend Skill

name: frontend-design
description: Design system, shadcn/ui patterns, Phosphor icons

---

## 🖼️ Screenshot-to-Code Instructions

When the user pastes a screenshot or mockup:

1. **Analyze the UI** - Identify components, layout, colors, icons
2. **Map to design system** - Convert colors to CSS variables, apply sharp edges
3. **Use shadcn/ui** - Replace generic elements with `@/components/ui/*`
4. **Use Phosphor icons** - Match icons to closest Phosphor equivalent
5. **Apply typography rules** - Use uppercase tracking for labels/titles
6. **Maintain consistency** - Follow patterns below exactly

**Always convert:**
| Screenshot Element | Convert To |
|--------------------|------------|
| Any rounded corners | Sharp edges (`rounded-none` or omit) |
| Blue buttons | `bg-primary` (Amber) |
| Any icons | Phosphor icons |
| Cards/containers | `<Card>` from shadcn |
| Inputs | `<Input>` from shadcn |
| Tables | `<Table>` from shadcn |
| Colored badges | `<Badge>` with CSS variable colors |

---

## Design System: Brussels Minimalist

| Token            | Value           | Notes                        |
| ---------------- | --------------- | ---------------------------- |
| **Primary**      | Amber `#F59E0B` | FocusGlow branding           |
| **Secondary**    | Blue `#3B82F6`  | Accents, charts              |
| **Radius**       | `0px`           | Sharp edges everywhere       |
| **Font Display** | Inter           | Headings, uppercase tracking |
| **Mode**         | Dark-first      | Default to dark mode         |

---

## Component Library: shadcn/ui

Always use shadcn/ui components from `@/components/ui/`.

### Installing New Components

```bash
npx shadcn@latest add [component-name] --yes
```

**Available:** button, card, input, table, badge, separator

**To add more:** dialog, dropdown-menu, tabs, tooltip, avatar, etc.

---

## Icon Library: Phosphor

Import icons from `@phosphor-icons/react`:

```tsx
import {
	Lightning,
	ChartLineUp,
	Timer,
	Gear,
} from '@phosphor-icons/react';

// Usage
<Lightning size={24} weight="bold" />;
```

**Weights:** `thin`, `light`, `regular`, `bold`, `fill`, `duotone`

**Common icons:**

| Purpose         | Icon              |
| --------------- | ----------------- |
| Dashboard       | `SquaresFour`     |
| Analytics       | `ChartLineUp`     |
| Timer/Session   | `Timer`           |
| Settings        | `Gear`            |
| User            | `User`            |
| Search          | `MagnifyingGlass` |
| Notifications   | `Bell`            |
| Success         | `CheckCircle`     |
| Warning         | `WarningCircle`   |
| Streak/Fire     | `Flame`           |
| Lightning/Power | `Lightning`       |

---

## Component Patterns

### Card Container

```tsx
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

<Card>
	<CardHeader>
		<CardTitle className="text-xl uppercase tracking-widest font-light">
			Title
		</CardTitle>
	</CardHeader>
	<CardContent>{/* Content */}</CardContent>
</Card>;
```

### Primary Button

```tsx
import { Button } from "@/components/ui/button";

<Button>Action</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Ghost</Button>
```

### Section Title

```tsx
<h2 className="text-xl uppercase tracking-widest font-light mb-1">
  Section Title
</h2>
<p className="text-sm text-muted-foreground">
  Subtitle text
</p>
```

### Stat Label

```tsx
<p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
  Metric Label
</p>
<h3 className="text-4xl font-light">
  42 <span className="text-lg text-muted-foreground">unit</span>
</h3>
```

### Status Badge (Positive)

```tsx
import { Badge } from '@/components/ui/badge';

<Badge
	variant="outline"
	className="bg-success/10 text-success border-success/30"
>
	<TrendUp className="mr-1" size={12} /> +5%
</Badge>;
```

### Input with Icon

```tsx
import { Input } from '@/components/ui/input';
import { MagnifyingGlass } from '@phosphor-icons/react';

<div className="relative">
	<MagnifyingGlass
		className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
		size={16}
	/>
	<Input className="pl-10" placeholder="Search..." />
</div>;
```

---

## Typography Rules

| Element       | Classes                                                   |
| ------------- | --------------------------------------------------------- |
| Page Title    | `text-2xl uppercase tracking-widest font-light`           |
| Section Title | `text-xl uppercase tracking-widest font-light`            |
| Card Title    | `text-lg font-medium`                                     |
| Label         | `text-sm uppercase tracking-widest text-muted-foreground` |
| Body          | `text-sm text-foreground`                                 |
| Muted         | `text-sm text-muted-foreground`                           |

---

## Color Usage

```tsx
// Primary actions
className = 'bg-primary text-primary-foreground hover:bg-primary/90';

// Secondary/Blue accents
className = 'bg-secondary text-secondary-foreground';

// Success states
className = 'text-success'; // or bg-success/10 for subtle

// Muted/disabled
className = 'text-muted-foreground';

// Borders
className = 'border border-border';
```

---

## Layout Patterns

### Fixed Sidebar + Main Content

```tsx
<div className="min-h-screen flex">
	<aside className="w-64 border-r border-border fixed h-full bg-sidebar">
		{/* Sidebar content */}
	</aside>
	<main className="flex-1 ml-64">{/* Main content */}</main>
</div>
```

### Sticky Header

```tsx
<header className="h-20 flex items-center justify-between px-8 border-b border-border bg-background sticky top-0 z-10">
	{/* Header content */}
</header>
```

### Grid Dashboard

```tsx
<div className="grid grid-cols-12 gap-8 p-8">
	<div className="col-span-12 md:col-span-4">
		{/* 1/3 width card */}
	</div>
	<div className="col-span-12 md:col-span-8">
		{/* 2/3 width card */}
	</div>
</div>
```

---

## Do NOT

- ❌ Use `rounded-*` classes (keep sharp edges)
- ❌ Use Material Icons (use Phosphor)
- ❌ Hardcode colors (use CSS variables via Tailwind)
- ❌ Create custom components when shadcn/ui has one

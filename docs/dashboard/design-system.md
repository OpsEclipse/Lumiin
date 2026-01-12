# Dashboard Design System

Minimalist "Brussels" style with sharp edges and clean typography.

---

## Colors

```js
colors: {
  primary: "#F59E0B",        // Amber-500 (FocusGlow)
  accent: "#3B82F6",         // Blue-500 (secondary)
  "background-light": "#F9FAFB",
  "background-dark": "#0F0F0F",
  "surface-light": "#FFFFFF",
  "surface-dark": "#18181B",
  "border-light": "#E5E7EB",
  "border-dark": "#27272A",
}
```

---

## Typography

- **Font:** Inter (weights: 300-700)
- **Headings:** `uppercase tracking-widest font-light`
- **Labels:** `text-xs uppercase tracking-widest text-gray-500`

---

## Border Radius

**Sharp edges throughout:** `rounded-none` (0px)

---

## Common Patterns

### Card Container

```html
<div
	class="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6"
></div>
```

### Section Title

```html
<h2 class="text-xl font-display uppercase tracking-widest mb-1">
	Title
</h2>
<p class="text-sm text-gray-500 dark:text-gray-400">Subtitle</p>
```

### Status Badge (Positive)

```html
<span
	class="text-xs text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full"
>
	<i class="ph ph-trend-up"></i> +2
</span>
```

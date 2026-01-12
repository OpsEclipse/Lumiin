# Charts

Weekly performance line chart and focus intensity heatmap.

---

## Weekly Performance Chart

### Container (8-column)

```html
<div
	class="col-span-12 lg:col-span-8 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 relative"
></div>
```

### Legend

```html
<div class="flex gap-4 text-sm">
	<div class="flex items-center gap-2">
		<span class="w-3 h-3 bg-primary"></span>
		<span>Focus</span>
	</div>
	<div class="flex items-center gap-2">
		<span class="w-3 h-3 bg-accent"></span>
		<span>Posture</span>
	</div>
</div>
```

### Chart.js Config

See `dependencies.md` for full Chart.js configuration.

---

## Focus Intensity Heatmap

### Container (4-column)

```html
<div
	class="col-span-12 lg:col-span-4 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8 flex flex-col"
></div>
```

### Time Row

```html
<div class="flex items-center gap-4">
	<span class="w-16 text-xs uppercase text-gray-500 text-right"
		>08 - 12</span
	>
	<div class="flex-1 flex gap-1 h-8">
		<div class="flex-1 bg-primary/20"></div>
		<div class="flex-1 bg-primary/40"></div>
		<div class="flex-1 bg-primary/80"></div>
		<div class="flex-1 bg-primary"></div>
	</div>
</div>
```

### Intensity Scale

| Opacity         | Meaning  |
| --------------- | -------- |
| `bg-primary/5`  | Very low |
| `bg-primary/20` | Low      |
| `bg-primary/40` | Medium   |
| `bg-primary/80` | High     |
| `bg-primary`    | Peak     |

### Footer Stat

```html
<div
	class="mt-6 pt-6 border-t border-border-light dark:border-border-dark"
>
	<div class="flex items-center justify-between text-sm">
		<span class="text-gray-500">Most Productive</span>
		<span class="font-medium text-primary">10:00 AM</span>
	</div>
</div>
```

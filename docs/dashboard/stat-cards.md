# Stat Cards

Top row of KPI metrics.

---

## Grid Layout

```html
<div
	class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-4"
></div>
```

---

## Card Template

```html
<div
	class="border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-6 relative group overflow-hidden"
>
	<!-- Background Icon -->
	<div
		class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"
	>
		<i class="ph ph-flame text-6xl text-primary"></i>
	</div>

	<!-- Content -->
	<div class="flex flex-col h-full justify-between">
		<p
			class="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2"
		>
			Label
		</p>
		<div class="flex items-baseline gap-2">
			<h3 class="text-4xl font-light">
				12 <span class="text-lg text-gray-400">unit</span>
			</h3>
			<!-- Optional badge -->
		</div>
	</div>
</div>
```

---

## Cards

| Card           | Icon        | Icon Color        | Value Example |
| -------------- | ----------- | ----------------- | ------------- |
| Current Streak | `ph-flame`  | `text-primary`    | `12 days`     |
| Focus Hours    | `ph-clock`  | `text-accent`     | `48.5 hrs`    |
| Global Rank    | `ph-trophy` | `text-yellow-400` | `#842`        |

---

## Trend Badge

```html
<span
	class="text-xs text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-full"
>
	<i class="ph ph-trend-up"></i> +2
</span>
```

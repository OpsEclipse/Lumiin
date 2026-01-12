# Sidebar

Fixed left navigation panel.

---

## Container

```html
<aside
	class="w-64 border-r border-border-light dark:border-border-dark flex flex-col fixed h-full bg-surface-light dark:bg-background-dark z-20"
></aside>
```

| Property | Value          |
| -------- | -------------- |
| Width    | `w-64` (256px) |
| Position | `fixed h-full` |
| z-index  | `z-20`         |

---

## Logo

```html
<div
	class="h-20 flex items-center px-8 border-b border-border-light dark:border-border-dark"
>
	<div class="flex items-center gap-3">
		<div
			class="w-8 h-8 bg-primary rounded-none flex items-center justify-center"
		>
			<i class="ph ph-lightning text-white text-xl"></i>
		</div>
		<span class="font-display font-bold text-xl tracking-tight"
			>LUMIIN</span
		>
	</div>
</div>
```

---

## Nav Links

```html
<nav class="flex-1 overflow-y-auto py-8 px-4 space-y-1"></nav>
```

### Active State

```html
<a
	class="flex items-center gap-4 px-4 py-3 bg-gray-100 dark:bg-surface-dark text-primary font-medium border border-border-light dark:border-border-dark"
>
	<i class="ph ph-squares-four text-lg"></i>
	Dashboard
</a>
```

### Inactive State

```html
<a
	class="flex items-center gap-4 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-surface-dark transition-colors"
>
	<i class="ph ph-chart-line-up text-lg"></i>
	Analytics
</a>
```

### Menu Items

| Label          | Icon                   |
| -------------- | ---------------------- |
| Dashboard      | `ph-squares-four`      |
| Analytics      | `ph-chart-line-up`     |
| Focus Sessions | `ph-timer`             |
| Posture Health | `ph-person-simple-run` |
| Settings       | `ph-gear`              |

---

## User Footer

```html
<div class="p-4 border-t border-border-light dark:border-border-dark">
	<div class="flex items-center gap-3 px-4 py-3">
		<img
			class="w-8 h-8 rounded-full"
			src="..."
			alt="User Avatar"
		/>
		<div class="flex flex-col">
			<span class="text-sm font-medium">Alex Morgan</span>
			<span class="text-xs text-gray-500 dark:text-gray-400"
				>Pro Plan</span
			>
		</div>
	</div>
</div>
```

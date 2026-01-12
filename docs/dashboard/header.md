# Header

Sticky top bar with page title, search, and notifications.

---

## Container

```html
<header
	class="h-20 flex items-center justify-between px-8 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark sticky top-0 z-10"
></header>
```

---

## Page Title

```html
<h1
	class="text-2xl font-display font-light uppercase tracking-widest"
>
	Overview
</h1>
```

---

## Search Input

```html
<div class="relative">
	<i
		class="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
	></i>
	<input
		class="pl-10 pr-4 py-2 bg-transparent border border-border-light dark:border-border-dark text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none w-64 transition-all"
		placeholder="Search data..."
		type="text"
	/>
</div>
```

---

## Notification Bell

```html
<button
	class="relative p-2 text-gray-500 hover:text-primary transition-colors"
>
	<i class="ph ph-bell text-xl"></i>
	<span
		class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"
	></span>
</button>
```

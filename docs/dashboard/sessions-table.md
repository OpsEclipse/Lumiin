# Sessions Table

Recent focus sessions with activity type, scores, and posture status.

---

## Container

```html
<div
	class="col-span-12 border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-8"
></div>
```

---

## Table Header

```html
<tr
	class="border-b border-border-light dark:border-border-dark text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400"
>
	<th class="py-4 font-normal">Date</th>
	<th class="py-4 font-normal">Duration</th>
	<th class="py-4 font-normal">Activity</th>
	<th class="py-4 font-normal">Focus Score</th>
	<th class="py-4 font-normal">Posture</th>
	<th class="py-4 font-normal text-right">Action</th>
</tr>
```

---

## Activity Tags

```html
<!-- Coding -->
<span
	class="inline-flex items-center gap-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide"
>
	Coding
</span>

<!-- Writing -->
<span
	class="... bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 ..."
>
	Writing
</span>

<!-- Reading -->
<span
	class="... bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ..."
>
	Reading
</span>
```

---

## Focus Score Bar

```html
<div class="flex items-center gap-2">
	<div
		class="w-16 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden"
	>
		<div class="h-full bg-primary" style="width: 92%"></div>
	</div>
	<span class="font-bold">92</span>
</div>
```

---

## Posture Status

```html
<!-- Good -->
<span class="text-green-500 flex items-center gap-1">
	<i class="ph ph-check-circle"></i> Good
</span>

<!-- Average -->
<span class="text-yellow-500 flex items-center gap-1">
	<i class="ph ph-warning-circle"></i> Average
</span>
```

---

## AI Recommendation Banner

```html
<div
	class="col-span-12 border border-border-light dark:border-border-dark bg-gradient-to-r from-primary/10 to-transparent p-6 flex flex-col md:flex-row items-center justify-between gap-6"
>
	<div class="flex items-start gap-4">
		<div
			class="w-12 h-12 bg-primary/20 flex items-center justify-center text-primary rounded-none border border-primary/30"
		>
			<i class="ph ph-lightbulb text-2xl"></i>
		</div>
		<div>
			<h3 class="font-bold text-lg mb-1">AI Recommendation</h3>
			<p
				class="text-sm text-gray-600 dark:text-gray-300 max-w-xl"
			>
				Recommendation text...
			</p>
		</div>
	</div>
	<button
		class="whitespace-nowrap px-6 py-3 bg-primary hover:bg-amber-600 text-white font-medium text-sm uppercase tracking-wide transition-colors"
	>
		Set Smart Timer
	</button>
</div>
```

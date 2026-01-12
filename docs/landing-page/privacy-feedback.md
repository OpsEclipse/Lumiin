# Privacy & FocusGlow Sections

Two value proposition sections with two-column layouts.

---

## Privacy Section

### Layout

Image on left, text on right (stacked on mobile with reversed order).

### Grid Structure

```html
<div class="grid lg:grid-cols-2 gap-16 items-center mb-24">
	<div class="order-2 lg:order-1 relative">
		<!-- Image with glow -->
	</div>
	<div class="order-1 lg:order-2">
		<!-- Text content -->
	</div>
</div>
```

### Image with Glow

```html
<div
	class="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-2xl transform rotate-2 blur-xl"
></div>
<img
	class="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-10 grayscale-[20%] hover:grayscale-0 transition-all duration-500"
	src="..."
	alt="Dashboard Interface"
/>
```

### Text Content

- **Label:** `<span class="text-accent font-bold tracking-wider text-sm uppercase mb-2 block">Privacy First</span>`
- **Heading:** `font-display text-3xl md:text-4xl font-bold`
- **Description:** `text-lg text-gray-600 dark:text-gray-300`

### Checklist Items

```html
<li class="flex items-start">
	<span class="material-icons text-green-500 mr-3 mt-1"
		>check_circle</span
	>
	<span class="text-gray-700 dark:text-gray-300"
		>On-device processing with WebAssembly</span
	>
</li>
```

**Items:**

- On-device processing with WebAssembly
- GDPR & CCPA Compliant by design
- Zero-knowledge architecture

---

## FocusGlow Section

### Layout

Text on left, code editor mockup on right.

### State Indicator Cards

```html
<div class="flex flex-col sm:flex-row gap-4 mt-8">
	<div
		class="flex-1 bg-white dark:bg-black p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
	>
		<div
			class="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full mb-3 overflow-hidden"
		>
			<div class="h-full bg-accent w-3/4"></div>
		</div>
		<h4 class="font-bold text-gray-900 dark:text-white">
			Flow State
		</h4>
		<p class="text-xs text-gray-500 mt-1">
			High mental engagement
		</p>
	</div>
</div>
```

| State      | Bar Color    | Width   |
| ---------- | ------------ | ------- |
| Flow State | `bg-accent`  | `w-3/4` |
| Correction | `bg-primary` | `w-1/2` |

### FocusGlow Bar Overlay

```html
<div
	class="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 h-2 rounded-full bg-gray-800/80 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
>
	<div
		class="w-full h-full bg-accent rounded-full opacity-80 animate-pulse"
	></div>
</div>
```

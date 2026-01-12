# Hero Section

The main above-the-fold section with headline, CTAs, and product visualization.

---

## Layout

Two-column grid on desktop, stacked on mobile:

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│  [Badge: AI-Powered Focus Tracking]                                    │
│                                                                        │
│  Your Biometric                    ┌──────────────────────────┐        │
│  Accountability Partner            │    [Laptop Mockup]       │        │
│                                    │    with CV overlay       │        │
│  [Description paragraph]           │    - Posture indicator   │        │
│                                    │    - Focus score bar     │        │
│  [Start Trial] [How it works]      └──────────────────────────┘        │
│                                                                        │
│  [Avatar stack] Trusted by 10,000+ deep workers                        │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Section Container

```html
<section
	class="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden"
></section>
```

**Padding:**

- Top: `pt-32` (128px) accounts for fixed nav, expands to `lg:pt-40` (160px)
- Bottom: `pb-20` → `lg:pb-32`

---

## Background Effects

Four layered backgrounds create depth:

### 1. Gradient Orbs

```html
<!-- Top-right blue orb -->
<div
	class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 dark:bg-primary/20 blur-3xl"
></div>

<!-- Bottom-left amber orb -->
<div
	class="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent/10 dark:bg-accent/10 blur-3xl"
></div>
```

### 2. Noise Texture

```html
<div
	class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 dark:opacity-10 mix-blend-overlay"
></div>
```

### 3. Grid Pattern

```html
<div
	class="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
></div>
```

---

## Content Grid

```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
	<div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
		<!-- Left: Text Content -->
		<!-- Right: Laptop Mockup -->
	</div>
</div>
```

---

## Status Badge

Animated badge indicating live product:

```html
<div
	class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 mb-6"
>
	<span class="flex h-2 w-2 relative">
		<span
			class="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"
		></span>
		<span
			class="relative inline-flex rounded-full h-2 w-2 bg-accent"
		></span>
	</span>
	<span
		class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
		>AI-Powered Focus Tracking</span
	>
</div>
```

**Features:**

- Pulsing amber dot with `animate-ping`
- Uppercase tracking text
- Pill shape with subtle border

---

## Headline

```html
<h1
	class="font-display text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]"
>
	Your Biometric <br class="hidden lg:block" />
	<span
		class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400"
		>Accountability</span
	>
	Partner
</h1>
```

**Key details:**

- Font: `font-display` (Plus Jakarta Sans)
- Size: `text-5xl` → `lg:text-7xl`
- Weight: `font-extrabold`
- Line height: `leading-[1.1]` (tight)
- Line break: Hidden on mobile, visible on `lg:`
- Gradient text: `bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400`

---

## Description

```html
<p
	class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg"
>
	Lumiin uses privacy-first computer vision to monitor your posture
	and focus in real-time. Build healthier habits while you work,
	without wearing a device.
</p>
```

---

## CTA Buttons

### Primary Button

```html
<button
	class="bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
>
	Start Free Trial
	<span
		class="material-icons group-hover:translate-x-1 transition-transform text-sm"
		>arrow_forward</span
	>
</button>
```

**Interactions:**

- Lifts on hover: `hover:-translate-y-1`
- Shadow intensifies: `shadow-primary/20` → `hover:shadow-primary/40`
- Arrow slides right on hover: `group-hover:translate-x-1`

### Secondary Button

```html
<button
	class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
>
	<span class="material-icons text-gray-400"
		>play_circle_outline</span
	>
	How it works
</button>
```

### Button Container

```html
<div class="flex flex-col sm:flex-row gap-4">
	<!-- Primary -->
	<!-- Secondary -->
</div>
```

---

## Social Proof

Avatar stack with text:

```html
<div
	class="mt-8 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
>
	<div class="flex -space-x-2">
		<img
			alt="User Avatar"
			class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
			src="..."
		/>
		<img
			alt="User Avatar"
			class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
			src="..."
		/>
		<img
			alt="User Avatar"
			class="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-900 object-cover"
			src="..."
		/>
	</div>
	<p>Trusted by 10,000+ deep workers</p>
</div>
```

**Avatar styling:**

- Size: `h-8 w-8`
- Overlap: `-space-x-2`
- Border: `ring-2 ring-white dark:ring-gray-900`

---

## Laptop Mockup

### Container

```html
<div
	class="relative lg:h-[600px] flex items-center justify-center"
></div>
```

### Screen

```html
<div
	class="relative w-full max-w-md aspect-video bg-gray-900 rounded-t-2xl border-4 border-gray-800 shadow-2xl overflow-hidden z-20"
>
	<!-- Background image -->
	<img
		class="w-full h-full object-cover opacity-60 mix-blend-overlay grayscale"
		src="..."
		alt="Person working"
	/>

	<!-- CV Overlay SVG -->
	<!-- Status badges -->
</div>
```

### CV Overlay SVG

```html
<svg
	class="absolute inset-0 w-full h-full text-primary pointer-events-none"
	fill="none"
	viewBox="0 0 400 300"
	xmlns="http://www.w3.org/2000/svg"
>
	<!-- Head circle -->
	<circle
		class="animate-pulse-slow"
		cx="200"
		cy="120"
		r="40"
		stroke="currentColor"
		stroke-dasharray="4 4"
		stroke-width="1.5"
	/>

	<!-- Body lines -->
	<path
		d="M200 120 L200 200"
		stroke="currentColor"
		stroke-opacity="0.5"
		stroke-width="1.5"
	/>
	<path
		d="M160 220 L200 200 L240 220"
		stroke="currentColor"
		stroke-opacity="0.5"
		stroke-width="1.5"
	/>

	<!-- Landmark dots -->
	<circle
		class="text-accent"
		cx="200"
		cy="120"
		fill="currentColor"
		r="2"
	/>
	<circle cx="185" cy="115" fill="currentColor" r="1.5" />
	<circle cx="215" cy="115" fill="currentColor" r="1.5" />
</svg>
```

### Posture Status Badge

```html
<div
	class="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded text-xs font-mono text-primary border border-primary/30 flex items-center gap-2"
>
	<span
		class="w-2 h-2 rounded-full bg-green-500 animate-pulse"
	></span>
	POSTURE: GOOD
</div>
```

### Focus Score Bar

```html
<div
	class="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50"
>
	<div
		class="flex justify-between text-xs text-gray-300 font-mono mb-1"
	>
		<span>FOCUS SCORE</span>
		<span class="text-accent">94%</span>
	</div>
	<div class="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
		<div
			class="h-full bg-gradient-to-r from-primary to-accent w-[94%]"
		></div>
	</div>
</div>
```

### Laptop Base & Stand

```html
<!-- Base -->
<div
	class="absolute bottom-[calc(50%-160px)] w-24 h-16 bg-gray-800 z-10 rounded-b-lg"
></div>

<!-- Stand -->
<div
	class="absolute bottom-[calc(50%-170px)] w-48 h-4 bg-gray-700 z-10 rounded-full shadow-xl"
></div>
```

### Decorative Rings

```html
<div
	class="absolute z-0 w-[500px] h-[500px] border border-gray-200 dark:border-gray-800 rounded-full"
></div>
<div
	class="absolute z-0 w-[400px] h-[400px] border border-gray-200 dark:border-gray-800 rounded-full"
></div>
<div
	class="absolute z-0 w-[300px] h-[300px] border border-gray-200 dark:border-gray-800 rounded-full"
></div>
```

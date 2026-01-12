# Features Section

The "How It Works" three-step flow and social proof bar.

---

## Social Proof Bar

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│     Empowering teams at innovative companies                       │
│  [DesignCo] [MindSet] [BoltShift] [SecureNet] [Loop]              │
└────────────────────────────────────────────────────────────────────┘
```

### Section Container

```html
<section
	class="py-10 border-y border-gray-100 dark:border-gray-800 bg-surface-light/50 dark:bg-surface-dark/30"
></section>
```

### Heading

```html
<p
	class="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8"
>
	Empowering teams at innovative companies
</p>
```

### Logo Grid

```html
<div
	class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
></div>
```

### Company Logo Item

```html
<div
	class="text-xl font-bold font-display text-gray-800 dark:text-gray-200 flex items-center gap-1"
>
	<span class="material-icons">architecture</span> DesignCo
</div>
```

### Company List

| Company   | Material Icon   |
| --------- | --------------- |
| DesignCo  | `architecture`  |
| MindSet   | `psychology`    |
| BoltShift | `bolt`          |
| SecureNet | `fingerprint`   |
| Loop      | `all_inclusive` |

**Note:** Loop is hidden on smaller screens: `hidden lg:flex`

---

## How It Works Section

### Layout

```
┌────────────────────────────────────────────────────────────────────┐
│        Seamless Integration with Your Flow                        │
│        [Description paragraph]                                     │
│                                                                    │
│  ┌──────────┐ ─ ─ ─ ─ ─ ─ ┌──────────┐ ─ ─ ─ ─ ─ ─ ┌──────────┐   │
│  │ 🎯       │              │ ⚡       │              │ 📊       │   │
│  │Calibrate │              │  Focus   │              │  Review  │   │
│  │ 30sec AI │              │Work deep │              │Dashboard │   │
│  │ learning │              │ w/nudges │              │ metrics  │   │
│  └──────────┘              └──────────┘              └──────────┘   │
└────────────────────────────────────────────────────────────────────┘
```

### Section Container

```html
<section
	class="py-24 bg-background-light dark:bg-background-dark relative"
	id="features"
></section>
```

### Section Header

```html
<div class="text-center max-w-3xl mx-auto mb-20">
	<h2
		class="font-display text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
	>
		Seamless Integration with Your Flow
	</h2>
	<p class="text-lg text-gray-600 dark:text-gray-400">
		Lumiin runs quietly in the background. No wearables to charge,
		no complex setup. Just you and your best work.
	</p>
</div>
```

### Cards Grid

```html
<div class="grid md:grid-cols-3 gap-12 relative">
	<!-- Connecting line -->
	<!-- Card 1: Calibrate -->
	<!-- Card 2: Focus -->
	<!-- Card 3: Review -->
</div>
```

### Connecting Dashed Line

Desktop only, positioned behind cards:

```html
<div
	class="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-gray-300 dark:border-gray-700 z-0"
></div>
```

### Feature Card Template

```html
<div class="relative z-10 group">
	<div
		class="bg-surface-light dark:bg-surface-dark rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-300 h-full text-center"
	>
		<!-- Icon Circle -->
		<div
			class="w-20 h-20 mx-auto bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-gray-100 dark:border-gray-700"
		>
			<span class="material-icons text-4xl text-primary"
				>center_focus_strong</span
			>
		</div>

		<!-- Title -->
		<h3
			class="text-xl font-bold text-gray-900 dark:text-white mb-3"
		>
			1. Calibrate
		</h3>

		<!-- Description -->
		<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
			Spend 30 seconds letting the AI learn your ideal posture
			and neutral expression.
		</p>
	</div>
</div>
```

### Card Hover Effects

- Card lifts: `hover:-translate-y-2`
- Shadow grows: `hover:shadow-xl hover:shadow-primary/5`
- Icon scales: `group-hover:scale-110`

### Step Specifications

| Step | Number    | Icon                  | Icon Color        | Description                                 |
| ---- | --------- | --------------------- | ----------------- | ------------------------------------------- |
| 1    | Calibrate | `center_focus_strong` | `text-primary`    | 30 seconds for AI to learn posture baseline |
| 2    | Focus     | `bolt`                | `text-accent`     | Work deeply with subtle nudges              |
| 3    | Review    | `insights`            | `text-indigo-500` | Check FocusGlow dashboard for metrics       |

---

## Complete Section Structure

```html
<!-- Social Proof Bar -->
<section
	class="py-10 border-y border-gray-100 dark:border-gray-800 bg-surface-light/50 dark:bg-surface-dark/30"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<p
			class="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-8"
		>
			Empowering teams at innovative companies
		</p>
		<div
			class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
		>
			<!-- Company logos -->
		</div>
	</div>
</section>

<!-- Features Section -->
<section
	class="py-24 bg-background-light dark:bg-background-dark relative"
	id="features"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Header -->
		<div class="text-center max-w-3xl mx-auto mb-20">
			<!-- ... -->
		</div>

		<!-- Cards -->
		<div class="grid md:grid-cols-3 gap-12 relative">
			<!-- Connecting line -->
			<!-- 3 feature cards -->
		</div>
	</div>
</section>
```

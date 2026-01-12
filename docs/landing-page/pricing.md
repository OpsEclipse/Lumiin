# Pricing Section

Three-tier pricing cards with featured Professional tier.

---

## Section Container

```html
<section
	class="py-24 bg-background-light dark:bg-background-dark relative overflow-hidden"
	id="pricing"
></section>
```

### Background Pattern

```html
<div
	class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
></div>
```

---

## Section Header

```html
<div class="text-center mb-16">
	<h2
		class="font-display text-4xl font-bold text-gray-900 dark:text-white mb-4"
	>
		Simple, transparent pricing
	</h2>
	<p class="text-lg text-gray-600 dark:text-gray-400">
		Invest in your long-term health and productivity.
	</p>
</div>
```

---

## Pricing Cards Container

```html
<div
	class="grid lg:grid-cols-3 gap-0 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl"
></div>
```

---

## Tier: Starter (Left)

```html
<div
	class="bg-white dark:bg-gray-900 p-8 flex flex-col border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800"
></div>
```

**Pricing:** `$0/mo`

**Features:**

- Basic Posture Alerts
- 1 Hour Session Limit
- Weekly Summary

**CTA:** Secondary style button

---

## Tier: Professional (Center, Featured)

```html
<div class="bg-gray-900 dark:bg-black p-8 flex flex-col relative">
	<div
		class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent"
	></div>
</div>
```

**Badge:**

```html
<span
	class="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wide"
	>Popular</span
>
```

**Pricing:** `$12/mo`

**Features (with checkmarks):**

- Everything in Starter
- Unlimited Sessions
- FocusGlow™ Analytics
- Posture Trends

**CTA:** Primary style with shadow

---

## Tier: Team (Right)

```html
<div
	class="bg-white dark:bg-gray-900 p-8 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800"
></div>
```

**Pricing:** `$29/seat`

**Features:**

- Volume Discounts
- Team Wellness Reports
- SSO & Admin Panel

**CTA:** Secondary style button

---

## Feature List Styles

### Basic Tier (Bullet)

```html
<li
	class="flex items-center text-sm text-gray-600 dark:text-gray-300"
>
	<div
		class="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-3 text-xs"
	>
		●
	</div>
	Feature text
</li>
```

### Professional Tier (Checkmark)

```html
<li class="flex items-center text-sm text-gray-300">
	<div
		class="w-5 h-5 rounded-full bg-primary flex items-center justify-center mr-3 text-white text-xs font-bold"
	>
		✓
	</div>
	Feature text
</li>
```

---

## CTA Buttons

### Secondary (Starter/Team)

```html
<button
	class="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
>
	Get Started
</button>
```

### Primary (Professional)

```html
<button
	class="w-full py-3 px-4 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-colors shadow-lg shadow-primary/25"
>
	Start 14-Day Free Trial
</button>
```

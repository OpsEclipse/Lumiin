# Navigation

Fixed navigation bar with glassmorphism effect.

---

## Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]  Lumiin          Vision  Features  Pricing  Log in  [Get Started] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Container Specifications

| Property   | Value                                            |
| ---------- | ------------------------------------------------ |
| Position   | `fixed w-full z-50`                              |
| Height     | `h-20` (80px)                                    |
| Background | `bg-background-light/80` with `backdrop-blur-md` |
| Border     | `border-b border-gray-100 dark:border-gray-800`  |
| Max Width  | `max-w-7xl` centered with `mx-auto`              |
| Padding    | `px-4 sm:px-6 lg:px-8`                           |

---

## Logo

```html
<div class="flex-shrink-0 flex items-center gap-2">
	<div
		class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold"
	>
		L
	</div>
	<span class="font-display font-bold text-xl tracking-tight"
		>Lumiin</span
	>
</div>
```

**Specifications:**

- Circle: `w-8 h-8` (32px)
- Background: `bg-primary`
- Letter: White, bold, centered
- Brand name: `font-display font-bold text-xl tracking-tight`

---

## Desktop Navigation

Visible on `md:` breakpoint and above:

```html
<div class="hidden md:flex space-x-8 items-center">
	<a
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
		href="#vision"
		>Vision</a
	>
	<a
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
		href="#features"
		>Features</a
	>
	<a
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
		href="#pricing"
		>Pricing</a
	>
	<a
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
		href="#"
		>Log in</a
	>
	<!-- CTA Button -->
</div>
```

### Link Styling

| State   | Classes                                                |
| ------- | ------------------------------------------------------ |
| Default | `text-gray-600 dark:text-gray-300 text-sm font-medium` |
| Hover   | `hover:text-primary dark:hover:text-primary`           |

### Anchor Links

| Link     | Target      |
| -------- | ----------- |
| Vision   | `#vision`   |
| Features | `#features` |
| Pricing  | `#pricing`  |

---

## CTA Button

```html
<a
	class="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-primary/30"
	href="#"
>
	Get Started
</a>
```

**Specifications:**

- Background: `bg-primary` → `hover:bg-primary-dark`
- Text: `text-white text-sm font-semibold`
- Padding: `px-5 py-2.5`
- Shape: `rounded-full` (pill)
- Shadow: `shadow-lg` → `hover:shadow-primary/30`

---

## Mobile Menu Toggle

Visible below `md:` breakpoint:

```html
<div class="md:hidden flex items-center">
	<button
		class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
	>
		<span class="material-icons">menu</span>
	</button>
</div>
```

### Mobile Menu Panel (To Implement)

When the hamburger is clicked, open a fullscreen overlay:

```html
<!-- Suggested implementation -->
<div
	class="fixed inset-0 z-50 bg-background-light dark:bg-background-dark"
>
	<div class="flex justify-between items-center p-4">
		<!-- Logo -->
		<button>
			<span class="material-icons">close</span>
		</button>
	</div>
	<nav class="flex flex-col items-center space-y-6 pt-12">
		<a href="#vision" class="text-2xl font-medium">Vision</a>
		<a href="#features" class="text-2xl font-medium">Features</a>
		<a href="#pricing" class="text-2xl font-medium">Pricing</a>
		<a href="#" class="text-2xl font-medium">Log in</a>
		<a
			href="#"
			class="bg-primary text-white px-8 py-3 rounded-full font-semibold mt-4"
			>Get Started</a
		>
	</nav>
</div>
```

---

## Complete Nav Structure

```html
<nav
	class="fixed w-full z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-20">
			<!-- Logo -->
			<div class="flex-shrink-0 flex items-center gap-2">
				<div
					class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold"
				>
					L
				</div>
				<span
					class="font-display font-bold text-xl tracking-tight"
					>Lumiin</span
				>
			</div>

			<!-- Desktop Nav -->
			<div class="hidden md:flex space-x-8 items-center">
				<a
					class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium"
					href="#vision"
					>Vision</a
				>
				<a
					class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium"
					href="#features"
					>Features</a
				>
				<a
					class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium"
					href="#pricing"
					>Pricing</a
				>
				<a
					class="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm font-medium"
					href="#"
					>Log in</a
				>
				<a
					class="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-primary/30"
					href="#"
					>Get Started</a
				>
			</div>

			<!-- Mobile Toggle -->
			<div class="md:hidden flex items-center">
				<button
					class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
				>
					<span class="material-icons">menu</span>
				</button>
			</div>
		</div>
	</div>
</nav>
```

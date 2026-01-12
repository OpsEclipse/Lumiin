# Footer & CTA Section

Email capture CTA and footer with links.

---

## CTA Section

### Container

```html
<section class="py-24 bg-surface-light dark:bg-surface-dark relative">
	<div
		class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
	></div>
</section>
```

### Heading

```html
<h2
	class="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
>
	Ready to master your focus?
</h2>
<p class="text-xl text-gray-600 dark:text-gray-400 mb-10">
	Join thousands of developers, designers, and writers who use
	Lumiin to stay healthy and productive.
</p>
```

### Email Form

```html
<form
	class="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
>
	<input
		class="flex-1 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary py-3 px-4 shadow-sm"
		placeholder="Enter your email address"
		type="email"
	/>
	<button
		class="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/25 transition-all whitespace-nowrap"
		type="button"
	>
		Get Early Access
	</button>
</form>
<p class="mt-4 text-xs text-gray-500">
	No credit card required. Cancel anytime.
</p>
```

---

## Footer

### Container

```html
<footer
	class="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-16 pb-8"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
</footer>
```

### Grid Layout

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"></div>
```

### Logo Column

```html
<div class="col-span-2 md:col-span-1">
	<div class="flex items-center gap-2 mb-4">
		<div
			class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold"
		>
			L
		</div>
		<span
			class="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white"
			>Lumiin</span
		>
	</div>
	<p class="text-sm text-gray-500 dark:text-gray-400">
		San Francisco, CA<br />
		Designed for the future of work.
	</p>
</div>
```

### Link Columns

```html
<div>
	<h4 class="font-bold text-gray-900 dark:text-white mb-4">
		Product
	</h4>
	<ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
		<li>
			<a class="hover:text-primary transition-colors" href="#"
				>Download</a
			>
		</li>
		<li>
			<a class="hover:text-primary transition-colors" href="#"
				>Changelog</a
			>
		</li>
		<li>
			<a class="hover:text-primary transition-colors" href="#"
				>Pricing</a
			>
		</li>
		<li>
			<a class="hover:text-primary transition-colors" href="#"
				>Methodology</a
			>
		</li>
	</ul>
</div>
```

**Columns:**
| Column | Links |
| ------- | ---------------------------------- |
| Product | Download, Changelog, Pricing, Methodology |
| Company | About Us, Careers, Legal, Contact |

### Social Icons

```html
<div>
	<h4 class="font-bold text-gray-900 dark:text-white mb-4">
		Social
	</h4>
	<div class="flex space-x-4">
		<a
			class="text-gray-400 hover:text-primary transition-colors"
			href="#"
		>
			<span class="sr-only">Twitter</span>
			<svg
				class="h-6 w-6"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<!-- Twitter path -->
			</svg>
		</a>
		<a
			class="text-gray-400 hover:text-primary transition-colors"
			href="#"
		>
			<span class="sr-only">GitHub</span>
			<svg
				class="h-6 w-6"
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<!-- GitHub path -->
			</svg>
		</a>
	</div>
</div>
```

### Bottom Bar

```html
<div
	class="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500"
>
	<p>© 2023 Lumiin Inc. All rights reserved.</p>
	<div class="flex space-x-6 mt-4 md:mt-0">
		<a class="hover:text-gray-900 dark:hover:text-white" href="#"
			>Privacy Policy</a
		>
		<a class="hover:text-gray-900 dark:hover:text-white" href="#"
			>Terms of Service</a
		>
	</div>
</div>
```

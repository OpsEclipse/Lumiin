# Dependencies & Implementation Notes

External resources and production considerations.

---

## CDN Resources

### Tailwind CSS

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
```

### Google Fonts

```html
<link
	href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
	rel="stylesheet"
/>
```

### Material Icons

```html
<link
	href="https://fonts.googleapis.com/icon?family=Material+Icons"
	rel="stylesheet"
/>
```

---

## Required Material Icons

| Section    | Icons                                                                |
| ---------- | -------------------------------------------------------------------- |
| Navigation | `menu`                                                               |
| Hero       | `arrow_forward`, `play_circle_outline`                               |
| Logos      | `architecture`, `psychology`, `bolt`, `fingerprint`, `all_inclusive` |
| Features   | `center_focus_strong`, `bolt`, `insights`                            |
| Privacy    | `check_circle`                                                       |

---

## Tailwind Config

```js
tailwind.config = {
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				primary: '#3b82f6',
				'primary-dark': '#1d4ed8',
				'background-light': '#ffffff',
				'background-dark': '#0a0a0a',
				'surface-light': '#f3f4f6',
				'surface-dark': '#171717',
				'text-light': '#111827',
				'text-dark': '#f9fafb',
				accent: '#f59e0b',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
				display: [
					'Clash Display',
					'Plus Jakarta Sans',
					'sans-serif',
				],
			},
			animation: {
				'pulse-slow':
					'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
		},
	},
};
```

---

## Accessibility Checklist

- [ ] All images have descriptive `alt` attributes
- [ ] Focus states use `focus:ring-primary focus:border-primary`
- [ ] Icon buttons have `sr-only` labels
- [ ] Heading hierarchy is correct (h1 → h2 → h3)
- [ ] Color contrast meets WCAG AA

---

## Production Notes

### Replace CDN Tailwind

For production, use proper Tailwind build process instead of CDN.

### Images

- Replace placeholder images with actual assets
- Use WebP format for optimization
- Lazy load below-fold images

### Mobile Menu

Implement functional mobile menu overlay (see `navigation.md`).

### Form Handling

Add email validation and submission logic for CTA form.

### Performance

- Preload critical fonts
- Use `next/image` for automatic optimization
- Implement intersection observer for scroll animations

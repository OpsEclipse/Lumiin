# Dashboard Dependencies

External resources and Chart.js configuration.

---

## CDN Resources

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>

<!-- Google Fonts -->
<link
	href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
	rel="stylesheet"
/>

<!-- Phosphor Icons -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

---

## Phosphor Icons Used

| Component      | Icons                                                                                |
| -------------- | ------------------------------------------------------------------------------------ |
| Logo           | `ph-lightning`                                                                       |
| Sidebar Nav    | `ph-squares-four`, `ph-chart-line-up`, `ph-timer`, `ph-person-simple-run`, `ph-gear` |
| Header         | `ph-magnifying-glass`, `ph-bell`                                                     |
| Stat Cards     | `ph-flame`, `ph-clock`, `ph-trophy`, `ph-trend-up`, `ph-caret-up`                    |
| Table          | `ph-check-circle`, `ph-warning-circle`, `ph-caret-right`                             |
| Recommendation | `ph-lightbulb`                                                                       |

---

## Chart.js Configuration

```js
const performanceChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [
			{
				label: 'Focus Score',
				data: [65, 78, 90, 85, 92, 60, 75],
				borderColor: '#F59E0B',
				backgroundColor: 'rgba(245, 158, 11, 0.1)',
				borderWidth: 2,
				tension: 0.4,
				fill: true,
			},
			{
				label: 'Posture Quality',
				data: [70, 72, 85, 80, 88, 75, 80],
				borderColor: '#3B82F6',
				borderDash: [5, 5],
				borderWidth: 2,
				tension: 0.4,
				fill: false,
			},
		],
	},
	options: {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			y: { beginAtZero: true, max: 100 },
			x: { grid: { display: false } },
		},
	},
});
```

---

## Main Layout Classes

```html
<!-- Body -->
<body
	class="bg-background-light dark:bg-background-dark font-body antialiased min-h-screen flex"
>
	<!-- Main content offset for sidebar -->
	<main class="flex-1 ml-64 p-0"></main>
</body>
```

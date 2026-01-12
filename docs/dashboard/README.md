# Dashboard - Frontend Instructions

Authenticated analytics dashboard for logged-in users. Uses a minimalist "Brussels" aesthetic with sharp edges.

---

## Documents

| File                                  | Purpose                         |
| ------------------------------------- | ------------------------------- |
| [Design System](./design-system.md)   | Colors, typography, sharp edges |
| [Sidebar](./sidebar.md)               | Fixed navigation sidebar        |
| [Header](./header.md)                 | Top bar with search & actions   |
| [Stat Cards](./stat-cards.md)         | KPI metrics display             |
| [Charts](./charts.md)                 | Performance & heatmap visuals   |
| [Sessions Table](./sessions-table.md) | Recent activity list            |
| [Dependencies](./dependencies.md)     | CDN resources & Chart.js config |

---

## Page Layout

```
┌─────────┬──────────────────────────────────────────────┐
│         │  [Header: Title + Search + Notifications]   │
│ Sidebar ├──────────────────────────────────────────────┤
│  (nav)  │  [Stat Cards: Streak | Hours | Rank]        │
│         ├────────────────────────────┬─────────────────┤
│         │  [Weekly Performance Chart]│ [Focus Heatmap]│
│         ├────────────────────────────┴─────────────────┤
│         │  [Recent Sessions Table]                     │
│         ├──────────────────────────────────────────────┤
│         │  [AI Recommendation Banner]                  │
│         └──────────────────────────────────────────────┘
```

---

## Design Principles

1. **Sharp edges** - `rounded-none` (0px border radius)
2. **Minimalist** - Clean lines, uppercase tracking, light font weights
3. **Data-dense** - Focus on metrics and visualizations
4. **Subtle accents** - Amber primary, blue secondary

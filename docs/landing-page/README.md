# Lumiin Landing Page - Frontend Instructions

This directory contains comprehensive specifications for building the Lumiin marketing landing page. Each file covers a specific section or system.

---

## Quick Reference

| Document                                    | Purpose                                     |
| ------------------------------------------- | ------------------------------------------- |
| [Design System](./design-system.md)         | Colors, typography, spacing, animations     |
| [Navigation](./navigation.md)               | Header, logo, nav links, mobile menu        |
| [Hero Section](./hero.md)                   | Headline, CTAs, laptop mockup, social proof |
| [Features Section](./features.md)           | "How It Works" three-step flow              |
| [Privacy & Feedback](./privacy-feedback.md) | Privacy and FocusGlow value propositions    |
| [Pricing Section](./pricing.md)             | Three-tier pricing cards                    |
| [Footer & CTA](./footer.md)                 | Email capture, footer links, social icons   |
| [Dependencies](./dependencies.md)           | CDN resources, icons, implementation notes  |

---

## Page Structure Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Navigation - Fixed header with glassmorphism]                     │
├─────────────────────────────────────────────────────────────────────┤
│  [Hero - Two-column: headline + laptop mockup]                      │
├─────────────────────────────────────────────────────────────────────┤
│  [Social Proof Bar - Company logos]                                 │
├─────────────────────────────────────────────────────────────────────┤
│  [Features - Three-step "How It Works"]                             │
├─────────────────────────────────────────────────────────────────────┤
│  [Privacy Section - Image + checklist]                              │
├─────────────────────────────────────────────────────────────────────┤
│  [FocusGlow Section - State indicators + code editor]               │
├─────────────────────────────────────────────────────────────────────┤
│  [Pricing - Three-tier cards]                                       │
├─────────────────────────────────────────────────────────────────────┤
│  [CTA Section - Email capture form]                                 │
├─────────────────────────────────────────────────────────────────────┤
│  [Footer - Links and social]                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Design Principles

1. **Dark mode first** - All components support `dark:` variants
2. **Glassmorphism** - Semi-transparent backgrounds with backdrop blur
3. **Gradient accents** - Primary blue to accent amber gradients
4. **Micro-interactions** - Hover states with transforms and shadows
5. **Mobile-first** - Responsive breakpoints at `sm`, `md`, `lg`

---

## Related Project Documents

- `docs/project_overview.md` - Core product vision
- `docs/roadmap.md` - Development timeline
- `.claude/rules/typescript.md` - Code standards

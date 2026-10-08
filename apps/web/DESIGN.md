# Kickback design system

Simple, clean, modern. Flat surfaces, thin borders, no gradients, no glow, no glassmorphism,
no decorative blobs or noise. One font (Figtree). Light and dark modes.

## Colors (Tailwind classes, all theme-aware)

| Role | Class examples |
|---|---|
| Page background | `bg-bb-bg` |
| Card / surface | `bg-bb-card`, `.bb-card` |
| Subtle fill (table header, sidebar, soft boxes) | `bg-bb-subtle`, `.bb-soft-box` |
| Text | `text-bb-text` |
| Secondary text | `text-bb-muted` |
| Hairline borders | `border-bb-border/10` (cards), `/15` (inputs) |
| Primary = light brown | `bg-bb-primary`, `text-bb-primary-strong`, `bg-bb-primary-soft` |
| Accent = light red | `bg-bb-accent`, `text-bb-accent-strong`, `bg-bb-accent-soft` (alerts, errors, unread dots, destructive) |
| Success / warning | `text-bb-success`, `text-bb-warning` (only for status) |

Never use raw Tailwind palette colors (indigo, sky, cyan, emerald, rose, slate, white/10...) or inline `style={{ color: 'rgb(var(--bb-…))' }}`. Use the classes above.

## Components (CSS classes in `src/assets/styles/index.css`)

- Buttons: `.bb-btn-primary`, `.bb-btn-ghost` (secondary), `.bb-btn-danger`, `.bb-btn-accent`, `.bb-icon-btn`. Height 40px (h-9 for compact).
- Forms: `.bb-label`, `.bb-input`, `.bb-select`, `textarea.bb-input`.
- Tables: `.bb-table-wrap > table.bb-table`, `thead.bb-thead`, `th.bb-th`, `tr.bb-tr.bb-tr-hover`, `td.bb-td`.
- Badges: `.bb-badge` + `.bb-badge-green | -amber | -brown | -red`. Chips: `.bb-chip`.
- Popovers / dropdowns: `.bb-popover`. Avatar: `.bb-avatar`. Skeleton: `.bb-skeleton`.

## React kit (`@/shared/components/ui`)

`PageHeader`, `Section`, `Stat`, `StatusBadge`, `EmptyState`, `Skeleton`, `Segmented`, `Modal`,
`formatNumber`, `formatMoney`, `formatDate`. Prefer these over hand-rolled equivalents.

## Rules

- Every signed-in page starts with `<PageHeader title=… description=… actions=… />`. No hero banners inside the app.
- Radius: 10px controls, 14px cards. No `rounded-3xl`, no `rounded-full` buttons.
- Weights: 400 body, 500 labels/buttons, 600 headings. No `font-black` / `font-extrabold`.
- Sentence case everywhere. No uppercase tracking-widest labels except tiny table headers.
- Spacing: `gap-4`/`gap-6` between blocks, cards `p-5`.
- Icons: `@heroicons/react/24/outline`, 18-20px, muted color unless active.
- Motion: none beyond `bb-pop` on mount. No hover translate.
- Empty, loading and error states are always handled (`EmptyState`, `Skeleton`, a red soft box).
- Product name is **Kickback**. Never "Buy & Bye".

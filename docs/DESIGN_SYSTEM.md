# HK Design System — Engineering Minimalism

A unified, developer-focused design system derived directly from [harshakurtkoti.in](https://www.harshakurtkoti.in). Built for systems engineering, backend infrastructure, and AI observability workspaces.

---

## 1. Design Philosophy

- **Substance over Gimmicks:** The sophistication comes from typography, layout structure, whitespace rhythm, and data density — never from neon glows, saturated cyberpunk gradients, or decorative background images.
- **Restrained Color Economy:** A near-monochrome charcoal/slate canvas with single-pixel borders, paired with a singular mint/signal accent (`#a7f3d0` / `#34d399`) used intentionally for interactive affordances and live operational states.
- **Editorial Engineering Typography:** Clean, modern sans-serif (`Geist`) paired with tabular monospace (`JetBrains Mono` / `Geist Mono`) for technical metadata and subtle warm serif italic accents (`Georgia`) for key emphasis words.
- **Content-First Hierarchy:** Search bars, documents, code snippets, and inspectable multi-stage pipelines are the visual heroes; metadata and operational controls support them without visual noise.

---

## 2. Core Color Palette & Tokens

### Surfaces & Backgrounds
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--canvas` / `--background` | `#080d10` | Deep charcoal-slate root background |
| `--surface` / `--card` | `#101918` | Primary container, cards, tables, drawers |
| `--surface-subtle` | `#0d1414` | Recessed input fields, code containers |
| `--raised` / `--secondary` | `#162420` | Hover states, active tabs, elevated controls |
| `--raised-hover` | `#1f332d` | Button hover, list item hover |

### Borders & Dividers
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--line` / `--border` | `#202e2b` | Structural card borders, header dividers |
| `--hairline` | `#16221f` | Subtle internal section dividers, nested separators |
| `--line-subtle` | `rgba(32, 46, 43, 0.6)` | Table row borders, faint bounding boxes |

### Typography & Ink
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--ink` / `--foreground` | `#f1f5f4` | Primary high-contrast text |
| `--ink-secondary` | `#d6dedc` | Secondary readable text |
| `--muted` / `--muted-foreground` | `#8e9e9b` | Descriptive captions, timestamps, column headers |
| `--quiet` | `#607370` | Faint hints, shortcut badges, disabled states |

### Accents & Status Indicators
| Token | Hex Value | Semantic Usage |
|---|---|---|
| `--mint` / `--accent` / `--primary` | `#a7f3d0` | Primary brand accent, focus rings, active links |
| `--mint-subtle` | `rgba(167, 243, 208, 0.08)` | Active row highlight, badge backgrounds |
| `--mint-border` | `rgba(167, 243, 208, 0.22)` | Subtle active border highlight |
| `--signal` | `#34d399` | Operational service health, 100% checks |
| `--warning` | `#fbbf24` | Degraded service, latency spikes |
| `--danger` / `--destructive` | `#f87171` | Health check failures, errors, deletions |

---

## 3. Typography Scale

- **Display / Page Title:** `text-xl` or `text-2xl`, font weight 400–500, letter spacing `-0.03em`. Features a signature serif italic accent word (`font-serif italic text-accent`).
- **Section Heading:** `text-sm` or `text-base`, font weight 500, letter spacing `-0.01em`.
- **Body:** `text-xs` to `text-sm`, font weight 400, line height 1.55.
- **Kickers / Eyebrows:** `text-[10px]` or `text-[11px]`, monospace (`font-mono`), uppercase, tracking `0.12em` (`tracking-widest`), paired with optional `.with-rule` (24px horizontal mint rule).
- **Tabular Data:** `font-mono text-xs tabular-nums` for timings (e.g. `107 ms`), token counts, and chunk IDs.

---

## 4. Reusable Component Patterns

### 1. Kicker / Section Header
```tsx
<div className="flex items-center gap-2">
  <span className="w-5 h-[2px] bg-accent" />
  <span className="text-[10px] font-mono uppercase tracking-widest text-accent">
    Data Layer
  </span>
</div>
```

### 2. Status Badge / Pill
```tsx
<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
  <span>Operational</span>
</div>
```

### 3. Metric Tile
```tsx
<div className="rounded-lg border border-border bg-card p-3.5 flex flex-col gap-1">
  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
    p95 Retrieval Latency
  </span>
  <span className="text-xl font-semibold text-foreground tracking-tight tabular-nums">
    107 ms
  </span>
</div>
```

### 4. Interactive Search Bar
- Dark recessed container (`bg-surface-subtle border-border`)
- Focus ring with subtle mint glow (`focus-within:border-accent/50`)
- Trailing shortcut indicator (`Cmd+K` / `Enter`)

---

## 5. Adoption Guide for Other Projects (e.g. `prod_rag_monitoring`, `VisionBoard`)

To adopt this design language in any Tailwind / Next.js / React project:

1. **Install Fonts:** Add `Geist` (sans) and `JetBrains Mono` / `Geist Mono` to the font stack.
2. **Apply CSS Variables:** Copy the `:root` and `.dark` variables from `frontend/src/app/globals.css` into your root stylesheet.
3. **Configure Tailwind:** Ensure `background`, `foreground`, `card`, `border`, `primary`, and `accent` resolve to the defined CSS variables.
4. **Remove Slop:** Ban continuous pulsating drop-shadows, saturated cyan `#00F5FF` gradients, decorative geometric background images, and mock dials.
5. **Enforce Consistency:** Keep borders at `1px solid var(--border)` and container radius at `8px` (`rounded-lg`) or `12px` (`rounded-xl`).

# GlobeGo Design System — Master CSS Reference Document

> **Document Version:** 1.0.0  
> **Target Audience:** Frontend Engineers, UI/UX Designers, QA Team  
> **Source Files in Repository:**  
> - Primary Stylesheet: [`src/styles/design-system.css`](../src/styles/design-system.css)  
> - Root Layout & Accessibility: [`src/index.css`](../src/index.css)  
> - Browser-Viewable Version: [`docs/CSS_DESIGN_SYSTEM_REFERENCE.html`](./CSS_DESIGN_SYSTEM_REFERENCE.html)

---

## 1. Executive Summary & Design Vision

GlobeGo uses a **Balanced Classic Blue Design System** inspired by tier-1 travel platforms (Expedia / Booking.com), optimized for high accessibility, crisp typography, clean card elevation, responsive layout grids, and seamless light/dark mode support without external CSS framework bloat.

### Key Pillars:
1. **Zero Hardcoded Values**: All colors, radii, shadows, spacing, and transitions MUST use CSS custom properties (`var(--...)`).
2. **Unified Semantic Tokens**: Clear separation between brand blues, sunshine amber accents, emerald rating indicators, and neutral surface layers.
3. **WCAG AA Compliance**: High-contrast ratios, standardized `:focus-visible` rings on all interactive elements, and accessible touch targets.
4. **Adaptive Dark Mode**: Surface tokens invert seamlessly under `[data-theme="dark"]`.

---

## 2. Typography & Fonts

### Font Families
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
```

| Token | Family Stack | Weights | Use Cases |
| :--- | :--- | :--- | :--- |
| `var(--font-heading)` | `'Plus Jakarta Sans', sans-serif` | `600`, `700`, `800` | Section headings, card titles, hero headers |
| `var(--font-body)` | `'Plus Jakarta Sans', sans-serif` | `400`, `500`, `600`, `700` | Body copy, buttons, form inputs, metadata |
| `var(--font-serif)` | `'Playfair Display', Georgia, serif` | `600`, `700` (Italic available) | Editorial punchlines, premium destination quotes |

---

## 3. Design Tokens (CSS Variables)

### 3.1 Color Palette

#### Primary Action Blues (Pine Series & Expedia Blue)
| Variable | Hex / Value | Role / Usage |
| :--- | :--- | :--- |
| `--pine-900` | `#0a2540` | Deep slate navy — Top bar, footer background, primary contrast headers |
| `--pine-800` | `#0d3862` | Deep navy border / card header background |
| `--pine-700` | `#1557b0` | Deep classic blue — Hover state for primary buttons |
| `--pine-600` / `--expedia-blue` | `#1a73e8` | **Primary Brand Action Blue** — Primary buttons, active tabs, links |
| `--pine-500` | `#2b7de9` | Bright blue accents, focus rings |
| `--pine-400` | `#4285f4` | Secondary blue border highlight |
| `--pine-100` | `#e8f0fe` | Subtle blue tint — Active sidebar tab background |
| `--pine-50` | `#f4f8fe` | Very light blue — Hover state on table rows & list items |

#### Sunshine Gold & Amber Accents
| Variable | Hex / Value | Role / Usage |
| :--- | :--- | :--- |
| `--amber-600` | `#d99e00` | Dark amber — Text inside amber badges |
| `--amber-500` / `--expedia-yellow` | `#ffc72c` | **High-contrast Sunshine Gold** — Discount tags, CTAs, focus outlines |
| `--amber-400` | `#ffd766` | Hover state for gold buttons |
| `--amber-300` | `#ffe499` | Light gold borders |
| `--amber-100` | `#fff6d9` | Amber badge background |
| `--amber-50` | `#fffcf0` | Subtle gold tint |

#### Neutrals & Surface Colors (Light vs Dark Mode)
| Variable | Light Theme | Dark Theme (`[data-theme="dark"]`) | Description |
| :--- | :--- | :--- | :--- |
| `--cream` | `#f6f8fc` | `#060d17` | Main page background |
| `--off-white` | `#eef3f9` | `#0b1524` | Input fields, pill tracks, secondary surfaces |
| `--white` | `#ffffff` | `#101e33` | Card background, modal background, sticky headers |
| `--ink-900` | `#0f172a` | `#f8fafc` | Primary text |
| `--ink-800` | `#1e293b` | `#e2e8f0` | Secondary text |
| `--ink-700` | `#334155` | `#cbd5e1` | Descriptions, subtitles |
| `--ink-500` | `#64748b` | `#94a3b8` | Placeholders, muted timestamps |
| `--ink-300` | `#cbd5e1` | `#475569` | Disabled text, light dividers |
| `--ink-100` | `#e2e8f0` | `#1e293b` | Sub-dividers |
| `--border-color` | `#e2e8f0` | `#1e293b` | General component borders |
| `--card-border` | `#e6edf5` | `#1e3352` | Card bounding borders |
| `--expedia-dark` | `#071a2e` | `#040910` | Darkest container contrast surface |

#### Semantic & Feedback Colors
| Variable | Hex Value | Background Variable | Role |
| :--- | :--- | :--- | :--- |
| `--rating-green` / `--success` | `#107c41` | `--rating-green-bg` (`#e8f5ed`) | Hotel ratings (e.g., 9.4/10), positive alerts |
| `--warning` | `#c8791a` | `--warning-bg` (`#fdf1de`) | Caution tags, budget warnings |
| `--danger` | `#d13b3b` | `#fde8e8` | Errors, delete actions, over-budget tags |
| `--info` | `#1a73e8` | `--pine-100` (`#e8f0fe`) | Informational tooltips, info alerts |

---

### 3.2 Spacing Scale
| Variable | Value | Equivalent | Usage |
| :--- | :--- | :--- | :--- |
| `--space-1` | `4px` | 0.25rem | Micro offsets, badge internal padding |
| `--space-2` | `8px` | 0.50rem | Icon margins, button inner gap |
| `--space-3` | `12px` | 0.75rem | Input vertical padding, list item gaps |
| `--space-4` | `16px` | 1.00rem | Standard grid gap, mobile padding |
| `--space-5` | `24px` | 1.50rem | Card internal padding, desktop gutters |
| `--space-6` | `32px` | 2.00rem | Section margins, header spacing |
| `--space-7` | `48px` | 3.00rem | Major section separations |
| `--space-8` | `64px` | 4.00rem | Hero padding, footer padding |

---

### 3.3 Radii & Elevation Shadows

#### Border Radii
- `var(--radius-sm)` = `8px` *(Form controls, search inputs, photo chips)*
- `var(--radius-md)` = `12px` *(Standard cards, dropdown panels, day slot cards)*
- `var(--radius-lg)` = `18px` *(Promotional banners, day container cards, panels)*
- `var(--radius-xl)` = `24px` *(Modals, hero cards, overview cards)*
- `var(--radius-pill)` = `999px` *(Action buttons, pill badges, category tabs)*

#### Elevation Shadows
- `var(--shadow-sm)`: `0 1px 3px rgba(10, 37, 64, 0.06), 0 1px 2px rgba(10, 37, 64, 0.04)`
- `var(--shadow-md)`: `0 4px 14px rgba(10, 37, 64, 0.08), 0 2px 6px rgba(10, 37, 64, 0.04)`
- `var(--shadow-lg)`: `0 12px 32px rgba(10, 37, 64, 0.12), 0 4px 12px rgba(10, 37, 64, 0.06)`
- `var(--shadow-xl)`: `0 20px 48px rgba(10, 37, 64, 0.16)`
- `var(--shadow-floating)`: `0 8px 30px rgba(0, 0, 0, 0.12)`

#### Transitions
- `var(--transition-fast)`: `150ms cubic-bezier(0.4, 0, 0.2, 1)` *(Hovers, taps, active states)*
- `var(--transition-med)`: `250ms cubic-bezier(0.4, 0, 0.2, 1)` *(Modals, drawers, accordion dropdowns)*

---

## 4. Global Architecture & Layout Shell

### Application Wrapper Structure ([`src/index.css`](../src/index.css))
```html
<div class="app-layout">
  <header>
    <div class="top-bar-notice">...</div>
    <nav class="expedia-nav">...</nav>
  </header>
  
  <main class="app-content container">
    <!-- Page Routed Content -->
  </main>

  <footer class="app-footer">...</footer>
</div>
```

### Layout Utilities:
- `.container`: Constrains layout to `max-width: 1240px; margin: 0 auto; padding: 0 var(--space-5);`.
- `.app-content`: Flex-grow content wrapper preventing footer displacement (`flex: 1 0 auto`).

### Accessibility Standards:
All interactive elements automatically receive high-contrast focus rings:
```css
button:focus-visible,
a:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid var(--amber-500);
  outline-offset: 2px;
}
```

---

## 5. UI Component Class Catalog

### 5.1 Buttons & Action Controls
```html
<!-- Primary CTA Button -->
<button class="btn btn-primary">Search Flights</button>

<!-- Secondary White Button -->
<button class="btn btn-secondary">Change Dates</button>

<!-- Ghost / Transparent Button -->
<button class="btn btn-ghost">Cancel</button>

<!-- Size Variants -->
<button class="btn btn-primary btn-sm">Small (8px 14px)</button>
<button class="btn btn-primary">Default (12px 22px)</button>
<button class="btn btn-primary btn-lg">Large (14px 28px)</button>

<!-- Full Width Modifier -->
<button class="btn btn-primary btn-block">Full Width</button>
```

---

### 5.2 Cards, Panels & Badges
```html
<!-- Base Panel Card -->
<div class="panel">
  <h3>Card Heading</h3>
  <p>Panel with standard white surface and border.</p>
</div>

<!-- Score & Status Badges -->
<span class="badge green">9.4 Exceptional</span>
<span class="badge amber">Member Price 20% Off</span>
```

---

### 5.3 Modals & Dialogs
```html
<div class="modal-overlay">
  <div class="modal-card">
    <div class="modal-header">
      <h3>Edit Itinerary Day</h3>
      <button class="btn btn-ghost">✕</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here...</p>
    </div>
  </div>
</div>
```

---

### 5.4 Search Box & Tab Selector
```html
<div class="hero-search-box">
  <!-- Search Category Pill Tabs -->
  <div class="search-tabs-list">
    <button class="search-tab-item active">Stays</button>
    <button class="search-tab-item">Flights</button>
    <button class="search-tab-item">Cars</button>
    <button class="search-tab-item">AI Planner</button>
  </div>

  <!-- 4-Column Search Input Grid -->
  <div class="search-inputs-grid">
    <div class="search-field-box">
      <span class="search-field-icon">📍</span>
      <div class="search-field-content">
        <label>Where to?</label>
        <input type="text" placeholder="Destination, city..." />
      </div>
    </div>
    <!-- Dates, Travelers, Submit Button -->
  </div>
</div>
```

---

### 5.5 AI Planner & Agent Workspace Shell
```html
<div class="agent-shell">
  <!-- Left Sticky Navigation (280px) -->
  <aside class="agent-sidebar">
    <button class="agent-mode-btn active">
      <div class="mode-icon-box">🧭</div>
      <div class="mode-copy">
        <strong>Itinerary Planner</strong>
        <span>Smart daily schedule</span>
      </div>
    </button>
    <button class="agent-mode-btn">
      <div class="mode-icon-box">💰</div>
      <div class="mode-copy">
        <strong>Budget Advice</strong>
        <span>Cost breakdown</span>
      </div>
    </button>
  </aside>

  <!-- Right Main Interactive Area -->
  <main class="agent-main-content">
    <!-- Itinerary, Breakdown or Chat Component -->
  </main>
</div>
```

---

### 5.6 Daily Timeline & Activity Cards
```html
<div class="itinerary-timeline">
  <div class="day-card">
    <div class="day-header-row">
      <span class="day-pill-badge">Day 1</span>
      <h3 class="day-theme-title">Arrival & City Landmarks</h3>
    </div>

    <!-- 3-Slot Grid (Morning, Afternoon, Evening) -->
    <div class="day-slots-grid">
      <div class="slot-card">
        <div class="slot-img-wrap">
          <img src="..." alt="Morning activity" />
          <span class="slot-tag">Morning</span>
        </div>
        <div class="slot-body">
          <h4 class="slot-title">Shinjuku Gyoen National Garden</h4>
          <p class="slot-desc">Stroll through traditional Japanese landscaped gardens.</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

### 5.7 Budget Trackers & Progress Fillers
```html
<div class="budget-bar-track">
  <!-- Progress fill percentage set via style width -->
  <div class="budget-bar-fill" style="width: 65%;"></div>
</div>

<div class="budget-total-row">
  <span>Total Estimated Cost</span>
  <span>$2,450 USD</span>
</div>
```

---

## 6. Responsive Breakpoints

| Breakpoint | CSS Media Query | Layout Changes |
| :--- | :--- | :--- |
| **Desktop** | `> 1024px` | Full multi-column grids (4-5 columns), 2-column sticky AI agent shell |
| **Tablet** | `@media (max-width: 1024px)` | Navbar center hides; mobile slide menu active; hotel/package grids switch to 2 columns; agent shell switches to 1 column |
| **Mobile** | `@media (max-width: 768px)` | Search inputs stack to 1 column; promo cards stack vertically; day activity cards stack to 1 column; top notices condense |

---

## 7. Developer Rules & Best Practices

1. **Strict Variable Usage**:
   - ❌ Never write: `color: #0a2540; border-radius: 12px;`
   - ✅ Always write: `color: var(--pine-900); border-radius: var(--radius-md);`
2. **Automatic Dark Mode**:
   - By sticking to semantic background variables (`--white`, `--cream`, `--card-border`, `--ink-900`), all pages automatically support dark mode when `data-theme="dark"` is set on `document.documentElement`.
3. **Button Hierarchy**:
   - Every view must have only **one** `.btn-primary` per visual zone. Auxiliary actions should use `.btn-secondary` or `.btn-ghost`.
4. **No Ad-hoc Inline Styles**:
   - Write reusable class names in `design-system.css` or scoped class patterns instead of large inline style objects.

# Ramon Celebration Site – Font System Guide

## 1. Overview

Typography is a core pillar of the **Ramon’s Wicked 50th** visual identity.  
Our goal is to deliver text that is:

* modern & on-trend  
* highly legible across screen sizes  
* cohesive with the party-vibe aesthetic  
* accessible for users with low vision or cognitive load

To accomplish this we introduced a **three-tier font hierarchy** that separates **display**, **interface**, and **reading** roles. Each tier is exposed as a CSS variable and mapped to Tailwind utilities so the entire UI stays consistent and easy to maintain.

```
--font-display  →  Plus Jakarta Sans   (Bold statements & hero text)
--font-sans     →  Inter              (Headings, UI labels, buttons)
--font-serif    →  Source Serif 4     (Body copy, long messages)
```

## 2. Font Selections & Use-Cases

| Tier            | Google Font ID        | Primary Weights | Typical Usage                                    | Tailwind class |
| --------------- | --------------------- | --------------- | ----------------------------------------------- | -------------- |
| Display         | `Plus_Jakarta_Sans`   | 400 / 600 / 800 | Site title, large hero headings, numbers        | `font-display` |
| Sans (UI)       | `Inter`              | 400 / 500 / 700 | H1–H4, form labels, buttons, badges, nav links  | `font-sans`    |
| Serif (Body)    | `Source_Serif_4`     | 400 / 600 / 700 | Paragraphs, scrapbook messages, long captions   | `font-serif`   |

**Why this combo?**

* **Plus Jakarta Sans** provides a contemporary, geometric flair that pops at large sizes.
* **Inter** is a proven UI workhorse—neutral, space-efficient, and optimised for screen rendering.
* **Source Serif 4** adds warmth and readability to longer passages, preventing visual fatigue.

All three families are variable-font ready, lightweight, and widely supported.

## 3. Responsive Sizing Guidelines

Our scale follows a **mobile-first** approach. Use Tailwind’s breakpoint modifiers to adjust size & line-height.

| Context                    | Mobile (`base`) | Tablet (`md`) | Desktop (`lg`) |
| -------------------------- | -------------- | ------------- | -------------- |
| Site Title / Hero          | `text-3xl`     | `text-5xl`    | `text-6xl`     |
| Section Header (h1)        | `text-xl`      | `text-2xl`    | `text-3xl`     |
| Sub-header (h2–h3)         | `text-lg`      | `text-xl`     | `text-2xl`     |
| Body / Message Paragraph   | `text-sm`      | `text-base`   | `text-base`    |
| Caption / Footnote         | `text-xs`      | `text-sm`     | `text-sm`      |

Line-height defaults from Tailwind (`leading-normal` / `leading-relaxed`) are usually sufficient. For display text consider `tracking-tight` to tighten large glyphs.

## 4. Implementation Examples

### 4.1. Font Imports (`src/app/layout.tsx`)

```ts
import {
  Plus_Jakarta_Sans as FontDisplay,
  Inter as FontSans,
  Source_Serif_4 as FontSerif,
} from 'next/font/google';

const fontDisplay = FontDisplay({ subsets:['latin'], variable:'--font-display', weight:['400','600','800'] });
const fontSans    = FontSans   ({ subsets:['latin'], variable:'--font-sans',    weight:['400','500','700'] });
const fontSerif   = FontSerif  ({ subsets:['latin'], variable:'--font-serif',   weight:['400','600','700'] });
```

### 4.2. Tailwind Mapping (`tailwind.config.ts`)

```js
extend: {
  fontFamily: {
    display: ['var(--font-display)'],
    sans:    ['var(--font-sans)', ...fontFamily.sans],
    serif:   ['var(--font-serif)', ...fontFamily.serif],
  },
}
```

### 4.3. Usage in Components

```jsx
<h1 className="font-display text-5xl md:text-6xl">Ramon’s Wicked 50th!</h1>

<label className="font-sans text-sm">Your Name</label>

<p className="font-serif leading-relaxed">
  Remember that time at the warehouse party in ’98 …?
</p>
```

## 5. Accessibility Considerations

1. **Contrast** – Ensure background gradients never drop below a 4.5:1 ratio against text. Primary text color is `#333` on light mode and `#f2f2f2` on dark mode.
2. **Font Size** – Minimum interactive text size is **14 px** (`text-sm`).  
3. **Focus States** – Inputs & buttons retain a 2 px ring in `var(--primary)` plus a 3 px semi-transparent shadow to achieve WCAG 2.2 AA focus contrast.
4. **System Fallbacks** – Each variable cascades to `sans-serif` or `serif` generics if a font fails to load.
5. **Motion Preferences** – Font animations are not used; background animations honour `prefers-reduced-motion`.

## 6. Mobile-First Approach

* All font sizes are declared without breakpoints first (`base` mobile).  
* Progressive enhancements (`sm`, `md`, `lg`) gradually scale typographic hierarchy.  
* Tight character-count containers (`max-w-3xl`) avoid overly long line‐lengths on desktop.

---

### Cheat-Sheet

```txt
font-display → show-stopper (hero, site logo)
font-sans    → UI & headings (labels, buttons, nav)
font-serif   → narrative (messages, long copy)
```

Stick to these utilities and the site will remain **cohesive, performant, and beautiful** across every device.

# 🧹 Production Cleanup Checklist

Use this document to track final tasks before shipping **Ramon’s Wicked 50th** to production.

---

## 1. Completed Fixes ✔️

- [x] **Legacy font classes updated**  
  - `font-body` → `font-serif`  
  - `font-headline` → `font-display`
- [x] **Form field UX**  
  - Placeholders only (no hard-coded values)  
  - `maxLength`, required, and file-type validation added
- [x] **Responsiveness improvements**  
  - Flexible dialog width (`max-w-[95vw]`)  
  - Responsive typography (`text-lg → text-6xl`)  
  - Mobile-pinned FAB (`right-4 bottom-4`) with `hover:scale` micro-interaction
- [x] **Toast enhancements**  
  - Added `success` variant & shorter durations  
  - Consistent typography (`font-sans` title, `font-serif` body)

---

## 2. Unused Components to Remove 🗑️

_Shared shadcn/ui boilerplate that does **not** appear in any import searches; safe to delete to reduce bundle size._

| File | Notes |
|------|-------|
| `src/components/ui/calendar.tsx` | No date pickers in UX |
| `src/components/ui/chart.tsx` | No data-viz |
| `src/components/ui/menubar.tsx` | Not referenced |
| `src/components/ui/sidebar.tsx` | App uses header/fab, no sidebars |
| `src/components/ui/table.tsx` | No tabular data |
| `src/components/ui/tabs.tsx` | Not imported |
| `src/components/ui/slider.tsx` | Unused |
| `src/components/ui/switch.tsx` | Unused |
| `src/components/ui/radio-group.tsx` | Unused |
| `src/components/ui/accordion.tsx` | Unused |
| `src/components/ui/sheet.tsx` | Unused |
| **Review**: `scroll-area`, `select`, `tooltip` — keep if used in admin pages; otherwise remove.

_Action_: run `grep -R "from '@/components/ui/{component}' src | wc -l` to verify before deletion._

---

## 3. Code Quality & Security 🔍

### Legacy Patterns
- [ ] Replace any remaining **hardcoded color hexes** with CSS variables (`--primary`, `--foreground`, etc.).
- [ ] Remove stray console logs, commented-out code, and obsolete TODOs.
- [ ] Ensure all server actions use **`use server`** directive (Next 15 requirement).

### Security
- [ ] **Password state file** → encrypt or move to env secrets before deploy.  
- [ ] Validate **upload size limits** in `addMessageSubmission` to prevent large Data URIs.  
- [ ] Sanitize user text (strip HTML) to mitigate XSS inside scrapbook cards.

### Performance
- [ ] Tree-shake unused shadcn components (section 2).  
- [ ] Use `next/image` `priority` flag only on first hero image.  
- [ ] Verify Turbopack warnings resolved (`Webpack configured while Turbopack not`).

---

## 4. Responsiveness Validation 📱

| Check | Mobile (<640 px) | Tablet (≥640 px) | Desktop (≥1024 px) |
|-------|------------------|-------------------|---------------------|
| FAB visible, not overlapping content | ⬜ | ⬜ | ⬜ |
| Header text scales (`text-lg → text-6xl`) | ⬜ | ⬜ | ⬜ |
| Dialog fits viewport (`max-w-[95vw]`) | ⬜ | n/a | n/a |
| Touch targets ≥ 48 px | ⬜ | ⬜ | ⬜ |
| Grid columns (1 / 2 / 3) | ⬜ | ⬜ | ⬜ |
| Toasts don’t overlap FAB / header | ⬜ | ⬜ | ⬜ |

---

## 5. Production Readiness 🚀

- [ ] **Environment variables**  
  - `NEXT_PUBLIC_BASE_URL`, secret passwords, AI keys in `.env` + Vercel Dashboard
- [ ] **Error handling**  
  - `ErrorBoundary` wraps app root & admin pages  
  - Log errors to Sentry / console only in dev
- [ ] **Accessibility (WCAG 2.2 AA)**  
  - Color contrast ≥ 4.5:1 (primary magenta on gradient)  
  - Focus rings: 2 px `ring-primary` + 3 px shadow  
  - ARIA labels on icon-only buttons (`aria-label="Open post dialog"`)
- [ ] **SEO & Metadata**  
  - Unique `<title>` & `<meta description>` per route  
  - OpenGraph images exist at final URLs
- [ ] **CI/CD**  
  - Type-checking & ESLint in pipeline  
  - Preview deploy → QA checklist before prod promote

---

## ✅ Next Steps

1. Purge unused UI components (Section 2).  
2. Complete checklist ticks, commit, and run `npm run build` for a clean prod build.  
3. Deploy to Vercel / Firebase Hosting and run Lighthouse & Axe audits.  
4. Celebrate 🎉!

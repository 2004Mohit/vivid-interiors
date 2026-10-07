# Vivid Interiors

React 19 · Vite 8 · TypeScript 6 · Tailwind CSS 4 · GSAP 3 (+ ScrollTrigger) · Lenis · three.js

```bash
npm install
npm run dev      # development
npm run build    # type-check + production build
npm run lint
```

## Theming (Light / Dark)

* **Toggle** – the sun/moon switch in the navigation bar (`src/components/ui/ThemeToggle.tsx`).
* **Persistence** – saved in `localStorage` (`vivid-theme`); first visit follows the OS setting.
  `index.html` applies the theme before first paint, so there is no flash.
* **Tokens** – `src/styles/variables.css`. `<html data-theme="light|dark">` flips every token.
  * **Light** = the original Hero palette (soft white + pista wash), used on every section.
  * **Dark** = the dark glass slide palette, used on every section **including the Hero**.
* **Brand words** – `<Accent>` (`src/components/ui/Accent.tsx`): in dark mode the first letter of
  each word is red and the remaining letters are pista.
* Never hard-code `#fff` / `rgba(255,255,255,…)` in component CSS. Use `--text`, `--fg-rgb`,
  `--surface`, `--line`… (or `--media-fg-rgb` for text that always sits on photos).

## Motion

* `src/hooks/useReveal.ts` – put `data-reveal="up|down|left|right|fade|scale|mask|stagger"`
  (optional `data-reveal-delay`, `data-reveal-duration`) on any element inside a section that calls
  `useReveal(sectionRef)`. It animates **in** on arrival and **out** when it leaves the viewport.
* `src/hooks/useLenis.ts` – Lenis is driven by GSAP's ticker so smooth-scroll and ScrollTrigger share one loop.
* All animation respects `prefers-reduced-motion`.

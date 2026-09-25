# joeyoosenbrug.nl design kit

Everything a `*.joeyoosenbrug.nl` app needs to look and feel like the portfolio: colors, backgrounds, type, spacing, motion, components, the exact header, and the conventions the code follows.

**Source of truth:** the portfolio. The files here are copies of `src/app.css` and `src/lib/components/Nav.svelte`. Change the portfolio first, then copy the change here, then into the apps.

| File                     | What it is                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `jo-kit.css`             | Tokens (both themes), base styles, ambient background, buttons, tags, cards             |
| `jo-header.css`          | The header, 1:1 with the portfolio, classes prefixed `jo-nav` so nothing clashes        |
| `header.html`            | Header markup for plain HTML or any template language                                   |
| `jo-header.js`           | Header behaviour, no dependencies (scroll bar, blur, mobile menu, theme, Ctrl K)        |
| `jo-header.d.ts`         | Types for `jo-header.js`                                                                |
| `JoHeader.tsx`           | The same header as a React component (DevCity, any Next.js app)                         |
| `jo-header.component.ts` | The same header as an Angular component (CodeGuessr, any Angular 17+ app)               |
| `demo.html`              | Live preview. Serve the repo root (`npx serve .`) and open `/docs/design-kit/demo.html` |

The header in `demo.html` was checked against the live portfolio header in Chrome: position, size, colors, fonts, borders, blur and shadows are identical at 1600, 1440, 1280, 1000 and 390 px wide, in both themes, at the top of the page, scrolled, and with the mobile menu open. `JoHeader.tsx` was rendered with the same links and passed the same comparison, and it type-checks with `strict` against React 19. `jo-header.component.ts` was built in an Angular 22 app (strict) and passed the same comparison.

---

## 1. Quick start

### Next.js + Tailwind 4 (DevCity)

1. Fonts, self-hosted (no Google requests):
   ```sh
   pnpm add @fontsource-variable/inter @fontsource-variable/jetbrains-mono
   ```
2. Copy `jo-kit.css`, `jo-header.css`, `jo-header.js` and `JoHeader.tsx` into the app (e.g. `components/jo/`).
3. `app/globals.css`:
   ```css
   @import 'tailwindcss';
   @import '../components/jo/jo-kit.css';
   @import '../components/jo/jo-header.css';

   /* Kit tokens as Tailwind utilities: bg-bg, text-muted, border-border, text-accent-text, font-mono, ... */
   @theme inline {
     --color-bg: var(--bg);
     --color-bg-2: var(--bg-2);
     --color-surface: var(--surface);
     --color-surface-2: var(--surface-2);
     --color-border: var(--border);
     --color-text: var(--text);
     --color-muted: var(--muted);
     --color-accent: var(--accent);
     --color-accent-text: var(--accent-text);
     --color-accent-ink: var(--accent-ink);
     --color-accent-2: var(--accent-2);
     --color-accent-2-text: var(--accent-2-text);
     --font-sans: var(--font);
     --font-mono: var(--mono);
     --radius-card: var(--radius);
     --radius-control: var(--radius-sm);
     --ease-jo: var(--ease);
   }
   ```
   The kit is unlayered, so it wins over Tailwind's preflight where they overlap. That is intended.
4. `app/[locale]/layout.tsx`:
   ```tsx
   import '@fontsource-variable/inter';
   import '@fontsource-variable/jetbrains-mono';
   import { JoHeader, joHeaderLabels } from '@/components/jo/JoHeader';

   const themeScript = `try{var m=document.cookie.match(/(?:^|; )jo-theme=(dark|light)/);var t=(m&&m[1])||localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;document.documentElement.classList.add('js')}catch(e){}`;

   export default async function Layout({ children, params }) {
     const { locale } = await params; // 'en' | 'nl'
     return (
       <html lang={locale} data-theme="dark" suppressHydrationWarning>
         <head>
           <meta name="theme-color" content="#0a0e17" />
           <script dangerouslySetInnerHTML={{ __html: themeScript }} />
         </head>
         <body>
           <a className="skip" href="#main">
             {locale === 'nl' ? 'Naar de inhoud' : 'Skip to content'}
           </a>
           <JoHeader
             labels={joHeaderLabels[locale]}
             links={[
               { label: 'Skills', href: `/${locale}/` },
               { label: 'Career', href: `/${locale}/career/` },
               { label: 'My repos', href: `/${locale}/repos/` },
               { label: 'Any repo', href: `/${locale}/any-repo/` }
             ]}
             languages={[
               { code: 'en', href: '/en/', current: locale === 'en' },
               { code: 'nl', href: '/nl/', current: locale === 'nl' }
             ]}
           />
           <main id="main">{children}</main>
         </body>
       </html>
     );
   }
   ```
   Mark the active link with `current: true` (use `usePathname()` in a small client wrapper if the layout does not know the route). The language links should point to the same page in the other language, not to the home page.

### Angular (CodeGuessr)

1. Fonts, self-hosted:
   ```sh
   npm i @fontsource-variable/inter @fontsource-variable/jetbrains-mono
   ```
2. Copy `jo-kit.css`, `jo-header.css`, `jo-header.js`, `jo-header.d.ts` and `jo-header.component.ts` into `src/app/jo/`.
3. `src/styles.css` (already listed under `styles` in `angular.json`):
   ```css
   @import '@fontsource-variable/inter';
   @import '@fontsource-variable/jetbrains-mono';
   @import './app/jo/jo-kit.css';
   @import './app/jo/jo-header.css';
   ```
4. `src/index.html`: add `data-theme="dark"` to `<html>`, `<meta name="theme-color" content="#0a0e17" />`, and the theme script from the Next.js example as a `<script>` in `<head>`.
5. In the root component:
   ```ts
   import { Component } from '@angular/core';
   import { RouterOutlet } from '@angular/router';
   import { JO_HEADER_LABELS, JoHeaderComponent } from './jo/jo-header.component';

   @Component({
     selector: 'app-root',
     imports: [RouterOutlet, JoHeaderComponent],
     template: `
       <a class="skip" href="#main">Skip to content</a>
       <jo-header [links]="links" [languages]="languages" [labels]="labels.en" />
       <main id="main"><router-outlet /></main>
     `
   })
   export class App {
     protected readonly labels = JO_HEADER_LABELS;
     protected readonly links = [
       { label: 'Play', routerLink: '/en/play' },
       { label: 'Leaderboard', routerLink: '/en/leaderboard' },
       { label: 'How it works', routerLink: '/en/about' }
     ];
     protected readonly languages = [
       { code: 'en', href: '/en/', current: true },
       { code: 'nl', href: '/nl/' }
     ];
   }
   ```

| Input / output | Type                                                     | Notes                                                                            |
| -------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `links`        | `{ label; href? ; routerLink? ; current? }[]` (required) | `routerLink` navigates inside the app without a reload; `href` for anything else |
| `languages`    | `{ code; href; current? }[]` (required)                  | The same page in each language                                                   |
| `labels`       | `JO_HEADER_LABELS.en` / `.nl`                            | Defaults to English                                                              |
| `homeHref`     | `string`                                                 | Defaults to `https://joeyoosenbrug.nl/`; leave it                                |
| `showSearch`   | `boolean`                                                | Shows the Ctrl K button and binds Ctrl/Cmd+K                                     |
| `(search)`     | `void`                                                   | Fires on the button and on Ctrl/Cmd+K                                            |

`current` is up to you. With the router, a small `computed()` over `router.url` (e.g. via `toSignal(router.events)`) keeps it in sync. The component starts its scripts in `afterNextRender`, so it is safe with SSR and prerendering, and cleans up when destroyed.

### Plain HTML, Svelte, Astro, anything else

```html
<html lang="en" data-theme="dark">
  <head>
    <meta name="theme-color" content="#0a0e17" />
    <script>
      /* theme script from above, before any CSS */
    </script>
    <link rel="stylesheet" href="jo-kit.css" />
    <link rel="stylesheet" href="jo-header.css" />
  </head>
  <body>
    <!-- contents of header.html -->
    <main id="main">…</main>
    <script type="module">
      import { initJoHeader } from './jo-header.js';
      initJoHeader(document.querySelector('.jo-nav'));
    </script>
  </body>
</html>
```

In SvelteKit, render the markup in a component and call `initJoHeader(el)` in `onMount` (return its cleanup).

---

## 2. The header

**What changes per app, and nothing else:**

- the links (`label` + `href`), numbered `01.`, `02.`, … in order
- which link is current (`aria-current="page"`)
- the language links (the same page in EN and NL)
- the label language (`joHeaderLabels.en` / `.nl`, or the attributes in `header.html`)
- whether the Ctrl K button shows (only when the app has a command menu: pass `onSearch`)

**What stays exactly the same:** the `<JO/>` logo linking to `https://joeyoosenbrug.nl/`, height (60px), max width (1360px), the pill language switch, the theme button, the burger below 1120px, the gradient progress bar, the frosted background once scrolled, every color, size and animation.

**Behaviour** (`jo-header.js`, used by both versions):

| Feature         | How it works                                                                                                                              |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Progress bar    | 2px teal→purple gradient along the bottom edge, scaled to scroll position                                                                 |
| Frosted state   | After 12px of scroll: `--bg` at 78%, `blur(16px)`, bottom border                                                                          |
| Active link     | `aria-current` on the link. Links to `#sections` on the same page are tracked while scrolling                                             |
| Mobile menu     | Below 1120px the links move into a dropdown card; closes on link click and Escape                                                         |
| Number prefixes | `01.` shown above 1480px and in the mobile menu; hidden in between to save room                                                           |
| Theme           | Sun in dark mode, moon in light mode. Saved in a `jo-theme` cookie on `.joeyoosenbrug.nl`, shared by every subdomain, plus `localStorage` |
| Ctrl K          | Hidden unless `onSearch` is passed; then the button shows and Ctrl/Cmd+K calls it                                                         |

The portfolio itself still keeps the theme in `localStorage` only. Until it also reads and writes the `jo-theme` cookie, a theme chosen on a subdomain does not carry over to joeyoosenbrug.nl (the other way round works through `localStorage` fallback only on the same origin).

---

## 3. Colors

Two themes, switched with `data-theme` on `<html>`. **Dark is the default.** Never hard-code a color in a component; use the tokens so both themes keep working.

| Token             | Dark                         | Light                            | Use                                                                |
| ----------------- | ---------------------------- | -------------------------------- | ------------------------------------------------------------------ |
| `--bg`            | `#0a0e17`                    | `#f4f6fb`                        | Page background, also `<meta name="theme-color">`                  |
| `--bg-2`          | `#111726`                    | `#e9edf6`                        | Solid panels on top of the page (dropdowns, popovers)              |
| `--surface`       | `rgba(255,255,255,.04)`      | `rgba(255,255,255,.72)`          | Cards, buttons, inputs                                             |
| `--surface-2`     | `rgba(255,255,255,.08)`      | `rgba(255,255,255,.96)`          | Hover state of a surface                                           |
| `--border`        | `rgba(255,255,255,.09)`      | `rgba(20,30,60,.12)`             | All 1px borders                                                    |
| `--text`          | `#e6e9f2`                    | `#141b2d`                        | Body text, headings                                                |
| `--muted`         | `#98a3b9`                    | `#4b566d`                        | Secondary text, inactive links, meta                               |
| `--accent`        | `#7dd3c0`                    | `#0f766e`                        | Brand teal: primary button, active pill, caret, bars               |
| `--accent-text`   | `#7dd3c0`                    | `#0b6259`                        | Teal as **text** (links, numbers); passes contrast                 |
| `--accent-ink`    | `#06201b`                    | `#ffffff`                        | Text **on** a teal background                                      |
| `--accent-2`      | `#b49cff`                    | `#6d4fd6`                        | Second brand color, purple: gradients, highlights                  |
| `--accent-2-text` | `#c3b1ff`                    | `#5b3fc4`                        | Purple as text (badges, "draft")                                   |
| `--glow`          | `rgba(125,211,192,.26)`      | `rgba(15,118,110,.2)`            | 4px focus-like ring on hover (`box-shadow: 0 0 0 4px var(--glow)`) |
| `--shadow`        | `0 18px 50px rgba(0,0,0,.4)` | `0 18px 40px rgba(30,40,80,.12)` | Cards and dropdowns                                                |
| `--grid-line`     | `rgba(255,255,255,.035)`     | `rgba(20,30,60,.05)`             | The faint background grid                                          |

Gradients always run **teal → purple**, left to right: `linear-gradient(90deg, var(--accent), var(--accent-2))`.

Mixing: use `color-mix(in srgb, var(--accent) 55%, var(--border))` for a teal-tinted border on hover, and `color-mix(in srgb, var(--accent) 12%, transparent)` for a soft teal fill.

Code colors (`--syn-kw`, `--syn-str`, `--syn-num`, `--syn-fn`, `--syn-prop`, `--syn-com`, `--syn-punc`) and the classes `.kw .str .num-t .fn .prop .com .punc` are for anything that looks like code.

## 4. Background

Every page has the same backdrop, drawn by `body::before` in `jo-kit.css`:

- a purple glow top right (`--accent-2` at 13%, 1100×650px ellipse at 85% / -10%)
- a teal glow left (`--accent` at 9%, 900×600px at -10% / 25%)
- a 48px grid of 1px `--grid-line` lines

It is `position: fixed` behind everything, so content scrolls over it. Don't give full-page containers their own background, or the grid disappears. Cards are translucent (`.glass`: `--surface` + `blur(14px)`) so the backdrop shows through.

## 5. Typography

| Role                | Font                                                 | Notes                                                               |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| Body text           | Inter Variable (`--font`)                            | 1rem, line-height 1.6, max 70ch per paragraph                       |
| Code-ish UI         | JetBrains Mono Variable (`--mono`, `.mono`)          | Nav links, buttons, tags, section titles, labels, meta              |
| h1                  | Inter, 700                                           | Large and tight: `letter-spacing: -0.04em`, line-height ~0.95       |
| h2 (section titles) | Mono, 700, `clamp(1.6rem, 3.4vw, 2.3rem)`, `-0.04em` | Written as a tag: `<Skills/>`, with `<` and `/>` in `--accent-text` |
| h3                  | Inter, 700, 1.15rem                                  |                                                                     |

Both fonts are self-hosted through `@fontsource-variable/*`. No Google Fonts, so no visitor IPs go to a third party.

## 6. Spacing, size and shape

| Token / rule    | Value                                                            |
| --------------- | ---------------------------------------------------------------- |
| `--nav-h`       | 60px (header height; `scroll-padding-top` is 60 + 8px)           |
| Content width   | `.container`: `min(1100px, 100% - 2rem)` (1rem gutter each side) |
| Header width    | `min(1360px, 100% - 2rem)`                                       |
| Section padding | `.section`: `clamp(2.75rem, 6vw, 4.5rem)` top and bottom         |
| `--radius`      | 14px: cards, dropdowns                                           |
| `--radius-sm`   | 9px: buttons, icon buttons, inputs                               |
| Tags            | 6px radius; pills (language switch, badges) 999px                |
| Icon buttons    | 36×36px, 1px border, `--surface`                                 |
| Borders         | Always 1px `--border`                                            |

## 7. Motion

| Token      | Value                               | Use                                      |
| ---------- | ----------------------------------- | ---------------------------------------- |
| `--ease`   | `cubic-bezier(0.22, 1, 0.36, 1)`    | Default for everything                   |
| `--spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Small playful overshoots (logo brackets) |

- Hover transitions 0.2–0.35s; entrance animations 0.7–0.9s (`fade-up`, `.reveal`: fade + 18px rise + blur).
- Buttons press down to `scale(0.96)`; icon buttons to `scale(0.92)`.
- **Nothing follows the cursor.** Buttons stay where they are (a deliberate decision; the magnetic effect was removed). A gentle tilt on large cards is fine.
- `prefers-reduced-motion` switches all animation off (already in `jo-kit.css`). Anything you add must respect it too.

## 8. Components in the kit

| Class              | What                                                                      |
| ------------------ | ------------------------------------------------------------------------- |
| `.btn`             | Mono, 0.9rem, 600, surface + border; hover: surface-2, teal border, glow  |
| `.btn.btn-primary` | Teal fill, `--accent-ink` text, light sweep on hover. One per view        |
| `.tag`             | Small mono chip, muted; teal on hover                                     |
| `.glass`           | Frosted card: surface, border, 14px radius, blur, shadow                  |
| `.glass.ring`      | Same, plus a rotating teal→purple border on hover/focus (clickable cards) |
| `.caret`           | Blinking block cursor                                                     |
| `.skip`            | "Skip to content" link, first thing in `<body>`, targets `#main`          |
| `.sr-only`         | Visually hidden, still read by screen readers                             |
| `:focus-visible`   | 2px `--accent-text` outline, 3px offset. Never remove it                  |

Frosted blur: always write `-webkit-backdrop-filter` **before** `backdrop-filter`. Lightning CSS (used by Vite 8 and Tailwind 4) merges the two and keeps only the last one; if that is the prefixed one, Chrome shows no blur.

## 9. UI decisions

- **It looks like a developer's editor.** File-path labels (`~/joey/skills.ts`), window chrome with three dots, `// comments` for hints, `<Title/>` section heads, a terminal prompt (`joey@portfolio:~$`). Use it as seasoning, not on every element.
- **Playful but clear.** Microcopy can joke ("side quests", "Go on, poke one"), but every control says what it does. If something is not obvious, it is not playful, it is unclear.
- **Dark by default**, light as an equal option. Test every screen in both.
- **Two languages.** English at `/`, Dutch at `/nl/` (or `/en/` + `/nl/` for apps with locale routing). Same pages, same structure; the switch keeps you on the same page. Write the Dutch text yourself; don't machine-translate it.
- **The first screen fits.** Hero content plus anything meant to be seen at a glance fits in 1366×657 up to 2560×1300 without scrolling.
- **External links** open in a new tab with `rel="noopener noreferrer"` and end with `↗`. The `<JO/>` logo always returns to the portfolio.
- **Privacy.** No cookies except the theme cookie, cookie-less analytics (Cloudflare Web Analytics), self-hosted fonts, no contact forms.
- **Accessible.** WCAG 2.2 AA: contrast via the `*-text` tokens, a skip link, visible focus, `aria-current` for the active page, labelled icon buttons, `<html lang>` per language, reduced motion respected.

## 10. Code conventions

- **TypeScript** everywhere, strict. Prefer plain data + small functions over classes.
- **Formatting:** Prettier with `singleQuote: true`, `trailingComma: "none"`, `printWidth: 160`, `endOfLine: "auto"`. **Linting:** ESLint (typescript-eslint recommended + framework plugin + `eslint-config-prettier`); unused vars are errors unless prefixed `_`.
- **Content lives in data files, not components.** Text per language in `locales/en` and `locales/nl`; the Dutch file is type-checked against the English one, and a unit test checks both have the same keys.
- **Styles:** tokens only, no hard-coded colors or font stacks. Component styles are scoped (Svelte `<style>`, CSS modules, or Tailwind utilities mapped to the tokens). Shared classes come from the kit.
- **Comments** explain _why_, not _what_, and are short.
- **Tests on every pull request:** type check, lint, unit tests (Vitest), end-to-end + accessibility tests (Playwright + axe, desktop and mobile, both themes), Lighthouse budgets. Nothing merges with a red check.
- **Workflow:** feature branch → pull request into `main` → checks → merge → automatic deploy. `main` is never pushed to directly.
- **Commits:** imperative subject (“Fit the hero in one screen…”), a body that explains why when it is not obvious, one author: Joey.
- **Dependencies:** Dependabot weekly; bumps that must move together (e.g. Vite + its plugin) are done in one PR.

## 11. Checklist for a new subdomain

- [ ] `jo-kit.css` + `jo-header.css` loaded, fonts installed
- [ ] Theme script in `<head>` before the CSS; `<meta name="theme-color" content="#0a0e17">`
- [ ] Skip link → header → `<main id="main">`
- [ ] Header links, language links and labels filled in; `<JO/>` goes to joeyoosenbrug.nl
- [ ] `/en/` and `/nl/` (or `/` and `/nl/`), `<html lang>` set per language
- [ ] Checked in dark and light, at 390px and 1440px wide, with keyboard only
- [ ] Added to `sideProjects` in the portfolio (`src/lib/data/shared/sideProjects.ts`) so it appears in the hero and under Projects

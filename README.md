# Joey Oosenbrug: portfolio

SvelteKit (static adapter) + TypeScript + plain CSS. No UI kit, hand-built SVG charts. NL/EN language switch and dark/light theme built in.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in ./build
npm run preview    # serve the production build
npm run check      # type check
```

## Edit your content

Everything lives in `src/lib/data/`, one file per part, so content is easy to filter and change.

```
src/lib/data/
  types.ts                 shared types
  shared/                  language-neutral facts
    roles.ts               workplaces: company, dates, location, tech stack   <- durations and charts derive from this
    skills.ts              every skill + category
    projects.ts            project cards (link: null = shown as placeholder)
    education.ts           education and courses
    languages.ts           spoken languages
    contact.ts             email, LinkedIn, GitHub, form endpoint, photo, CV file paths
    testimonials.ts        empty = the section is hidden
  locales/
    en/  profile.ts experience.ts projects.ts education.ts skills.ts languages.ts ui.ts
    nl/  (same files, Dutch; typed against en so a missing key is a compile error)
```

- Skill "time in projects" is not stored: it is calculated from the dates of the roles whose `stack` contains the skill (overlaps counted once). Bubble size, proficiency level, bar chart, radar and growth chart all follow from that.
- To add a role: add it to `shared/roles.ts`, then add its texts under the same id in both `locales/*/experience.ts`.
- To add a language: copy `locales/en` to `locales/de`, translate, then register it in `locales/index.ts` and the `Locale` type.
- CV downloads: replace the files in `static/cv/` (paths set in `shared/contact.ts`).

## Placeholders to fill in

- `shared/contact.ts`: email, GitHub URL (marked "placeholder" on the page), optional photo, optional Formspree `formEndpoint`.
- `shared/projects.ts`: project links.
- `locales/*/experience.ts`: the Activate role description.
- `shared/testimonials.ts`: add recommendations to show the carousel.

## Deploy

**Netlify**: build command `npm run build`, publish directory `build`.

**Vercel**: the SvelteKit preset works out of the box, or use build `npm run build` and output `build`.

**GitHub Pages**: build with your repo name as base path and publish `build`:

```bash
BASE_PATH=/your-repo npm run build
```

Then deploy `build/` (for example with the `actions/deploy-pages` action). For a user site (`username.github.io`) leave `BASE_PATH` empty.

## Easter egg

Type the Konami code (up up down down left right left right b a).

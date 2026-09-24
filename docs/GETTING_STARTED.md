# Getting started

## Requirements

- [Node.js](https://nodejs.org) 20 or newer
- npm (comes with Node)

## Run it locally

```bash
git clone https://github.com/joeykwispel/Portfolio.git
cd Portfolio
npm install
npm run dev
```

Open http://localhost:5173.

## Scripts

| Command           | What it does                                      |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload              |
| `npm run build`   | Build the static site into `build/`               |
| `npm run preview` | Serve the production build locally                |
| `npm run check`   | Type-check the project                            |

To share the preview on your local network, run `npm run preview -- --host` and open the "Network" URL it prints.

## Project structure

```
src/
  routes/
    +page.svelte        the portfolio (single page)
    cv/+page.svelte     the printable CV page
    +error.svelte       404 page
  lib/
    components/         sections (Hero, About, Skills, ...) and ui/ building blocks
    data/               all content, see below
    utils/              date helpers, derived stats, Svelte actions
static/                 favicon, robots.txt, social preview image
```

## Editing the content

All content lives in `src/lib/data/`. You never need to touch the components to change text.

| File                                  | Contains                                                   |
| ------------------------------------- | ---------------------------------------------------------- |
| `shared/contact.ts`                   | Email, LinkedIn, GitHub, photo, public site URL            |
| `shared/roles.ts`                     | Jobs: company, dates, location, tech stack                 |
| `shared/projects.ts`                  | Project cards and their links                              |
| `shared/skills.ts`                    | Every skill and its category                               |
| `shared/education.ts`                 | Education and courses                                      |
| `shared/testimonials.ts`              | Recommendations (the section hides when this is empty)     |
| `cv.ts`                               | Full CV text for the `/cv` page, English and Dutch         |
| `locales/en/*`, `locales/nl/*`        | All translated text (Dutch is type-checked against English) |

Good to know:

- **Skill durations are calculated**, not typed in: each skill's "time in projects" comes from the dates of the roles whose `stack` lists it. The charts, bubble sizes and levels all follow from that.
- **Adding a job:** add it to `shared/roles.ts`, then add its text under the same id in both `locales/en/experience.ts` and `locales/nl/experience.ts`.
- **Adding a language:** copy `locales/en` to a new folder, translate it, and register it in `locales/index.ts` and the `Locale` type in `types.ts`.

## Deploying

The site builds to plain static files in `build/`, so any static host works.

- **Netlify:** build command `npm run build`, publish directory `build`.
- **Vercel:** import the repo; the SvelteKit preset works as-is.
- **GitHub Pages:** for a project site, build with the repo name as base path, then publish `build/` (for example with the `actions/deploy-pages` action):

  ```bash
  BASE_PATH=/Portfolio npm run build
  ```

  For a user site (`username.github.io`) leave `BASE_PATH` empty.

After deploying, set `siteUrl` in `src/lib/data/shared/contact.ts` to your live URL (no trailing slash). Social platforms need that absolute URL to show the preview image when the link is shared.

## Extras

- `Ctrl + K` (or `/`) opens a command menu.
- Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.

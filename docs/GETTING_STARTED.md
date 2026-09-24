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
| `shared/contributions.ts`             | Open-source pull requests, incl. diff snippets             |
| `cv.ts`                               | Full CV text for the `/cv` page, English and Dutch         |
| `locales/en/*`, `locales/nl/*`        | All translated text (Dutch is type-checked against English) |

When a pull request gets merged, change its `state` to `'merged'` in `shared/contributions.ts`; the badge turns purple.

Good to know:

- **Skill durations are calculated**, not typed in: each skill's "time in projects" comes from the dates of the roles whose `stack` lists it. The charts, bubble sizes and levels all follow from that.
- **Adding a job:** add it to `shared/roles.ts`, then add its text under the same id in both `locales/en/experience.ts` and `locales/nl/experience.ts`.
- **Adding a language:** copy `locales/en` to a new folder, translate it, and register it in `locales/index.ts` and the `Locale` type in `types.ts`.

## Deploying

The site builds to plain static files in `build/`, so any static host works. This repo deploys to **GitHub Pages** at **https://joeyoosenbrug.nl**.

**Workflow:** work on a feature branch and open a pull request into `main`.
- `.github/workflows/pr-check.yml` type-checks and builds every PR (nothing is deployed).
- `.github/workflows/deploy.yml` deploys when the PR is merged into `main`.

Tip: protect `main` (Settings → Branches → add a rule requiring a pull request and the "PR check" status) so nothing reaches the live site without a PR.

### GitHub Pages with a custom domain (one-time setup)

1. **Repository:** Settings → Pages → Build and deployment → Source: **GitHub Actions**.
2. **Custom domain:** in the same screen, enter `joeyoosenbrug.nl` and save.
3. **DNS** at your domain registrar:

   | Type  | Name  | Value                  |
   | ----- | ----- | ---------------------- |
   | A     | `@`   | `185.199.108.153`      |
   | A     | `@`   | `185.199.109.153`      |
   | A     | `@`   | `185.199.110.153`      |
   | A     | `@`   | `185.199.111.153`      |
   | AAAA  | `@`   | `2606:50c0:8000::153`  |
   | AAAA  | `@`   | `2606:50c0:8001::153`  |
   | AAAA  | `@`   | `2606:50c0:8002::153`  |
   | AAAA  | `@`   | `2606:50c0:8003::153`  |
   | CNAME | `www` | `joeykwispel.github.io` |

4. Once DNS has propagated (minutes to a few hours), tick **Enforce HTTPS** in Settings → Pages.
5. Recommended: verify the domain under your GitHub account (Settings → Pages → Verified domains), so nobody else can claim it for their Pages site.

### Other hosts

- **Netlify:** build command `npm run build`, publish directory `build`.
- **Vercel:** import the repo; the SvelteKit preset works as-is.
- **Without a custom domain** on GitHub Pages the site lives in a sub-folder, so build with `BASE_PATH=/<repo-name> npm run build`.

If the domain changes, update `siteUrl` in `src/lib/data/shared/contact.ts` and the URLs in `static/sitemap.xml` and `static/robots.txt`.

## Extras

- `Ctrl + K` (or `/`) opens a command menu.
- Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A.

import type { Locale, SideProject } from '../types';

/**
 * My own products, shown first under Projects and as quick links in the hero.
 * Unlike client projects they have no role, so they don't add to "years in projects";
 * their stack still shows up in the Skills section and on the CV.
 * A 'wip' project is listed as coming soon and not linked.
 */
export const sideProjects: SideProject[] = [
  {
    id: 'devcity',
    name: 'DevCity',
    url: 'https://devcity.joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/devcity',
    status: 'live',
    localized: true,
    start: '2026-09',
    stack: [
      'Next.js',
      'React',
      'TypeScript',
      'Three.js',
      'React Three Fiber',
      'D3.js',
      'Tailwind CSS',
      'Shadcn',
      'TanStack Query',
      'Zustand',
      'Zod',
      'I18N',
      'Hono',
      'Cloudflare Workers',
      'Turborepo',
      'PNPM',
      'Vitest',
      'Playwright',
      'axe-core',
      'Storybook',
      'ESLint',
      'Prettier',
      'GitHub Actions',
      'GitHub Pages'
    ],
    links: [
      { id: 'skills', path: '' },
      { id: 'career', path: 'career/' },
      { id: 'repos', path: 'repos/' },
      { id: 'any-repo', path: 'any-repo/' }
    ]
  },
  {
    id: 'portfolio',
    name: 'joeyoosenbrug.nl',
    url: 'https://joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/Portfolio',
    status: 'live',
    localized: false,
    start: '2026-09',
    stack: [
      'Svelte',
      'SvelteKit',
      'TypeScript',
      'Vite',
      'I18N',
      'Vitest',
      'Playwright',
      'axe-core',
      'Lighthouse CI',
      'ESLint',
      'Prettier',
      'SEO',
      'WCAG 2.2',
      'GitHub Actions',
      'GitHub Pages'
    ]
  },
  {
    id: 'dev-puzzle',
    name: 'Dev Puzzle',
    url: 'https://dev-puzzle.joeyoosenbrug.nl',
    repo: null,
    status: 'wip',
    localized: false,
    start: '2026-09',
    stack: []
  }
];

/** Side projects that are live, in the order they should appear. */
export const liveSideProjects = sideProjects.filter((p) => p.status === 'live');

/** Link into a side project. Localized apps (DevCity) use /en/ and /nl/ prefixes. */
export function sideProjectHref(p: SideProject, locale: Locale, path = ''): string {
  return p.localized ? `${p.url}/${locale}/${path}` : `${p.url}/${path}`;
}

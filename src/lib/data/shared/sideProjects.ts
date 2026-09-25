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
    localeRoutes: 'prefixed',
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
    id: 'codeguessr',
    name: 'Codeguessr',
    url: 'https://codeguessr.joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/codeguessr',
    status: 'live',
    localeRoutes: 'dutch-prefix',
    start: '2026-09',
    stack: [
      'Angular',
      'Angular CDK',
      'TypeScript',
      'RxJS',
      'PWA',
      'I18N',
      'Supabase',
      'PostgreSQL',
      'OAuth',
      'Vitest',
      'Angular Testing Library',
      'Playwright',
      'axe-core',
      'Lighthouse CI',
      'ESLint',
      'Prettier',
      'SEO',
      'WCAG 2.2',
      'GitHub Actions',
      'GitHub Pages'
    ],
    links: [
      { id: 'today', path: '' },
      { id: 'archive', path: 'archive/' }
    ]
  },
  {
    id: 'portfolio',
    name: 'joeyoosenbrug.nl',
    url: 'https://joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/Portfolio',
    status: 'live',
    localeRoutes: 'none',
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
  }
];

/** Side projects that are live, in the order they should appear. */
export const liveSideProjects = sideProjects.filter((p) => p.status === 'live');

/** Link into a side project, in the reader's language where the app has one. */
export function sideProjectHref(p: SideProject, locale: Locale, path = ''): string {
  if (p.localeRoutes === 'prefixed') return `${p.url}/${locale}/${path}`;
  if (p.localeRoutes === 'dutch-prefix' && locale === 'nl') return `${p.url}/nl/${path}`;
  return `${p.url}/${path}`;
}

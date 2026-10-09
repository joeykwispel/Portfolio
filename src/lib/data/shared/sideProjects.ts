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
    ],
    heroLinks: 2
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
    id: 'arcade',
    name: 'Arcade',
    url: 'https://arcade.joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/arcade',
    status: 'live',
    localeRoutes: 'dutch-prefix',
    start: '2026-09',
    // Every game is built with a different stack, so the languages come first on the card.
    stack: [
      'Svelte',
      'React',
      'Rust',
      'WebAssembly',
      'Kotlin',
      'Elm',
      'ReScript',
      'Three.js',
      'Lua',
      'C++',
      'Emscripten',
      'Gleam',
      'Dart',
      'Flutter',
      'Python',
      'Godot',
      'TypeScript',
      'JavaScript (ES6)',
      'SvelteKit',
      'HTML5',
      'CSS3',
      'I18N',
      'Vite',
      'Gradle',
      'Vitest',
      'Playwright',
      'axe-core',
      'ESLint',
      'Prettier',
      'GitHub Actions',
      'GitHub Pages'
    ],
    links: [
      { id: 'duck', path: 'play/duck/' },
      { id: 'bug-bash', path: 'play/bug-bash/' },
      { id: 'git-gud', path: 'play/git-gud/' },
      { id: 'standup-survivor', path: 'play/standup-survivor/' },
      { id: 'infinite-scroll', path: 'play/infinite-scroll/' },
      { id: 'deploy-tycoon', path: 'play/deploy-tycoon/' },
      { id: 'semicolon-snake', path: 'play/semicolon-snake/' },
      { id: 'dependency-hell', path: 'play/dependency-hell/' },
      { id: 'dev-ware', path: 'play/dev-ware/' },
      { id: 'cookie-consent', path: 'play/cookie-consent/' },
      { id: 'code-review-tinder', path: 'play/code-review-tinder/' },
      { id: 'rm-rf-dungeon', path: 'play/rm-rf-dungeon/' },
      { id: 'localhost-golf', path: 'play/localhost-golf/' }
    ],
    heroLinks: 2,
    // Thirteen games make the card far taller than its neighbours; the app itself is the list.
    cardLinks: 0
  },
  {
    id: 'tools',
    name: 'Tools',
    url: 'https://tools.joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/Tools',
    status: 'live',
    localeRoutes: 'dutch-prefix',
    start: '2026-10',
    stack: [
      'Svelte',
      'SvelteKit',
      'TypeScript',
      'Vite',
      'I18N',
      'Supabase',
      'PostgreSQL',
      'OAuth',
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
    ],
    links: [{ id: 'regex', path: 'regex/' }]
  },
  {
    id: 'designkit',
    name: 'Design Kit',
    url: 'https://designkit.joeyoosenbrug.nl',
    repo: 'https://github.com/joeykwispel/designkit',
    status: 'live',
    localeRoutes: 'dutch-prefix',
    start: '2026-10',
    stack: [
      'TypeScript',
      'CSS3',
      'Svelte',
      'React',
      'Tailwind CSS',
      'SvelteKit',
      'NPM',
      'Vite',
      'I18N',
      'Vitest',
      'Playwright',
      'axe-core',
      'Lighthouse CI',
      'ESLint',
      'Prettier',
      'WCAG 2.2',
      'GitHub Actions',
      'GitHub Pages'
    ],
    links: [
      { id: 'tokens', path: 'tokens/' },
      { id: 'components', path: 'components/' },
      { id: 'header', path: 'header/' },
      { id: 'guidelines', path: 'guidelines/' },
      { id: 'changelog', path: 'changelog/' }
    ],
    heroLinks: 2
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

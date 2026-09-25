import type { PostBase } from '../types';

/**
 * Writing, newest first. Text per language lives in locales/<lang>/posts.ts.
 * Set `status: 'published'` once a post is approved; drafts only show up in `npm run dev`.
 */
export const posts: PostBase[] = [
  { slug: 'crypto-agility-in-three-pull-requests', date: '2026-09-24', status: 'published', tags: ['Post-quantum', 'Security', 'Open source'] },
  { slug: 'playwright-and-mcp', date: '2026-09-24', status: 'published', tags: ['Testing', 'Playwright', 'AI tooling'] },
  { slug: 'how-this-portfolio-works', date: '2026-09-24', status: 'published', tags: ['SvelteKit', 'Performance', 'Accessibility'] }
];

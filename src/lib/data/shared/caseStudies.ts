import type { CaseStudyBase } from '../types';

/**
 * Case studies, newest first. Text per language lives in locales/<lang>/caseStudies.ts.
 * Set `status: 'published'` once the text is approved; drafts only show up in `npm run dev`.
 */
export const caseStudies: CaseStudyBase[] = [
  {
    slug: 'pqnavigator',
    projectId: 'pqnavigator',
    status: 'published',
    stack: ['Next.js', 'TypeScript', 'NestJS', 'FastAPI', 'PostgreSQL', 'Kubernetes', 'Proxmox', 'WCAG 2.2'],
    contributions: ['minvws-dvp-proxy-8', 'fundament-424', 'brp-amsterdam-195']
  },
  {
    slug: 'post-quantum-open-source',
    projectId: 'pqnavigator',
    status: 'published',
    stack: ['Python', 'Go', 'Kubernetes', 'JWT', 'Pytest'],
    standalone: true,
    contributions: ['minvws-dvp-proxy-8', 'fundament-424', 'brp-amsterdam-195']
  },
  {
    slug: 'property-plan',
    projectId: 'property-plan',
    status: 'published',
    stack: ['Angular', 'Ionic Framework', 'Capacitor', 'RxJS', 'Playwright', 'MCP', 'Azure DevOps']
  },
  {
    slug: 'code-tuner',
    projectId: 'code-tuner',
    status: 'published',
    stack: ['React', 'Next.js', 'NestJS', 'Hono', 'D3.js', 'PostgreSQL', 'Stryker', 'GitHub Actions'],
    testimonial: 0
  },
  {
    slug: 'vice-content-platform',
    projectId: 'vice-platform',
    status: 'published',
    stack: ['React', 'Next.js', 'Cypress', 'Cucumber', 'Figma']
  }
];

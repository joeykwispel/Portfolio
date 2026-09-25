import type { CategoryId, SkillBase } from '../types';

const group = (category: CategoryId, names: string[]): SkillBase[] => names.map((name) => ({ name, category }));

/**
 * Every skill, tool, language and methodology from the CV (NL + EN merged) and LinkedIn.
 * Years of use are NOT stored here: they are derived from the roles whose `stack` contains the skill.
 */
export const skills: SkillBase[] = [
  ...group('frontend', [
    'Angular',
    'Angular Material',
    'React',
    'Vue.js',
    'Next.js',
    'Nuxt',
    'Ionic Framework',
    'TypeScript',
    'JavaScript (ES6)',
    'RxJS',
    'Web Components',
    'jQuery',
    'HTML5',
    'Semantic HTML5',
    'CSS3',
    'SASS',
    'SCSS',
    'Styled Components',
    'Tailwind CSS',
    'Shadcn',
    'I18N',
    'D3.js',
    'Chart.js',
    'Twig'
  ]),
  ...group('backend', [
    'PHP',
    'Laravel',
    'Symfony',
    'Zend',
    'NestJS',
    'Python',
    'FastAPI',
    'Hono',
    'Pydantic',
    'Prisma',
    'SQL',
    'MySQL',
    'PostgreSQL',
    'SQLite',
    'RESTful APIs',
    'OpenAPI',
    'Swagger',
    'JSON',
    'YAML',
    'XML',
    'XPath',
    'JWT',
    'Google Maps API'
  ]),
  ...group('devops', [
    'Docker',
    'Kubernetes',
    'Proxmox',
    'Nginx',
    'Git',
    'GitHub',
    'GitLab',
    'Azure DevOps',
    'GitHub Actions',
    'CI/CD',
    'Bash',
    'Shell',
    'Command Line',
    'Microservices'
  ]),
  ...group('testing', ['Playwright', 'Jest', 'Vitest', 'Pytest', 'Cypress', 'Cucumber', 'React Testing Library', 'Stryker', 'Storybook', 'ast-grep']),
  ...group('tools', [
    'MCP',
    'Capacitor',
    'Postman',
    'Sentry',
    'Jira',
    'Trello',
    'Monday',
    'Miro',
    'Figma',
    'WordPress',
    'HubSpot',
    'Visual Studio Code',
    'PhpStorm',
    'JetBrains',
    'NPM',
    'PNPM',
    'Yarn',
    'Turborepo',
    'Vite',
    'ESLint',
    'Prettier',
    'SEO',
    'Windows',
    'Linux',
    'macOS',
    'iOS',
    'Android'
  ]),
  ...group('methods', ['Agile', 'Scrum', 'SAFe', 'Kanban', 'Scrum Master', 'UX/UI Design', 'UX/UI Principles', 'WCAG 2.1', 'WCAG 2.2', 'GDPR']),
  ...group('soft', ['Technical Leadership', 'Mentoring', 'Code Reviews', 'Stakeholder Management']),
  ...group('languages', ['Dutch', 'English'])
];

/** The stack I want to be known for, shown first in the Skills section. Names must exist above. */
export const coreSkills = ['TypeScript', 'Angular', 'React', 'Next.js', 'Vue.js', 'NestJS', 'Python', 'FastAPI', 'Kubernetes', 'Playwright'];

export const categoryOrder: CategoryId[] = ['frontend', 'backend', 'devops', 'testing', 'tools', 'methods', 'soft', 'languages'];

/** Hue per category, used for chip/graph colours (HSL). */
export const categoryHue: Record<CategoryId, number> = {
  frontend: 168,
  backend: 262,
  devops: 205,
  testing: 32,
  tools: 330,
  methods: 95,
  soft: 12,
  languages: 55
};

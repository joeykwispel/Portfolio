import type { SideProjectText } from '../../types';

export const sideProjects: Record<string, SideProjectText> = {
  devcity: {
    tagline: 'My skills, career and repos as a 3D city',
    description:
      'My CV and GitHub activity as an explorable 3D city. Every skill, role and repository becomes a building, sized by how much I used it. You can also load any public GitHub repo and walk through its code as a skyline.',
    links: { skills: 'Skills', career: 'Career', repos: 'My repos', 'any-repo': 'Any repo' }
  },
  portfolio: {
    tagline: 'This site',
    description:
      'The site you are on. A static SvelteKit site in English and Dutch where every skill duration, chart and stat is derived from the dates of my roles. Each pull request runs type checks, unit tests, end-to-end tests, accessibility scans and Lighthouse budgets before it can go live.'
  },
  'dev-puzzle': {
    tagline: 'A daily puzzle for developers',
    description: 'A small coding puzzle every day. Work in progress.'
  }
};

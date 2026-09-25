import type { SideProjectText } from '../../types';

export const sideProjects: Record<string, SideProjectText> = {
  devcity: {
    tagline: 'Mijn skills, carrière en repos als 3D-stad',
    description:
      'Mijn CV en GitHub-activiteit als een 3D-stad die je kunt verkennen. Elke skill, rol en repository wordt een gebouw, zo groot als hoeveel ik het gebruikt heb. Je kunt ook elke publieke GitHub-repo inladen en door de code lopen als skyline.',
    links: { skills: 'Skills', career: 'Carrière', repos: 'Mijn repos', 'any-repo': 'Elke repo' }
  },
  portfolio: {
    tagline: 'Deze site',
    description:
      'De site waar je nu op bent. Een statische SvelteKit-site in het Nederlands en Engels, waarin elke skillduur, grafiek en statistiek wordt berekend uit de data van mijn rollen. Elke pull request doorloopt typechecks, unittests, end-to-end tests, toegankelijkheidsscans en Lighthouse-budgetten voordat hij live mag.'
  },
  'dev-puzzle': {
    tagline: 'Een dagelijkse puzzel voor developers',
    description: 'Elke dag een kleine programmeerpuzzel. Werk in uitvoering.'
  }
};

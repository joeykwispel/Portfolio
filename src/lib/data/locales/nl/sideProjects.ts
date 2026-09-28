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
  codeguessr: {
    tagline: 'Dagelijkse Wordle-puzzel voor developers',
    description:
      'Raad het framework, de taal, tool of het protocol van de dag aan de hand van zes hints, te beginnen met de vaagste. Houd je reeks vast, deel je resultaat en speel elke eerdere puzzel in het archief. Werkt offline en zonder account.',
    links: { today: 'Puzzel van vandaag', archive: 'Archief' }
  },
  arcade: {
    tagline: 'Browsergames, elk in een andere stack',
    description:
      'Een verzameling kleine browsergames, elk gebouwd met een andere stack om te voelen hoe ze zich verhouden. Rubber Duck Run is het offline dinospel voor developers in vanilla JavaScript en Canvas: spring over bugs, duik onder meeting-uitnodigingen. Bug Bash is een tower defense in Rust, gecompileerd naar WebAssembly: installeer linters, unit tests en rubber ducks en squash bugs voor ze productie halen.',
    links: { duck: 'Rubber Duck Run', 'bug-bash': 'Bug Bash' }
  }
};

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
      'Een verzameling browsergames voor developers, elk gebouwd met een andere stack om te voelen hoe ze zich verhouden: vanilla JavaScript, Rust + WebAssembly, React, Kotlin/JS, ReScript + Three.js, Elm, Lua, C++ + Box2D, Gleam, Dart + Flutter, Python in de browser, Godot, en één helemaal zonder JavaScript. Verdedig productie tegen bugs, ontwar commit graphs met echte git commands, stapel npm-packages tot left-pad verdwijnt, swipe door code reviews, rm je een weg door een filesystem-kerker of golf door webpagina’s.',
    links: {
      duck: 'Rubber Duck Run',
      'bug-bash': 'Bug Bash',
      'git-gud': 'Git Gud',
      'standup-survivor': 'Standup Survivor',
      'infinite-scroll': 'Infinite Scroll',
      'deploy-tycoon': 'Deploy Tycoon',
      'semicolon-snake': 'Semicolon Snake',
      'dependency-hell': 'Dependency Hell',
      'dev-ware': 'Dev-Ware',
      'cookie-consent': 'Cookie Consent Speedrun',
      'code-review-tinder': 'Code Review Tinder',
      'rm-rf-dungeon': 'rm -rf dungeon',
      'localhost-golf': 'Localhost Golf'
    }
  },
  tools: {
    tagline: 'Developertools die in je browser draaien',
    description:
      'Een dashboard met de kleine tools die je als developer steeds weer nodig hebt, zelf gebouwd, plus een selectie links naar de beste tools elders. Elke tool draait in de browser, dus wat je erin plakt wordt nergens naartoe gestuurd. De regex-tester is de eerste; de rest staat als binnenkort in de lijst. Geef je favorieten een ster om ze vast te zetten, en log in met Google om ze tussen apparaten te synchroniseren.',
    links: { regex: 'Regex-tester' }
  },
  designkit: {
    tagline: 'Het design system achter deze sites',
    description:
      'Het design system van joeyoosenbrug.nl en de subdomeinen, gepubliceerd als npm-package: tokens voor beide thema’s, basisstijlen, componenten en de gedeelde header, voor gewone HTML, Svelte, React en Tailwind. Elke tokenwaarde staat op één plek en de CSS, JSON en het Tailwind-thema worden daaruit gegenereerd. De documentatiesite is gebouwd met het package zelf, met live voorbeelden en richtlijnen.',
    links: { tokens: 'Tokens', components: 'Componenten', header: 'Header', guidelines: 'Richtlijnen', changelog: 'Changelog' }
  }
};

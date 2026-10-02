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
  codeguessr: {
    tagline: 'A daily Wordle-style puzzle for developers',
    description:
      'Guess the framework, language, tool or protocol of the day from six clues, starting with the vaguest. Keep your streak, share your result grid, and play every past puzzle in the archive. Works offline and without an account.',
    links: { today: "Today's puzzle", archive: 'Archive' }
  },
  arcade: {
    tagline: 'Browser games, each in a different stack',
    description:
      'A hub of browser games for developers, each built with a different stack to feel how they compare: vanilla JavaScript, Rust + WebAssembly, React, Kotlin/JS, ReScript + Three.js, Elm, Lua, C++ + Box2D, Gleam, Dart + Flutter, Python in the browser, Godot, and one with no JavaScript at all. Defend production from bugs, untangle commit graphs with real git commands, stack npm packages until left-pad disappears, swipe through code reviews, rm your way through a filesystem dungeon or golf through web pages.',
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
    tagline: 'Developer tools that run in your browser',
    description:
      'A dashboard of the small tools a developer keeps reaching for, built in-house, plus hand-picked links to the best ones elsewhere. Every tool runs in the browser, so what you paste into it is never sent anywhere. The regex tester is the first one; the rest are listed as coming soon. Star your favourites to pin them, and sign in with Google to sync them across devices.',
    links: { regex: 'Regex tester' }
  },
  designkit: {
    tagline: 'The design system behind these sites',
    description:
      'The design system of joeyoosenbrug.nl and its subdomains, published as an npm package: tokens for both themes, base styles, components and the shared header, for plain HTML, Svelte, React and Tailwind. Every token value is typed once and the CSS, JSON and Tailwind theme are generated from it. The documentation site is built with the package itself, with live examples and guidelines.',
    links: { tokens: 'Tokens', components: 'Components', header: 'Header', guidelines: 'Guidelines', changelog: 'Changelog' }
  }
};

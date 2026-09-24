import type { UI } from '../en/ui';

export const ui: UI = {
  meta: {
    title: 'Joey Oosenbrug | Senior Front-end & Full-Stack Developer',
    description: 'Portfolio van Joey Oosenbrug: senior front-end en full-stack developer met Angular, React, Next.js, Vue.js, TypeScript, NestJS en Python.'
  },
  nav: {
    about: 'Over mij',
    skills: 'Skills',
    insights: 'Inzichten',
    experience: 'Ervaring',
    projects: 'Projecten',
    testimonials: 'Aanbevelingen',
    contact: 'Contact',
    skip: 'Naar de inhoud',
    menu: 'Menu',
    language: 'Taal wijzigen',
    toLight: 'Schakel naar licht thema',
    toDark: 'Schakel naar donker thema',
    home: 'Terug naar boven'
  },
  hero: {
    hello: 'Hoi, ik ben',
    work: 'Bekijk werk',
    contact: 'Contact',
    cv: 'Download CV'
  },
  about: {
    title: 'Over mij',
    languages: 'Talen',
    factsTitle: 'Kerngegevens',
    stats: { years: 'Jaar in development', tech: 'Technologieën', projects: 'Projecten', clients: 'Werkgevers en klanten' }
  },
  skills: {
    title: 'Skills',
    intro: 'Alle tools, frameworks en methodieken uit mijn CV. Grotere bubbels betekenen meer tijd in projecten die ze gebruikten. Sleep, hover of klik op een bubbel.',
    all: 'Alles',
    shuffle: 'Schudden',
    hint: 'Tip: sleep een bubbel, hij veert terug.',
    years: 'Tijd in projecten',
    level: 'Niveau',
    levels: { listed: 'Vermeld', familiar: 'Bekend mee', working: 'Werkervaring', proficient: 'Bekwaam', advanced: 'Gevorderd' },
    usedIn: 'Gebruikt bij',
    noRoles: 'Vermeld in mijn CV, nog zonder gedateerd project.',
    close: 'Sluiten',
    proficiencyNote: 'Het niveau is afgeleid van de totale duur van de projecten waarin de skill is gebruikt.',
    playgroundTitle: 'Skill playground',
    playgroundIntro: 'Kies een categorie en zie de radar meebewegen. Elke as is een van de topskills in die categorie, gemeten in jaren.',
    axisEmpty: 'Geen andere skills',
    count: 'skills'
  },
  charts: {
    title: 'Inzichten',
    intro: 'Alles hieronder is berekend uit de data van mijn functies.',
    radarTitle: 'Sterkte per categorie',
    radarDesc: 'Gemiddelde van de vijf langst gebruikte skills per categorie, afgezet tegen mijn hele loopbaan.',
    barsTitle: 'Topskills in jaren',
    barsDesc: 'Tijd in projecten, overlappende functies tellen één keer mee.',
    donutTitle: 'Tijd per werkgever of klant',
    donutDesc: 'Aandeel van de development-tijd per functie.',
    donutTotal: 'in development',
    growthTitle: 'Groei van skills door de jaren',
    growthDesc: 'Aantal verschillende skills dat is ingezet, cumulatief aan het einde van elk jaar.',
    skillsUsed: 'skills in gebruik',
    of: 'van'
  },
  timeline: {
    title: 'Ervaring',
    intro: 'Werkplekken, opleiding en cursussen, nieuwste eerst.',
    expand: 'Toon details',
    collapse: 'Verberg details',
    present: 'Heden',
    via: 'via',
    stack: 'Stack',
    education: 'Opleiding',
    training: 'Cursus',
    other: 'Overig werk'
  },
  projects: {
    title: 'Projecten',
    intro: 'Een selectie van producten waaraan ik werkte, uit mijn CV.',
    linkPlaceholder: 'Linkplaceholder',
    visit: 'Bekijk project',
    role: 'Rol'
  },
  testimonials: { title: 'Aanbevelingen', prev: 'Vorige', next: 'Volgende', pause: 'Pauzeer', play: 'Afspelen' },
  contact: {
    title: 'Contact',
    intro: 'Een project of een vraag? Stuur een bericht of neem direct contact op.',
    name: 'Je naam',
    email: 'Je e-mail',
    message: 'Bericht',
    send: 'Verstuur bericht',
    sent: 'Bedankt, je bericht is verstuurd.',
    error: 'Versturen mislukt. Gebruik in plaats daarvan de e-maillink.',
    mailHint: 'Dit opent je e-mailapp met het bericht al ingevuld.',
    placeholder: 'placeholder',
    links: 'Vind mij online',
    subject: 'Portfolio-contact van'
  },
  footer: { built: 'Gebouwd met SvelteKit.', top: 'Terug naar boven' },
  units: { year: 'jr', years: 'jr', month: 'mnd', months: 'mnd' },
  easter: 'Konami-code ontgrendeld!'
};

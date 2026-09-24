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
    cv: 'Bekijk CV'
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
    intro: 'Geen formulieren, geen captcha’s. Kies je favoriete protocol en zeg hoi.',
    github: 'Bekijk mijn code en zijprojecten',
    linkedin: 'Loopbaan, aanbevelingen en snel connecten',
    email: 'De directe lijn, rechtstreeks in mijn inbox',
    githubAction: 'Bekijk profiel',
    linkedinAction: 'Connect',
    emailAction: 'Stuur e-mail',
    copy: 'Kopieer',
    copied: 'Gekopieerd!',
    location: 'Gevestigd in Druten · altijd in voor een koffie',
    cta: 'Laten we iets moois bouwen',
    placeholder: 'placeholder'
  },
  palette: {
    open: 'Commandomenu',
    placeholder: 'Typ een commando of zoek...',
    empty: 'Geen commando gevonden',
    goto: 'Ga naar',
    actions: 'Acties',
    links: 'Links',
    theme: 'Wissel licht / donker thema',
    lang: 'Switch language to English',
    copy: 'Kopieer e-mailadres',
    copied: 'E-mailadres gekopieerd',
    github: 'Open GitHub',
    linkedin: 'Open LinkedIn',
    mail: 'Stuur een e-mail',
    cv: 'Bekijk CV',
    party: 'Start party mode',
    navigate: 'navigeer',
    select: 'kies',
    close: 'sluit'
  },
  cvPage: {
    back: 'Terug naar portfolio',
    print: 'Print / Opslaan als PDF',
    hint: 'Tip: kies "Opslaan als PDF" als printer om hem te downloaden.',
    file: 'curriculum-vitae.tsx',
    docTitle: 'Joey Oosenbrug - CV'
  },
  quips: {
    about: "if (koffie.isLeeg()) throw new Error('404: koffie niet gevonden');",
    skills: "skills.sort((a, b) => b.jaren - a.jaren); // bescheiden gesorteerd",
    insights: "// grafieken: 100% echte data, 0% Excel",
    experience: "git log --author=\"Joey\" --oneline | wc -l  // best veel",
    projects: "<Joey mood=\"vol-cafeïne\" status=\"shipping\" />",
    console: "Hé collega-dev! Aan het rondneuzen in de source? Nu al fan. Laten we praten:"
  },
  footer: {
    built: "Gebouwd met TypeScript en te veel koffie.",
    quips: [
      "404: koffie niet gevonden",
      "// werkt op mijn machine",
      "git commit -m \"definitief-definitief-v2\"",
      "while (wakker) { code(); koffie(); }",
      "// geen bugs, alleen ongedocumenteerde features",
      "console.log('waarom is dit undefined?')",
      "npm install slaap --save-dev",
      "// TODO: betere grappen schrijven",
      "Er zijn 10 soorten mensen: zij die binair snappen en zij die dat niet doen",
      "if (moe) koffie++; else koffie++;",
      "// op vrijdag gedeployed. Leeft nog.",
      "<Joey mood=\"vol-cafeïne\" />"
    ],
    away: "// kom terug, de build wacht...",
    top: 'Terug naar boven', palette: "voor commando's" },
  units: { year: 'jr', years: 'jr', month: 'mnd', months: 'mnd' },
  easter: 'Konami-code ontgrendeld!'
};

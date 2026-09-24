export const ui = {
  meta: {
    title: 'Joey Oosenbrug | Senior Front-end & Full-Stack Developer',
    description: 'Portfolio of Joey Oosenbrug: senior front-end and full-stack developer working with Angular, React, Next.js, Vue.js, TypeScript, NestJS and Python.'
  },
  nav: {
    about: 'About',
    skills: 'Skills',
    insights: 'Insights',
    experience: 'Experience',
    projects: 'Projects',
    testimonials: 'Recommendations',
    contact: 'Contact',
    skip: 'Skip to content',
    menu: 'Menu',
    language: 'Switch language',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    home: 'Back to top'
  },
  hero: {
    hello: 'Hi, I am',
    work: 'View work',
    contact: 'Contact',
    cv: 'Download CV'
  },
  about: {
    title: 'About',
    languages: 'Languages',
    factsTitle: 'Key facts',
    stats: { years: 'Years in development', tech: 'Technologies', projects: 'Projects', clients: 'Employers and clients' }
  },
  skills: {
    title: 'Skills',
    intro: 'Every tool, framework and method from my CV. Bigger bubbles mean more time spent on projects that used them. Drag, hover or click a bubble.',
    all: 'All',
    shuffle: 'Shuffle',
    hint: 'Tip: drag a bubble, it springs back.',
    years: 'Time in projects',
    level: 'Proficiency',
    levels: { listed: 'Listed', familiar: 'Familiar', working: 'Working knowledge', proficient: 'Proficient', advanced: 'Advanced' },
    usedIn: 'Used in',
    noRoles: 'Listed on my CV without a dated project yet.',
    close: 'Close',
    proficiencyNote: 'Proficiency is derived from the total time of the projects that used the skill.',
    playgroundTitle: 'Skill playground',
    playgroundIntro: 'Pick a category and watch the radar morph. Each axis is one of the top skills in that category, measured in years.',
    axisEmpty: 'No further skills',
    count: 'skills'
  },
  charts: {
    title: 'Insights',
    intro: 'Everything below is calculated from the dates of my roles.',
    radarTitle: 'Strength per category',
    radarDesc: 'Average of the five longest-used skills per category, relative to my full career.',
    barsTitle: 'Top skills by years',
    barsDesc: 'Time in projects, overlapping roles counted once.',
    donutTitle: 'Time per employer or client',
    donutDesc: 'Share of development time per role.',
    donutTotal: 'in development',
    growthTitle: 'Skill growth over the years',
    growthDesc: 'Number of distinct skills put to use, cumulative at the end of each year.',
    skillsUsed: 'skills in use',
    of: 'of'
  },
  timeline: {
    title: 'Experience',
    intro: 'Workplaces, education and training, newest first.',
    expand: 'Show details',
    collapse: 'Hide details',
    present: 'Present',
    via: 'via',
    stack: 'Stack',
    education: 'Education',
    training: 'Training',
    other: 'Other work'
  },
  projects: {
    title: 'Projects',
    intro: 'A selection of products I worked on, taken from my CV.',
    linkPlaceholder: 'Link placeholder',
    visit: 'Visit project',
    role: 'Role'
  },
  testimonials: { title: 'Recommendations', prev: 'Previous', next: 'Next', pause: 'Pause', play: 'Play' },
  contact: {
    title: 'Contact',
    intro: 'Have a project or a question? Send a message or reach out directly.',
    name: 'Your name',
    email: 'Your email',
    message: 'Message',
    send: 'Send message',
    sent: 'Thanks, your message was sent.',
    error: 'Sending failed. Please use the email link instead.',
    mailHint: 'This opens your email app with the message prepared.',
    placeholder: 'placeholder',
    links: 'Find me online',
    subject: 'Portfolio contact from'
  },
  footer: { built: 'Built with SvelteKit.', top: 'Back to top' },
  units: { year: 'yr', years: 'yrs', month: 'mo', months: 'mo' },
  easter: 'Konami code unlocked!'
};

export type UI = typeof ui;

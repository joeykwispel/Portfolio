/**
 * Full CV content, taken verbatim from "Joey 20260903 EN.docx" and "Joey 20260903 NL.docx".
 * Only the header contact details differ from the documents: the page shows personal details
 * (see shared/contact.ts) instead of the agency contact line.
 * Rendered on /cv as styled HTML with a print-to-PDF option.
 */
export interface CvProject {
  client: string;
  role: string;
  period: string;
  summary: string;
  bullets: string[];
  stack: string;
}

export interface Cv {
  title: string;
  headline: string;
  employment: string;
  headings: { profile: string; skills: string; projects: string; sideProjects: string; education: string; languages: string };
  profile: string[];
  skills: { label: string; items: string }[];
  projects: CvProject[];
  /** Own products, listed after client work. */
  sideProjects: CvProject[];
  education: { degree: string; trainingLabel: string; courses: string[] };
  languages: string;
}

export const cv: Record<'en' | 'nl', Cv> = {
  en: {
    title: 'Curriculum Vitae',
    headline: 'Senior Front-End Developer | Full-Stack Developer',
    employment: 'Employed by Competa IT | Assigned to client projects',
    headings: {
      profile: 'Profile',
      skills: 'Skillset',
      projects: 'Project experience',
      sideProjects: 'Side projects',
      education: 'Education & Certifications',
      languages: 'Languages'
    },
    profile: [
      'Joey is an experienced Senior Front-end & Fullstack Developer with over five years of experience building and evolving modern web applications, SaaS platforms and technical product environments across sectors including the public sector, real estate, media, e-health and professional services. He specialises in Angular, React, Next.js, Vue.js and TypeScript, complemented by strong back-end experience with NestJS, Python and FastAPI. His expertise spans front-end architecture, end-to-end application development, server infrastructure, Kubernetes, Proxmox and CI/CD.',
      'Within projects, Joey takes ownership across the full technical chain and contributes to architecture, performance, testability, accessibility and maintainability. He translates functional requirements, stakeholder feedback and UX designs into scalable solutions with a strong focus on user-centered design and reducing technical debt. He also brings experience in technical leadership, code reviews, mentoring developers, stakeholder management and collaboration with Product Owners, UX designers, engineers and public-sector organisations within Agile Scrum teams.'
    ],
    skills: [
      {
        label: 'Front-End',
        items:
          'Angular, Angular Material, React, Vue.js, Next.js, Nuxt, Ionic Framework, TypeScript, JavaScript (ES6), RxJS, XML, Web Components, jQuery, HTML5, Semantic HTML5, CSS3, SASS, SCSS, Styled Components, Tailwind CSS, Svelte, SvelteKit, Three.js, React Three Fiber, TanStack Query, Zustand'
      },
      {
        label: 'Back-End',
        items: 'PHP, Laravel, Symfony, Zend, NestJS, Python, Hono, Prisma, SQL, MySQL, PostgreSQL, SQLite, RESTful APIs, JSON, YAML, XML, XPath, Zod'
      },
      {
        label: 'DevOps & CI/CD',
        items: 'Docker, Git, GitHub, GitLab, Azure DevOps, GitHub Actions, GitHub Pages, Cloudflare Workers, CI/CD Pipelines, Bash, Command Line, Microservices'
      },
      {
        label: 'Testing',
        items: 'Playwright, Jest, Vitest, Cypress, React Testing Library, Stryker, Storybook, axe-core, Lighthouse CI'
      },
      {
        label: 'Platforms & Tools',
        items:
          'Model Context Protocol (MCP), Capacitor, Postman, Sentry, Jira, Trello, Monday, Miro, Figma, WordPress, HubSpot, Visual Studio Code, PhpStorm, JetBrains, NPM, PNPM, Yarn, Vite, ESLint, Prettier, SEO, Windows, Linux, macOS, iOS, Android'
      },
      {
        label: 'Standards & Methodologies',
        items: 'Agile, Scrum, SAFe, Kanban, UX/UI Design, UX/UI Principles, WCAG 2.1, GDPR'
      }
    ],
    projects: [
      {
        client: 'PQNavigator - Rijksdienst voor Ondernemend Nederland (RVO) (via Competa IT)',
        summary:
          'As a Senior Front-end and Fullstack Developer, Joey contributes to the development of PQNavigator, a static-analysis platform that scans source repositories to build a cryptographic inventory and assess post-quantum readiness. His work focuses on the user-facing application, end-to-end application flows, server-side integration and the infrastructure required to run and deploy the platform reliably.',
        bullets: [
          'Develops and enhances the front-end for reviewing cryptographic findings, risks and repository scan results.',
          'Designs and implements end-to-end application flows across front-end behaviour, back-end processing and server-side interactions.',
          'Integrates the application with APIs and back-end services used to process and retrieve repository scan data.',
          'Builds and maintains the server infrastructure using Proxmox and Kubernetes for application hosting and orchestration.',
          'Manages the DevOps environment and deployment workflows required to run the platform reliably across environments.',
          'Improves the local development setup to support efficient development, testing and debugging of the complete application stack.',
          'Translates complex technical and cryptographic findings into clear and usable interfaces for end users.',
          'Works with stakeholders from Dutch public-sector organisations, including ministries and other government bodies, to align functionality with operational needs.',
          'Supports stakeholder sessions by translating requirements, feedback and technical constraints into concrete product improvements.',
          'Contributes to the delivery and validation of PQNavigator for Dutch public-sector organisations, including MinBZK, MinBuZa, MinVWS and VNG.'
        ],
        role: 'Senior Front-end Developer | Fullstack Developer',
        period: 'July 2026 – Present',
        stack:
          'Next.js, React, TypeScript, JavaScript (ES6), HTML5, CSS3, Tailwind CSS, Shadcn, I18N, Vite, NestJS, Python, FastAPI, Pydantic, REST APIs, OpenAPI, Swagger, JSON, PostgreSQL, Prisma, JWT, ast-grep, Vitest, Jest, Pytest, ESLint, Turborepo, pnpm, Shell, Docker, Kubernetes, Proxmox, GitHub Actions, Git, WCAG 2.2, Stakeholder Management, Agile, Scrum'
      },
      {
        client: 'Property Plan (via Competa IT)',
        summary:
          'Joey is responsible for the continued development of an Angular platform for property maintenance, enabling real estate professionals to register and manage maintenance requests and damage reports. Working within an Agile Scrum team, he contributes to both the web and mobile applications while actively participating in technical decision-making.',
        bullets: [
          'Developing and enhancing the front-end application using Angular and TypeScript.',
          'Implementing new functionality for registering, managing, and processing maintenance workflows.',
          'Translating functional requirements and UX designs into scalable, user-friendly, and maintainable solutions.',
          'Safeguarding the quality, performance, and maintainability of the front-end codebase.',
          'Conducting code reviews with a focus on code quality, consistency, and adherence to technical standards and best practices.',
          'Contributing to the technical architecture and making well-founded technical decisions.',
          'Collaborating with Product Owners, UX designers, and back-end developers to deliver high-quality functionality.',
          'Identifying and reducing technical debt while contributing to the continuous improvement of development processes.',
          'Actively participating in refinements, sprint planning, reviews, and retrospectives within an Agile Scrum environment.',
          'Setting up and executing automated end-to-end tests using Playwright, leveraging MCP to achieve broader test coverage and faster feedback loops.'
        ],
        role: 'Senior Front-end Developer',
        period: 'July 2025 – July 2026',
        stack:
          'Angular, Ionic Framework, Capacitor, Angular Material, RxJS, TypeScript, JavaScript (ES6), HTML5, SCSS, CSS3, REST APIs, JSON, Playwright MCP, Jest, Vitest, Git, Azure DevOps, Docker, npm, ESLint, Prettier, Agile, Scrum'
      },
      {
        client: 'Red Ocelot (via Competa IT)',
        summary:
          'As Lead Developer, Joey was responsible for the development of Code Tuner, a greenfield SaaS platform that helps organizations gain insight into and reduce technical debt across complex software landscapes. He provided technical leadership to the development team, was responsible for both front-end and back-end development, and also fulfilled the role of Scrum Master.',
        bullets: [
          'Providing technical leadership and mentoring the development team.',
          'Developing and enhancing the SaaS platform.',
          'Designing and implementing scalable microservices and REST APIs.',
          'Translating functional and domain-specific requirements into future-proof technical solutions.',
          'Contributing to the software architecture and making well-founded technical design decisions.',
          'Safeguarding the quality, performance, and maintainability of the application.',
          'Setting up and improving testing and CI/CD processes.',
          'Identifying and reducing technical debt.',
          'Serving as Scrum Master within the Agile Scrum team.',
          'Working closely with the Product Owner and domain experts.'
        ],
        role: 'Lead Software Developer',
        period: 'December 2023 – June 2025',
        stack:
          'React, Next.js, Web Components, D3.js, Chart.js, TypeScript, JavaScript (ES6), HTML, SCSS, CSS, Sass, NestJS, Hono, Python, Prisma, PostgreSQL, REST Services, JSON, Jest, Vitest, React Testing Library, Stryker, Git, GitHub, GitLab, GitHub Actions, Docker, Sentry, Trello, CI/CD, Microservices, Agile, Scrum, SAFe, WCAG 2.1'
      },
      {
        client: 'ParaMedia (via Competa IT)',
        summary:
          'Joey contributed to the continued development of MediumChat, a communication platform for healthcare professionals. As part of the development team, he was responsible for implementing new front-end functionality and contributed to the further development of the underlying APIs and integrations.',
        bullets: [
          'Developing new front-end functionality.',
          'Enhancing and integrating APIs and external integrations.',
          'Contributing to the front-end architecture.',
          'Improving the structure and maintainability of the front-end codebase.',
          'Collaborating with developers and Product Owners within an Agile Scrum team.'
        ],
        role: 'Software Developer',
        period: 'June 2023 – December 2023',
        stack: 'PHP, Zend, JavaScript (ES6), jQuery, HTML, CSS/SCSS, JSON, XML, SEO, Trello, Sentry, Agile, Scrum, WCAG 2.1'
      },
      {
        client: 'Vice Media (via Competa IT)',
        summary:
          'Joey contributed to the development of a platform for managing and publishing content across social media channels. Working within an Agile Scrum team, he developed reusable React components and templates that could be used by multiple editorial teams.',
        bullets: [
          'Developing reusable React components and templates.',
          'Translating UX designs into responsive front-end solutions.',
          'Ensuring the quality and accessibility of the front-end.',
          'Testing and optimizing the application.',
          'Collaborating with UX designers and developers within an Agile Scrum team.'
        ],
        role: 'Front-end Developer',
        period: 'November 2022 – May 2023',
        stack: 'React, Next.js, JavaScript (ES6), HTML, SCSS/CSS, JSON, XML, Git, GitHub, Cypress, Cucumber, Trello, Jira, Figma, Agile, Scrum'
      },
      {
        client: 'JEX (via Competa IT)',
        summary:
          'At JEX, Joey contributed to the further development of the corporate website within the HubSpot CMS, with a strong focus on pixel-perfect implementation, performance, and user experience.',
        bullets: [
          'Developing new pages and components within HubSpot CMS.',
          'Translating designs into responsive front-end solutions.',
          'Ensuring the quality and consistency of the user interface.',
          'Optimizing performance and SEO.',
          'Collaborating with designers and marketers within an Agile Scrum team.'
        ],
        role: 'Front-end Developer',
        period: 'May 2022 – August 2022',
        stack: 'JavaScript (ES6), HTML5, CSS3, HubSpot, SEO, Trello, Agile, Scrum'
      },
      {
        client: 'EHVG ehealth venture group',
        summary:
          'Joey contributed to the development of a healthcare platform that connects pharmacies with patients. Using Vue.js, he developed accessible and user-friendly front-end functionality with a strong emphasis on delivering an optimal user experience.',
        bullets: [],
        role: 'Front-end Developer',
        period: 'August 2021 – May 2022',
        stack: 'Vue.js, JavaScript (ES6), HTML5, SCSS, Styled Components, Git, Agile, Scrum'
      },
      {
        client: 'Cruisereizen (intern)',
        summary:
          'Joey worked on internal systems and applications using PHP and Laravel. He integrated the Google Maps API and developed a scheduling system for selecting available time slots.',
        bullets: [],
        role: 'Software Developer',
        period: 'February 2021 – July 2021',
        stack: 'PHP, Laravel, Twig, SCSS/CSS, Google Maps API, Agile, Scrum'
      },
      {
        client: 'Competa IT (intern)',
        summary: 'Joey supported the development of the Competa IT website using WordPress, Twig, and custom JavaScript solutions.',
        bullets: [],
        role: 'Software Developer',
        period: 'August 2019 – January 2020',
        stack: 'JavaScript (ES6), HTML, SCSS/CSS, Twig, WordPress'
      }
    ],
    sideProjects: [
      {
        client: 'DevCity - devcity.joeyoosenbrug.nl',
        role: 'Creator',
        period: 'September 2026 – Present',
        summary:
          'An open-source web app that renders Joey’s CV and GitHub activity as an explorable 3D city. Skills, roles and repositories become buildings sized by real usage, and visitors can load any public GitHub repository to explore its code as a skyline.',
        bullets: [
          'Built a Turborepo monorepo with a Next.js static export, a framework-free layout engine and a typed GitHub client.',
          'Rendered the city in Three.js with React Three Fiber, with a list view as an accessible alternative to the 3D scene.',
          'Added a Hono edge proxy on Cloudflare Workers that keeps the GitHub token server-side and caches responses.',
          'Set up CI with unit, end-to-end and accessibility tests, and deploys to GitHub Pages in English and Dutch.'
        ],
        stack:
          'Next.js, React, TypeScript, Three.js, React Three Fiber, D3.js, Tailwind CSS, Shadcn, TanStack Query, Zustand, Zod, I18N, Hono, Cloudflare Workers, Turborepo, pnpm, Vitest, Playwright, axe-core, Storybook, ESLint, Prettier, GitHub Actions, GitHub Pages'
      },
      {
        client: 'Portfolio - joeyoosenbrug.nl',
        role: 'Creator',
        period: 'September 2026 – Present',
        summary:
          'Joey’s bilingual portfolio and CV. Every skill duration, chart and statistic is derived from the dates of his roles, so the site stays accurate as the CV changes.',
        bullets: [
          'Built as a static SvelteKit site with English and Dutch routes, structured data and a printable CV.',
          'Every pull request runs type checks, unit tests, end-to-end tests, axe accessibility scans and Lighthouse budgets.'
        ],
        stack:
          'Svelte, SvelteKit, TypeScript, Vite, I18N, Vitest, Playwright, axe-core, Lighthouse CI, ESLint, Prettier, SEO, WCAG 2.2, GitHub Actions, GitHub Pages'
      }
    ],
    education: {
      degree: 'Applicatie- en Media Ontwikkelaar - mboRijnland (2018 – 2021)',
      trainingLabel: 'Additional Training',
      courses: [
        'C# for .NET Developers (2024)',
        'Python for Everybody (2024)',
        'Blockchain (2024)',
        'Microservices (2024)',
        'Lexers & Parsers – Computer Science, University of Salford, UK (2023)',
        'Scrum/Agile (2022)',
        'Advanced TypeScript (2022)'
      ]
    },
    languages: 'Dutch (native), English (professional working proficiency)'
  },
  nl: {
    title: 'Curriculum Vitae',
    headline: 'Senior Front-end Developer | Full-Stack Developer',
    employment: 'In dienst van Competa IT | Gedetacheerd bij klantprojecten',
    headings: {
      profile: 'Profiel',
      skills: 'Skillset',
      projects: 'Projectervaring',
      sideProjects: 'Zijprojecten',
      education: 'Educatie & Training',
      languages: 'Talen'
    },
    profile: [
      'Joey is een ervaren Senior Front-end & Fullstack Developer met ruim vijf jaar ervaring in het ontwikkelen en doorontwikkelen van moderne webapplicaties, SaaS-platformen en technische productomgevingen binnen onder meer de publieke sector, vastgoed, media, e-health en zakelijke dienstverlening. Hij is gespecialiseerd in Angular, React, Next.js, Vue.js en TypeScript en beschikt daarnaast over brede back-end kennis van onder andere NestJS, Python en FastAPI. Zijn ervaring strekt zich uit van front-end architectuur en end-to-end applicatieontwikkeling tot serverinfrastructuur, Kubernetes, Proxmox en CI/CD.',
      'Binnen projecten neemt Joey eigenaarschap over de volledige technische keten en denkt hij actief mee over architectuur, performance, testbaarheid, toegankelijkheid en onderhoudbaarheid. Hij vertaalt functionele wensen, stakeholderfeedback en UX-ontwerpen naar schaalbare oplossingen met aandacht voor user-centered design en het terugdringen van technical debt. Daarnaast heeft hij ervaring met technisch leiderschap, code reviews, begeleiding van developers, stakeholder management en samenwerking met Product Owners, UX-designers, engineers en overheidsorganisaties binnen Agile Scrum-teams.'
    ],
    skills: [
      {
        label: 'Front-end',
        items:
          'Angular, Angular Material, React, Vue.js, Next.js, Nuxt, Ionic Framework, TypeScript, JavaScript (ES6), RxJS, XML, Web Components, jQuery, HTML5, Semantic HTML5, CSS3, SASS, SCSS, Styled Components, Tailwind CSS, Shadcn, I18N, Svelte, SvelteKit, Three.js, React Three Fiber, TanStack Query, Zustand'
      },
      {
        label: 'Back-end',
        items:
          'PHP, Laravel, Symfony, Zend, NestJS, Python, FastAPI, Hono, Pydantic, Prisma, SQL, MySQL, PostgreSQL, SQLite, RESTful APIs, OpenAPI, Swagger, JSON, YAML, XML, XPath, JWT, Zod'
      },
      {
        label: 'DevOps & CI/CD',
        items:
          'Docker, Kubernetes, Proxmox, Nginx, Git, GitHub, GitLab, Azure DevOps, GitHub Actions, GitHub Pages, Cloudflare Workers, CI/CD pipelines, Bash, Shell, Command Line, Microservices'
      },
      {
        label: 'Testing',
        items: 'Playwright, Jest, Vitest, Pytest, Cypress, React Testing Library, Stryker, Storybook, ast-grep, axe-core, Lighthouse CI'
      },
      {
        label: 'Platforms & Tools',
        items:
          'Model Context Protocol (MCP), Capacitor, Postman, Sentry, Jira, Trello, Monday, Miro, Figma, WordPress, HubSpot, Visual Studio Code, PHPStorm, JetBrains, NPM, PNPM, Yarn, Turborepo, Vite, ESLint, Prettier, SEO, Windows, Linux, macOS, iOS, Android'
      },
      {
        label: 'Standaarden en methodologieën',
        items: 'Agile, Scrum, SAFe, Kanban, Stakeholder Management, UX/UI Design, UX/UI Principles, WCAG 2.1, WCAG 2.2, GDPR'
      }
    ],
    projects: [
      {
        client: 'PQNavigator - Rijksdienst voor Ondernemend Nederland (RVO) (via Competa IT)',
        summary:
          'Als Senior Front-end & Fullstack Developer draagt Joey bij aan de ontwikkeling van PQNavigator, een static-analysis platform dat source repositories scant om een cryptografische inventaris op te bouwen en de gereedheid voor post-quantum cryptografie te beoordelen. Zijn werkzaamheden richten zich op de gebruikersapplicatie, end-to-end applicatieflows, server-side integraties en de infrastructuur die nodig is om het platform betrouwbaar te draaien en uit te rollen.',
        bullets: [
          'Ontwikkelt en verbetert de front-end voor het beoordelen van cryptografische bevindingen, risico’s en repository-scanresultaten.',
          'Ontwerpt en implementeert end-to-end applicatieflows over de front-end, back-end en server-side interacties.',
          'Integreert de applicatie met API’s en back-end services voor het verwerken en ophalen van repository-scanresultaten.',
          'Bouwt en beheert de serverinfrastructuur met Proxmox en Kubernetes voor hosting en orchestratie van de applicatie.',
          'Beheert de volledige DevOps-omgeving en deploymentprocessen voor een betrouwbare werking van het platform.',
          'Optimaliseert de lokale ontwikkelomgeving voor efficiënte ontwikkeling, testing en debugging van de volledige applicatiestack.',
          'Vertaalt complexe technische en cryptografische bevindingen naar duidelijke en gebruiksvriendelijke interfaces.',
          'Werkt samen met stakeholders van Nederlandse overheidsorganisaties, waaronder ministeries, om functionaliteit af te stemmen op operationele behoeften.',
          'Vertaalt requirements, feedback en technische randvoorwaarden vanuit stakeholders naar concrete productverbeteringen.',
          'Draagt bij aan de oplevering en validatie van PQNavigator voor Nederlandse overheidsorganisaties, waaronder VNG en de ministeries van BZK, BuZa en VWS, met het PQC-migratie handboek als beoordelingskader.'
        ],
        role: 'Senior Front-end & Fullstack Developer',
        period: 'juli 2026 – heden',
        stack:
          'Next.js, React, TypeScript, JavaScript (ES6), HTML5, CSS3, Tailwind CSS, Shadcn, I18N, Vite, NestJS, Python, FastAPI, Pydantic, REST APIs, OpenAPI, Swagger, JSON, PostgreSQL, Prisma, JWT, ast-grep, Vitest, Jest, Pytest, ESLint, Turborepo, pnpm, Shell, Docker, Kubernetes, Proxmox, GitHub Actions, Git, WCAG 2.2, Stakeholder Management, Agile, Scrum'
      },
      {
        client: 'Property Plan (via Competa IT)',
        summary:
          'Joey is verantwoordelijk voor de doorontwikkeling van een Angular-platform voor vastgoedonderhoud, waarmee vastgoedprofessionals onderhouds- en schademeldingen registreren en afhandelen. Binnen een Agile Scrum-team werkt hij aan de web- en mobiele applicatie en draagt hij bij aan technische besluitvorming.',
        bullets: [
          'Ontwikkelen en doorontwikkelen van de front-end applicatie met Angular en TypeScript.',
          'Realiseren van nieuwe functionaliteiten voor het registreren, beheren en afhandelen van onderhoudsprocessen.',
          'Vertalen van functionele wensen en UX-ontwerpen naar schaalbare, gebruiksvriendelijke en onderhoudbare oplossingen.',
          'Bewaken van de kwaliteit, performance en onderhoudbaarheid van de front-end codebase.',
          'Uitvoeren van code reviews met aandacht voor codekwaliteit, consistentie en naleving van technische standaarden en best practices.',
          'Meedenken over de technische architectuur en maken van weloverwogen technische keuzes.',
          'Samenwerken met Product Owners, UX-designers en back-end developers om kwalitatief hoogwaardige functionaliteiten op te leveren.',
          'Signaleren en terugdringen van technical debt en bijdragen aan de continue verbetering van ontwikkelprocessen.',
          'Actief deelnemen aan refinements, sprintplanningen, reviews en retrospectives binnen een Agile Scrum-omgeving.',
          'Opzetten en uitvoeren van geautomatiseerde end-to-end tests met Playwright, waarbij MCP wordt ingezet voor bredere test coverage en snellere feedbackloops.'
        ],
        role: 'Senior Front-end Developer',
        period: 'juli 2025 – juli 2026',
        stack:
          "Angular, Ionic Framework, Capacitor, Angular Material, RxJS, TypeScript, JavaScript (ES6), HTML5, SCSS, CSS3, REST API's, JSON, Playwright MCP, Jest, Vitest, Git, Azure DevOps, Docker, npm, ESLint, Prettier, Agile, Scrum"
      },
      {
        client: 'Red Ocelot (via Competa IT)',
        summary:
          'Als Lead Developer was Joey verantwoordelijk voor de ontwikkeling van Code Tuner, een greenfield SaaS-platform dat organisaties helpt technical debt binnen complexe softwarelandschappen inzichtelijk te maken en te verminderen. Hij gaf technisch leiding aan het ontwikkelteam, was verantwoordelijk voor zowel front-end als back-end ontwikkeling en vervulde daarnaast de rol van Scrum Master.',
        bullets: [
          'Technisch aansturen en begeleiden van het ontwikkelteam.',
          'Ontwikkelen en doorontwikkelen van het SaaS-platform.',
          "Ontwerpen en realiseren van schaalbare microservices en REST API's.",
          'Vertalen van functionele en domeinspecifieke wensen naar toekomstbestendige technische oplossingen.',
          'Meedenken over de softwarearchitectuur en maken van onderbouwde technische ontwerpkeuzes.',
          'Bewaken van de kwaliteit, performance en onderhoudbaarheid van de applicatie.',
          'Opzetten en verbeteren van test- en CI/CD-processen.',
          'Signaleren en terugdringen van technical debt.',
          'Vervullen van de rol van Scrum Master binnen het Agile Scrum-team.',
          'Intensief samenwerken met de Product Owner en domeinexperts.'
        ],
        role: 'Lead Software Developer',
        period: 'december 2023 – juni 2025',
        stack:
          'React, Next.js, Web Components, D3.js, Chart.js, TypeScript, JavaScript (ES6), HTML, SCSS, CSS, Sass, NestJS, Hono, Python, Prisma, PostgreSQL, REST services, JSON, Jest, Vitest, React Testing Library, Stryker, Git, GitHub, GitLab, GitHub Actions, Docker, Sentry, Trello, CI/CD, Microservices, Agile, Scrum, SAFe, WCAG 2.1'
      },
      {
        client: 'ParaMedia (via Competa IT)',
        summary:
          'Joey werkte aan de doorontwikkeling van MediumChat, een communicatieplatform voor zorgprofessionals. Binnen het ontwikkelteam was hij verantwoordelijk voor nieuwe front-end functionaliteiten en droeg hij bij aan de doorontwikkeling van onderliggende API’s en koppelingen.',
        bullets: [
          'Ontwikkelen van nieuwe front-end functionaliteiten.',
          "Doorontwikkelen en integreren van API's en externe koppelingen.",
          'Meedenken over de front-end architectuur.',
          'Verbeteren van de structuur en onderhoudbaarheid van de front-end codebase.',
          'Samenwerken met developers en Product Owners binnen een Agile Scrum-team.'
        ],
        role: 'Software Developer',
        period: 'juni 2023 – december 2023',
        stack: 'PHP, Zend, JavaScript (ES6), jQuery, HTML, CSS/SCSS, JSON, XML, SEO, Trello, Sentry, Agile, Scrum, WCAG 2.1'
      },
      {
        client: 'Vice Media (via Competa IT)',
        summary:
          'Joey werkte aan de ontwikkeling van een platform voor het beheren en publiceren van content voor socialmediakanalen. Binnen een Agile Scrum-team ontwikkelde hij herbruikbare React-componenten en templates die door verschillende redactieteams konden worden ingezet.',
        bullets: [
          'Ontwikkelen van herbruikbare React-componenten en templates.',
          'Vertalen van UX-ontwerpen naar responsive front-end oplossingen.',
          'Bewaken van de kwaliteit en toegankelijkheid van de front-end.',
          'Testen en optimaliseren van de applicatie.',
          'Samenwerken met UX-designers en developers binnen een Agile Scrum-team.'
        ],
        role: 'Front-end Developer',
        period: 'november 2022 – mei 2023',
        stack: 'React, Next.js, JavaScript (ES6), HTML, SCSS/CSS, JSON, XML, Git, GitHub, Cypress, Cucumber, Trello, Jira, Figma, Agile, Scrum'
      },
      {
        client: 'JEX (via Competa IT)',
        summary:
          'Bij JEX werkte Joey aan de doorontwikkeling van de corporate website binnen het HubSpot CMS, met de nadruk op pixel-perfecte implementatie, performance en gebruikerservaring.',
        bullets: [
          "Ontwikkelen van nieuwe pagina's en componenten binnen HubSpot CMS.",
          'Vertalen van ontwerpen naar responsive front-end oplossingen.',
          'Bewaken van de kwaliteit en consistentie van de gebruikersinterface.',
          'Optimaliseren van performance en SEO.',
          'Samenwerken met designers en marketeers binnen een Agile Scrum-team.'
        ],
        role: 'Front-end Developer',
        period: 'mei 2022 – augustus 2022',
        stack: 'JavaScript (ES6), HTML5, CSS3, HubSpot, SEO, Trello, Agile, Scrum'
      },
      {
        client: 'EHVG ehealth venture group',
        summary:
          'Joey droeg bij aan de ontwikkeling van een zorgplatform dat apotheken met patiënten verbindt. Met Vue.js realiseerde hij toegankelijke en gebruiksvriendelijke front-end functionaliteiten, waarbij de nadruk lag op een optimale gebruikerservaring.',
        bullets: [],
        role: 'Front-end Developer',
        period: 'augustus 2021 – mei 2022',
        stack: 'Vue.js, JavaScript (ES6), HTML5, SCSS, Styled Components, Git, Agile, Scrum'
      },
      {
        client: 'Cruisereizen (intern)',
        summary:
          'Joey werkte aan interne systemen en applicaties met PHP en Laravel. Hij integreerde de Google Maps API en ontwikkelde een planningssysteem voor het selecteren van tijdsloten.',
        bullets: [],
        role: 'Software Developer',
        period: 'februari 2021 – juli 2021',
        stack: 'PHP, Laravel, Twig, SCSS/CSS, Google Maps API, Agile, Scrum'
      },
      {
        client: 'Competa IT (intern)',
        summary: 'Joey ondersteunde de ontwikkeling van de website van Competa IT met WordPress, Twig en maatwerk in JavaScript.',
        bullets: [],
        role: 'Software Developer',
        period: 'augustus 2019 – januari 2020',
        stack: 'JavaScript (ES6), HTML, SCSS/CSS, Twig, WordPress'
      }
    ],
    sideProjects: [
      {
        client: 'DevCity - devcity.joeyoosenbrug.nl',
        role: 'Maker',
        period: 'september 2026 – heden',
        summary:
          'Een open-source webapplicatie die het CV en de GitHub-activiteit van Joey weergeeft als een 3D-stad die je kunt verkennen. Skills, rollen en repositories worden gebouwen op basis van echt gebruik, en bezoekers kunnen elke publieke GitHub-repository inladen om de code als skyline te bekijken.',
        bullets: [
          'Opgezet als Turborepo-monorepo met een statische Next.js-export, een framework-onafhankelijke layout-engine en een getypeerde GitHub-client.',
          'De stad gerenderd in Three.js met React Three Fiber, met een lijstweergave als toegankelijk alternatief voor de 3D-scène.',
          'Een Hono-edgeproxy op Cloudflare Workers toegevoegd die het GitHub-token server-side houdt en responses cachet.',
          'CI ingericht met unit-, end-to-end- en toegankelijkheidstests, met deployment naar GitHub Pages in het Nederlands en Engels.'
        ],
        stack:
          'Next.js, React, TypeScript, Three.js, React Three Fiber, D3.js, Tailwind CSS, Shadcn, TanStack Query, Zustand, Zod, I18N, Hono, Cloudflare Workers, Turborepo, pnpm, Vitest, Playwright, axe-core, Storybook, ESLint, Prettier, GitHub Actions, GitHub Pages'
      },
      {
        client: 'Portfolio - joeyoosenbrug.nl',
        role: 'Maker',
        period: 'september 2026 – heden',
        summary:
          'Het tweetalige portfolio en CV van Joey. Elke skillduur, grafiek en statistiek wordt berekend uit de data van zijn rollen, zodat de site klopt zodra het CV verandert.',
        bullets: [
          'Gebouwd als statische SvelteKit-site met Nederlandse en Engelse routes, structured data en een printbaar CV.',
          'Elke pull request doorloopt typechecks, unittests, end-to-end tests, axe-toegankelijkheidsscans en Lighthouse-budgetten.'
        ],
        stack:
          'Svelte, SvelteKit, TypeScript, Vite, I18N, Vitest, Playwright, axe-core, Lighthouse CI, ESLint, Prettier, SEO, WCAG 2.2, GitHub Actions, GitHub Pages'
      }
    ],
    education: {
      degree: 'Applicatie- en Media Ontwikkelaar - mboRijnland (2018 – 2021)',
      trainingLabel: 'Aanvullende cursussen',
      courses: [
        'C# for .NET Developers (2024)',
        'Python for Everybody (2024)',
        'Blockchain (2024)',
        'Microservices (2024)',
        'Lexers & Parsers – Computer Science, University of Salford, UK (2023)',
        'Scrum/Agile (2022)',
        'Advanced TypeScript (2022)'
      ]
    },
    languages: 'Nederlands (moedertaal), Engels (professionele vaardigheid)'
  }
};

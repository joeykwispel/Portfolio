import type { CaseStudyText } from '../../types';

/**
 * Case study text. Written from the CV, the pull requests and the public project pages only:
 * no numbers or claims that are not in those sources. Add real metrics when you have them.
 */
export const caseStudies: Record<string, CaseStudyText> = {
  pqnavigator: {
    title: 'Making cryptography visible for the Dutch government',
    lede: 'PQNavigator scans source code for cryptography and shows how ready an organisation is for post-quantum migration. I work on the whole chain: the interface people read, the flows behind it and the cluster it runs on.',
    role: 'Senior front-end & full-stack developer',
    team: 'Competa IT team, for RVO, with ministries and VNG as stakeholders',
    teaser: 'Turning thousands of low-level crypto findings into something a policy team can act on.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Large quantum computers will break RSA and elliptic-curve cryptography. Data that is intercepted today can be decrypted later, so government organisations need to know now where they use vulnerable algorithms. Most of them have no idea: cryptography hides in libraries, config files, certificates and one-off helper functions spread over hundreds of repositories.',
          'PQNavigator answers that question. It scans repositories without running them, builds a cryptographic inventory (a CBOM) and assesses what has to change, in which order, following the PQC Migration Handbook by AIVD, CWI and TNO.'
        ]
      },
      {
        heading: 'What I do',
        body: [
          {
            steps: [
              {
                title: 'The review interface',
                text: 'I build the front-end where people go through findings, risks and scan results per repository. The hard part is not the table, it is the language: a finding like "RSA-2048 key generation in a JWT signer" has to make sense to a developer and to a policy advisor.'
              },
              {
                title: 'End-to-end flows',
                text: 'I design and build the flows from a scan request to a finished report, across the Next.js front-end, the NestJS and FastAPI services, and the server-side jobs that process scan data.'
              },
              {
                title: 'Infrastructure',
                text: 'I set up and maintain the servers on Proxmox and the Kubernetes cluster the platform runs on, plus the deployment workflows and the local development setup, so the whole stack runs on a laptop the same way it runs in the cluster.'
              },
              {
                title: 'Stakeholders',
                text: 'I join sessions with ministries (BZK, BuZa, VWS) and VNG, and turn their feedback and constraints into concrete product changes.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Decisions and trade-offs',
        body: [
          'Accessibility is a requirement, not a nice-to-have: government software has to meet WCAG 2.2. That rules out a lot of "clever" data visualisation. Every chart needs a readable text equivalent, and colour alone never carries the meaning of a risk level.',
          'Owning both the interface and the infrastructure means fewer handovers. When a scan is slow, I can see if the cause is the UI, the API or the cluster, instead of filing a ticket and waiting.'
        ]
      },
      {
        heading: 'Where it stands',
        body: [
          'PQNavigator has reached a working proof of concept and is validated against open-source repositories from the Dutch public sector. Organisations were surprised by how many cryptographic dependencies it found, and told us they did not want another platform to run themselves. That feedback moved the product from a self-hosted tool to a managed service.',
          'Findings from those scans also became real fixes: I turned three of them into pull requests for public-sector projects, which you can read about in the open-source case study.'
        ]
      }
    ]
  },

  'post-quantum-open-source': {
    title: 'Post-quantum fixes in public-sector code',
    lede: 'Three pull requests to open-source projects of the Ministry of VWS, the City of Amsterdam and the Fundament community. Each one started as a PQNavigator finding and ended as a change that is safe to merge today.',
    role: 'Contributor, from finding to pull request',
    team: 'Solo, reviewed by each project’s maintainers',
    teaser: 'From a scan finding to a change maintainers can merge without risk.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A scan report full of "quantum-vulnerable" findings is easy to produce and easy to ignore. Maintainers need a change that fixes something real, does not break production, and explains itself. I wanted to show that post-quantum migration can start with small, reviewable steps.'
        ]
      },
      {
        heading: 'Three fixes, three patterns',
        body: [
          {
            steps: [
              {
                title: 'Make the algorithm configurable (VWS)',
                text: 'A proxy signed its login JWT with a hardcoded RS256 constant. I made the algorithm configurable, defaulting to ML-DSA-65 (FIPS 204) with an automatic RS256 fallback when no post-quantum key is configured. Production keeps working unchanged until the keys are there.'
              },
              {
                title: 'Shorten the lifetime when you cannot switch yet (Fundament)',
                text: 'A Kubernetes operator created an RSA-4096 CA valid for 10 years. cert-manager cannot issue ML-DSA certificates yet, so switching was impossible. Instead I cut the lifetime to 3 years with a 90-day renewal window, which limits how long anything it signs stays vulnerable.'
              },
              {
                title: 'Protect data that must stay secret for years (Amsterdam)',
                text: 'A proxy to the national population register handles citizen service numbers. I added opt-in hybrid post-quantum TLS (X25519MLKEM768) against “harvest now, decrypt later”, and upgraded stored BSN encryption from Fernet (AES-128) to AES-256-GCM.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Decisions and trade-offs',
        body: [
          'Every change is opt-in or has a fallback. A maintainer can merge it without changing production behaviour, then switch it on when they are ready. That matters more than being cryptographically perfect.',
          'I measured instead of guessing. An ML-DSA-65 signature makes the JWT grow from 658 bytes to 4,733 bytes, which is fine for a server-to-server call but worth knowing. For the CA, I checked the new lifetime against Mosca’s inequality (X + Y < Z) and wrote a design record on the path to a real ML-DSA CA.',
          'Tests prove it works. The TLS change comes with a real loopback handshake test, so the new setting is shown to do something, not just to be accepted by the config parser.'
        ]
      },
      {
        heading: 'Result',
        body: [
          'Three pull requests, 432 lines added across 16 files, each backed by the AIVD/CWI/TNO PQC Migration Handbook. They are open for review; the status on this site updates itself from GitHub.'
        ]
      }
    ]
  },

  'property-plan': {
    title: 'Maintenance workflows on web and mobile',
    lede: 'Property Plan lets real estate professionals register and handle maintenance requests and damage reports. For a year I worked on the Angular web app and the mobile app built from the same code.',
    role: 'Senior front-end developer',
    team: 'Agile Scrum team with Product Owner, UX designer and back-end developers',
    teaser: 'One Angular codebase for web and mobile, and E2E tests that keep up with it.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'A maintenance request passes through many hands: a tenant reports damage, someone assesses it, a contractor gets assigned, the work gets checked. Each step has its own screen, states and edge cases, and it all has to work on a desktop in the office and on a phone on site.'
        ]
      },
      {
        heading: 'What I did',
        body: [
          {
            list: [
              'Built new functionality for registering, managing and processing maintenance workflows in Angular and TypeScript, with RxJS for the state that changes while you look at it.',
              'Worked on the web and mobile apps from one codebase, using Ionic and Capacitor for the native builds.',
              'Turned functional requirements and UX designs into components the rest of the team could reuse.',
              'Reviewed code with a focus on consistency and maintainability, and helped decide on the technical architecture.',
              'Found and reduced technical debt as part of normal sprint work, not as a separate project.'
            ]
          }
        ]
      },
      {
        heading: 'End-to-end tests with Playwright and MCP',
        body: [
          'Workflows with many steps are exactly where regressions hide, and exactly where writing E2E tests by hand is slow. I set up automated end-to-end tests with Playwright and used the Playwright MCP server, so an AI assistant could drive a real browser through the app while I wrote and refined the tests.',
          'The result was broader test coverage of the workflows and a faster feedback loop: a change that broke a step showed up in the pipeline instead of in a user report.'
        ]
      },
      {
        heading: 'What I take along',
        body: [
          'Shared code between web and mobile only pays off if the components are designed for both from the start. Retrofitting a desktop screen for a phone is always more work than building it responsive in the first place.'
        ]
      }
    ]
  },

  'code-tuner': {
    title: 'Leading a greenfield SaaS for technical debt',
    lede: 'Code Tuner analyses codebases to show where technical debt concentrates, so teams can decide where effort matters most. At Red Ocelot I led development from an empty repository, and was also the team’s Scrum Master.',
    role: 'Lead software developer and Scrum Master',
    team: 'Development team with the Product Owner and domain experts from Red Ocelot',
    teaser: 'From an empty repository to a platform that turns code metrics into decisions.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Every organisation knows it has technical debt. Few can say where it is, how bad it is, or which part to fix first. Code Tuner measures signals like complexity, coupling and how often code changes, without running or changing the code, and presents them so engineering and business can prioritise together.'
        ]
      },
      {
        heading: 'What I did',
        body: [
          {
            steps: [
              {
                title: 'Architecture',
                text: 'Designed and built the microservices and REST APIs with NestJS and Hono on PostgreSQL via Prisma, with Python where the analysis needed it.'
              },
              {
                title: 'Front-end',
                text: 'Built the React and Next.js application, including data visualisations with D3.js and Chart.js that make metrics readable for people who do not read code.'
              },
              {
                title: 'Quality',
                text: 'Set up testing and CI/CD with Jest, Vitest, React Testing Library and GitHub Actions, and used Stryker mutation testing to check that the tests actually catch bugs.'
              },
              {
                title: 'Leadership',
                text: 'Led and mentored the team, and ran the Scrum ceremonies as Scrum Master while working closely with the Product Owner.'
              }
            ]
          }
        ]
      },
      {
        heading: 'Decisions and trade-offs',
        body: [
          'A tool that measures technical debt cannot have a lot of its own. That is why testing and CI/CD were part of the first sprints, not something to add later, and why mutation testing was worth its extra run time.',
          'Being lead developer and Scrum Master at once is a balance. It helped to keep the two roles visibly separate: in refinement I spoke for the technical side, in the retrospective I facilitated and let the team talk.'
        ]
      },
      {
        heading: 'Result',
        body: ['Code Tuner went from a greenfield idea to a working SaaS platform that is now live at codetuner.digital.']
      }
    ]
  },

  'vice-content-platform': {
    title: 'Reusable templates for editorial teams',
    lede: 'At Vice Media I worked on the platform editorial teams use to create and publish content for social channels. My focus: React components and templates that several teams could use without a developer.',
    role: 'Front-end developer',
    team: 'Agile Scrum team with UX designers and developers',
    teaser: 'Components that let editors publish on brand without asking a developer.',
    sections: [
      {
        heading: 'The problem',
        body: [
          'Several editorial teams publish on social media, each with their own formats, under one brand. Without shared building blocks, every new format means custom work and small inconsistencies.'
        ]
      },
      {
        heading: 'What I did',
        body: [
          {
            list: [
              'Built reusable React components and templates in Next.js, used by multiple editorial teams.',
              'Turned Figma designs into responsive components, working closely with the UX designers.',
              'Guarded the quality and accessibility of the front-end.',
              'Tested the application with Cypress and Cucumber, so scenarios were readable for the whole team.'
            ]
          }
        ]
      },
      {
        heading: 'What I take along',
        body: [
          'A component library is a product with its own users. The editors were those users, and the best components were the ones they could use without reading documentation.'
        ]
      }
    ]
  }
};

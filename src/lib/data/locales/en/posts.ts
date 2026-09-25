import type { PostText } from '../../types';

export const posts: Record<string, PostText> = {
  'crypto-agility-in-three-pull-requests': {
    title: 'Crypto-agility in three pull requests',
    description: 'What I learned turning post-quantum scan findings into changes that maintainers of public-sector code can actually merge.',
    sections: [
      {
        heading: 'A finding is not a fix',
        body: [
          'Working on PQNavigator, I see a lot of scan output. "RSA used here", "ECDSA used there". It is all correct and almost none of it is useful on its own. A maintainer who gets a list of fifty quantum-vulnerable call sites will close the tab.',
          'So I picked three findings in open-source projects from the Dutch public sector and tried to turn each one into a pull request that is safe to merge today. Each one taught me a different pattern.'
        ]
      },
      {
        heading: '1. Stop hardcoding the algorithm',
        body: [
          'In a proxy from the Ministry of VWS, the JWT signing algorithm was a class constant. That is the opposite of crypto-agility: changing it means a code change, a review and a release.',
          {
            code: 'class ClientAssertionJwtIssuer:\n-    JWT_ALG: str = "RS256"\n+    KEY_STORE_FALLBACK_PRIVATE_KEY_ID: str = (\n+        "client_assertion_jwt_fallback_private_key"\n+    )',
            lang: 'python',
            caption: 'minvws/nl-mgo-dvp-proxy#8'
          },
          'The fix reads the algorithm from config, defaults to ML-DSA-65 and falls back to RS256 when no post-quantum key exists. Nothing changes in production until someone adds the new key.',
          {
            code: 'try:\n    self.__private_key = self.__jwk_repository.get_first_key_from_store(\n        self.KEY_STORE_PRIVATE_KEY_ID\n    )\nexcept KeyError:\n    self.__using_fallback_alg = True\n    self.__private_key = self.__jwk_repository.get_first_key_from_store(\n        self.KEY_STORE_FALLBACK_PRIVATE_KEY_ID\n    )',
            lang: 'python'
          },
          {
            note: 'Post-quantum signatures are big. The JWT grew from 658 to 4,733 bytes. Fine for a server-to-server call, a problem if you put it in a cookie. Measure before you migrate.'
          }
        ]
      },
      {
        heading: '2. When you cannot switch, shorten the window',
        body: [
          'The Fundament Kubernetes operator creates an RSA-4096 CA that is valid for ten years. The honest answer is that it cannot move to ML-DSA yet: cert-manager only supports RSA, ECDSA and Ed25519.',
          'But you can still reduce the risk. Mosca’s inequality says you are in trouble when the time data must stay secure (X) plus the time to migrate (Y) is longer than the time until a quantum computer arrives (Z). A ten-year CA makes X huge. Three years, with renewal 90 days before expiry, makes it small, and forces a new decision point before anyone commits to RSA again.',
          {
            code: '"privateKey":  map[string]any{"algorithm": "RSA", "size": int64(4096)},\n"duration":    "26280h", // 3 years\n"renewBefore": "2160h",  // 90 days',
            lang: 'go',
            caption: 'fundament-oss/fundament#424'
          }
        ]
      },
      {
        heading: '3. Protect what attackers are recording today',
        body: [
          'The City of Amsterdam runs a proxy to the national population register. Citizen service numbers stay sensitive for a lifetime, which makes them the textbook target of "harvest now, decrypt later".',
          'The change adds hybrid post-quantum TLS (X25519MLKEM768) on the outbound connection, behind a flag, and checks that the linked OpenSSL is new enough. If it is not, it logs a warning and uses classical TLS instead of failing.',
          {
            code: 'if ssl.OPENSSL_VERSION_INFO[:2] < _MIN_OPENSSL_FOR_PQC:\n    logger.warning(\n        "PQC TLS requested (BRP_ENABLE_PQC_TLS) but linked OpenSSL %s is older "\n        "than 3.5 and does not support the ML-KEM hybrid TLS 1.3 group - "\n        "falling back to classical TLS.",',
            lang: 'python',
            caption: 'Amsterdam/brp-amsterdam-api#195'
          }
        ]
      },
      {
        heading: 'What the three have in common',
        body: [
          {
            list: [
              'Every change is opt-in or has a fallback. Merging it changes nothing until the team decides.',
              'Every change explains itself in the code, with a link to the reasoning, so the next developer does not undo it.',
              'Every change is tested for real. The TLS change comes with a loopback handshake test, not just a config check.'
            ]
          },
          'Post-quantum migration will take years. It will not happen in one big-bang project, but in hundreds of small changes like these. The sooner they become boring, the better.'
        ]
      }
    ]
  },

  'playwright-and-mcp': {
    title: 'Writing E2E tests with Playwright and MCP',
    description:
      'How I used the Playwright MCP server to let an AI assistant drive a real browser while writing end-to-end tests for a workflow-heavy Angular app.',
    sections: [
      {
        heading: 'Why E2E tests lag behind',
        body: [
          'In a workflow-heavy app like Property Plan, the risky bugs are rarely inside a single component. They sit in the path through several screens: a report that cannot move to the next status, a form that loses its state on mobile. That is what end-to-end tests are for, and it is also what they are slowest to write for.',
          'Writing a good E2E test means clicking through the app, finding stable selectors, waiting for the right thing, and doing it again when the UI changes. That friction is why E2E coverage usually trails behind the features.'
        ]
      },
      {
        heading: 'What MCP adds',
        body: [
          'The Model Context Protocol lets an AI assistant use tools. The Playwright MCP server is one of those tools: it gives the assistant a real browser it can open, click through and read, using the accessibility tree instead of screenshots.',
          'That changes the loop. Instead of me clicking through a workflow and translating it into code, I describe the scenario, the assistant walks through the app, and I review and shape the test it proposes.'
        ]
      },
      {
        heading: 'How I used it',
        body: [
          {
            steps: [
              { title: 'Describe the scenario', text: 'In plain language, from the user’s side: register a damage report, assign it, close it.' },
              {
                title: 'Let it explore',
                text: 'The assistant opens the app, finds the elements by role and label, and reports what it sees, including where the flow does not do what I described.'
              },
              {
                title: 'Review like any other code',
                text: 'The generated test goes through the same review as hand-written code: role-based selectors, no fixed timeouts, one clear assertion per step.'
              },
              { title: 'Run it in the pipeline', text: 'The test runs in CI with plain Playwright. MCP is only used while writing, not while testing.' }
            ]
          }
        ]
      },
      {
        heading: 'What I watch out for',
        body: [
          'An assistant happily writes a test that passes. That is not the same as a test that fails when it should. I still break the feature on purpose once to see the test go red.',
          'Accessible markup pays off twice. The same roles and labels that help screen reader users make the app easy to navigate for the assistant, and make the tests stable.'
        ]
      }
    ]
  },

  'how-this-portfolio-works': {
    title: 'How this portfolio works',
    description: 'A static SvelteKit site where every chart and number is calculated from one data file, in two languages, without cookies.',
    sections: [
      {
        heading: 'One source of truth',
        body: [
          'Everything on this site comes from a handful of TypeScript files in src/lib/data. The roles have start and end dates and a stack. The rest is derived: how long I used each skill, the charts, the stats in the About section, the skill levels. When I add a role, every number updates.',
          {
            code: "{\n  id: 'property-plan',\n  company: 'Property Plan',\n  start: '2025-07',\n  end: '2026-07',\n  stack: ['Angular', 'Ionic Framework', 'Capacitor', 'RxJS', 'Playwright', 'MCP']\n}",
            lang: 'ts',
            caption: 'src/lib/data/shared/roles.ts'
          },
          'Overlapping roles are counted once, so two parallel projects with React do not make two years of React out of one.'
        ]
      },
      {
        heading: 'Static, but not boring',
        body: [
          'The site is built with SvelteKit and exported as plain HTML with adapter-static, hosted on GitHub Pages. Every page, in both languages, is prerendered, so it works without JavaScript and search engines see the full text.',
          'Heavier sections load when you scroll near them. The fonts are self-hosted, so your IP address is not sent to Google. Analytics come from Cloudflare Web Analytics, which uses no cookies, so there is no cookie banner either.'
        ]
      },
      {
        heading: 'Two languages, two URLs',
        body: [
          'English lives at / and Dutch at /nl/. Each page links to its translation with hreflang tags, so a Dutch search shows the Dutch page. The text for each language lives in its own folder, and TypeScript checks that the Dutch version has every key the English one has.'
        ]
      },
      {
        heading: 'Tested like a product',
        body: [
          {
            list: [
              'Unit tests with Vitest for the date maths and the derived statistics.',
              'End-to-end tests with Playwright, including an axe accessibility scan of every page in both themes.',
              'Lighthouse CI on every pull request, with budgets for performance, accessibility and SEO.',
              'A Content Security Policy with hashes for every inline script.'
            ]
          },
          'The status of my open-source pull requests is fetched from the GitHub API at build time, and the site rebuilds itself every week, so it does not show a merged PR as open for months.',
          'The code is MIT-licensed on GitHub. Feel free to use it for your own portfolio.'
        ]
      }
    ]
  }
};

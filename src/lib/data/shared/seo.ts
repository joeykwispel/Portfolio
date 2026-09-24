import { skills } from './skills';
import { contact, person, siteUrl } from './contact';
import { employer } from './roles';

/**
 * Cloudflare Web Analytics site token (dash.cloudflare.com -> Analytics & Logs -> Web Analytics -> Add a site).
 * Cookie-less and stores no IPs, so no consent banner is needed. Leave empty to disable the beacon.
 * The token is public by design (it ships in the page source).
 */
export const cloudflareAnalyticsToken = '';

/**
 * Google Search Console "HTML tag" verification code (only the content="..." value).
 * Not needed if you verify the domain with a DNS TXT record instead. Leave empty to omit the tag.
 */
export const googleSiteVerification = '';

export const jobTitle = 'Senior Front-end & Full-Stack Developer';

/** Search terms people might use to find this site. Google ignores the keywords tag, but Bing and others still read it. */
export const keywords = [
  person.name,
  'Joey',
  'Oosenbrug',
  jobTitle,
  'Senior Front-end Developer',
  'Full-Stack Developer',
  'Frontend Developer Nederland',
  'Webontwikkelaar',
  'Freelance developer',
  person.location,
  'Gelderland',
  'Nijmegen',
  'Angular',
  'React',
  'Next.js',
  'Vue.js',
  'TypeScript',
  'NestJS',
  'Python',
  'Portfolio'
];

const skillCategories = new Set(['frontend', 'backend', 'devops', 'testing']);

/** schema.org structured data for the home page: a ProfilePage about a Person, plus the WebSite itself. */
export function profileJsonLd(description: string) {
  const url = `${siteUrl}/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}#website`,
        url,
        name: person.name,
        description,
        inLanguage: ['en', 'nl'],
        publisher: { '@id': `${url}#person` }
      },
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profile`,
        url,
        name: `${person.name} | ${jobTitle}`,
        description,
        isPartOf: { '@id': `${url}#website` },
        mainEntity: { '@id': `${url}#person` }
      },
      {
        '@type': 'Person',
        '@id': `${url}#person`,
        name: person.name,
        givenName: 'Joey',
        familyName: 'Oosenbrug',
        url,
        image: person.photoSquare ? `${siteUrl}/${person.photoSquare}` : undefined,
        email: `mailto:${contact.email.value}`,
        jobTitle,
        description,
        worksFor: { '@type': 'Organization', name: employer.name },
        address: {
          '@type': 'PostalAddress',
          addressLocality: person.location,
          addressRegion: 'Gelderland',
          addressCountry: 'NL'
        },
        nationality: { '@type': 'Country', name: 'Netherlands' },
        knowsLanguage: ['nl', 'en'],
        knowsAbout: skills.filter((s) => skillCategories.has(s.category)).map((s) => s.name),
        sameAs: [contact.linkedin.value, contact.github.value]
      }
    ]
  };
}

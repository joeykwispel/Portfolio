import type { Locale } from '../types';

/** DevCity: hobby project that renders my skills, career and GitHub repos as an explorable 3D city.
 * Source: https://github.com/joeykwispel/devcity */
export const devcity = {
  url: 'https://devcity.joeyoosenbrug.nl',
  repo: 'https://github.com/joeykwispel/devcity',
  stack: ['React', 'Next.js', 'Three.js', 'TypeScript']
};

/** The city's layers, in the order DevCity's layer switcher shows them. */
export const devcityLayers = ['skills', 'career', 'repos', 'any-repo'] as const;
export type DevcityLayer = (typeof devcityLayers)[number];

/** Deep link into DevCity. Without a layer it opens on the city's own default view. */
export function devcityHref(locale: Locale, layer?: DevcityLayer): string {
  const q = new URLSearchParams({ lang: locale });
  if (layer) q.set('layer', layer);
  return `${devcity.url}/?${q}`;
}

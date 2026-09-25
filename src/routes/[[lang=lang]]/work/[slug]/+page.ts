import { error } from '@sveltejs/kit';
import { visibleCaseStudies } from '$lib/data';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => visibleCaseStudies.flatMap((c) => [{ slug: c.slug }, { lang: 'nl', slug: c.slug }]);

export const load: PageLoad = ({ params }) => {
  const i = visibleCaseStudies.findIndex((c) => c.slug === params.slug);
  if (i < 0) error(404, 'Case study not found');
  return { study: visibleCaseStudies[i], next: visibleCaseStudies[(i + 1) % visibleCaseStudies.length] };
};

import { testimonials, visiblePosts } from '$lib/data';

/** Home page sections in order. Numbers in the nav and section headers are derived from this list. */
export type SectionId = 'about' | 'skills' | 'insights' | 'experience' | 'projects' | 'opensource' | 'writing' | 'testimonials' | 'contact';

export const sectionIds: SectionId[] = [
  'about',
  'skills',
  'insights',
  'experience',
  'projects',
  'opensource',
  ...(visiblePosts.length ? (['writing'] as const) : []),
  ...(testimonials.length ? (['testimonials'] as const) : []),
  'contact'
];

/** "01", "02", ... for a section, or "" if it is not on the page. */
export const sectionNum = (id: SectionId) => {
  const i = sectionIds.indexOf(id);
  return i < 0 ? '' : String(i + 1).padStart(2, '0');
};

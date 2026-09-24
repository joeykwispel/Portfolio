import type { CategoryId } from '../../types';

export const categories: Record<CategoryId, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  devops: 'Cloud & DevOps',
  testing: 'Testing',
  tools: 'Tools & platforms',
  methods: 'Methods & standards',
  soft: 'Soft skills',
  languages: 'Languages'
};

/** Only skills whose display name differs from the canonical name need an entry. */
export const skillLabels: Record<string, string> = {};

import type { CategoryId } from '../../types';

export const categories: Record<CategoryId, string> = {
  frontend: 'Front-end',
  backend: 'Back-end',
  devops: 'Cloud & DevOps',
  testing: 'Testen',
  tools: 'Tools & platforms',
  methods: 'Methodieken & standaarden',
  soft: 'Soft skills',
  languages: 'Talen'
};

export const skillLabels: Record<string, string> = {
  Dutch: 'Nederlands',
  English: 'Engels',
  'Stakeholder Management': 'Stakeholdermanagement',
  'Technical Leadership': 'Technisch leiderschap',
  Mentoring: 'Begeleiding van developers'
};

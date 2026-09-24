import type { ProjectText } from '../../types';

export const projects: Record<string, ProjectText> = {
  pqnavigator: {
    sector: 'Public sector',
    description: 'Static-analysis platform that scans source repositories, builds a cryptographic inventory and assesses post-quantum readiness for Dutch government organisations.'
  },
  'property-plan': {
    sector: 'Real estate',
    description: 'Angular web and mobile platform where property professionals register and handle maintenance requests and damage reports.'
  },
  'code-tuner': {
    sector: 'SaaS',
    description: 'Greenfield SaaS platform that makes technical debt visible and helps organisations reduce it across complex software landscapes.'
  },
  mediumchat: {
    sector: 'E-health',
    description: 'Communication platform for healthcare professionals, with new front-end features, API work and external integrations.'
  },
  'vice-platform': {
    sector: 'Media',
    description: 'Platform for managing and publishing content on social channels, built on reusable React components and editorial templates.'
  },
  'ehvg-pharmacy': {
    sector: 'E-health',
    description: 'Healthcare platform connecting pharmacies with patients, built with Vue.js and a focus on accessible user experience.'
  }
};

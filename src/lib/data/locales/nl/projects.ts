import type { ProjectText } from '../../types';

export const projects: Record<string, ProjectText> = {
  pqnavigator: {
    sector: 'Publieke sector',
    description:
      'Static-analysis platform dat source repositories scant, een cryptografische inventaris opbouwt en de post-quantum gereedheid van Nederlandse overheidsorganisaties beoordeelt.'
  },
  'property-plan': {
    sector: 'Vastgoed',
    description: 'Angular web- en mobiel platform waarmee vastgoedprofessionals onderhouds- en schademeldingen registreren en afhandelen.'
  },
  'code-tuner': {
    sector: 'SaaS',
    description: 'Greenfield SaaS-platform dat technical debt zichtbaar maakt en organisaties helpt die te verminderen binnen complexe softwarelandschappen.'
  },
  mediumchat: {
    sector: 'E-health',
    description: 'Communicatieplatform voor zorgprofessionals, met nieuwe front-end features, API-werk en externe koppelingen.'
  },
  'vice-platform': {
    sector: 'Media',
    description:
      'Platform voor het beheren en publiceren van content op socialmediakanalen, gebouwd op herbruikbare React-componenten en redactionele templates.'
  },
  'ehvg-pharmacy': {
    sector: 'E-health',
    description: 'Zorgplatform dat apotheken met patiënten verbindt, gebouwd met Vue.js en gericht op een toegankelijke gebruikerservaring.'
  }
};

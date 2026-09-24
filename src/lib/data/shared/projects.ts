import type { ProjectBase } from '../types';

/** Projects come from the CV's client work. `link: null` renders a marked placeholder. */
export const projects: ProjectBase[] = [
  { id: 'pqnavigator', name: 'PQNavigator', roleId: 'pqnavigator', tags: ['Next.js', 'NestJS', 'FastAPI', 'Kubernetes', 'Proxmox', 'WCAG 2.2'], link: null },
  { id: 'property-plan', name: 'Property Plan', roleId: 'property-plan', tags: ['Angular', 'Ionic Framework', 'Capacitor', 'Playwright', 'MCP'], link: null },
  { id: 'code-tuner', name: 'Code Tuner', roleId: 'red-ocelot', tags: ['React', 'Next.js', 'NestJS', 'D3.js', 'Microservices'], link: null },
  { id: 'mediumchat', name: 'MediumChat', roleId: 'paramedia', tags: ['PHP', 'Zend', 'jQuery', 'JSON', 'XML'], link: null },
  { id: 'vice-platform', name: 'Vice Media content platform', roleId: 'vice-media', tags: ['React', 'Next.js', 'Cypress', 'Figma'], link: null },
  { id: 'ehvg-pharmacy', name: 'EHVG pharmacy platform', roleId: 'ehvg', tags: ['Vue.js', 'Styled Components', 'SCSS'], link: null }
];

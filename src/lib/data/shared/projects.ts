import type { ProjectBase } from '../types';

/** Projects come from the CV's client work. `link: null` renders a marked placeholder.
 * Vice links to their Instagram, where the content built with the platform was published. */
export const projects: ProjectBase[] = [
  { id: 'pqnavigator', name: 'PQNavigator', roleId: 'pqnavigator', tags: ['Next.js', 'NestJS', 'FastAPI', 'Kubernetes', 'Proxmox', 'WCAG 2.2'], link: 'https://competa.com/en-GB/knowledge/from-pqc-migration-tool-to-managed-service-p6pr2rf5gsv39ef60eiiqylz/' },
  { id: 'property-plan', name: 'Property Plan', roleId: 'property-plan', tags: ['Angular', 'Ionic Framework', 'Capacitor', 'Playwright', 'MCP'], link: 'https://www.propertyplan.nl/' },
  { id: 'code-tuner', name: 'Code Tuner', roleId: 'red-ocelot', tags: ['React', 'Next.js', 'NestJS', 'D3.js', 'Microservices'], link: 'https://codetuner.digital/' },
  { id: 'mediumchat', name: 'MediumChat', roleId: 'paramedia', tags: ['PHP', 'Zend', 'jQuery', 'JSON', 'XML'], link: 'https://www.mediumchat.nl/' },
  { id: 'vice-platform', name: 'Vice Media content platform', roleId: 'vice-media', tags: ['React', 'Next.js', 'Cypress', 'Figma'], link: 'https://www.instagram.com/vice/' },
  { id: 'ehvg-pharmacy', name: 'EHVG pharmacy platform', roleId: 'ehvg', tags: ['Vue.js', 'Styled Components', 'SCSS'], link: 'https://ehealthventuresgroup.com/' }
];

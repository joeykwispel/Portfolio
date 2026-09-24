export type Locale = 'en' | 'nl';

export type CategoryId =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'testing'
  | 'tools'
  | 'methods'
  | 'soft'
  | 'languages';

/** Language-neutral part of a work entry (dates, company, stack). Text lives in locales/<lang>/experience.ts */
export interface RoleBase {
  id: string;
  company: string;
  /** 'work' and 'internship' count towards skill years; 'other' (non-dev jobs) does not. */
  kind: 'work' | 'internship' | 'other';
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or null for "present" */
  end: string | null;
  via?: string;
  location?: string;
  /** Names must match a skill name in shared/skills.ts */
  stack: string[];
}

export interface RoleText {
  title: string;
  summary: string;
  bullets: string[];
}

export interface RoleTextMap {
  [roleId: string]: RoleText;
}

export interface SkillBase {
  name: string;
  category: CategoryId;
  /** Extra role ids for skills that don't appear in a role's stack (e.g. leadership). */
  roles?: string[];
}

export interface ProjectBase {
  id: string;
  name: string;
  roleId: string;
  tags: string[];
  /** null = placeholder */
  link: string | null;
}

export interface ProjectText {
  description: string;
  sector: string;
}

export interface EducationBase {
  id: string;
  kind: 'education' | 'certification';
  institution: string;
  startYear: number;
  endYear: number;
  /** Course names for certification nodes. */
  courses?: string[];
}

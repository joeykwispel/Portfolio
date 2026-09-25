export type Locale = 'en' | 'nl';

export type CategoryId = 'frontend' | 'backend' | 'devops' | 'testing' | 'tools' | 'methods' | 'soft' | 'languages';

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

/** A product I build on my own, hosted under a joeyoosenbrug.nl subdomain. Text lives in locales/<lang>/sideProjects.ts */
export interface SideProject {
  id: string;
  name: string;
  /** Origin without trailing slash */
  url: string;
  /** null = private or not published yet */
  repo: string | null;
  /** 'wip' is shown as coming soon, without a link */
  status: 'live' | 'wip';
  /** true when the app has /en/ and /nl/ routes */
  localized: boolean;
  /** YYYY-MM */
  start: string;
  /** Names must match a skill name in shared/skills.ts */
  stack: string[];
  /** Deep links into the app, relative to its (locale) root. Labels live in the locale text. */
  links?: { id: string; path: string }[];
}

export interface SideProjectText {
  /** One line, used in the hero quick links */
  tagline: string;
  description: string;
  /** Label per link id */
  links?: Record<string, string>;
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

/** One piece of long-form content. A plain string is a paragraph. */
export type Block =
  | string
  | { list: string[] }
  | { steps: { title: string; text: string }[] }
  | { quote: string; cite?: string }
  | { code: string; lang?: string; caption?: string }
  | { note: string };

export interface ProseSection {
  heading: string;
  body: Block[];
}

/** 'draft' is only shown in `npm run dev`, with a banner; 'published' goes live. */
export type PublishStatus = 'draft' | 'published';

export interface CaseStudyBase {
  slug: string;
  /** Id in shared/projects.ts */
  projectId: string;
  status: PublishStatus;
  /** Skill names (shared/skills.ts) worth highlighting for this case */
  stack: string[];
  /** Contribution ids from shared/contributions.ts shown as proof */
  contributions?: string[];
  /** Index in shared/testimonials.ts */
  testimonial?: number;
  /** Not client work: hides the client, period and project link from the spec sheet. */
  standalone?: boolean;
}

export interface CaseStudyText {
  title: string;
  /** One or two sentences under the title */
  lede: string;
  /** Short answers for the spec sheet next to the story */
  role: string;
  team: string;
  /** The problem in one line, shown on the project card */
  teaser: string;
  sections: ProseSection[];
}

export interface PostBase {
  slug: string;
  /** YYYY-MM-DD */
  date: string;
  status: PublishStatus;
  tags: string[];
}

export interface PostText {
  title: string;
  description: string;
  sections: ProseSection[];
}

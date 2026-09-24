import { dev } from '$app/environment';
import { caseStudies } from './shared/caseStudies';
import { posts } from './shared/posts';
import type { Block, ProseSection, PublishStatus } from './types';

/**
 * Drafts are only shown by `npm run dev` (or a build with VITE_SHOW_DRAFTS=1, for reviewing and testing them),
 * so they can be checked before going live.
 */
const showDrafts = dev || import.meta.env.VITE_SHOW_DRAFTS === '1';
export const isVisible = (status: PublishStatus) => status === 'published' || showDrafts;

export const visibleCaseStudies = caseStudies.filter((c) => isVisible(c.status));
export const visiblePosts = posts.filter((p) => isVisible(p.status));

export const caseStudyFor = (projectId: string) => visibleCaseStudies.find((c) => c.projectId === projectId && !c.standalone);

const blockText = (b: Block): string => {
  if (typeof b === 'string') return b;
  if ('list' in b) return b.list.join(' ');
  if ('steps' in b) return b.steps.map((s) => `${s.title} ${s.text}`).join(' ');
  if ('quote' in b) return b.quote;
  if ('note' in b) return b.note;
  return b.code;
};

/** Reading time at 220 words per minute, at least 1. */
export function readingMinutes(sections: ProseSection[]): number {
  const words = sections
    .flatMap((s) => [s.heading, ...s.body.map(blockText)])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

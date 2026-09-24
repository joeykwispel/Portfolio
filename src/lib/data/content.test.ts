import { describe, expect, it } from 'vitest';
import { caseStudies, contributions, coreSkills, getContent, posts, projects, readingMinutes, roles, skills, testimonials } from '$lib/data';

/** All key paths of a nested object, so two translations can be compared. */
function keys(o: unknown, prefix = ''): string[] {
  if (Array.isArray(o)) return [`${prefix}[${o.length}]`, ...o.flatMap((v, i) => keys(v, `${prefix}[${i}]`))];
  if (o && typeof o === 'object') return Object.entries(o).flatMap(([k, v]) => [`${prefix}.${k}`, ...keys(v, `${prefix}.${k}`)]);
  return [];
}

/** The footer jokes don't need to line up one-to-one between languages. */
const structural = (o: unknown) => keys(o).filter((k) => !/\.quips\[/.test(k));

const en = getContent('en');
const nl = getContent('nl');

describe('translations', () => {
  for (const part of ['ui', 'experience', 'projects', 'contributions', 'categories', 'languages', 'profile'] as const) {
    it(`nl has the same ${part} keys as en`, () => {
      expect(structural(nl[part])).toEqual(structural(en[part]));
    });
  }

  it('every case study and post is translated with the same sections', () => {
    for (const c of caseStudies) {
      expect(en.caseStudies[c.slug], c.slug).toBeDefined();
      expect(nl.caseStudies[c.slug], c.slug).toBeDefined();
      expect(nl.caseStudies[c.slug].sections).toHaveLength(en.caseStudies[c.slug].sections.length);
    }
    for (const p of posts) {
      expect(en.posts[p.slug], p.slug).toBeDefined();
      expect(nl.posts[p.slug], p.slug).toBeDefined();
      expect(nl.posts[p.slug].sections).toHaveLength(en.posts[p.slug].sections.length);
    }
  });
});

describe('data integrity', () => {
  const skillNames = new Set(skills.map((s) => s.name));

  it('every skill in a role stack exists', () => {
    for (const r of roles) for (const s of r.stack) expect(skillNames.has(s), `${s} in ${r.id}`).toBe(true);
  });

  it('every core skill exists', () => {
    for (const s of coreSkills) expect(skillNames.has(s), s).toBe(true);
  });

  it('every project points to a real role', () => {
    for (const p of projects)
      expect(
        roles.some((r) => r.id === p.roleId),
        p.id
      ).toBe(true);
  });

  it('every case study points to real projects, pull requests and testimonials', () => {
    const slugs = new Set<string>();
    for (const c of caseStudies) {
      expect(slugs.has(c.slug), `duplicate slug ${c.slug}`).toBe(false);
      slugs.add(c.slug);
      expect(
        projects.some((p) => p.id === c.projectId),
        c.slug
      ).toBe(true);
      for (const id of c.contributions ?? [])
        expect(
          contributions.some((p) => p.id === id),
          id
        ).toBe(true);
      if (c.testimonial !== undefined) expect(testimonials[c.testimonial], c.slug).toBeDefined();
    }
  });

  it('posts are newest first with valid dates', () => {
    for (const p of posts) expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const dates = posts.map((p) => p.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('slugs are URL-safe', () => {
    for (const s of [...caseStudies.map((c) => c.slug), ...posts.map((p) => p.slug)]) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
});

describe('reading time', () => {
  it('is at least one minute and grows with length', () => {
    expect(readingMinutes([{ heading: 'a', body: ['short'] }])).toBe(1);
    const long = Array.from({ length: 1100 }, () => 'word').join(' ');
    expect(readingMinutes([{ heading: 'a', body: [long] }])).toBe(5);
  });
});

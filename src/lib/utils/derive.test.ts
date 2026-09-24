import { describe, expect, it } from 'vitest';
import { roles, skills } from '$lib/data';
import { careerMonths, categoryStrength, computeSkillStats, proficiencyKey, topSkills } from './derive';

describe('proficiency', () => {
  it('maps months to levels', () => {
    expect(proficiencyKey(0)).toBe('listed');
    expect(proficiencyKey(6)).toBe('familiar');
    expect(proficiencyKey(12)).toBe('working');
    expect(proficiencyKey(30)).toBe('proficient');
    expect(proficiencyKey(48)).toBe('advanced');
  });
});

describe('skill stats', () => {
  const stats = computeSkillStats();

  it('has one entry per skill', () => {
    expect(stats).toHaveLength(skills.length);
  });

  it('never counts more time for a skill than the whole career', () => {
    const career = careerMonths();
    for (const s of stats) expect(s.months).toBeLessThanOrEqual(career);
  });

  it('lists the roles that used a skill, newest first', () => {
    const ts = stats.find((s) => s.name === 'TypeScript')!;
    expect(ts.roleIds.length).toBeGreaterThan(0);
    const starts = ts.roleIds.map((id) => roles.find((r) => r.id === id)!.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('keeps soft skills and languages out of the top list', () => {
    expect(topSkills(stats, 50).some((s) => ['soft', 'methods', 'languages'].includes(s.category))).toBe(false);
  });

  it('scores categories between 0 and 100', () => {
    for (const c of categoryStrength(stats)) {
      expect(c.value).toBeGreaterThanOrEqual(0);
      expect(c.value).toBeLessThanOrEqual(100);
    }
  });
});

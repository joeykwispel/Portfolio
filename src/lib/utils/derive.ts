import { roles, sideProjects, skills, categoryOrder, education } from '$lib/data';
import type { CategoryId, RoleBase } from '$lib/data';
import { monthsInRange, nowIdx, rangeOf, unionMonths } from './dates';

export interface SkillStat {
  name: string;
  category: CategoryId;
  months: number;
  years: number;
  roleIds: string[];
  /** Side projects that use the skill. They don't add to `months`, which counts paid work only. */
  sideIds: string[];
  firstIdx: number | null;
}

const devRoles = () => roles.filter((r) => r.kind !== 'other');

export function computeSkillStats(): SkillStat[] {
  const byId = new Map(roles.map((r) => [r.id, r]));
  const known = new Set(skills.map((s) => s.name));
  if (import.meta.env.DEV) {
    for (const r of roles) for (const n of r.stack) if (!known.has(n)) console.warn(`[data] "${n}" in role "${r.id}" is missing from shared/skills.ts`);
    for (const p of sideProjects)
      for (const n of p.stack) if (!known.has(n)) console.warn(`[data] "${n}" in side project "${p.id}" is missing from shared/skills.ts`);
  }
  return skills.map((s) => {
    const ids = new Set<string>(s.roles ?? []);
    for (const r of devRoles()) if (r.stack.includes(s.name)) ids.add(r.id);
    const used = [...ids].map((id) => byId.get(id)).filter((r): r is RoleBase => !!r && r.kind !== 'other');
    const ranges = used.map(rangeOf);
    const months = unionMonths(ranges);
    return {
      name: s.name,
      category: s.category,
      months,
      years: months / 12,
      roleIds: used.sort((a, b) => b.start.localeCompare(a.start)).map((r) => r.id),
      sideIds: sideProjects.filter((p) => p.status === 'live' && p.stack.includes(s.name)).map((p) => p.id),
      firstIdx: ranges.length ? Math.min(...ranges.map((r) => r[0])) : null
    };
  });
}

export function careerMonths(): number {
  return unionMonths(devRoles().map(rangeOf));
}

export function categoryStrength(stats: SkillStat[]): { id: CategoryId; value: number }[] {
  const career = careerMonths() || 1;
  return categoryOrder
    .filter((c) => c !== 'languages')
    .map((id) => {
      const top = stats
        .filter((s) => s.category === id)
        .map((s) => s.months)
        .sort((a, b) => b - a)
        .slice(0, 5);
      const avg = top.length ? top.reduce((a, b) => a + b, 0) / 5 : 0;
      return { id, value: Math.min(100, Math.round((avg / career) * 100)) };
    });
}

export function topSkills(stats: SkillStat[], n = 10): SkillStat[] {
  return stats
    .filter((s) => !['languages', 'methods', 'soft'].includes(s.category) && s.months > 0)
    .sort((a, b) => b.months - a.months || a.name.localeCompare(b.name))
    .slice(0, n);
}

export function monthsPerRole() {
  return devRoles().map((r) => ({ id: r.id, company: r.company, months: monthsInRange(r) }));
}

export function growthSeries(stats: SkillStat[]) {
  const now = new Date();
  const years: number[] = [];
  const first = Math.min(...devRoles().map((r) => Math.floor(rangeOf(r)[0] / 12)));
  for (let y = first; y <= now.getFullYear(); y++) years.push(y);
  return years.map((y) => {
    const cutoff = y === now.getFullYear() ? nowIdx() : y * 12 + 11;
    const active = stats.filter((s) => s.firstIdx !== null && s.firstIdx <= cutoff && s.category !== 'languages');
    const perCategory: Partial<Record<CategoryId, number>> = {};
    for (const s of active) perCategory[s.category] = (perCategory[s.category] ?? 0) + 1;
    return { year: y, total: active.length, perCategory };
  });
}

export function proficiencyKey(months: number): 'listed' | 'familiar' | 'working' | 'proficient' | 'advanced' {
  if (months <= 0) return 'listed';
  const y = months / 12;
  if (y < 1) return 'familiar';
  if (y < 2.5) return 'working';
  if (y < 4) return 'proficient';
  return 'advanced';
}

export interface TimelineItem {
  key: string;
  type: 'work' | 'education' | 'certification' | 'other';
  sortKey: number;
  roleId?: string;
  eduId?: string;
}

/** Roles, education and training merged into one list, newest first. */
export function buildTimeline(): TimelineItem[] {
  const items: TimelineItem[] = roles.map((r) => ({
    key: r.id,
    type: r.kind === 'other' ? 'other' : 'work',
    sortKey: rangeOf(r)[0],
    roleId: r.id
  }));
  for (const e of education) {
    items.push({
      key: e.id,
      type: e.kind,
      sortKey: e.kind === 'education' ? e.startYear * 12 : e.startYear * 12 + 11,
      eduId: e.id
    });
  }
  return items.sort((a, b) => b.sortKey - a.sortKey);
}

export function employerCount(): number {
  return new Set(devRoles().map((r) => r.company.replace(/\s*\(.*\)/, ''))).size;
}

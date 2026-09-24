import type { UI } from '$lib/data/locales/en/ui';

const idx = (s: string) => {
  const [y, m] = s.split('-').map(Number);
  return y * 12 + (m - 1);
};

export const nowIdx = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};

/** Inclusive month range [start, end] as month indexes. `end: null` means today. */
export const rangeOf = (r: { start: string; end: string | null }): [number, number] => [idx(r.start), r.end ? idx(r.end) : nowIdx()];

/** Total months covered by a set of ranges (overlaps counted once). */
export function unionMonths(ranges: [number, number][]): number {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  let total = 0;
  let cs: number | null = null;
  let ce = 0;
  for (const [s, e] of sorted) {
    if (cs === null) {
      cs = s;
      ce = e;
    } else if (s <= ce + 1) {
      ce = Math.max(ce, e);
    } else {
      total += ce - cs + 1;
      cs = s;
      ce = e;
    }
  }
  if (cs !== null) total += ce - cs + 1;
  return total;
}

export const monthsInRange = (r: { start: string; end: string | null }) => {
  const [s, e] = rangeOf(r);
  return e - s + 1;
};

export function fmtMonth(value: string, locale: string): string {
  const [y, m] = value.split('-').map(Number);
  return new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(y, m - 1, 1));
}

export function fmtDuration(months: number, units: UI['units']): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? units.year : units.years}`);
  if (m || !y) parts.push(`${m} ${units.months}`);
  return parts.join(' ');
}

export const fmtYears = (months: number) => (Math.round((months / 12) * 10) / 10).toString();

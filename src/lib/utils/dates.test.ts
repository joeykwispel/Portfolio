import { describe, expect, it } from 'vitest';
import { fmtDuration, fmtYears, monthsInRange, rangeOf, unionMonths } from './dates';

const units = { year: 'yr', years: 'yrs', month: 'mo', months: 'mo' };

describe('month ranges', () => {
  it('counts both the start and the end month', () => {
    expect(monthsInRange({ start: '2025-07', end: '2026-07' })).toBe(13);
    expect(monthsInRange({ start: '2024-01', end: '2024-01' })).toBe(1);
  });

  it('treats a missing end as the current month', () => {
    const [, end] = rangeOf({ start: '2020-01', end: null });
    const d = new Date();
    expect(end).toBe(d.getFullYear() * 12 + d.getMonth());
  });

  it('counts overlapping ranges once', () => {
    const a = rangeOf({ start: '2020-01', end: '2020-12' });
    const b = rangeOf({ start: '2020-06', end: '2021-05' });
    expect(unionMonths([a, b])).toBe(17);
  });

  it('joins adjacent ranges and keeps gaps out', () => {
    const a = rangeOf({ start: '2020-01', end: '2020-03' });
    const b = rangeOf({ start: '2020-04', end: '2020-06' });
    const c = rangeOf({ start: '2021-01', end: '2021-01' });
    expect(unionMonths([c, a, b])).toBe(7);
    expect(unionMonths([])).toBe(0);
  });
});

describe('formatting', () => {
  it('writes years and months', () => {
    expect(fmtDuration(14, units)).toBe('1 yr 2 mo');
    expect(fmtDuration(24, units)).toBe('2 yrs');
    expect(fmtDuration(5, units)).toBe('5 mo');
    expect(fmtDuration(0, units)).toBe('0 mo');
  });

  it('rounds years to one decimal', () => {
    expect(fmtYears(18)).toBe('1.5');
    expect(fmtYears(12)).toBe('1');
  });
});

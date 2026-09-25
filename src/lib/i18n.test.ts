import { describe, expect, it } from 'vitest';
import { localeOf, localize, stripLocale } from './i18n';

describe('i18n paths', () => {
  it('prefixes Dutch and leaves English at the root', () => {
    expect(localize('/', 'en')).toBe('/');
    expect(localize('/', 'nl')).toBe('/nl/');
    expect(localize('/cv/', 'nl')).toBe('/nl/cv/');
  });

  it('strips the locale prefix', () => {
    expect(stripLocale('/nl/')).toBe('/');
    expect(stripLocale('/nl')).toBe('/');
    expect(stripLocale('/nl/work/x/')).toBe('/work/x/');
    expect(stripLocale('/cv/')).toBe('/cv/');
    // a path that only starts with "nl" is not Dutch
    expect(stripLocale('/nlx/')).toBe('/nlx/');
  });

  it('reads the locale from a path', () => {
    expect(localeOf('/nl/cv/')).toBe('nl');
    expect(localeOf('/nl')).toBe('nl');
    expect(localeOf('/')).toBe('en');
    expect(localeOf('/nlx/')).toBe('en');
  });
});

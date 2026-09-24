import en from './en';
import nl from './nl';
import type { Locale } from '../types';

export type Content = typeof en;

export const locales: Locale[] = ['en', 'nl'];

/** Returns all translatable content for a locale. Add a new language by adding a folder next to en/ and nl/. */
export function getContent(locale: Locale): Content {
  return locale === 'nl' ? nl : en;
}

import { goto } from '$app/navigation';
import type { Locale } from '$lib/data';
import { localize, stripLocale } from '$lib/i18n';

class AppState {
  /** Set by the [[lang]] layout from the URL: / is English, /nl/ is Dutch. */
  locale = $state<Locale>('en');
  theme = $state<'dark' | 'light'>('dark');
  reduced = $state(false);
  party = $state(0);
  palette = $state(false);
  /** Load every lazy section now, not when it scrolls near. Set before jumping to a #section. */
  eager = $state(false);

  init() {
    try {
      const t = localStorage.getItem('theme');
      if (t === 'light' || t === 'dark') this.theme = t;
    } catch {
      /* storage unavailable */
    }
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = mq.matches;
    mq.addEventListener('change', (e) => (this.reduced = e.matches));
  }

  /** Remembers the choice, so a later visit to the English home page sends a Dutch reader to /nl/. */
  rememberLocale(l: Locale) {
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* ignore */
    }
  }

  /** The same page in another language. */
  hrefFor(l: Locale, pathname: string) {
    return localize(stripLocale(pathname), l);
  }

  setLocale(l: Locale) {
    this.rememberLocale(l);
    goto(this.hrefFor(l, location.pathname) + location.hash, { noScroll: true, keepFocus: true });
  }

  /** Site-absolute href in the current language. */
  href(path: string) {
    return localize(path, this.locale);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', this.theme);
    } catch {
      /* ignore */
    }
  }
}

export const app = new AppState();

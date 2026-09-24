import type { Locale } from '$lib/data';

class AppState {
  locale = $state<Locale>('en');
  theme = $state<'dark' | 'light'>('dark');
  reduced = $state(false);
  party = $state(0);
  palette = $state(false);

  init() {
    try {
      const l = localStorage.getItem('lang') || navigator.language.slice(0, 2);
      if (l === 'nl' || l === 'en') this.locale = l;
      const t = localStorage.getItem('theme');
      if (t === 'light' || t === 'dark') this.theme = t;
    } catch {
      /* storage unavailable */
    }
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced = mq.matches;
    mq.addEventListener('change', (e) => (this.reduced = e.matches));
  }

  setLocale(l: Locale) {
    this.locale = l;
    try {
      localStorage.setItem('lang', l);
    } catch {
      /* ignore */
    }
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

import { tick } from 'svelte';
import { app } from '$lib/app.svelte';

/*
 * Sections below the fold load lazily behind placeholders of a guessed height. Jumping to #section
 * while they load makes the page grow under the scroll and land in the wrong place. So a jump first
 * loads every section, waits until they have rendered, and only then scrolls.
 */

const PENDING = '[data-lazy]:not([data-loaded])';
const frame = () => new Promise((r) => requestAnimationFrame(r));

export const hasPendingSections = () => !!document.querySelector(PENDING);

async function loadAllSections(timeout = 3000) {
  app.eager = true;
  const start = performance.now();
  while (hasPendingSections() && performance.now() - start < timeout) await frame();
  await tick();
  await frame();
  await frame();
}

/** Keeps `el` at the top while late layout changes (charts measuring, fonts) settle, until the reader scrolls. */
function pin(el: HTMLElement, ms = 2000) {
  const main = document.getElementById('main');
  if (!main) return;
  let top = main.offsetHeight;
  const ro = new ResizeObserver(() => {
    if (main.offsetHeight === top) return;
    top = main.offsetHeight;
    el.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
  const stop = () => {
    ro.disconnect();
    clearTimeout(timer);
    for (const e of events) removeEventListener(e, stop);
  };
  for (const e of events) addEventListener(e, stop, { passive: true });
  const timer = setTimeout(stop, ms);
  ro.observe(main);
}

/**
 * Scrolls to a section on the current page once everything above it has loaded.
 * `pushHash` updates the address bar the way a normal anchor click would.
 */
export async function scrollToSection(id: string, { smooth = true, pushHash = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  await loadAllSections();
  if (pushHash && location.hash !== `#${id}`) {
    // The layout is final now, so the browser's own hash jump lands in the right place.
    location.hash = id;
  } else {
    el.scrollIntoView({ block: 'start', behavior: smooth && !app.reduced ? 'smooth' : 'instant' });
  }
  pin(el);
  return true;
}

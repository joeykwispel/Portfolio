<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { app } from '$lib/app.svelte';
  import { getContent, locales } from '$lib/data';
  import { stripLocale } from '$lib/i18n';
  import { sectionIds, sectionNum } from '$lib/sections';
  import { magnetic } from '$lib/utils/actions';

  const t = $derived(getContent(app.locale).ui.nav);
  const items = $derived(sectionIds.map((id) => ({ id, label: t[id] })));
  /** On sub-pages the section links point back to the home page. */
  const home = $derived(stripLocale(page.url.pathname) === '/');
  const to = (id: string) => (home ? `#${id}` : `${app.href('/')}#${id}`);

  let active = $state('hero');
  let open = $state(false);
  let bar: HTMLDivElement;
  let scrolled = $state(false);

  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) active = e.target.id;
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    document.querySelectorAll('[data-section]').forEach((s) => io.observe(s));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        scrolled = scrollY > 12;
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      removeEventListener('scroll', onScroll);
    };
  });
</script>

<header class="nav" class:scrolled>
  <div class="progress" bind:this={bar} aria-hidden="true"></div>
  <div class="container bar">
    <a class="logo mono" href={to('hero')} aria-label={t.home}><span class="br">&lt;</span>JO<span class="br">/&gt;</span></a>

    <nav class:open aria-label="Main">
      <ul>
        {#each items as item (item.id)}
          <li>
            <a
              class="mono"
              href={to(item.id)}
              class:active={active === item.id}
              aria-current={active === item.id ? 'true' : undefined}
              onclick={() => (open = false)}><span class="idx">{sectionNum(item.id)}.</span>{item.label}</a
            >
          </li>
        {/each}
      </ul>
    </nav>

    <div class="tools">
      <button
        type="button"
        class="k mono"
        onclick={() => (app.palette = true)}
        aria-label={getContent(app.locale).ui.palette.open}
        aria-keyshortcuts="Control+K Meta+K"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"
          ><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg
        >
        <kbd>Ctrl K</kbd>
      </button>
      <div class="lang" role="group" aria-label={t.language}>
        {#each locales as l (l)}
          <a
            class="mono"
            href={app.hrefFor(l, page.url.pathname)}
            hreflang={l}
            aria-current={app.locale === l ? 'true' : undefined}
            data-sveltekit-noscroll
            data-sveltekit-keepfocus
            onclick={() => app.rememberLocale(l)}>{l.toUpperCase()}</a
          >
        {/each}
      </div>
      <button type="button" class="icon" onclick={() => app.toggleTheme()} aria-label={app.theme === 'dark' ? t.toLight : t.toDark} use:magnetic={0.3}>
        {#if app.theme === 'dark'}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
            ><circle cx="12" cy="12" r="4" /><path
              d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            /></svg
          >
        {:else}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg
          >
        {/if}
      </button>
      <button type="button" class="icon burger" aria-expanded={open} aria-label={t.menu} onclick={() => (open = !open)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
          ><path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} /></svg
        >
      </button>
    </div>
  </div>
</header>

<style>
  .nav {
    position: fixed;
    inset: 0 0 auto 0;
    height: var(--nav-h);
    z-index: 50;
    transition:
      background 0.3s,
      border-color 0.3s,
      backdrop-filter 0.3s;
    border-bottom: 1px solid transparent;
  }
  .nav.scrolled {
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-color: var(--border);
  }
  .progress {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transform: scaleX(0);
    transform-origin: left;
  }
  .bar {
    width: min(1360px, 100% - 2rem);
    height: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: space-between;
    white-space: nowrap;
  }
  .logo,
  .tools {
    flex: none;
  }
  .logo {
    font-weight: 800;
    font-size: 0.95rem;
    letter-spacing: -0.04em;
    text-decoration: none;
    color: var(--text);
    padding: 0.3rem 0.55rem;
    border-radius: 9px;
    background: var(--surface);
    border: 1px solid var(--border);
    transition:
      border-color 0.25s,
      box-shadow 0.25s;
  }
  .logo .br {
    color: var(--accent-text);
    display: inline-block;
    transition: transform 0.35s var(--spring);
  }
  .logo:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    box-shadow: 0 0 0 4px var(--glow);
  }
  .logo:hover .br:first-child {
    transform: translateX(-3px);
  }
  .logo:hover .br:last-child {
    transform: translateX(3px);
  }
  nav ul {
    display: flex;
    gap: 0.1rem;
  }
  nav a {
    position: relative;
    display: block;
    padding: 0.35rem 0.6rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--muted);
    font-size: 0.8rem;
    transition:
      color 0.2s,
      background 0.2s;
  }
  .idx {
    color: var(--accent-text);
    margin-right: 0.3rem;
    opacity: 0.8;
  }
  nav a::after {
    content: '';
    position: absolute;
    left: 0.6rem;
    right: 0.6rem;
    bottom: 0.1rem;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s var(--ease);
  }
  nav a:hover {
    color: var(--text);
  }
  nav a:hover::after,
  nav a.active::after {
    transform: scaleX(1);
  }
  nav a.active {
    color: var(--text);
  }
  .k {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    height: 36px;
    padding: 0 0.6rem;
    border-radius: 9px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    font-size: 0.75rem;
    transition:
      border-color 0.2s,
      color 0.2s,
      box-shadow 0.2s;
  }
  .k:hover {
    color: var(--text);
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    box-shadow: 0 0 0 4px var(--glow);
  }
  .k kbd {
    font-family: inherit;
    font-size: 0.68rem;
    padding: 0.05rem 0.35rem;
    border-radius: 5px;
    border: 1px solid var(--border);
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .lang {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px;
    background: var(--surface);
  }
  .lang a {
    text-decoration: none;
    border: 0;
    background: transparent;
    padding: 0.25rem 0.7rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    transition:
      background 0.2s,
      color 0.2s;
  }
  .lang a[aria-current='true'] {
    background: var(--accent);
    color: var(--accent-ink);
  }
  .icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    border: 1px solid var(--border);
    background: var(--surface);
    transition:
      transform 0.2s,
      background 0.2s;
  }
  .icon:hover {
    background: var(--surface-2);
  }
  .icon:active {
    transform: scale(0.92);
  }
  .burger {
    display: none;
  }

  @media (max-width: 1480px) {
    .idx {
      display: none;
    }
  }
  @media (max-width: 1320px) {
    .k kbd {
      display: none;
    }
  }
  @media (max-width: 1120px) {
    .idx {
      display: inline;
    }
    .burger {
      display: grid;
    }
    nav {
      position: fixed;
      inset: var(--nav-h) 0.75rem auto 0.75rem;
      background: var(--bg-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 0.6rem;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-8px);
      transition:
        opacity 0.25s,
        transform 0.25s,
        visibility 0.25s;
    }
    nav.open {
      opacity: 1;
      visibility: visible;
      transform: none;
    }
    nav ul {
      flex-direction: column;
    }
    nav a {
      padding: 0.7rem 1rem;
      font-size: 0.9rem;
    }
    nav a::after {
      display: none;
    }
  }
</style>

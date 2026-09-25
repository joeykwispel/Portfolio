<script lang="ts">
  import { tick } from 'svelte';
  import { fade, scale } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import { app } from '$lib/app.svelte';
  import { contact, getContent, liveSideProjects, sideProjectHref, visiblePosts } from '$lib/data';
  import { sectionIds } from '$lib/sections';
  import { scrollToSection } from '$lib/utils/scroll';

  const c = $derived(getContent(app.locale));
  const p = $derived(c.ui.palette);

  type Cmd = { id: string; group: string; label: string; hint?: string; icon: string; run: () => void };

  let query = $state('');
  let index = $state(0);
  let input = $state<HTMLInputElement>();
  let toast = $state('');

  const go = (id: string) => () => {
    if (document.getElementById(id)) scrollToSection(id, { pushHash: true });
    else goto(`${app.href('/')}#${id}`);
  };
  const open = (href: string) => () => window.open(href, '_blank', 'noopener');

  const commands = $derived<Cmd[]>([
    ...[['hero', c.ui.nav.home], ...sectionIds.map((id) => [id, c.ui.nav[id]])].map(([id, label]) => ({
      id: `go-${id}`,
      group: p.goto,
      label,
      hint: `#${id}`,
      icon: '#',
      run: go(id)
    })),
    { id: 'theme', group: p.actions, label: p.theme, icon: '◐', run: () => app.toggleTheme() },
    { id: 'lang', group: p.actions, label: p.lang, icon: '⇄', run: () => app.setLocale(app.locale === 'en' ? 'nl' : 'en') },
    {
      id: 'copy',
      group: p.actions,
      label: p.copy,
      hint: contact.email.value,
      icon: '⧉',
      run: () => navigator.clipboard?.writeText(contact.email.value).then(() => flash(p.copied))
    },
    { id: 'cv', group: p.actions, label: p.cv, hint: '/cv', icon: '▤', run: () => goto(app.href('/cv/')) },
    ...(visiblePosts.length
      ? [{ id: 'writing', group: p.actions, label: p.writing, hint: '/writing', icon: '✎', run: () => goto(app.href('/writing/')) }]
      : []),
    { id: 'party', group: p.actions, label: p.party, hint: '↑↑↓↓←→←→BA', icon: '✦', run: () => app.party++ },
    { id: 'github', group: p.links, label: p.github, hint: 'github.com/joeykwispel', icon: '↗', run: open(contact.github.value) },
    ...liveSideProjects
      .filter((sp) => sp.id !== 'portfolio')
      .map((sp) => ({
        id: `app-${sp.id}`,
        group: p.links,
        label: p.openApp.replace('{name}', sp.name),
        hint: sp.url.replace('https://', ''),
        icon: '↗',
        run: open(sideProjectHref(sp, app.locale))
      })),
    { id: 'linkedin', group: p.links, label: p.linkedin, hint: 'linkedin.com/in/joey-oosenbrug', icon: '↗', run: open(contact.linkedin.value) },
    { id: 'mail', group: p.links, label: p.mail, hint: contact.email.value, icon: '@', run: () => (location.href = `mailto:${contact.email.value}`) }
  ]);

  /** Subsequence fuzzy match: every query char must appear in order. */
  function score(text: string, q: string) {
    if (!q) return 1;
    const t = text.toLowerCase();
    if (t.includes(q)) return 2;
    let i = 0;
    for (const ch of t) if (ch === q[i]) i++;
    return i === q.length ? 1 : 0;
  }

  const results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return commands.filter((cmd) => score(`${cmd.label} ${cmd.hint ?? ''} ${cmd.group}`, q) > 0);
  });

  $effect(() => {
    void query;
    index = 0;
  });

  $effect(() => {
    if (!app.palette) return;
    query = '';
    // On touch screens, focusing would pop up the keyboard and hide most of the list; tap the field to search.
    if (!matchMedia('(pointer: coarse)').matches) tick().then(() => input?.focus());
    // Keep the page behind from scrolling, so swipes scroll the list instead.
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => (root.style.overflow = prev);
  });

  function flash(msg: string) {
    toast = msg;
    setTimeout(() => (toast = ''), 2200);
  }

  function run(cmd: Cmd) {
    app.palette = false;
    cmd.run();
  }

  function onKey(e: KeyboardEvent) {
    const typing = e.target instanceof Element && e.target.closest('input, textarea, [contenteditable]');
    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      app.palette = !app.palette;
      return;
    }
    if (!app.palette && e.key === '/' && !typing) {
      e.preventDefault();
      app.palette = true;
      return;
    }
    if (!app.palette) return;
    if (e.key === 'Escape') app.palette = false;
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      index = (index + 1) % Math.max(1, results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      index = (index - 1 + results.length) % Math.max(1, results.length);
    } else if (e.key === 'Enter' && results[index]) {
      e.preventDefault();
      run(results[index]);
    }
  }

  function scrollActive(node: HTMLElement, active: boolean) {
    const upd = (a: boolean) => a && node.scrollIntoView({ block: 'nearest' });
    upd(active);
    return { update: upd };
  }
</script>

<svelte:window onkeydown={onKey} />

{#if app.palette}
  <div class="backdrop" transition:fade={{ duration: app.reduced ? 0 : 150 }} onclick={() => (app.palette = false)} aria-hidden="true"></div>
  <div class="palette" role="dialog" aria-modal="true" aria-label={p.open} transition:scale={{ duration: app.reduced ? 0 : 180, start: 0.96 }}>
    <div class="search">
      <span class="gt mono" aria-hidden="true">&gt;</span>
      <input
        bind:this={input}
        bind:value={query}
        class="mono"
        placeholder={p.placeholder}
        role="combobox"
        aria-expanded="true"
        aria-controls="cmd-list"
        aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
        autocomplete="off"
        spellcheck="false"
      />
      <kbd>esc</kbd>
    </div>
    <ul id="cmd-list" role="listbox">
      {#each results as cmd, i (cmd.id)}
        {#if i === 0 || results[i - 1].group !== cmd.group}
          <li class="group mono" role="presentation">{cmd.group}</li>
        {/if}
        <li
          id="cmd-{cmd.id}"
          role="option"
          aria-selected={i === index}
          class:active={i === index}
          use:scrollActive={i === index}
          onpointermove={(e) => e.pointerType === 'mouse' && (index = i)}
          onclick={() => run(cmd)}
          onkeydown={() => {}}
        >
          <span class="ic mono" aria-hidden="true">{cmd.icon}</span>
          <span class="lbl">{cmd.label}</span>
          {#if cmd.hint}<span class="hint mono">{cmd.hint}</span>{/if}
        </li>
      {:else}
        <li class="empty mono">{p.empty}</li>
      {/each}
    </ul>
    <footer class="mono">
      <span><kbd>↑</kbd><kbd>↓</kbd> {p.navigate}</span>
      <span><kbd>↵</kbd> {p.select}</span>
      <span><kbd>esc</kbd> {p.close}</span>
    </footer>
  </div>
{/if}

{#if toast}
  <div class="toast mono" role="status" transition:fade={{ duration: 200 }}>✓ {toast}</div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 80;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
  }
  .palette {
    position: fixed;
    z-index: 81;
    top: 14vh;
    left: 50%;
    translate: -50% 0;
    width: min(620px, 100% - 1.5rem);
    max-height: calc(100dvh - 14vh - 1rem);
    display: flex;
    flex-direction: column;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow:
      var(--shadow),
      0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent),
      0 40px 120px -40px var(--glow);
    overflow: hidden;
  }
  .search {
    flex: none;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.85rem 1rem;
    border-bottom: 1px solid var(--border);
  }
  .gt {
    color: var(--accent-text);
    font-weight: 700;
  }
  input {
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text);
    font-size: 0.95rem;
  }
  kbd {
    font-family: var(--mono);
    font-size: 0.68rem;
    padding: 0.05rem 0.35rem;
    border-radius: 5px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
  }
  ul {
    max-height: min(52vh, 420px);
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0.4rem;
  }
  .group {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    padding: 0.6rem 0.7rem 0.3rem;
  }
  [role='option'] {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.55rem 0.7rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.92rem;
    border-left: 2px solid transparent;
  }
  [role='option'].active {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border-left-color: var(--accent);
  }
  .ic {
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 6px;
    font-size: 0.8rem;
    color: var(--accent-text);
    background: var(--surface);
    border: 1px solid var(--border);
  }
  .lbl {
    flex: 1;
  }
  .hint {
    font-size: 0.72rem;
    color: var(--muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 45%;
  }
  .empty {
    padding: 1.5rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.85rem;
  }
  footer {
    display: flex;
    gap: 1rem;
    padding: 0.55rem 1rem;
    border-top: 1px solid var(--border);
    font-size: 0.7rem;
    color: var(--muted);
  }
  footer kbd {
    margin-right: 0.15rem;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 2rem;
    translate: -50% 0;
    z-index: 95;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    border-radius: 10px;
    color: var(--accent-ink);
    background: var(--accent);
    box-shadow: var(--shadow);
  }
  @media (max-width: 560px) {
    .hint {
      display: none;
    }
    /* Use the full screen height on phones: the list fills whatever is left below the search field. */
    .palette {
      top: 0.75rem;
      max-height: calc(100dvh - 1.5rem);
    }
    ul {
      flex: 1;
      max-height: none;
    }
  }
  /* The arrow/enter/esc hints only make sense with a keyboard. */
  @media (pointer: coarse) {
    footer {
      display: none;
    }
  }
</style>

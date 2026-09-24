<script lang="ts">
  import { flip } from 'svelte/animate';
  import { scale } from 'svelte/transition';
  import { app } from '$lib/app.svelte';
  import { categoryHue, categoryOrder, getContent } from '$lib/data';
  import type { CategoryId } from '$lib/data';
  import { computeSkillStats, type SkillStat } from '$lib/utils/derive';
  import { springDrag, magnetic } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';
  import SkillPopover from './skills/SkillPopover.svelte';
  import RadarPlayground from './skills/RadarPlayground.svelte';

  const c = $derived(getContent(app.locale));
  const stats = computeSkillStats();
  const maxMonths = Math.max(...stats.map((s) => s.months), 1);

  const base = [...stats].sort(
    (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) || b.months - a.months || a.name.localeCompare(b.name)
  );

  let filter = $state<'all' | CategoryId>('all');
  let order = $state<string[] | null>(null);
  let selected = $state<{ stat: SkillStat; rect: DOMRect } | null>(null);

  const visible = $derived.by(() => {
    const list = filter === 'all' ? base : base.filter((s) => s.category === filter);
    if (!order) return list;
    const o = order;
    return [...list].sort((a, b) => o.indexOf(a.name) - o.indexOf(b.name));
  });

  const counts = $derived(Object.fromEntries(categoryOrder.map((k) => [k, stats.filter((s) => s.category === k).length])) as Record<CategoryId, number>);

  function setFilter(f: 'all' | CategoryId) {
    filter = f;
    order = null;
    selected = null;
  }

  function shuffle() {
    const names = stats.map((s) => s.name);
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }
    order = names;
    selected = null;
  }

  function hash(s: string) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  const dur = (ms: number) => (app.reduced ? 0 : ms);
  const size = (s: SkillStat) => 0.85 + 0.5 * Math.pow(s.months / maxMonths, 0.6);

  function open(s: SkillStat, el: HTMLElement) {
    selected = selected?.stat.name === s.name ? null : { stat: s, rect: el.getBoundingClientRect() };
  }

  function onPointerDown(e: PointerEvent) {
    if (!selected) return;
    const t = e.target as HTMLElement;
    if (!t.closest('.pop') && !t.closest('.chip')) selected = null;
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (selected = null)} onscroll={() => (selected = null)} onpointerdown={onPointerDown} />

<section class="section">
  <div class="container">
    <SectionHead num="02" slug="skills" title={c.ui.skills.title} intro={c.ui.skills.intro} />

    <div class="filters" role="group" aria-label={c.ui.skills.title}>
      <button type="button" class="f" aria-pressed={filter === 'all'} onclick={() => setFilter('all')}>{c.ui.skills.all} <small>{stats.length}</small></button>
      {#each categoryOrder as k (k)}
        <button type="button" class="f" style="--h:{categoryHue[k]}" aria-pressed={filter === k} onclick={() => setFilter(k)}>{c.categories[k]} <small>{counts[k]}</small></button>
      {/each}
      <button type="button" class="f shuffle" onclick={shuffle} use:magnetic={0.2}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
        {c.ui.skills.shuffle}
      </button>
    </div>

    <div class="stage glass">
      <ul class="cloud" aria-label={c.ui.skills.title}>
        {#each visible as s (s.name)}
          <li animate:flip={{ duration: dur(450) }} in:scale={{ duration: dur(320), start: 0.6 }} out:scale={{ duration: dur(180), start: 0.6 }}>
            <button
              type="button"
              class="chip"
              use:springDrag
              style="--h:{categoryHue[s.category]};--fs:{size(s)}rem"
              aria-haspopup="dialog"
              aria-expanded={selected?.stat.name === s.name}
              onclick={(e) => open(s, e.currentTarget)}
            >
              <span class="in" style="--d:{-(hash(s.name) % 60) / 10}s;--t:{4 + (hash(s.name) % 30) / 10}s;--a:{3 + (hash(s.name) % 5)}px">{c.skillLabels[s.name] ?? s.name}</span>
            </button>
          </li>
        {/each}
      </ul>
      <p class="hint">{c.ui.skills.hint}</p>
    </div>

    <div class="play"><RadarPlayground {stats} /></div>
  </div>
</section>

{#if selected}
  {#key selected.stat.name}
    <SkillPopover stat={selected.stat} anchor={selected.rect} {maxMonths} onclose={() => (selected = null)} />
  {/key}
{/if}

<style>
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 0.9rem;
  }
  .f {
    --h: 200;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 8px;
    padding: 0.3rem 0.75rem;
    font-family: var(--mono);
    font-size: 0.8rem;
    transition: background 0.2s, transform 0.2s, border-color 0.2s;
  }
  .f small {
    color: var(--muted);
    font-size: 0.7rem;
    opacity: 0.8;
  }
  .f:hover {
    background: var(--surface-2);
  }
  .f:active {
    transform: scale(0.95);
  }
  .f[aria-pressed='true'] {
    background: color-mix(in srgb, var(--accent) 22%, var(--surface));
    border-color: var(--accent);
    font-weight: 600;
  }
  .shuffle {
    margin-left: auto;
    border-color: color-mix(in srgb, var(--accent-2) 60%, var(--border));
  }
  .stage {
    padding: clamp(0.9rem, 2.5vw, 1.5rem);
    overflow: hidden;
  }
  .cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 0.5rem;
    justify-content: center;
    min-height: 200px;
  }
  .chip {
    --h: 200;
    display: block;
    border: 0;
    padding: 0;
    background: none;
    touch-action: manipulation;
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
  }
  .chip:active {
    cursor: grabbing;
  }
  .in {
    display: block;
    font-size: var(--fs);
    line-height: 1.2;
    padding: 0.42em 0.95em;
    border-radius: 999px;
    color: hsl(var(--h) 80% var(--chip-l));
    background: hsl(var(--h) 70% 55% / var(--chip-bg-a));
    border: 1px solid hsl(var(--h) 70% 60% / 0.35);
    animation: float var(--t) ease-in-out var(--d) infinite;
    transition: scale 0.3s var(--ease), background 0.25s, box-shadow 0.25s;
    will-change: transform;
  }
  .chip:hover .in,
  .chip:focus-visible .in,
  .chip[aria-expanded='true'] .in {
    scale: 1.14;
    background: hsl(var(--h) 70% 55% / 0.3);
    box-shadow: 0 0 22px hsl(var(--h) 80% 60% / 0.35);
  }
  .chip:active .in {
    scale: 0.96;
  }
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(calc(var(--a) * -1));
    }
  }
  .hint {
    margin: 0.9rem auto 0;
    font-family: var(--mono);
    font-size: 0.78rem;
    text-align: center;
    color: var(--muted);
  }
  .play {
    margin-top: 1rem;
  }
</style>

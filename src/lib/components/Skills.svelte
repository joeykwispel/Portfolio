<script lang="ts">
  import { slide } from 'svelte/transition';
  import { app } from '$lib/app.svelte';
  import { categoryHue, categoryOrder, coreSkills, getContent, sideProjectHref, sideProjects } from '$lib/data';
  import type { CategoryId } from '$lib/data';
  import { computeSkillStats, proficiencyKey, type SkillStat } from '$lib/utils/derive';
  import { fmtYears } from '$lib/utils/dates';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';
  import SkillPopover from './skills/SkillPopover.svelte';

  const c = $derived(getContent(app.locale));
  const stats = computeSkillStats();
  const maxMonths = Math.max(...stats.map((s) => s.months), 1);
  const byMonths = (a: SkillStat, b: SkillStat) => b.months - a.months || a.name.localeCompare(b.name);

  const core = stats.filter((s) => coreSkills.includes(s.name)).sort(byMonths);
  const groups = categoryOrder.map((id) => ({ id, skills: stats.filter((s) => s.category === id).sort(byMonths) })).filter((g) => g.skills.length);
  const districts = groups.filter((g) => g.id !== 'languages');
  const city = sideProjects.find((p) => p.id === 'devcity')!;

  /* Mini skyline: one building per skill, a district per area, height from time in projects. */
  const BW = 6;
  const GAP = 10;
  const SKY_H = 62;
  const skyline = (() => {
    const buildings: { x: number; h: number; hue: number }[] = [];
    let x = 0;
    for (const g of districts) {
      for (const s of g.skills) {
        buildings.push({ x, h: 6 + Math.sqrt(s.months / maxMonths) * (SKY_H - 8), hue: categoryHue[g.id] });
        x += BW;
      }
      x += GAP;
    }
    return { buildings, width: x - GAP };
  })();

  let selected = $state<{ stat: SkillStat; rect: DOMRect } | null>(null);
  let open = $state<Partial<Record<CategoryId, boolean>>>({});
  let showList = $state(false);

  const label = (s: SkillStat) => c.skillLabels[s.name] ?? s.name;
  const pct = (s: SkillStat) => Math.max(2, (s.months / maxMonths) * 100);

  function pick(s: SkillStat, el: HTMLElement) {
    selected = selected?.stat.name === s.name ? null : { stat: s, rect: el.getBoundingClientRect() };
  }

  function onPointerDown(e: PointerEvent) {
    if (!selected) return;
    const t = e.target as HTMLElement;
    if (!t.closest('.pop') && !t.closest('[data-skill]')) selected = null;
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (selected = null)} onscroll={() => (selected = null)} onpointerdown={onPointerDown} />

<section class="section">
  <div class="container">
    <SectionHead section="skills" slug="skills" title={c.ui.skills.title} intro={c.ui.skills.intro} />

    <div class="layout">
      <div class="core glass ring" use:reveal>
        <header class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>core-stack.json</header>
        <div class="core-head">
          <h3>{c.ui.skills.coreTitle}</h3>
          <p>{c.ui.skills.coreIntro}</p>
        </div>
        <ul class="bars">
          {#each core as s (s.name)}
            <li>
              <button
                type="button"
                class="bar-row"
                data-skill
                aria-haspopup="dialog"
                aria-expanded={selected?.stat.name === s.name}
                onclick={(e) => pick(s, e.currentTarget)}
                style="--h:{categoryHue[s.category]};--w:{pct(s)}%"
              >
                <span class="name">{label(s)}</span>
                <span class="yrs mono">{fmtYears(s.months)} {c.ui.units.years}</span>
                <span class="track" aria-hidden="true"><span class="fill"></span></span>
                <span class="sr-only">{c.ui.skills.levels[proficiencyKey(s.months)]}</span>
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <div class="city glass ring" use:reveal={{ delay: 80 }}>
        <header class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>devcity.joeyoosenbrug.nl</header>
        <div class="city-body">
          <p class="kicker mono">{c.ui.skills.cityKicker.replace('{n}', String(stats.length))}</p>
          <h3>{c.ui.skills.cityTitle}</h3>
          <p class="city-text">{c.ui.skills.cityText}</p>
          <svg class="skyline" viewBox="0 0 {skyline.width} {SKY_H}" preserveAspectRatio="none" aria-hidden="true">
            {#each skyline.buildings as b, i (i)}
              <rect x={b.x} y={SKY_H - b.h} width={BW - 1.5} height={b.h} rx="0.8" style="--hue:{b.hue};--i:{i}" />
            {/each}
          </svg>
          <ul class="districts" aria-hidden="true">
            {#each districts as g (g.id)}
              <li style="--h:{categoryHue[g.id]}"><span class="dot"></span>{c.categories[g.id]}</li>
            {/each}
          </ul>
          <a class="btn btn-primary city-cta" href={sideProjectHref(city, app.locale)} target="_blank" rel="noopener noreferrer">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"><path d="M3 21h18M5 21V9l4-2v14M9 21V4l6 3v14M15 21v-9l4 2v7" /></svg
            >
            {c.ui.skills.cityCta} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>

    <div class="list-toggle">
      <button type="button" class="toggle mono" aria-expanded={showList} aria-controls="skills-list" onclick={() => (showList = !showList)}>
        {showList ? c.ui.skills.listHide : c.ui.skills.listShow}
        <svg
          class="chev"
          class:up={showList}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.4"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
        >
      </button>
    </div>

    {#if showList}
      <div id="skills-list" class="areas" transition:slide={{ duration: app.reduced ? 0 : 260 }}>
        <p class="areas-intro">{c.ui.skills.allIntro}</p>
        <ul class="tree glass ring">
          {#each groups as g (g.id)}
            <li style="--h:{categoryHue[g.id]}">
              <details bind:open={open[g.id]}>
                <summary>
                  <span class="dot" aria-hidden="true"></span>
                  <span class="cat">{c.categories[g.id]}</span>
                  <span class="count mono">{g.skills.length}</span>
                  <span class="preview" aria-hidden="true">{g.skills.slice(0, 4).map(label).join(', ')}</span>
                  <svg
                    class="chev"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg
                  >
                </summary>
                <ul class="chips">
                  {#each g.skills as s (s.name)}
                    <li>
                      <button
                        type="button"
                        class="chip"
                        data-skill
                        aria-haspopup="dialog"
                        aria-expanded={selected?.stat.name === s.name}
                        onclick={(e) => pick(s, e.currentTarget)}
                        style="--w:{g.id === 'languages' ? 0 : pct(s)}%"
                      >
                        {label(s)}
                        {#if s.months && g.id !== 'languages'}<span class="m mono">{fmtYears(s.months)}</span>
                        {:else if s.sideIds.length}<span class="m mono">{c.ui.skills.side}</span>{/if}
                      </button>
                    </li>
                  {/each}
                </ul>
              </details>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</section>

{#if selected}
  {#key selected.stat.name}
    <SkillPopover stat={selected.stat} anchor={selected.rect} {maxMonths} onclose={() => (selected = null)} />
  {/key}
{/if}

<style>
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 1.25rem;
    align-items: stretch;
  }
  h3 {
    font-size: 1.05rem;
  }
  .core-head p {
    color: var(--muted);
    font-size: 0.9rem;
    margin-top: 0.2rem;
  }

  .chrome {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.45rem 0.9rem;
    font-size: 0.68rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .dots {
    display: flex;
    gap: 5px;
  }
  .dots i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
  }

  /* core stack */
  .core {
    padding: 0 0 0.6rem;
    overflow: hidden;
  }
  .core-head {
    padding: 1rem 1.2rem 0.4rem;
  }
  .bars {
    display: grid;
    padding: 0 0.4rem;
  }
  .bar-row {
    --h: 168;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'name yrs'
      'track track';
    gap: 0.35rem 1rem;
    padding: 0.55rem 0.8rem 0.65rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    text-align: left;
    transition: background 0.2s;
  }
  .bar-row:hover,
  .bar-row[aria-expanded='true'] {
    background: var(--surface-2);
  }
  .name {
    grid-area: name;
    font-weight: 600;
  }
  .yrs {
    grid-area: yrs;
    font-size: 0.8rem;
    color: var(--muted);
    align-self: center;
  }
  .track {
    grid-area: track;
    height: 6px;
    border-radius: 6px;
    background: var(--surface-2);
    overflow: hidden;
  }
  .fill {
    display: block;
    height: 100%;
    width: var(--w);
    border-radius: inherit;
    background: linear-gradient(90deg, hsl(var(--h) 60% 50%), var(--accent));
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 0.9s var(--ease);
  }
  :global(.reveal.in) .fill,
  :global(html:not(.js)) .fill {
    transform: none;
  }

  /* DevCity panel */
  .city {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-color: color-mix(in srgb, var(--accent) 35%, var(--border));
    background: radial-gradient(120% 70% at 50% 100%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%), var(--surface);
  }
  .city-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 1.3rem 1.4rem 1.4rem;
  }
  .city h3 {
    font-size: clamp(1.35rem, 2.4vw, 1.75rem);
    letter-spacing: -0.02em;
  }
  .kicker {
    font-size: 0.75rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .city-text {
    color: var(--muted);
    font-size: 0.95rem;
  }
  .skyline {
    width: 100%;
    height: clamp(110px, 18vw, 170px);
    margin-top: auto;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
  }
  .skyline rect {
    fill: hsl(var(--hue) 65% 58% / 0.85);
    transform-box: fill-box;
    transform-origin: bottom;
    transform: scaleY(0);
    transition: transform 0.7s var(--ease) calc(var(--i) * 6ms);
  }
  :global(.reveal.in) .skyline rect,
  :global(html:not(.js)) .skyline rect {
    transform: none;
  }
  .districts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem 0.9rem;
    font-size: 0.75rem;
    color: var(--muted);
  }
  .districts li {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .districts .dot {
    width: 7px;
    height: 7px;
  }
  .city-cta {
    align-self: flex-start;
    gap: 0.5rem;
  }

  /* list toggle */
  .list-toggle {
    display: flex;
    justify-content: center;
    margin-top: 1.1rem;
  }
  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.4rem 0.8rem;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--muted);
    font-size: 0.85rem;
    transition:
      color 0.2s,
      background 0.2s;
  }
  .toggle:hover {
    color: var(--text);
    background: var(--surface-2);
  }
  .chev.up {
    transform: rotate(180deg);
  }

  /* full list */
  .areas {
    display: grid;
    gap: 0.9rem;
    margin-top: 0.8rem;
  }
  .areas-intro {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .tree {
    display: grid;
    padding: 0.35rem;
  }
  .tree > li + li {
    border-top: 1px solid var(--border);
  }
  summary {
    display: grid;
    grid-template-columns: auto auto auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 0.8rem;
    border-radius: var(--radius-sm);
    cursor: pointer;
    list-style: none;
    transition: background 0.2s;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary:hover {
    background: var(--surface-2);
  }
  .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: hsl(var(--h) 70% 60%);
    box-shadow: 0 0 10px hsl(var(--h) 80% 60% / 0.5);
  }
  .cat {
    font-weight: 600;
    white-space: nowrap;
  }
  .count {
    font-size: 0.72rem;
    color: var(--muted);
    padding: 0.05rem 0.45rem;
    border: 1px solid var(--border);
    border-radius: 999px;
  }
  .preview {
    color: var(--muted);
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.2s;
  }
  details[open] .preview {
    opacity: 0;
  }
  .chev {
    color: var(--muted);
    transition: transform 0.3s var(--ease);
  }
  details[open] .chev {
    transform: rotate(180deg);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    padding: 0.2rem 0.8rem 1rem 2.05rem;
  }
  details[open] .chips {
    animation: open 0.3s var(--ease);
  }
  @keyframes open {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
  .chip {
    position: relative;
    display: inline-flex;
    align-items: baseline;
    gap: 0.4rem;
    padding: 0.28rem 0.7rem 0.34rem;
    border-radius: 8px;
    font-size: 0.85rem;
    border: 1px solid hsl(var(--h) 60% 60% / 0.3);
    background: hsl(var(--h) 70% 55% / var(--chip-bg-a));
    color: hsl(var(--h) 80% var(--chip-l));
    overflow: hidden;
    transition:
      background 0.2s,
      border-color 0.2s;
  }
  /* thin usage bar along the bottom of each chip */
  .chip::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: var(--w);
    background: hsl(var(--h) 75% 60%);
    opacity: 0.8;
  }
  .chip:hover,
  .chip[aria-expanded='true'] {
    background: hsl(var(--h) 70% 55% / 0.28);
    border-color: hsl(var(--h) 70% 60% / 0.6);
  }
  .m {
    font-size: 0.7rem;
    opacity: 0.75;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: 1fr;
    }
    /* On one column the city comes first: it is the main way in. */
    .city {
      order: -1;
    }
  }
  @media (max-width: 520px) {
    .preview {
      display: none;
    }
    .chips {
      padding-left: 0.8rem;
    }
    .city-cta {
      align-self: stretch;
      justify-content: center;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .fill,
    .skyline rect {
      transition: none;
    }
    details[open] .chips {
      animation: none;
    }
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';
  import { getContent, roles, sideProjects, spokenLanguages } from '$lib/data';
  import { fmtDuration } from '$lib/utils/dates';
  import { proficiencyKey, type SkillStat } from '$lib/utils/derive';

  let { stat, anchor, maxMonths, onclose }: { stat: SkillStat; anchor: DOMRect; maxMonths: number; onclose: () => void } = $props();

  const c = $derived(getContent(app.locale));
  const W = 320;
  const left = $derived(Math.min(Math.max(anchor.left + anchor.width / 2 - W / 2, 12), innerWidth - W - 12));
  const below = $derived(anchor.bottom + 280 < innerHeight || anchor.top < 280);
  const pos = $derived(below ? `top:${anchor.bottom + 10}px` : `bottom:${innerHeight - anchor.top + 10}px`);

  const level = $derived(proficiencyKey(stat.months));
  const isLang = $derived(stat.category === 'languages');
  const lang = $derived(isLang ? spokenLanguages.find((l) => l.id === stat.name) : null);
  let el: HTMLDivElement;

  onMount(() => el.focus({ preventScroll: true }));
</script>

<div bind:this={el} class="pop glass" role="dialog" aria-label={c.skillLabels[stat.name] ?? stat.name} tabindex="-1" style="left:{left}px;{pos};--w:{W}px">
  <div class="top">
    <div>
      <h3>{c.skillLabels[stat.name] ?? stat.name}</h3>
      <span class="tag">{c.categories[stat.category]}</span>
    </div>
    <button type="button" class="x" onclick={onclose} aria-label={c.ui.skills.close}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"
        ><path d="M6 6l12 12M18 6L6 18" /></svg
      >
    </button>
  </div>

  {#if isLang && lang}
    <p class="lvl">{c.languages[lang.id as 'Dutch' | 'English'].level}</p>
  {:else}
    <dl>
      <div>
        <dt>{c.ui.skills.level}</dt>
        <dd>{!stat.months && stat.sideIds.length ? c.ui.skills.side : c.ui.skills.levels[level]}</dd>
      </div>
      <div>
        <dt>{c.ui.skills.years}</dt>
        <dd>{stat.months ? fmtDuration(stat.months, c.ui.units) : '0'}</dd>
      </div>
    </dl>
    <div class="meter" aria-hidden="true"><span style="width:{Math.max(3, (stat.months / maxMonths) * 100)}%"></span></div>
    {#if stat.roleIds.length}
      <p class="used">{c.ui.skills.usedIn}</p>
      <ul>
        {#each stat.roleIds as id (id)}
          {@const r = roles.find((x) => x.id === id)}
          {#if r}<li><strong>{r.company}</strong> <span>{c.experience[id]?.title}</span></li>{/if}
        {/each}
      </ul>
    {:else if !stat.sideIds.length}
      <p class="note">{c.ui.skills.noRoles}</p>
    {/if}
    {#if stat.sideIds.length}
      <p class="used">{c.ui.skills.sideIn}</p>
      <ul>
        {#each stat.sideIds as id (id)}
          {@const p = sideProjects.find((x) => x.id === id)}
          {#if p}<li><strong>{p.name}</strong> <span>{c.sideProjects[id]?.tagline}</span></li>{/if}
        {/each}
      </ul>
    {/if}
    <p class="foot">{c.ui.skills.proficiencyNote}</p>
  {/if}
</div>

<style>
  .pop {
    position: fixed;
    z-index: 60;
    width: var(--w);
    max-width: calc(100vw - 24px);
    padding: 1.1rem 1.2rem;
    display: grid;
    gap: 0.8rem;
    background: color-mix(in srgb, var(--bg-2) 92%, transparent);
    animation: pop-in 0.25s var(--ease);
    outline: none;
    font-size: 0.95rem;
    line-height: 1.5;
  }
  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.94) translateY(6px);
    }
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: start;
  }
  h3 {
    margin-bottom: 0.3rem;
  }
  .x {
    border: 0;
    background: var(--surface);
    width: 30px;
    height: 30px;
    border-radius: 10px;
    display: grid;
    place-items: center;
  }
  dl {
    margin: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }
  dt {
    color: var(--muted);
    font-size: 0.8rem;
  }
  dd {
    margin: 0;
    font-weight: 600;
  }
  .meter {
    height: 6px;
    border-radius: 6px;
    background: var(--surface-2);
    overflow: hidden;
  }
  .meter span {
    display: block;
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--accent), var(--accent-2));
    transform-origin: left;
    animation: grow 0.7s var(--ease);
  }
  @keyframes grow {
    from {
      transform: scaleX(0);
    }
  }
  .used,
  .note,
  .foot,
  .lvl {
    color: var(--muted);
    font-size: 0.85rem;
  }
  .lvl {
    color: var(--text);
    font-size: 1rem;
  }
  ul {
    display: grid;
    gap: 0.3rem;
    max-height: 9rem;
    overflow: auto;
  }
  li span {
    color: var(--muted);
  }
  .foot {
    font-size: 0.78rem;
  }
</style>

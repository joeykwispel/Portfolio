<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { categoryOrder, getContent } from '$lib/data';
  import type { CategoryId } from '$lib/data';
  import { careerMonths, type SkillStat } from '$lib/utils/derive';
  import { fmtDuration } from '$lib/utils/dates';
  import RadarChart from '../charts/RadarChart.svelte';

  let { stats }: { stats: SkillStat[] } = $props();
  const c = $derived(getContent(app.locale));
  const cats = categoryOrder.filter((x) => x !== 'languages');
  let cat = $state<CategoryId>('frontend');
  const AXES = 6;
  const career = careerMonths() || 1;

  const top = $derived(
    stats
      .filter((s) => s.category === cat)
      .sort((a, b) => b.months - a.months || a.name.localeCompare(b.name))
      .slice(0, AXES)
  );
  const labels = $derived(Array.from({ length: AXES }, (_, i) => (top[i] ? (c.skillLabels[top[i].name] ?? top[i].name) : '')));
  const values = $derived(Array.from({ length: AXES }, (_, i) => (top[i] ? Math.min(100, Math.round((top[i].months / career) * 100)) : 0)));
  const tips = $derived(
    Array.from({ length: AXES }, (_, i) => ({
      text: top[i] ? (c.skillLabels[top[i].name] ?? top[i].name) : c.ui.skills.axisEmpty,
      sub: top[i] ? fmtDuration(top[i].months, c.ui.units) : ''
    }))
  );
</script>

<div class="play glass">
  <div class="copy">
    <h3>{c.ui.skills.playgroundTitle}</h3>
    <p>{c.ui.skills.playgroundIntro}</p>
    <div class="tabs" role="group" aria-label={c.ui.skills.playgroundTitle}>
      {#each cats as k (k)}
        <button type="button" class="tab" aria-pressed={cat === k} onclick={() => (cat = k)}>{c.categories[k]}</button>
      {/each}
    </div>
  </div>
  <div class="chart">
    <RadarChart {labels} {values} {tips} label={`${c.ui.skills.playgroundTitle}: ${c.categories[cat]}`} animateOnView={false} />
  </div>
</div>

<style>
  .play {
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: 1.5rem;
    padding: clamp(1.2rem, 3vw, 2rem);
    align-items: center;
  }
  .copy {
    display: grid;
    gap: 1rem;
  }
  .copy p {
    color: var(--muted);
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .tab {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 999px;
    padding: 0.35rem 0.9rem;
    font-size: 0.92rem;
    transition: background 0.2s, transform 0.2s, border-color 0.2s;
  }
  .tab:hover {
    background: var(--surface-2);
  }
  .tab:active {
    transform: scale(0.95);
  }
  .tab[aria-pressed='true'] {
    background: var(--accent);
    color: var(--accent-ink);
    border-color: transparent;
    font-weight: 600;
  }
  @media (max-width: 860px) {
    .play {
      grid-template-columns: 1fr;
    }
  }
</style>

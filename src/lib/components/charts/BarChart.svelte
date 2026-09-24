<script lang="ts">
  import { inView } from '$lib/utils/actions';
  import ChartTip from '../ui/ChartTip.svelte';

  let { items, label = '' }: { items: { label: string; value: number; display: string; sub?: string }[]; label?: string } = $props();

  const ROW = 38;
  const LW = 170;
  const BW = 360;
  const max = $derived(Math.max(...items.map((i) => i.value), 1));
  let visible = $state(false);
  let host: HTMLDivElement;
  let tip = $state<{ x: number; y: number; i: number } | null>(null);
  function show(e: PointerEvent, i: number) {
    const r = host.getBoundingClientRect();
    tip = { x: e.clientX - r.left, y: e.clientY - r.top, i };
  }
</script>

<div class="wrap" bind:this={host} use:inView={(v) => (visible = v)}>
  <svg viewBox="0 0 600 {items.length * ROW + 8}" role="img" aria-label={label}>
    {#each items as it, i (it.label)}
      {@const y = i * ROW + 4}
      <g role="presentation" onpointermove={(e) => show(e, i)} onpointerleave={() => (tip = null)} class="row">
        <rect x="0" {y} width="600" height={ROW - 4} fill="transparent" />
        <text x={LW - 12} y={y + 20} text-anchor="end" class="lbl">{it.label}</text>
        <rect x={LW} y={y + 8} width={BW} height="14" rx="7" class="track" />
        <rect
          x={LW}
          y={y + 8}
          width={(BW * it.value) / max}
          height="14"
          rx="7"
          class="bar"
          class:on={visible}
          style="transition-delay:{i * 70}ms"
        />
        <text x={LW + BW + 12} y={y + 20} class="val">{it.display}</text>
      </g>
    {/each}
  </svg>
  {#if tip}
    <ChartTip x={tip.x} y={tip.y} text={items[tip.i].label} sub={items[tip.i].sub ?? items[tip.i].display} />
  {/if}
</div>

<style>
  .wrap {
    position: relative;
  }
  svg {
    width: 100%;
    height: auto;
  }
  .lbl {
    fill: var(--text);
    font-size: 13.5px;
  }
  .val {
    fill: var(--muted);
    font-size: 13px;
  }
  .track {
    fill: var(--surface-2);
  }
  .bar {
    fill: var(--accent);
    transform-box: fill-box;
    transform-origin: left center;
    transform: scaleX(0);
    transition: transform 1s var(--ease);
  }
  .bar.on {
    transform: scaleX(1);
  }
  .row:hover .bar {
    fill: var(--accent-2);
  }
</style>

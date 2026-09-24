<script lang="ts">
  import { inView } from '$lib/utils/actions';
  import ChartTip from '../ui/ChartTip.svelte';

  let { points, label = '' }: { points: { year: number; total: number; sub: string }[]; label?: string } = $props();

  const W = 600;
  const H = 300;
  const L = 40;
  const Rr = 20;
  const T = 20;
  const B = 34;
  const maxY = $derived(Math.max(10, Math.ceil(Math.max(...points.map((p) => p.total)) / 20) * 20));
  const x = (i: number) => L + (i * (W - L - Rr)) / Math.max(1, points.length - 1);
  const y = (v: number) => T + (1 - v / maxY) * (H - T - B);
  const line = $derived(points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.total).toFixed(1)}`).join(' '));
  const area = $derived(`${line} L${x(points.length - 1)},${H - B} L${x(0)},${H - B} Z`);
  const ticks = $derived([0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxY * f)));

  let visible = $state(false);
  let host: HTMLDivElement;
  let tip = $state<{ x: number; y: number; i: number } | null>(null);
  function show(e: PointerEvent, i: number) {
    const r = host.getBoundingClientRect();
    tip = { x: e.clientX - r.left, y: e.clientY - r.top, i };
  }
</script>

<div class="wrap" bind:this={host} use:inView={(v) => (visible = v)}>
  <svg viewBox="0 0 {W} {H}" role="img" aria-label={label}>
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.4" />
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0" />
      </linearGradient>
    </defs>
    {#each ticks as t}
      <line class="grid" x1={L} x2={W - Rr} y1={y(t)} y2={y(t)} />
      <text class="axis" x={L - 8} y={y(t) + 4} text-anchor="end">{t}</text>
    {/each}
    {#each points as p, i (p.year)}
      <text class="axis" x={x(i)} y={H - 10} text-anchor="middle">{p.year}</text>
    {/each}
    <path d={area} class="area" class:on={visible} fill="url(#areaGrad)" />
    <path d={line} class="line" class:on={visible} pathLength="1" />
    {#each points as p, i (p.year)}
      <circle class="dot" class:on={visible} cx={x(i)} cy={y(p.total)} r="5" style="transition-delay:{600 + i * 120}ms" />
      <circle class="hit" cx={x(i)} cy={y(p.total)} r="18" role="presentation" onpointermove={(e) => show(e, i)} onpointerleave={() => (tip = null)} />
    {/each}
  </svg>
  {#if tip}
    <ChartTip x={tip.x} y={tip.y} text="{points[tip.i].year}: {points[tip.i].total}" sub={points[tip.i].sub} />
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
  .grid {
    stroke: var(--border);
    stroke-dasharray: 3 5;
  }
  .axis {
    fill: var(--muted);
    font-size: 12px;
  }
  .line {
    fill: none;
    stroke: var(--accent);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.8s var(--ease);
  }
  .line.on {
    stroke-dashoffset: 0;
  }
  .area {
    opacity: 0;
    transition: opacity 1.2s ease 0.8s;
  }
  .area.on {
    opacity: 1;
  }
  .dot {
    fill: var(--accent-2);
    stroke: var(--bg);
    stroke-width: 2;
    opacity: 0;
    transition: opacity 0.4s;
  }
  .dot.on {
    opacity: 1;
  }
  .hit {
    fill: transparent;
    cursor: pointer;
  }
</style>

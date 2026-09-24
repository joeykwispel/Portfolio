<script lang="ts">
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { app } from '$lib/app.svelte';
  import { inView } from '$lib/utils/actions';
  import ChartTip from '../ui/ChartTip.svelte';

  interface Tip {
    text: string;
    sub?: string;
  }
  let {
    labels,
    values,
    tips = [],
    label = 'Radar chart',
    animateOnView = true
  }: { labels: string[]; values: number[]; tips?: Tip[]; label?: string; animateOnView?: boolean } = $props();

  const CX = 200;
  const CY = 200;
  const R = 130;
  const n = $derived(labels.length);
  let visible = $state(!animateOnView);
  const tween = new Tween<number[]>(Array(values.length).fill(0), { duration: 900, easing: cubicOut });

  $effect(() => {
    const target = values;
    if (visible) tween.set(target, app.reduced ? { duration: 0 } : undefined);
  });

  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, v: number): [number, number] => [CX + Math.cos(ang(i)) * ((R * v) / 100), CY + Math.sin(ang(i)) * ((R * v) / 100)];
  const poly = $derived(tween.current.map((v, i) => pt(i, v).join(',')).join(' '));

  let host: HTMLDivElement;
  let tip = $state<{ x: number; y: number; i: number } | null>(null);
  function show(e: PointerEvent, i: number) {
    const r = host.getBoundingClientRect();
    tip = { x: e.clientX - r.left, y: e.clientY - r.top, i };
  }
  const anchor = (i: number) => {
    const c = Math.cos(ang(i));
    return Math.abs(c) < 0.25 ? 'middle' : c > 0 ? 'start' : 'end';
  };
</script>

<div class="wrap" bind:this={host} use:inView={(v) => (visible = v)}>
  <svg viewBox="-100 -10 600 420" role="img" aria-label={label}>
    {#each [25, 50, 75, 100] as ring}
      <polygon class="ring" points={labels.map((_, i) => pt(i, ring).join(',')).join(' ')} />
    {/each}
    {#each labels as _, i}
      <line class="axis" x1={CX} y1={CY} x2={pt(i, 100)[0]} y2={pt(i, 100)[1]} />
    {/each}
    <polygon class="shape" points={poly} />
    {#each tween.current as v, i}
      {@const [x, y] = pt(i, v)}
      {#if labels[i]}
        <circle class="dot" cx={x} cy={y} r="5.5" role="presentation" onpointermove={(e) => show(e, i)} onpointerleave={() => (tip = null)} />
        <circle class="hit" cx={x} cy={y} r="16" role="presentation" onpointermove={(e) => show(e, i)} onpointerleave={() => (tip = null)} />
      {/if}
    {/each}
    {#each labels as l, i}
      {@const [lx, ly] = pt(i, 100)}
      <text x={lx + Math.cos(ang(i)) * 16} y={ly + Math.sin(ang(i)) * 16 + 4} text-anchor={anchor(i)} class="lbl">{l}</text>
    {/each}
  </svg>
  {#if tip && tips[tip.i]}
    <ChartTip x={tip.x} y={tip.y} text={tips[tip.i].text} sub={tips[tip.i].sub} />
  {/if}
</div>

<style>
  .wrap {
    position: relative;
  }
  svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .ring,
  .axis {
    fill: none;
    stroke: var(--border);
    stroke-width: 1;
  }
  .shape {
    fill: color-mix(in srgb, var(--accent) 24%, transparent);
    stroke: var(--accent);
    stroke-width: 2;
    stroke-linejoin: round;
  }
  .dot {
    fill: var(--accent-2);
    stroke: var(--bg);
    stroke-width: 2;
  }
  .hit {
    fill: transparent;
    cursor: pointer;
  }
  .lbl {
    fill: var(--muted);
    font-size: 13px;
  }
</style>

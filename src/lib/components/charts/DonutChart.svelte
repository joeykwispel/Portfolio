<script lang="ts">
  import { inView } from '$lib/utils/actions';
  import ChartTip from '../ui/ChartTip.svelte';

  let {
    items,
    centerValue,
    centerLabel,
    label = ''
  }: { items: { label: string; value: number; display: string }[]; centerValue: string; centerLabel: string; label?: string } = $props();

  const R = 78;
  const C = 2 * Math.PI * R;
  const total = $derived(items.reduce((a, b) => a + b.value, 0) || 1);
  const GAP = 2;
  const segs = $derived.by(() => {
    let acc = 0;
    return items.map((it, i) => {
      const len = Math.max(0, (it.value / total) * C - GAP);
      const seg = { ...it, len, offset: acc, color: `hsl(${(i * 41 + 160) % 360} 62% 62%)` };
      acc += (it.value / total) * C;
      return seg;
    });
  });

  let visible = $state(false);
  let hover = $state<number | null>(null);
  let host: HTMLDivElement;
  let tip = $state<{ x: number; y: number } | null>(null);
  function show(e: PointerEvent, i: number) {
    const r = host.getBoundingClientRect();
    hover = i;
    tip = { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function hide() {
    hover = null;
    tip = null;
  }
</script>

<div class="wrap" bind:this={host} use:inView={(v) => (visible = v)}>
  <svg viewBox="0 0 220 220" role="img" aria-label={label}>
    <g transform="rotate(-90 110 110)">
      {#each segs as s, i (s.label)}
        <circle
          cx="110"
          cy="110"
          r={R}
          fill="none"
          stroke={s.color}
          stroke-width={hover === i ? 34 : 28}
          stroke-dasharray={visible ? `${s.len} ${C - s.len}` : `0 ${C}`}
          stroke-dashoffset={-s.offset}
          class="seg"
          style="transition-delay:{visible && hover === null ? i * 90 : 0}ms"
          role="presentation"
          onpointermove={(e) => show(e, i)}
          onpointerleave={hide}
        />
      {/each}
    </g>
    <text x="110" y="108" text-anchor="middle" class="big">{hover !== null ? items[hover].display : centerValue}</text>
    <text x="110" y="128" text-anchor="middle" class="small">{hover !== null ? '' : centerLabel}</text>
  </svg>
  {#if tip && hover !== null}
    <ChartTip x={tip.x} y={tip.y} text={items[hover].label} sub={items[hover].display} />
  {/if}
  <ul class="legend">
    {#each segs as s, i (s.label)}
      <li class:on={hover === i}>
        <i style="background:{s.color}"></i>
        <span>{s.label}</span>
        <b>{s.display}</b>
      </li>
    {/each}
  </ul>
</div>

<style>
  .wrap {
    position: relative;
    display: grid;
    gap: 1rem;
    grid-template-columns: minmax(150px, 220px) 1fr;
    align-items: center;
  }
  svg {
    width: 100%;
    height: auto;
  }
  .seg {
    transition:
      stroke-dasharray 1s var(--ease),
      stroke-width 0.2s;
  }
  .big {
    fill: var(--text);
    font-size: 20px;
    font-weight: 700;
  }
  .small {
    fill: var(--muted);
    font-size: 10px;
  }
  .legend {
    display: grid;
    gap: 0.25rem;
    font-size: 0.86rem;
  }
  .legend li {
    display: grid;
    grid-template-columns: 12px 1fr auto;
    gap: 0.5rem;
    align-items: center;
    padding: 0.1rem 0.3rem;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .legend li.on {
    background: var(--surface-2);
  }
  .legend i {
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }
  .legend b {
    font-weight: 500;
    color: var(--muted);
  }
  @media (max-width: 520px) {
    .wrap {
      grid-template-columns: 1fr;
    }
    svg {
      max-width: 220px;
      margin-inline: auto;
    }
  }
</style>

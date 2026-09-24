<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { app } from '$lib/app.svelte';
  import { getContent } from '$lib/data';

  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let pos = 0;
  let canvas: HTMLCanvasElement;
  let toast = $state(false);
  const ui = $derived(getContent(app.locale).ui);

  function burst() {
    toast = true;
    setTimeout(() => (toast = false), 3500);
    document.body.classList.add('party');
    setTimeout(() => document.body.classList.remove('party'), 6000);
    if (app.reduced) return;
    const ctx = canvas.getContext('2d')!;
    const w = (canvas.width = innerWidth);
    const h = (canvas.height = innerHeight);
    const colors = ['#7dd3c0', '#b49cff', '#ffd166', '#ff8fab', '#7ab8ff'];
    const parts = Array.from({ length: 160 }, () => ({
      x: w / 2,
      y: h * 0.6,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 16 - 4,
      s: 4 + Math.random() * 6,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[(Math.random() * colors.length) | 0]
    }));
    let frames = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        ctx.restore();
      }
      if (++frames < 200) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, w, h);
    };
    tick();
  }

  $effect(() => {
    if (app.party) untrack(burst);
  });

  onMount(() => {
    const key = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === code[pos]) {
        pos++;
        if (pos === code.length) {
          pos = 0;
          app.party++;
        }
      } else pos = k === code[0] ? 1 : 0;
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  });
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>
{#if toast}
  <div class="toast glass" role="status">{ui.easter}</div>
{/if}

<style>
  canvas {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 90;
  }
  .toast {
    position: fixed;
    left: 50%;
    bottom: 2rem;
    translate: -50% 0;
    z-index: 95;
    padding: 0.7rem 1.2rem;
    font-weight: 600;
    animation: fade-up 0.4s var(--ease);
  }
</style>

<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';

  let el = $state<HTMLDivElement>();
  let enabled = $state(false);

  onMount(() => {
    enabled = matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!enabled) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          if (el) el.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
        });
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  });
</script>

{#if enabled && !app.reduced}
  <div class="glow" bind:this={el} aria-hidden="true"></div>
{/if}

<style>
  .glow {
    position: fixed;
    left: 0;
    top: 0;
    width: 400px;
    height: 400px;
    z-index: 0;
    pointer-events: none;
    border-radius: 50%;
    background: radial-gradient(circle, var(--glow), transparent 65%);
    will-change: transform;
    opacity: 0.7;
  }
</style>

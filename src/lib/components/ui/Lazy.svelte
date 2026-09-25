<script lang="ts">
  import { onMount } from 'svelte';
  import type { Component } from 'svelte';
  import { app } from '$lib/app.svelte';

  let { id, loader, minHeight = '60vh' }: { id: string; loader: () => Promise<{ default: Component<any> }>; minHeight?: string } = $props();

  let Comp = $state<Component<any> | null>(null);
  let started = false;
  let el: HTMLElement;

  function load() {
    if (started) return;
    started = true;
    loader().then((m) => (Comp = m.default));
  }

  // A jump to a #section loads everything at once, so the page stops changing height (see utils/scroll.ts).
  $effect(() => {
    if (app.eager) load();
  });

  onMount(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: '700px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<div {id} data-section data-lazy data-loaded={Comp ? '' : undefined} bind:this={el} style:min-height={Comp ? undefined : minHeight}>
  {#if Comp}
    <Comp />
  {/if}
</div>

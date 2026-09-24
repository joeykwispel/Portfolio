<script lang="ts">
  import { onMount } from 'svelte';
  import type { Component } from 'svelte';

  let { id, loader, minHeight = '60vh' }: { id: string; loader: () => Promise<{ default: Component<any> }>; minHeight?: string } = $props();

  let Comp = $state<Component<any> | null>(null);
  let el: HTMLElement;

  onMount(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          loader().then((m) => (Comp = m.default));
        }
      },
      { rootMargin: '700px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<div {id} data-section bind:this={el} style:min-height={Comp ? undefined : minHeight}>
  {#if Comp}
    <Comp />
  {/if}
</div>

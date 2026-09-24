<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { app } from '$lib/app.svelte';
  import { getContent, testimonials } from '$lib/data';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  let i = $state(0);
  let hovering = $state(false);
  let paused = $state(false);
  const count = testimonials.length;
  const go = (d: number) => (i = (i + d + count) % count);

  onMount(() => {
    const id = setInterval(() => {
      if (!hovering && !paused && !app.reduced && count > 1) go(1);
    }, 6000);
    return () => clearInterval(id);
  });
</script>

<section class="section">
  <div class="container">
    <SectionHead num="06" slug="recommendations" title={c.ui.testimonials.title} />
    <div class="carousel glass" role="region" aria-roledescription="carousel" aria-label={c.ui.testimonials.title} onpointerenter={() => (hovering = true)} onpointerleave={() => (hovering = false)} onfocusin={() => (hovering = true)} onfocusout={() => (hovering = false)}>
      {#key i}
        <figure in:fade={{ duration: app.reduced ? 0 : 300 }}>
          <blockquote>{testimonials[i].quote[app.locale]}</blockquote>
          <figcaption><strong>{testimonials[i].author}</strong> {testimonials[i].role}</figcaption>
        </figure>
      {/key}
      {#if count > 1}
        <div class="ctrl">
          <button type="button" onclick={() => go(-1)}>{c.ui.testimonials.prev}</button>
          <button type="button" onclick={() => (paused = !paused)}>{paused ? c.ui.testimonials.play : c.ui.testimonials.pause}</button>
          <button type="button" onclick={() => go(1)}>{c.ui.testimonials.next}</button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .carousel {
    padding: clamp(1.5rem, 4vw, 3rem);
    display: grid;
    gap: 1.5rem;
  }
  blockquote {
    margin: 0 0 1rem;
    font-size: clamp(1.15rem, 2.4vw, 1.5rem);
    line-height: 1.5;
  }
  figcaption {
    color: var(--muted);
  }
  .ctrl {
    display: flex;
    gap: 0.6rem;
  }
  .ctrl button {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 999px;
    padding: 0.4rem 1rem;
  }
</style>

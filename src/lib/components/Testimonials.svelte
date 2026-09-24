<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { app } from '$lib/app.svelte';
  import { getContent, testimonials } from '$lib/data';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  let i = $state(0);
  let hovering = $state(false);
  let paused = $state(false);
  const count = testimonials.length;
  const go = (d: number) => (i = (i + d + count) % count);
  const t = $derived(testimonials[i]);
  const initials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2);
  const date = $derived(new Date(t.date).toLocaleDateString(app.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));

  onMount(() => {
    const id = setInterval(() => {
      if (!hovering && !paused && !app.reduced && count > 1) go(1);
    }, 7000);
    return () => clearInterval(id);
  });
</script>

<section class="section">
  <div class="container">
    <SectionHead num="07" slug="recommendations" title={c.ui.testimonials.title} />
    <div
      class="card glass ring"
      role="region"
      aria-roledescription={count > 1 ? 'carousel' : undefined}
      aria-label={c.ui.testimonials.title}
      use:reveal
      onpointerenter={() => (hovering = true)}
      onpointerleave={() => (hovering = false)}
      onfocusin={() => (hovering = true)}
      onfocusout={() => (hovering = false)}
    >
      <div class="chrome mono" aria-hidden="true">
        <span class="dots"><i></i><i></i><i></i></span>
        <span>recommendation.md</span>
        {#if t.source}<span class="src">via {t.source}</span>{/if}
      </div>
      {#key i}
        <figure in:fade={{ duration: app.reduced ? 0 : 300 }}>
          <span class="mark mono" aria-hidden="true">&ldquo;</span>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span class="avatar mono" aria-hidden="true">{initials(t.author)}</span>
            <span class="who">
              <strong>{t.author}</strong>
              <span class="role">{t.role}</span>
              <span class="ctx mono"><span class="com">// </span>{t.context[app.locale]} · <time datetime={t.date}>{date}</time></span>
            </span>
          </figcaption>
        </figure>
      {/key}
      {#if count > 1}
        <div class="ctrl mono">
          <button type="button" onclick={() => go(-1)}>{c.ui.testimonials.prev}</button>
          <button type="button" onclick={() => (paused = !paused)}>{paused ? c.ui.testimonials.play : c.ui.testimonials.pause}</button>
          <button type="button" onclick={() => go(1)}>{c.ui.testimonials.next}</button>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .card {
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.5rem 1rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .src {
    margin-left: auto;
    color: var(--accent-text);
  }
  .dots {
    display: flex;
    gap: 5px;
  }
  .dots i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ff5f57;
  }
  .dots i:nth-child(2) {
    background: #febc2e;
  }
  .dots i:nth-child(3) {
    background: #28c840;
  }
  figure {
    position: relative;
    margin: 0;
    padding: clamp(1.25rem, 3.5vw, 2.25rem);
    padding-top: clamp(1.75rem, 4vw, 2.5rem);
    display: grid;
    gap: 1.25rem;
  }
  .mark {
    position: absolute;
    top: -0.1em;
    left: 0.25em;
    font-size: clamp(5rem, 12vw, 8rem);
    line-height: 1;
    font-weight: 800;
    background: linear-gradient(135deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    opacity: 0.35;
    pointer-events: none;
  }
  blockquote {
    position: relative;
    margin: 0;
    font-size: clamp(1rem, 1.9vw, 1.2rem);
    line-height: 1.65;
    max-width: 75ch;
  }
  figcaption {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding-top: 1rem;
    border-top: 1px dashed var(--border);
  }
  .avatar {
    flex: none;
    width: 46px;
    height: 46px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    font-weight: 800;
    color: var(--accent-text);
    border: 1px solid var(--border);
    background: conic-gradient(from var(--angle), color-mix(in srgb, var(--accent) 25%, transparent), color-mix(in srgb, var(--accent-2) 25%, transparent), color-mix(in srgb, var(--accent) 25%, transparent));
    animation: spin-angle 6s linear infinite;
  }
  .who {
    display: grid;
    gap: 0.1rem;
    line-height: 1.35;
  }
  .role {
    color: var(--muted);
    font-size: 0.85rem;
  }
  .ctx {
    color: var(--muted);
    font-size: 0.72rem;
  }
  .ctrl {
    display: flex;
    gap: 0.5rem;
    padding: 0 clamp(1.25rem, 3.5vw, 2.25rem) 1.25rem;
  }
  .ctrl button {
    border: 1px solid var(--border);
    background: var(--surface);
    border-radius: 8px;
    padding: 0.3rem 0.8rem;
    font-size: 0.78rem;
  }
</style>

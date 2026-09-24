<script lang="ts">
  import { onMount } from 'svelte';
  import { app } from '$lib/app.svelte';
  import { education, getContent, roles } from '$lib/data';
  import { buildTimeline } from '$lib/utils/derive';
  import { fmtDuration, fmtMonth, monthsInRange } from '$lib/utils/dates';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  const items = buildTimeline();
  const PREVIEW = 6;
  let open = $state<Record<string, boolean>>({});
  let list: HTMLElement;
  let progress = $state(0);

  onMount(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = list.getBoundingClientRect();
      progress = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  });
</script>

<section class="section">
  <div class="container">
    <SectionHead title={c.ui.timeline.title} intro={c.ui.timeline.intro} />

    <ol class="timeline" bind:this={list} style="--p:{app.reduced ? 1 : progress}">
      <div class="rail" aria-hidden="true"><span></span></div>

      {#each items as it, i (it.key)}
        {@const role = it.roleId ? roles.find((r) => r.id === it.roleId) : null}
        {@const edu = it.eduId ? education.find((e) => e.id === it.eduId) : null}
        <li class="item {it.type}" class:right={i % 2 === 1} use:reveal>
          <span class="node" aria-hidden="true"></span>

          {#if role}
            {@const t = c.experience[role.id]}
            {@const hasMore = t.bullets.length > 0 || role.stack.length > PREVIEW}
            <article class="card glass">
              <header>
                <div>
                  <h3>{role.company}</h3>
                  <p class="role">{t.title}{#if role.via}<span class="via">, {c.ui.timeline.via} {role.via}</span>{/if}</p>
                </div>
                <p class="meta">
                  <time datetime={role.start}>{fmtMonth(role.start, app.locale)}</time> to
                  {#if role.end}<time datetime={role.end}>{fmtMonth(role.end, app.locale)}</time>{:else}{c.ui.timeline.present}{/if}
                  <span>{fmtDuration(monthsInRange(role), c.ui.units)}{#if role.location} · {role.location}{/if}</span>
                </p>
              </header>
              <p class="summary">{t.summary}</p>

              {#if role.stack.length}
                <ul class="tags" aria-label={c.ui.timeline.stack}>
                  {#each role.stack.slice(0, PREVIEW) as s (s)}<li class="tag">{c.skillLabels[s] ?? s}</li>{/each}
                </ul>
              {/if}

              {#if hasMore}
                <div class="more" class:open={open[role.id]} id="more-{role.id}">
                  <div class="more-inner">
                    {#if t.bullets.length}
                      <ul class="bullets">
                        {#each t.bullets as b}<li>{b}</li>{/each}
                      </ul>
                    {/if}
                    {#if role.stack.length > PREVIEW}
                      <ul class="tags" aria-label={c.ui.timeline.stack}>
                        {#each role.stack.slice(PREVIEW) as s (s)}<li class="tag">{c.skillLabels[s] ?? s}</li>{/each}
                      </ul>
                    {/if}
                  </div>
                </div>
                <button type="button" class="toggle" aria-expanded={!!open[role.id]} aria-controls="more-{role.id}" onclick={() => (open[role.id] = !open[role.id])}>
                  {open[role.id] ? c.ui.timeline.collapse : c.ui.timeline.expand}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class:flip={open[role.id]}><path d="M6 9l6 6 6-6" /></svg>
                </button>
              {/if}
            </article>
          {:else if edu}
            <article class="card glass edu">
              <header>
                <div>
                  <p class="kind">{edu.kind === 'education' ? c.ui.timeline.education : c.ui.timeline.training}</p>
                  <h3>{edu.kind === 'education' ? c.education.mbo.title : c.education.trainingTitle}</h3>
                  {#if edu.institution}<p class="role">{edu.institution}</p>{/if}
                </div>
                <p class="meta">{edu.startYear === edu.endYear ? edu.startYear : `${edu.startYear} to ${edu.endYear}`}</p>
              </header>
              {#if edu.kind === 'education'}
                <p class="summary">{c.education.mbo.detail}</p>
              {:else}
                <ul class="courses">
                  {#each edu.courses ?? [] as course}<li>{course}</li>{/each}
                </ul>
              {/if}
            </article>
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .timeline {
    position: relative;
    display: grid;
    gap: 2rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }
  .rail {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
    margin-left: -1px;
    background: var(--border);
  }
  .rail span {
    display: block;
    height: 100%;
    background: linear-gradient(var(--accent), var(--accent-2));
    transform: scaleY(var(--p));
    transform-origin: top;
    box-shadow: 0 0 14px var(--glow);
  }
  .item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 3.5rem;
  }
  .item .card {
    grid-column: 1;
  }
  .item.right .card {
    grid-column: 2;
  }
  .node {
    position: absolute;
    left: 50%;
    top: 1.6rem;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-radius: 50%;
    background: var(--bg);
    border: 3px solid var(--accent);
    box-shadow: 0 0 0 4px var(--glow);
    z-index: 1;
  }
  .item.education .node,
  .item.certification .node {
    border-radius: 4px;
    rotate: 45deg;
    border-color: var(--accent-2);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent-2) 25%, transparent);
  }
  .item.certification .node {
    width: 12px;
    height: 12px;
    margin-left: -6px;
    background: var(--accent-2);
  }
  .item.other .node {
    border-color: var(--muted);
    box-shadow: none;
  }
  .card {
    padding: 1.4rem 1.5rem;
    display: grid;
    gap: 0.8rem;
    align-content: start;
  }
  .card.edu {
    border-style: dashed;
    border-color: color-mix(in srgb, var(--accent-2) 50%, var(--border));
  }
  header {
    display: grid;
    gap: 0.4rem;
  }
  .role {
    color: var(--text);
    font-weight: 500;
  }
  .via,
  .kind {
    color: var(--muted);
    font-weight: 400;
    font-size: 0.9rem;
  }
  .kind {
    color: var(--accent-2-text);
  }
  .meta {
    color: var(--muted);
    font-size: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .meta span {
    flex-basis: 100%;
  }
  .summary {
    color: var(--muted);
    font-size: 0.98rem;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .more {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.45s var(--ease);
  }
  .more.open {
    grid-template-rows: 1fr;
  }
  .more-inner {
    overflow: hidden;
    display: grid;
    gap: 0.8rem;
  }
  .bullets {
    display: grid;
    gap: 0.5rem;
    font-size: 0.96rem;
    padding-top: 0.3rem;
  }
  .bullets li {
    position: relative;
    padding-left: 1.1rem;
  }
  .bullets li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65em;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
  }
  .courses {
    display: grid;
    gap: 0.35rem;
  }
  .courses li::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 0.6rem;
    border-radius: 2px;
    background: var(--accent-2);
    vertical-align: middle;
  }
  .toggle {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 0;
    background: none;
    color: var(--accent-text);
    font-weight: 600;
    padding: 0.2rem 0;
  }
  .toggle svg {
    transition: rotate 0.3s var(--ease);
  }
  .toggle svg.flip {
    rotate: 180deg;
  }

  @media (max-width: 860px) {
    .rail {
      left: 8px;
    }
    .node {
      left: 8px;
    }
    .item {
      grid-template-columns: 1fr;
      padding-left: 2.3rem;
    }
    .item .card,
    .item.right .card {
      grid-column: 1;
    }
  }
</style>

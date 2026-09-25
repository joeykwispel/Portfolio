<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { caseStudyFor, getContent, liveSideProjects, projects, roles, sideProjectHref } from '$lib/data';
  import type { ProjectBase, SideProject } from '$lib/data';
  import { fmtMonth } from '$lib/utils/dates';
  import { reveal, tilt } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  // Projects with a case study come first and get a bigger card.
  const featured = projects.filter((p) => caseStudyFor(p.id));
  const rest = projects.filter((p) => !caseStudyFor(p.id));
  const STACK_SHOWN = 8;
  /** File name in each side project card's window bar, after the language it is written in. */
  const FILE_EXT: Record<string, string> = { devcity: '.tsx', codeguessr: '.ts', portfolio: '.svelte' };
</script>

{#snippet card(p: ProjectBase, i: number, big: boolean)}
  {@const role = roles.find((r) => r.id === p.roleId)}
  {@const txt = c.projects[p.id]}
  {@const cs = caseStudyFor(p.id)}
  <li use:reveal={{ delay: (i % 3) * 90 }}>
    <article class="card glass ring" class:big use:tilt={big ? 3 : 7}>
      <div class="chrome mono" aria-hidden="true">
        <span class="dots"><i></i><i></i><i></i></span><span class="file">~/projects/<b>{p.id}</b>{big ? '.md' : '.tsx'}</span>
      </div>
      <div class="row">
        <span class="tag">{txt.sector}</span>
        {#if role}<span class="when"
            >{fmtMonth(role.start, app.locale)} {c.ui.timeline.to} {role.end ? fmtMonth(role.end, app.locale) : c.ui.timeline.present}</span
          >{/if}
      </div>
      <h3>{p.name}</h3>
      {#if cs}<p class="teaser">{c.caseStudies[cs.slug].teaser}</p>{/if}
      <p class="desc">{txt.description}</p>
      {#if role}<p class="by">{role.company}, {c.experience[role.id]?.title}</p>{/if}
      <ul class="tags">
        {#each p.tags as t (t)}<li class="tag">{c.skillLabels[t] ?? t}</li>{/each}
      </ul>
      <div class="actions">
        {#if cs}
          <a class="btn btn-primary cs" href={app.href(`/work/${cs.slug}/`)}
            >{c.ui.projects.caseStudy}{#if cs.status === 'draft'}<span class="draft mono">draft</span>{/if}</a
          >
        {/if}
        {#if p.link}
          <a class="link" href={p.link} target="_blank" rel="noopener noreferrer">{c.ui.projects.visit} <span aria-hidden="true">↗</span></a>
        {:else}
          <span class="ph">[{c.ui.projects.linkPlaceholder}]</span>
        {/if}
      </div>
    </article>
  </li>
{/snippet}

{#snippet side(p: SideProject, i: number)}
  {@const txt = c.sideProjects[p.id]}
  {@const isHere = p.id === 'portfolio'}
  <li use:reveal={{ delay: (i % 3) * 90 }}>
    <article class="card glass ring big own" use:tilt={3}>
      <div class="chrome mono" aria-hidden="true">
        <span class="dots"><i></i><i></i><i></i></span><span class="file">~/side/<b>{p.id}</b>{FILE_EXT[p.id] ?? '.ts'}</span>
      </div>
      <div class="row">
        <span class="tag side-tag">{c.ui.projects.sideTag}</span>
        <span class="when">{p.url.replace('https://', '')}</span>
      </div>
      <h3>{p.name}</h3>
      <p class="desc">{txt.description}</p>
      <ul class="tags">
        {#each p.stack.slice(0, STACK_SHOWN) as t (t)}<li class="tag">{c.skillLabels[t] ?? t}</li>{/each}
        {#if p.stack.length > STACK_SHOWN}<li class="tag more">+{p.stack.length - STACK_SHOWN}</li>{/if}
      </ul>
      {#if p.links?.length}
        <p class="by">{c.ui.projects.jump}</p>
        <ul class="layers">
          {#each p.links as l (l.id)}
            <li>
              <a class="layer mono" href={sideProjectHref(p, app.locale, l.path)} target="_blank" rel="noopener noreferrer"
                >{txt.links?.[l.id]} <span aria-hidden="true">↗</span></a
              >
            </li>
          {/each}
        </ul>
      {/if}
      <div class="actions">
        {#if isHere}
          <span class="here mono">{c.ui.projects.here}</span>
        {:else}
          <a class="btn btn-primary cs" href={sideProjectHref(p, app.locale)} target="_blank" rel="noopener noreferrer"
            >{c.ui.projects.open} {p.name} <span aria-hidden="true">↗</span></a
          >
        {/if}
        {#if p.repo}
          <a class="link" href={p.repo} target="_blank" rel="noopener noreferrer">{c.ui.projects.source} <span aria-hidden="true">↗</span></a>
        {/if}
      </div>
    </article>
  </li>
{/snippet}

<section class="section">
  <div class="container">
    <SectionHead section="projects" slug="projects" title={c.ui.projects.title} intro={c.ui.projects.intro} />

    <div class="group-head">
      <h3 class="group mono">{c.ui.projects.own}</h3>
      <p>{c.ui.projects.ownIntro}</p>
    </div>
    <ul class="grid">
      {#each liveSideProjects as p, i (p.id)}{@render side(p, i)}{/each}
    </ul>

    <div class="group-head">
      <h3 class="group mono">{c.ui.projects.clients}</h3>
    </div>
    {#if featured.length}
      <ul class="grid featured">
        {#each featured as p, i (p.id)}{@render card(p, i, true)}{/each}
      </ul>
    {/if}
    {#if rest.length}
      <ul class="grid">
        {#each rest as p, i (p.id)}{@render card(p, i, false)}{/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  .grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
  .grid > li {
    display: grid;
  }
  .grid + .grid {
    margin-top: 1rem;
  }
  .featured {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .big {
    padding-bottom: 1.4rem;
  }
  .group-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.3rem 0.9rem;
    margin: 0 0 0.9rem;
  }
  .grid + .group-head {
    margin-top: 2.2rem;
  }
  .group {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent);
  }
  .group-head p {
    color: var(--muted);
    font-size: 0.88rem;
  }
  .own {
    border-color: color-mix(in srgb, var(--accent) 30%, var(--border));
  }
  .side-tag {
    color: var(--accent);
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  }
  .more {
    color: var(--muted);
  }
  .here {
    font-size: 0.85rem;
    color: var(--muted);
  }
  .layers {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .layer {
    display: inline-block;
    padding: 0.4rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    font-size: 0.8rem;
    font-weight: 600;
    text-decoration: none;
    transition:
      border-color 0.2s,
      background 0.2s;
  }
  .layer:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
    background: var(--surface-2);
  }
  .big h3 {
    font-size: 1.3rem;
  }
  .teaser {
    font-size: 1.02rem;
    color: var(--text);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem 1.1rem;
    margin-top: 0.3rem;
  }
  .cs {
    font-size: 0.88rem;
  }
  .draft {
    margin-left: 0.5rem;
    font-size: 0.65rem;
    padding: 0.05rem 0.4rem;
    border-radius: 5px;
    background: var(--accent-ink);
    color: var(--accent-2-text);
  }
  .card {
    --mx: 50%;
    --my: 0%;
    position: relative;
    padding: 0 1.2rem 1.2rem;
    display: grid;
    gap: 0.6rem;
    align-content: start;
    transition:
      transform 0.25s ease-out,
      border-color 0.3s;
    will-change: transform;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(320px circle at var(--mx) var(--my), var(--glow), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }
  .card:hover {
    border-color: color-mix(in srgb, var(--accent) 45%, var(--border));
  }
  .card:hover::before {
    opacity: 1;
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0 -1.2rem 0.3rem;
    padding: 0.45rem 0.9rem;
    font-size: 0.68rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chrome b {
    color: var(--text);
    font-weight: 600;
  }
  .dots {
    display: flex;
    gap: 5px;
    flex: none;
  }
  .dots i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
    transition: background 0.3s;
  }
  .card:hover .dots i:nth-child(1) {
    background: #ff5f57;
  }
  .card:hover .dots i:nth-child(2) {
    background: #febc2e;
  }
  .card:hover .dots i:nth-child(3) {
    background: #28c840;
  }
  h3 {
    font-family: var(--mono);
    font-size: 1.05rem;
    letter-spacing: -0.03em;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
  .when,
  .by {
    color: var(--muted);
    font-size: 0.78rem;
  }
  .when {
    font-family: var(--mono);
  }
  .desc {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .link {
    font-family: var(--mono);
    font-size: 0.85rem;
    font-weight: 600;
  }
  .ph {
    font-family: var(--mono);
    font-size: 0.75rem;
    color: var(--accent-2-text);
  }
  @media (max-width: 980px) {
    .grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 640px) {
    .grid,
    .featured {
      grid-template-columns: 1fr;
    }
  }
</style>

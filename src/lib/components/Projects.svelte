<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, projects, roles } from '$lib/data';
  import { fmtMonth } from '$lib/utils/dates';
  import { reveal, tilt } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
</script>

<section class="section">
  <div class="container">
    <SectionHead num="05" slug="projects" title={c.ui.projects.title} intro={c.ui.projects.intro} />
    <ul class="grid">
      {#each projects as p, i (p.id)}
        {@const role = roles.find((r) => r.id === p.roleId)}
        {@const txt = c.projects[p.id]}
        <li use:reveal={{ delay: (i % 3) * 90 }}>
          <article class="card glass ring" use:tilt={7}>
            <div class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span><span class="file">~/projects/<b>{p.id}</b>.tsx</span></div>
            <div class="row">
              <span class="tag">{txt.sector}</span>
              {#if role}<span class="when">{fmtMonth(role.start, app.locale)} to {role.end ? fmtMonth(role.end, app.locale) : c.ui.timeline.present}</span>{/if}
            </div>
            <h3>{p.name}</h3>
            <p class="desc">{txt.description}</p>
            {#if role}<p class="by">{role.company}, {c.experience[role.id]?.title}</p>{/if}
            <ul class="tags">
              {#each p.tags as t (t)}<li class="tag">{c.skillLabels[t] ?? t}</li>{/each}
            </ul>
            {#if p.link}
              <a class="link" href={p.link} target="_blank" rel="noopener noreferrer">{c.ui.projects.visit}</a>
            {:else}
              <span class="ph">[{c.ui.projects.linkPlaceholder}]</span>
            {/if}
          </article>
        </li>
      {/each}
    </ul>
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
  .card {
    --mx: 50%;
    --my: 0%;
    position: relative;
    padding: 0 1.2rem 1.2rem;
    display: grid;
    gap: 0.6rem;
    align-content: start;
    transition: transform 0.25s ease-out, border-color 0.3s;
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
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>

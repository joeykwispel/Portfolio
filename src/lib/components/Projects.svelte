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
    <SectionHead title={c.ui.projects.title} intro={c.ui.projects.intro} />
    <ul class="grid">
      {#each projects as p, i (p.id)}
        {@const role = roles.find((r) => r.id === p.roleId)}
        {@const txt = c.projects[p.id]}
        <li use:reveal={{ delay: (i % 3) * 90 }}>
          <article class="card glass" use:tilt={7}>
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
    gap: 1.25rem;
  }
  .grid > li {
    display: grid;
  }
  .card {
    --mx: 50%;
    --my: 0%;
    position: relative;
    padding: 1.5rem;
    display: grid;
    gap: 0.8rem;
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
    font-size: 0.85rem;
  }
  .desc {
    color: var(--muted);
    font-size: 0.97rem;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .link {
    font-weight: 600;
  }
  .ph {
    font-size: 0.85rem;
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

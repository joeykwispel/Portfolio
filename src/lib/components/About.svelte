<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, person, projects, skills, spokenLanguages } from '$lib/data';
  import { careerMonths, employerCount } from '$lib/utils/derive';
  import { countUp, reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  const years = Math.floor(careerMonths() / 12);
  const stats = $derived([
    { label: c.ui.about.stats.years, to: years, suffix: '+' },
    { label: c.ui.about.stats.tech, to: skills.filter((s) => s.category !== 'languages').length, suffix: '' },
    { label: c.ui.about.stats.projects, to: projects.length, suffix: '' },
    { label: c.ui.about.stats.clients, to: employerCount(), suffix: '' }
  ]);
</script>

<section id="about" data-section class="section">
  <div class="container">
    <SectionHead title={c.ui.about.title} />

    <div class="grid">
      <div class="bio" use:reveal>
        <div class="avatar glass" aria-hidden="true">
          {#if person.photo}
            <img src={person.photo} alt="" width="120" height="120" />
          {:else}
            <span>JO</span>
          {/if}
        </div>
        {#each c.profile.bio as para}
          <p>{para}</p>
        {/each}
      </div>

      <div class="facts glass" use:reveal={{ delay: 120 }}>
        <h3>{c.ui.about.factsTitle}</h3>
        <dl>
          {#each c.profile.facts as f}
            <div>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          {/each}
          <div>
            <dt>{c.ui.about.languages}</dt>
            <dd>{spokenLanguages.map((l) => `${c.languages[l.id as 'Dutch' | 'English'].name} (${c.languages[l.id as 'Dutch' | 'English'].level.toLowerCase()})`).join(', ')}</dd>
          </div>
        </dl>
      </div>
    </div>

    <ul class="stats">
      {#each stats as s, i (i)}
        <li class="glass" use:reveal={{ delay: i * 90 }}>
          <span class="num"><span use:countUp={{ to: s.to }}>{s.to}</span>{s.suffix}</span>
          <span class="lbl">{s.label}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1.3fr 1fr;
  }
  .bio {
    display: grid;
    gap: 1.1rem;
    align-content: start;
  }
  .avatar {
    width: 88px;
    height: 88px;
    display: grid;
    place-items: center;
    font-size: 1.8rem;
    font-weight: 800;
    color: var(--accent-text);
    overflow: hidden;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .facts {
    padding: 1.6rem;
    display: grid;
    gap: 1rem;
    align-content: start;
  }
  dl {
    margin: 0;
    display: grid;
    gap: 0.9rem;
  }
  dt {
    font-size: 0.85rem;
    color: var(--muted);
  }
  dd {
    margin: 0;
    font-weight: 500;
  }
  .stats {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
  }
  .stats li {
    padding: 1.3rem;
    display: grid;
    gap: 0.2rem;
  }
  .num {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--accent-text);
    font-variant-numeric: tabular-nums;
  }
  .lbl {
    color: var(--muted);
    font-size: 0.92rem;
    line-height: 1.35;
  }
  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

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
    <SectionHead num="01" slug="about" title={c.ui.about.title} />

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

      <div class="facts glass ring" use:reveal={{ delay: 120 }}>
        <div class="bar mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>facts.json</div>
        <h3 class="sr-only">{c.ui.about.factsTitle}</h3>
        <dl class="mono">
          {#each [...c.profile.facts, { label: c.ui.about.languages, value: spokenLanguages.map((l) => `${c.languages[l.id as 'Dutch' | 'English'].name} (${c.languages[l.id as 'Dutch' | 'English'].level.toLowerCase()})`).join(', ') }] as f, i}
            <div style="--d:{i * 70}ms">
              <dt><span class="prop">"{f.label}"</span><span aria-hidden="true">:</span></dt>
              <dd><span class="str">"{f.value}"</span><span aria-hidden="true">,</span></dd>
            </div>
          {/each}
        </dl>
      </div>
    </div>

    <ul class="stats">
      {#each stats as s, i (i)}
        <li class="glass ring" use:reveal={{ delay: i * 90 }}>
          <span class="key mono" aria-hidden="true">stats[{i}]</span>
          <span class="num mono"><span use:countUp={{ to: s.to }}>{s.to}</span>{s.suffix}</span>
          <span class="lbl">{s.label}</span>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: 1.25fr 1fr;
    align-items: start;
  }
  .bio {
    display: grid;
    gap: 0.9rem;
    align-content: start;
  }
  .bio p {
    color: var(--muted);
  }
  .bio p:first-of-type::first-line {
    color: var(--text);
  }
  .avatar {
    width: 72px;
    height: 72px;
    display: grid;
    place-items: center;
    font-family: var(--mono);
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--accent-text);
    overflow: hidden;
    background: conic-gradient(from var(--angle), color-mix(in srgb, var(--accent) 25%, transparent), color-mix(in srgb, var(--accent-2) 25%, transparent), color-mix(in srgb, var(--accent) 25%, transparent));
    animation: spin-angle 6s linear infinite;
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .facts {
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.5rem 0.9rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
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
  dl {
    margin: 0;
    padding: 1rem 1.2rem 1.1rem;
    display: grid;
    gap: 0.45rem;
    font-size: 0.8rem;
    line-height: 1.5;
  }
  dl::before,
  dl::after {
    content: '{';
    color: var(--syn-punc);
  }
  dl::after {
    content: '}';
  }
  dl > div {
    padding-left: 1.2rem;
    transition: background 0.2s;
    border-radius: 4px;
  }
  dl > div:hover {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }
  :global(.js) .facts dl > div {
    opacity: 0;
    translate: -8px 0;
    transition: opacity 0.5s var(--ease), translate 0.5s var(--ease), background 0.2s;
    transition-delay: calc(var(--d) + 350ms), calc(var(--d) + 350ms), 0s;
  }
  :global(.js) .facts:global(.in) dl > div {
    opacity: 1;
    translate: 0 0;
  }
  dt {
    display: inline;
  }
  dd {
    display: inline;
    margin: 0 0 0 0.5ch;
  }
  .stats {
    margin-top: 1.25rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.75rem;
  }
  .stats li {
    padding: 1rem 1.1rem;
    display: grid;
    gap: 0.1rem;
    transition: opacity 0.7s var(--ease), transform 0.7s var(--ease), filter 0.7s var(--ease), translate 0.3s var(--ease);
  }
  .stats li:hover {
    translate: 0 -3px;
  }
  .key {
    font-size: 0.68rem;
    color: var(--syn-com);
  }
  .num {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 1.1;
    background: linear-gradient(120deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-variant-numeric: tabular-nums;
  }
  .lbl {
    color: var(--muted);
    font-size: 0.85rem;
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

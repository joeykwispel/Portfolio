<script lang="ts">
  import { base } from '$app/paths';
  import { app } from '$lib/app.svelte';
  import { getContent, person, projects, skills, spokenLanguages } from '$lib/data';
  import { careerMonths, employerCount } from '$lib/utils/derive';
  import { countUp, reveal, tilt } from '$lib/utils/actions';
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

    <div class="grid" class:has-photo={!!person.photo}>
      <div class="bio" use:reveal>
        {#if !person.photo}
          <div class="avatar glass" aria-hidden="true"><span>JO</span></div>
        {/if}
        {#each c.profile.bio as para}
          <p>{para}</p>
        {/each}
      </div>

      {#if person.photo}
        <figure class="photo glass ring" use:reveal={{ delay: 60 }} use:tilt={5}>
          <div class="bar mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>{person.photo}<span class="dim">720×900</span></div>
          <div class="frame">
            <img src="{base}/{person.photo}" alt={person.name} width="720" height="900" loading="lazy" decoding="async" />
            <span class="scan" aria-hidden="true"></span>
            <span class="corner tl" aria-hidden="true"></span><span class="corner br" aria-hidden="true"></span>
          </div>
          <figcaption class="mono"><span class="com">// </span>{app.locale === 'nl' ? 'handgemaakt in Druten, op koffie' : 'handcrafted in Druten, runs on coffee'}</figcaption>
        </figure>
      {/if}
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
  /* With a photo: portrait on the left spanning both rows, bio + facts stacked on the right */
  .grid.has-photo {
    grid-template-columns: minmax(260px, 0.8fr) 1.6fr;
    grid-template-areas:
      'photo bio'
      'photo facts';
    grid-template-rows: auto 1fr;
    align-items: stretch;
  }
  .has-photo .bio {
    grid-area: bio;
  }
  .has-photo .photo {
    grid-area: photo;
  }
  .has-photo .facts {
    grid-area: facts;
    align-self: start;
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
  .photo {
    margin: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: color-mix(in srgb, var(--bg) 70%, transparent);
    transition: opacity 0.7s var(--ease), transform 0.25s ease-out, filter 0.7s var(--ease), border-color 0.3s;
  }
  .dim {
    margin-left: auto;
    opacity: 0.6;
  }
  .frame {
    position: relative;
    flex: 1;
    min-height: 320px;
    overflow: hidden;
  }
  .frame img {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 18%;
    filter: saturate(0.85) contrast(1.05);
    transition: transform 0.8s var(--ease), filter 0.5s;
  }
  /* subtle accent tint that fades out on hover */
  .frame::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(160deg, color-mix(in srgb, var(--accent) 22%, transparent), transparent 45%, color-mix(in srgb, var(--accent-2) 26%, transparent));
    mix-blend-mode: soft-light;
    transition: opacity 0.5s;
    pointer-events: none;
  }
  .photo:hover .frame img {
    transform: scale(1.05);
    filter: none;
  }
  .photo:hover .frame::after {
    opacity: 0;
  }
  /* one-time scan line when the card scrolls in */
  .scan {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 2px;
    background: var(--accent);
    box-shadow: 0 0 18px 4px var(--glow);
    opacity: 0;
    pointer-events: none;
  }
  :global(.js) .photo:global(.in) .scan {
    animation: scan 1.6s var(--ease) 0.4s both;
  }
  @keyframes scan {
    0% {
      top: 0;
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }
  .corner {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid var(--accent);
    pointer-events: none;
    transition: transform 0.4s var(--spring);
  }
  .tl {
    top: 10px;
    left: 10px;
    border-right: 0;
    border-bottom: 0;
  }
  .br {
    right: 10px;
    bottom: 10px;
    border-left: 0;
    border-top: 0;
  }
  .photo:hover .tl {
    transform: translate(-3px, -3px);
  }
  .photo:hover .br {
    transform: translate(3px, 3px);
  }
  .photo figcaption {
    padding: 0.5rem 0.9rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-top: 1px solid var(--border);
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
  /* tablet: photo + bio side by side, facts full width underneath */
  @media (max-width: 1000px) {
    .grid.has-photo {
      grid-template-columns: minmax(220px, 0.75fr) 1.5fr;
      grid-template-areas:
        'photo bio'
        'facts facts';
      grid-template-rows: auto auto;
    }
  }
  @media (max-width: 860px) {
    .grid {
      grid-template-columns: 1fr;
    }
    .stats {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  /* phone: single column, photo first with a fixed crop */
  @media (max-width: 640px) {
    .grid.has-photo {
      grid-template-columns: 1fr;
      grid-template-areas:
        'photo'
        'bio'
        'facts';
    }
    .frame {
      flex: none;
      min-height: 0;
      aspect-ratio: 4 / 4.2;
      max-height: 440px;
    }
  }
</style>

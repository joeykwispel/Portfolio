<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import { app } from '$lib/app.svelte';
  import { contact, cv, getContent, jobTitle, locales, person } from '$lib/data';
  import { reveal } from '$lib/utils/actions';
  import Scramble from '$lib/components/ui/Scramble.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  const c = $derived(getContent(app.locale));
  const d = $derived(cv[app.locale]);
  const t = $derived(c.ui.cvPage);
  const location = $derived(app.locale === 'nl' ? 'Druten, Gelderland' : 'Druten, Gelderland, NL');
  const split = (s: string) => s.split(/,\s*/).filter(Boolean);
  const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
</script>

<Seo title="{t.docTitle} | {jobTitle}" description={d.profile[0]} path="/cv/" type="profile" />

<header class="toolbar no-print">
  <div class="bar">
    <a class="back mono" href={app.href('/')}><span aria-hidden="true">←</span> {t.back}</a>
    <span class="path mono" aria-hidden="true">~/joey/<b>{t.file}</b></span>
    <div class="tools">
      <div class="lang" role="group" aria-label={c.ui.nav.language}>
        {#each locales as l (l)}
          <a
            class="mono"
            href={app.hrefFor(l, page.url.pathname)}
            hreflang={l}
            aria-current={app.locale === l ? 'true' : undefined}
            data-sveltekit-noscroll
            data-sveltekit-keepfocus
            onclick={() => app.rememberLocale(l)}>{l.toUpperCase()}</a
          >
        {/each}
      </div>
      <button type="button" class="btn btn-primary" onclick={() => window.print()}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          ><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="7" /></svg
        >
        {t.print}
      </button>
    </div>
  </div>
</header>

<main class="wrap">
  <p class="hint mono no-print"><span class="com">// </span>{t.hint}</p>

  <article class="sheet glass">
    <div class="chrome no-print" aria-hidden="true">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="mono">{t.file}</span>
    </div>

    <div class="doc">
      <header class="head" class:with-photo={!!person.photoSquare}>
        {#if person.photoSquare}
          <img class="portrait" src="{base}/{person.photoSquare}" alt={person.name} width="480" height="480" />
        {/if}
        <p class="kicker mono">{d.title}</p>
        <h1 class="mono"><Scramble text={person.name} trigger="mount" duration={800} /></h1>
        <p class="headline mono">{d.headline}</p>
        <p class="employment">{d.employment}</p>
        <ul class="contact mono">
          <li><span class="k">loc</span>{location}</li>
          <li><span class="k">mail</span><a href="mailto:{contact.email.value}">{contact.email.value}</a></li>
          <li><span class="k">in</span><a href={contact.linkedin.value} target="_blank" rel="noopener noreferrer">{host(contact.linkedin.value)}</a></li>
          <li><span class="k">git</span><a href={contact.github.value} target="_blank" rel="noopener noreferrer">{host(contact.github.value)}</a></li>
        </ul>
      </header>

      <section use:reveal>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.profile}<span class="br"> /&gt;</span></h2>
        {#each d.profile as para}<p class="para">{para}</p>{/each}
      </section>

      <section use:reveal>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.skills}<span class="br"> /&gt;</span></h2>
        <dl class="skills">
          {#each d.skills as s (s.label)}
            <div>
              <dt class="mono">{s.label}</dt>
              <dd>
                {#each split(s.items) as item (item)}<span class="tag">{item}</span>{/each}
              </dd>
            </div>
          {/each}
        </dl>
      </section>

      <section>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.projects}<span class="br"> /&gt;</span></h2>
        <ol class="projects">
          {#each d.projects as p (p.client)}
            <li class="proj" use:reveal>
              <div class="proj-head">
                <h3>{p.client}</h3>
                <p class="meta mono"><span class="role">{p.role}</span><span class="period">{p.period}</span></p>
              </div>
              <p class="para">{p.summary}</p>
              {#if p.bullets.length}
                <ul class="bullets">
                  {#each p.bullets as b}<li>{b}</li>{/each}
                </ul>
              {/if}
              <p class="stack mono"><span class="k">stack:</span> {p.stack}</p>
            </li>
          {/each}
        </ol>
      </section>

      <section>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.sideProjects}<span class="br"> /&gt;</span></h2>
        <ol class="projects">
          {#each d.sideProjects as p (p.client)}
            <li class="proj" use:reveal>
              <div class="proj-head">
                <h3>{p.client}</h3>
                <p class="meta mono"><span class="role">{p.role}</span><span class="period">{p.period}</span></p>
              </div>
              <p class="para">{p.summary}</p>
              {#if p.bullets.length}
                <ul class="bullets">
                  {#each p.bullets as b}<li>{b}</li>{/each}
                </ul>
              {/if}
              <p class="stack mono"><span class="k">stack:</span> {p.stack}</p>
            </li>
          {/each}
        </ol>
      </section>

      <section use:reveal>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.education}<span class="br"> /&gt;</span></h2>
        <p class="degree">{d.education.degree}</p>
        <p class="sub mono">{d.education.trainingLabel}</p>
        <ul class="bullets courses">
          {#each d.education.courses as course}<li>{course}</li>{/each}
        </ul>
      </section>

      <section use:reveal>
        <h2 class="mono"><span class="br">&lt;</span>{d.headings.languages}<span class="br"> /&gt;</span></h2>
        <p class="para">{d.languages}</p>
      </section>

      <p class="eof mono no-print" aria-hidden="true">// EOF: thanks for reading all the way down. Recruiter achievement unlocked.</p>
    </div>
  </article>
</main>

<style>
  .toolbar {
    position: sticky;
    top: 0;
    z-index: 50;
    background: color-mix(in srgb, var(--bg) 80%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--border);
  }
  .bar {
    width: min(900px, 100% - 2rem);
    margin-inline: auto;
    height: 58px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .back {
    font-size: 0.82rem;
    text-decoration: none;
    color: var(--muted);
    transition: color 0.2s;
  }
  .back:hover {
    color: var(--accent-text);
  }
  .path {
    flex: 1;
    text-align: center;
    font-size: 0.75rem;
    color: var(--muted);
  }
  .path b {
    color: var(--text);
    font-weight: 600;
  }
  .tools {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .lang {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 2px;
    background: var(--surface);
  }
  .lang a {
    text-decoration: none;
    border: 0;
    background: transparent;
    padding: 0.25rem 0.65rem;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--muted);
  }
  .lang a[aria-current='true'] {
    background: var(--accent);
    color: var(--accent-ink);
  }
  .btn {
    --pad: 0.5rem 0.9rem;
    font-size: 0.8rem;
  }

  .wrap {
    width: min(900px, 100% - 2rem);
    margin: 1.25rem auto 3rem;
  }
  .hint {
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 0.75rem;
  }
  .sheet {
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    animation: fade-up 0.8s var(--ease) both;
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.55rem 1rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .dots {
    display: flex;
    gap: 6px;
  }
  .dots i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5f57;
  }
  .dots i:nth-child(2) {
    background: #febc2e;
  }
  .dots i:nth-child(3) {
    background: #28c840;
  }
  .doc {
    padding: clamp(1.25rem, 4vw, 2.5rem);
    display: grid;
    gap: 1.6rem;
  }

  .head {
    display: grid;
    gap: 0.35rem;
    padding-bottom: 1.4rem;
    border-bottom: 1px dashed var(--border);
  }
  .head.with-photo {
    grid-template-columns: 1fr auto;
    column-gap: 1.5rem;
  }
  .head.with-photo > :not(.portrait) {
    grid-column: 1;
  }
  .portrait {
    grid-column: 2;
    grid-row: 1 / span 6;
    align-self: start;
    width: clamp(96px, 16vw, 148px);
    height: auto;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--accent) 14%, transparent),
      var(--shadow);
  }
  .kicker {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--accent-text);
  }
  h1 {
    font-size: clamp(2rem, 6vw, 3.1rem);
    letter-spacing: -0.06em;
    line-height: 1;
  }
  .headline {
    font-size: 0.95rem;
    font-weight: 600;
    background: linear-gradient(100deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .employment {
    color: var(--muted);
    font-size: 0.9rem;
  }
  .contact {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem 1.1rem;
    margin-top: 0.4rem;
    font-size: 0.78rem;
  }
  .contact li {
    display: flex;
    gap: 0.4rem;
    align-items: baseline;
  }
  .k {
    color: var(--syn-kw);
  }
  .contact a {
    color: var(--text);
    text-decoration: none;
    border-bottom: 1px dashed var(--border);
  }
  .contact a:hover {
    color: var(--accent-text);
  }

  section {
    display: grid;
    gap: 0.6rem;
  }
  h2 {
    font-size: 1.15rem;
    letter-spacing: -0.03em;
  }
  .br {
    color: var(--accent-text);
    opacity: 0.55;
    font-weight: 500;
  }
  .para {
    color: var(--muted);
    font-size: 0.93rem;
    max-width: none;
  }
  .skills {
    margin: 0;
    display: grid;
    gap: 0.6rem;
  }
  .skills > div {
    display: grid;
    grid-template-columns: 190px 1fr;
    gap: 0.8rem;
  }
  dt {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text);
    padding-top: 0.15rem;
  }
  dd {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .projects {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1.1rem;
  }
  .proj {
    position: relative;
    display: grid;
    gap: 0.45rem;
    padding-left: 1.1rem;
    border-left: 2px solid var(--border);
    transition:
      opacity 0.7s var(--ease),
      transform 0.7s var(--ease),
      filter 0.7s var(--ease),
      border-color 0.3s;
  }
  .proj:hover {
    border-left-color: var(--accent);
  }
  .proj::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 0.45rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--accent);
  }
  .proj-head {
    display: grid;
    gap: 0.15rem;
  }
  h3 {
    font-family: var(--mono);
    font-size: 1rem;
    letter-spacing: -0.03em;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 0.2rem 1rem;
    font-size: 0.76rem;
    max-width: none;
  }
  .role {
    color: var(--accent-text);
  }
  .period {
    color: var(--muted);
  }
  .bullets {
    display: grid;
    gap: 0.25rem;
    font-size: 0.88rem;
  }
  .bullets li {
    position: relative;
    padding-left: 1.1rem;
  }
  .bullets li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent-text);
    font-size: 0.85em;
  }
  .stack {
    font-size: 0.72rem;
    color: var(--muted);
    line-height: 1.55;
    max-width: none;
  }
  .degree {
    font-weight: 600;
  }
  .sub {
    font-size: 0.78rem;
    color: var(--muted);
  }
  .eof {
    font-size: 0.72rem;
    color: var(--syn-com);
    text-align: center;
    padding-top: 0.5rem;
  }

  @media (max-width: 520px) {
    .head.with-photo {
      grid-template-columns: 1fr;
    }
    .portrait {
      grid-column: 1;
      grid-row: auto;
      width: 96px;
      margin-bottom: 0.4rem;
      order: -1;
    }
  }
  @media (max-width: 640px) {
    .path {
      display: none;
    }
    .bar {
      justify-content: space-between;
    }
    .btn {
      font-size: 0;
      gap: 0;
    }
    .btn svg {
      width: 18px;
      height: 18px;
    }
    .skills > div {
      grid-template-columns: 1fr;
      gap: 0.3rem;
    }
  }

  /* ---------- print: clean black-on-white A4 ---------- */
  @media print {
    .wrap {
      width: auto;
      margin: 0;
    }
    .sheet {
      background: none;
      border: 0;
      box-shadow: none;
      backdrop-filter: none;
      animation: none;
      overflow: visible;
    }
    .doc {
      padding: 0;
      gap: 12pt;
    }
    h1 {
      font-size: 24pt;
    }
    .portrait {
      width: 30mm;
      box-shadow: none;
      border-color: #ccc;
      border-radius: 3mm;
    }
    .headline {
      background: none;
      color: #0b6259;
    }
    .para,
    .employment,
    .period,
    .stack,
    .sub {
      color: #333;
    }
    .para,
    .bullets {
      font-size: 9.5pt;
    }
    .role,
    .kicker,
    .br,
    .bullets li::before {
      color: #0b6259;
    }
    .contact a {
      color: #111;
      border: 0;
    }
    .proj {
      border-left-color: #ccc;
      break-inside: auto;
    }
    .proj-head {
      break-after: avoid;
    }
    .proj::before {
      background: #fff;
      border-color: #0b6259;
    }
    h2 {
      break-after: avoid;
      border-bottom: 1px solid #ddd;
      padding-bottom: 2pt;
    }
    .skills > div,
    .bullets li {
      break-inside: avoid;
    }
    :global(.tag) {
      color: #222 !important;
      background: none !important;
      border-color: #bbb !important;
    }
  }
</style>

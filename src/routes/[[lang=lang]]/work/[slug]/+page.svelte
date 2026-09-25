<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { contributions, getContent, projects, roles, testimonials } from '$lib/data';
  import { fmtMonth } from '$lib/utils/dates';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Prose from '$lib/components/ui/Prose.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  let { data } = $props();

  const c = $derived(getContent(app.locale));
  const t = $derived(c.ui.caseStudy);
  const study = $derived(data.study);
  const text = $derived(c.caseStudies[study.slug]);
  const project = $derived(projects.find((p) => p.id === study.projectId)!);
  const role = $derived(study.standalone ? undefined : roles.find((r) => r.id === project.roleId));
  const prs = $derived((study.contributions ?? []).map((id) => contributions.find((p) => p.id === id)).filter((p) => !!p));
  const quote = $derived(study.testimonial !== undefined ? testimonials[study.testimonial] : undefined);
  const next = $derived(data.next.slug === study.slug ? null : data.next);
</script>

<Seo title="{text.title} | Joey Oosenbrug" description={text.lede} path="/work/{study.slug}/" type="article" />

<a class="skip" href="#main">{c.ui.nav.skip}</a>
<Nav />

<main id="main" class="page">
  <div class="container">
    {#if study.status === 'draft'}
      <p class="draft mono" role="note"><strong>draft</strong> {t.draft}</p>
    {/if}

    <header class="head">
      <a class="back mono" href="{app.href('/')}#projects"><span aria-hidden="true">←</span> {t.back}</a>
      <p class="kicker">
        {#if study.standalone}
          <span class="tag">{c.ui.nav.opensource}</span>
        {:else}
          <span class="tag">{c.projects[project.id].sector}</span>
          <span class="mono">{project.name}</span>
        {/if}
      </p>
      <h1>{text.title}</h1>
      <p class="lede">{text.lede}</p>
    </header>

    <div class="layout">
      <article class="story">
        <Prose sections={text.sections} />

        {#if quote}
          <figure class="quote glass">
            <figcaption class="mono">{t.quote}</figcaption>
            <blockquote><p>{quote.quote}</p></blockquote>
            <p class="who"><strong>{quote.author}</strong><span>{quote.role}</span></p>
          </figure>
        {/if}

        {#if prs.length}
          <section class="proof" aria-labelledby="proof">
            <h2 id="proof" class="mono">{t.proof}</h2>
            <ul>
              {#each prs as p (p.id)}
                <li>
                  <a class="pr glass" href="https://github.com/{p.owner}/{p.repo}/pull/{p.number}" target="_blank" rel="noopener noreferrer">
                    <span class="state {p.state} mono">{c.ui.opensource[p.state]}</span>
                    <span class="repo mono">{p.owner}/{p.repo}#{p.number}</span>
                    <span class="title">{p.title}</span>
                    <span class="stat mono"><span class="plus">+{p.additions}</span> <span class="minus">−{p.deletions}</span></span>
                  </a>
                </li>
              {/each}
            </ul>
          </section>
        {/if}
      </article>

      <aside class="sheet glass ring" aria-label={project.name}>
        <div class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>case.json</div>
        <dl>
          {#if role}
            <div>
              <dt>{t.client}</dt>
              <dd>{role.company}</dd>
            </div>
            <div>
              <dt>{t.period}</dt>
              <dd>{fmtMonth(role.start, app.locale)} {c.ui.timeline.to} {role.end ? fmtMonth(role.end, app.locale) : c.ui.timeline.present}</dd>
            </div>
          {/if}
          <div>
            <dt>{t.role}</dt>
            <dd>{text.role}</dd>
          </div>
          <div>
            <dt>{t.team}</dt>
            <dd>{text.team}</dd>
          </div>
          <div>
            <dt>{t.stack}</dt>
            <dd>
              <ul class="tags">
                {#each study.stack as s (s)}<li class="tag">{c.skillLabels[s] ?? s}</li>{/each}
              </ul>
            </dd>
          </div>
        </dl>
        {#if project.link && !study.standalone}
          <a class="btn visit" href={project.link} target="_blank" rel="noopener noreferrer">{t.visit} <span aria-hidden="true">↗</span></a>
        {/if}
      </aside>
    </div>

    {#if next}
      <nav class="next" aria-label={t.next}>
        <a class="next-card glass ring" href={app.href(`/work/${next.slug}/`)}>
          <span class="mono lbl">{t.next}</span>
          <span class="next-title">{c.caseStudies[next.slug].title}</span>
          <span class="next-teaser">{c.caseStudies[next.slug].teaser}</span>
        </a>
      </nav>
    {/if}
  </div>
</main>

<Footer />

<style>
  .page {
    padding: calc(var(--nav-h) + clamp(1.5rem, 5vh, 3.5rem)) 0 clamp(3rem, 8vh, 6rem);
  }
  .draft {
    margin-bottom: 1.5rem;
    padding: 0.6rem 0.9rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--accent-2);
    color: var(--accent-2-text);
    font-size: 0.8rem;
    max-width: none;
  }
  .draft strong {
    text-transform: uppercase;
    margin-right: 0.4rem;
  }
  .head {
    display: grid;
    gap: 1rem;
    max-width: 60rem;
    margin-bottom: clamp(2rem, 5vw, 3.5rem);
  }
  .back {
    justify-self: start;
    font-size: 0.82rem;
    text-decoration: none;
    color: var(--muted);
  }
  .back:hover {
    color: var(--accent-text);
  }
  .kicker {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    flex-wrap: wrap;
    color: var(--muted);
    font-size: 0.85rem;
  }
  h1 {
    font-size: clamp(2rem, 5.2vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.035em;
    max-width: 20ch;
    text-wrap: balance;
  }
  .lede {
    font-size: clamp(1.08rem, 1.8vw, 1.28rem);
    line-height: 1.6;
    color: var(--muted);
    max-width: 60ch;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: clamp(2rem, 5vw, 4.5rem);
    align-items: start;
  }
  .story {
    display: grid;
    gap: 3rem;
    min-width: 0;
  }
  .sheet {
    position: sticky;
    top: calc(var(--nav-h) + 1.25rem);
    padding: 0 1.2rem 1.2rem;
    overflow: hidden;
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0 -1.2rem 0.9rem;
    padding: 0.45rem 0.9rem;
    font-size: 0.68rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .dots {
    display: flex;
    gap: 5px;
  }
  .dots i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--border);
  }
  dl {
    margin: 0;
    display: grid;
    gap: 0.9rem;
  }
  dt {
    font-size: 0.75rem;
    color: var(--muted);
    margin-bottom: 0.15rem;
  }
  dd {
    margin: 0;
    font-size: 0.93rem;
    line-height: 1.45;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.25rem;
  }
  .visit {
    margin-top: 1.2rem;
    width: 100%;
    justify-content: center;
  }
  .quote {
    margin: 0;
    padding: 1.4rem 1.5rem;
    display: grid;
    gap: 0.8rem;
  }
  .quote figcaption {
    font-size: 0.75rem;
    color: var(--accent-2-text);
  }
  .quote blockquote {
    margin: 0;
  }
  .quote blockquote p {
    font-size: 1.05rem;
    line-height: 1.7;
    max-width: 68ch;
  }
  .who {
    display: grid;
    font-size: 0.88rem;
  }
  .who span {
    color: var(--muted);
  }
  .proof {
    display: grid;
    gap: 1rem;
  }
  .proof h2 {
    font-size: 1.1rem;
  }
  .proof ul {
    display: grid;
    gap: 0.6rem;
  }
  .pr {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'state repo stat'
      'title title title';
    gap: 0.35rem 0.8rem;
    align-items: center;
    padding: 0.9rem 1.1rem;
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.2s;
  }
  .pr:hover {
    border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
  }
  .state {
    grid-area: state;
    font-size: 0.7rem;
    padding: 0.1rem 0.5rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--diff-add-fg) 18%, transparent);
    /* mixed with the text color so it keeps enough contrast on the tinted background in both themes */
    color: color-mix(in srgb, var(--diff-add-fg) 70%, var(--text));
  }
  .state.merged {
    background: color-mix(in srgb, var(--accent-2) 20%, transparent);
    color: var(--accent-2-text);
  }
  .state.closed {
    background: color-mix(in srgb, var(--diff-del-fg) 18%, transparent);
    color: color-mix(in srgb, var(--diff-del-fg) 70%, var(--text));
  }
  .repo {
    grid-area: repo;
    font-size: 0.78rem;
    color: var(--muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .title {
    grid-area: title;
    font-size: 0.95rem;
  }
  .stat {
    grid-area: stat;
    font-size: 0.75rem;
  }
  .plus {
    color: var(--diff-add-fg);
  }
  .minus {
    color: var(--diff-del-fg);
  }
  .next {
    margin-top: clamp(3rem, 8vw, 5rem);
  }
  .next-card {
    display: grid;
    gap: 0.4rem;
    padding: 1.4rem 1.6rem;
    text-decoration: none;
    color: var(--text);
    transition:
      border-color 0.2s,
      translate 0.3s var(--ease);
  }
  .next-card:hover {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    translate: 0 -2px;
  }
  .lbl {
    font-size: 0.75rem;
    color: var(--accent-text);
  }
  .next-title {
    font-size: clamp(1.25rem, 2.6vw, 1.7rem);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .next-teaser {
    color: var(--muted);
  }
  @media (max-width: 960px) {
    .layout {
      grid-template-columns: 1fr;
    }
    .sheet {
      position: static;
      order: -1;
    }
  }
</style>

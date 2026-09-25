<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { contributions, getContent, visibleCaseStudies } from '$lib/data';
  import type { Contribution, DiffRow } from '$lib/data';
  import { reveal } from '$lib/utils/actions';
  import SectionHead from './ui/SectionHead.svelte';

  const c = $derived(getContent(app.locale));
  const t = $derived(c.ui.opensource);
  const COLLAPSED_ROWS = 16;
  const story = visibleCaseStudies.find((cs) => cs.standalone && cs.contributions?.length);

  let expanded = $state<Record<string, boolean>>({});

  const totals = {
    prs: contributions.length,
    orgs: new Set(contributions.map((p) => p.owner)).size,
    additions: contributions.reduce((n, p) => n + p.additions, 0),
    deletions: contributions.reduce((n, p) => n + p.deletions, 0)
  };

  const date = (iso: string) => new Date(iso).toLocaleDateString(app.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  /** GitHub's 5-block diffstat. */
  const blocks = (p: Contribution) => {
    const green = Math.round((p.additions / (p.additions + p.deletions || 1)) * 5);
    return Array.from({ length: 5 }, (_, i) => (i < green ? 'add' : 'del'));
  };

  const initials = (owner: string) =>
    owner
      .replace(/[^A-Za-z]/g, '')
      .slice(0, 2)
      .toUpperCase();

  const splitPath = (path: string) => {
    const i = path.lastIndexOf('/');
    return { dir: path.slice(0, i + 1), base: path.slice(i + 1) };
  };

  /* ---- tiny syntax highlighter for the diff snippets (Python + Go) ---- */
  const KW = new Set(
    'def class return if else elif try except import from as not in is None True False self global raise with for while lambda func package var const map any type struct nil'.split(
      ' '
    )
  );
  type Tok = { t: string; c?: string };
  function highlight(src: string, lang: string): Tok[] {
    const comment = lang === 'go' ? '//' : '#';
    const out: Tok[] = [];
    const re = /("(?:[^"\\]|\\.)*"?|'(?:[^'\\]|\\.)*'?)|(\/\/.*$|#.*$)|\b(\d[\d_.]*)\b|\b([A-Za-z_]\w*)\b(?=\s*\()|\b([A-Za-z_]\w*)\b/g;
    let last = 0;
    for (const m of src.matchAll(re)) {
      const i = m.index ?? 0;
      if (i > last) out.push({ t: src.slice(last, i) });
      if (m[1]) out.push({ t: m[1], c: 'str' });
      else if (m[2]) out.push(m[2].startsWith(comment) ? { t: m[2], c: 'com' } : { t: m[2] });
      else if (m[3]) out.push({ t: m[3], c: 'num-t' });
      else if (m[4]) out.push({ t: m[4], c: KW.has(m[4]) ? 'kw' : 'fn' });
      else if (m[5]) out.push({ t: m[5], c: KW.has(m[5]) ? 'kw' : undefined });
      last = i + m[0].length;
    }
    if (last < src.length) out.push({ t: src.slice(last) });
    return out;
  }
  const langOf = (p: Contribution) => (p.lang === 'Go' ? 'go' : 'python');
  const rowClass = (r: DiffRow) => (r.k === '+' ? 'add' : r.k === '-' ? 'del' : r.k === 'hunk' ? 'hunk' : r.k === 'gap' ? 'gap' : 'ctx');
</script>

<section class="section">
  <div class="container">
    <SectionHead section="opensource" slug="open-source" title={t.title} intro={t.intro} />

    <ul class="totals mono" use:reveal>
      <li><strong>{totals.prs}</strong> {t.prs}</li>
      <li><strong>{totals.orgs}</strong> {t.orgs}</li>
      <li><strong class="plus">+{totals.additions}</strong> <strong class="minus">−{totals.deletions}</strong> {t.lines}</li>
    </ul>
    {#if story}
      <a class="story mono" href={app.href(`/work/${story.slug}/`)}
        >{c.ui.projects.caseStudy}: {c.caseStudies[story.slug].title}{#if story.status === 'draft'}
          (draft){/if}</a
      >
    {/if}

    <ol class="list">
      {#each contributions as p, idx (p.id)}
        {@const txt = c.contributions[p.id]}
        {@const path = splitPath(p.diff.file)}
        {@const long = p.diff.rows.length > COLLAPSED_ROWS}
        {@const lang = langOf(p)}
        <li use:reveal={{ delay: idx * 80 }}>
          <article class="pr glass ring">
            <header class="repo">
              <span class="avatar mono" aria-hidden="true" style="--h:{(idx * 97 + 160) % 360}">{initials(p.owner)}</span>
              <a class="repo-name mono" href="https://github.com/{p.owner}/{p.repo}" target="_blank" rel="noopener noreferrer">
                <span class="owner">{p.owner}</span><span class="slash">/</span><strong>{p.repo}</strong>
              </a>
              <span class="lang mono"><i style="background:{p.langColor}"></i>{p.lang}</span>
              {#if p.stars}<span class="stars mono" aria-label="{p.stars} stars">★ {p.stars}</span>{/if}
              <a class="view mono" href="https://github.com/{p.owner}/{p.repo}/pull/{p.number}" target="_blank" rel="noopener noreferrer">
                {t.view} <span aria-hidden="true">↗</span>
              </a>
            </header>

            <div class="body">
              <div class="info">
                <div class="state-row">
                  <span class="state {p.state}">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      {#if p.state === 'merged'}
                        <path
                          d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z"
                        />
                      {:else}
                        <path
                          d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
                        />
                      {/if}
                    </svg>
                    {t[p.state]}
                  </span>
                  {#if p.state === 'open'}<span class="awaiting mono">{t.awaiting}</span>{/if}
                </div>

                <h3 class="mono">{p.title} <span class="num">#{p.number}</span></h3>
                <p class="meta mono">{t.opened} {date(p.opened)} {t.by} <span class="me">@joeykwispel</span></p>

                <p class="stat mono">
                  <span class="plus">+{p.additions}</span>
                  <span class="minus">−{p.deletions}</span>
                  <span class="blocks" aria-hidden="true"
                    >{#each blocks(p) as b, i (i)}<i class={b}></i>{/each}</span
                  >
                  <span class="files">{p.files} {t.files}</span>
                </p>

                <p class="org">{txt.org}</p>

                <div class="block">
                  <h4 class="mono"><span class="com">// </span>{t.about}</h4>
                  <p>{txt.about}</p>
                </div>
                <div class="block">
                  <h4 class="mono"><span class="com">// </span>{t.did}</h4>
                  <p>{txt.did}</p>
                  <ul class="highlights">
                    {#each txt.highlights as h}<li>{h}</li>{/each}
                  </ul>
                </div>
                <ul class="tags">
                  {#each p.tags as tag (tag)}<li class="tag">{tag}</li>{/each}
                </ul>
              </div>

              <figure class="diff-card" class:long class:open={expanded[p.id]}>
                <figcaption class="file mono">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"
                    ><path
                      d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"
                    /></svg
                  >
                  <span class="path"><span class="dir">{path.dir}</span><strong>{path.base}</strong></span>
                  <span class="fstat"><span class="plus">+{p.diff.additions}</span> <span class="minus">−{p.diff.deletions}</span></span>
                </figcaption>
                <!-- scrollable code must be reachable by keyboard -->
                <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
                <div class="scroll" tabindex="0" role="region" aria-label="{t.snippet}: {p.diff.file}">
                  <table class="diff mono" aria-label="{t.snippet}: {p.diff.file}">
                    <tbody>
                      {#each p.diff.rows as r, i (i)}
                        <tr class={rowClass(r)} style="--i:{Math.min(i, 24)}">
                          {#if r.k === 'hunk'}
                            <td class="ln" colspan="2" aria-hidden="true"></td>
                            <td class="code" colspan="2">{r.t}</td>
                          {:else if r.k === 'gap'}
                            <td class="ln" colspan="2" aria-hidden="true">⋯</td>
                            <td class="code" colspan="2"></td>
                          {:else}
                            <td class="ln">{r.o ?? ''}</td>
                            <td class="ln">{r.n ?? ''}</td>
                            <td class="sign" aria-hidden="true">{r.k === ' ' ? '' : r.k}</td>
                            <td class="code"
                              >{#each highlight(r.t, lang) as tok, j (j)}{#if tok.c}<span class={tok.c}>{tok.t}</span>{:else}{tok.t}{/if}{/each}</td
                            >
                          {/if}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
                {#if long}
                  <button type="button" class="more mono" aria-expanded={!!expanded[p.id]} onclick={() => (expanded[p.id] = !expanded[p.id])}>
                    {expanded[p.id] ? t.collapse : t.expand}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      class:flip={expanded[p.id]}><path d="M6 9l6 6 6-6" /></svg
                    >
                  </button>
                {/if}
              </figure>
            </div>
          </article>
        </li>
      {/each}
    </ol>
  </div>
</section>

<style>
  .story {
    display: inline-block;
    margin: 0 0 1.4rem;
    font-size: 0.85rem;
    font-weight: 600;
  }
  .totals {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.1rem;
    font-size: 0.8rem;
    color: var(--muted);
  }
  .totals li {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }
  .totals strong {
    color: var(--text);
  }
  .plus {
    color: var(--diff-add-fg) !important;
  }
  .minus {
    color: var(--diff-del-fg) !important;
  }

  .list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1.1rem;
  }
  .pr {
    overflow: hidden;
    background: color-mix(in srgb, var(--bg) 72%, transparent);
  }

  /* ---- repo header ---- */
  .repo {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    padding: 0.65rem 1rem;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .avatar {
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    border-radius: 7px;
    font-size: 0.62rem;
    font-weight: 800;
    color: hsl(var(--h) 70% var(--chip-l));
    background: hsl(var(--h) 60% 50% / 0.16);
    border: 1px solid hsl(var(--h) 60% 55% / 0.35);
  }
  .repo-name {
    font-size: 0.85rem;
    color: var(--text);
    text-decoration: none;
  }
  .repo-name:hover strong {
    text-decoration: underline;
    color: var(--accent-text);
  }
  .owner {
    color: var(--muted);
  }
  .slash {
    color: var(--muted);
    margin: 0 0.2rem;
  }
  .lang,
  .stars {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.72rem;
    color: var(--muted);
  }
  .lang i {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
  .view {
    margin-left: auto;
    font-size: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    padding: 0.3rem 0.65rem;
    border-radius: 7px;
    border: 1px solid var(--border);
    transition:
      border-color 0.2s,
      box-shadow 0.2s,
      background 0.2s;
  }
  .view:hover {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--glow);
    background: var(--surface-2);
  }

  /* ---- body ---- */
  .body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 1.25rem;
    padding: 1.1rem 1rem 1.2rem;
    align-items: start;
  }
  .info {
    display: grid;
    gap: 0.55rem;
    align-content: start;
  }
  .state-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .state {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.2rem 0.65rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #fff;
  }
  .state.open {
    background: #238636;
  }
  .state.merged {
    background: #8957e5;
  }
  .state.closed {
    background: #da3633;
  }
  .awaiting {
    font-size: 0.7rem;
    color: var(--muted);
  }
  h3 {
    font-size: 0.98rem;
    line-height: 1.4;
    letter-spacing: -0.02em;
  }
  .num {
    color: var(--muted);
    font-weight: 400;
  }
  .meta {
    font-size: 0.72rem;
    color: var(--muted);
  }
  .me {
    color: var(--accent-text);
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
  }
  .blocks {
    display: inline-flex;
    gap: 2px;
  }
  .blocks i {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }
  .blocks .add {
    background: var(--diff-add-fg);
  }
  .blocks .del {
    background: var(--diff-del-fg);
  }
  .files {
    color: var(--muted);
    font-weight: 400;
  }
  .org {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--text);
    padding-top: 0.2rem;
  }
  .block {
    display: grid;
    gap: 0.25rem;
  }
  h4 {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: none;
  }
  h4 .com {
    font-style: normal;
  }
  .block p {
    font-size: 0.88rem;
    color: var(--muted);
  }
  .highlights {
    display: grid;
    gap: 0.2rem;
    margin-top: 0.25rem;
    font-size: 0.84rem;
  }
  .highlights li {
    position: relative;
    padding-left: 1.05rem;
  }
  .highlights li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent-text);
    font-size: 0.85em;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    padding-top: 0.2rem;
  }

  /* ---- GitHub-style diff ---- */
  .diff-card {
    --diff-bg: color-mix(in srgb, var(--bg) 85%, black);
    margin: 0;
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
    background: var(--diff-bg);
    position: relative;
  }
  .file {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .path {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .path strong {
    color: var(--text);
  }
  .fstat {
    margin-left: auto;
    flex: none;
    font-weight: 600;
  }
  .scroll {
    overflow-x: auto;
  }
  .diff-card.long:not(.open) .scroll {
    max-height: calc(16 * 1.6em + 1rem);
    overflow-y: hidden;
    -webkit-mask: linear-gradient(#000 75%, transparent);
    mask: linear-gradient(#000 75%, transparent);
  }
  .diff {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.72rem;
    line-height: 1.6;
    tab-size: 4;
    /* show code exactly as written, like GitHub (no "->" to arrow ligatures) */
    font-variant-ligatures: none;
  }
  .diff td {
    padding: 0 0.5rem;
    white-space: pre;
    vertical-align: top;
  }
  .ln {
    width: 1%;
    min-width: 2.6em;
    text-align: right;
    color: color-mix(in srgb, var(--muted) 65%, transparent);
    user-select: none;
  }
  .sign {
    width: 1%;
    padding-right: 0 !important;
    user-select: none;
  }
  .code {
    color: var(--text);
    padding-right: 1rem !important;
  }
  tr.add {
    background: var(--diff-add-bg);
  }
  tr.add .ln {
    background: var(--diff-add-num);
  }
  tr.add .sign {
    color: var(--diff-add-fg);
  }
  tr.del {
    background: var(--diff-del-bg);
  }
  tr.del .ln {
    background: var(--diff-del-num);
  }
  tr.del .sign {
    color: var(--diff-del-fg);
  }
  tr.hunk {
    background: var(--diff-hunk-bg);
  }
  tr.hunk td {
    color: var(--diff-hunk-fg);
    padding-block: 0.25rem;
  }
  tr.gap td {
    background: var(--diff-hunk-bg);
    color: var(--diff-hunk-fg);
    text-align: center;
    line-height: 1.1;
  }
  /* rows slide in when the card scrolls into view */
  :global(.js) .pr tr {
    opacity: 0;
    translate: -6px 0;
    transition:
      opacity 0.35s var(--ease),
      translate 0.35s var(--ease);
    transition-delay: calc(var(--i) * 22ms + 250ms);
  }
  :global(.js) :global(.in) .pr tr {
    opacity: 1;
    translate: 0 0;
  }
  .more {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    width: 100%;
    padding: 0.5rem;
    border: 0;
    border-top: 1px solid var(--border);
    background: var(--surface);
    color: var(--accent-text);
    font-size: 0.72rem;
    font-weight: 600;
  }
  .more:hover {
    background: var(--surface-2);
  }
  .more svg {
    transition: rotate 0.3s var(--ease);
  }
  .more svg.flip {
    rotate: 180deg;
  }

  @media (max-width: 1000px) {
    .body {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 560px) {
    .view {
      margin-left: 0;
      width: 100%;
      text-align: center;
    }
  }
</style>

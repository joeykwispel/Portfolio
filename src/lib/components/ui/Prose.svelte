<script lang="ts">
  import type { ProseSection } from '$lib/data';

  /** Renders long-form content (case studies, posts) from the structured blocks in the data files. */
  let { sections }: { sections: ProseSection[] } = $props();

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  /** Diff-style code: lines starting with + or - get colored like a pull request. */
  const lineKind = (l: string) => (l.startsWith('+') ? 'add' : l.startsWith('-') ? 'del' : '');
</script>

<div class="prose">
  {#each sections as s (s.heading)}
    <section aria-labelledby={slugify(s.heading)}>
      <h2 id={slugify(s.heading)}><span class="hash mono" aria-hidden="true">##</span>{s.heading}</h2>
      {#each s.body as b, i (i)}
        {#if typeof b === 'string'}
          <p>{b}</p>
        {:else if 'list' in b}
          <ul class="list">
            {#each b.list as item}<li>{item}</li>{/each}
          </ul>
        {:else if 'steps' in b}
          <ul class="steps">
            {#each b.steps as st (st.title)}
              <li>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            {/each}
          </ul>
        {:else if 'quote' in b}
          <blockquote>
            <p>{b.quote}</p>
            {#if b.cite}<cite>{b.cite}</cite>{/if}
          </blockquote>
        {:else if 'note' in b}
          <aside class="note"><p>{b.note}</p></aside>
        {:else if 'code' in b}
          <figure class="code glass">
            {#if b.lang || b.caption}
              <figcaption class="mono">
                {#if b.lang}<span class="lang">{b.lang}</span>{/if}
                {#if b.caption}<span class="cap">{b.caption}</span>{/if}
              </figcaption>
            {/if}
            <!-- long lines scroll sideways, so keyboard users need to reach it -->
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <pre class="mono" tabindex="0"><code
                >{#each b.code.split('\n') as line, j (j)}<span class="ln {lineKind(line)}">{line || ' '}</span>{/each}</code
              ></pre>
          </figure>
        {/if}
      {/each}
    </section>
  {/each}
</div>

<style>
  .prose {
    display: grid;
    gap: 2.6rem;
    font-size: 1.05rem;
    line-height: 1.75;
  }
  section {
    display: grid;
    gap: 1.05rem;
    scroll-margin-top: calc(var(--nav-h) + 1.5rem);
  }
  h2 {
    font-family: var(--font);
    font-size: clamp(1.3rem, 2.4vw, 1.6rem);
    letter-spacing: -0.02em;
    display: flex;
    align-items: baseline;
    gap: 0.55rem;
  }
  .hash {
    font-size: 0.8em;
    color: var(--accent-text);
    opacity: 0.7;
  }
  p {
    max-width: 68ch;
    color: color-mix(in srgb, var(--text) 86%, var(--muted));
  }
  .list {
    display: grid;
    gap: 0.55rem;
    max-width: 68ch;
  }
  .list li {
    position: relative;
    padding-left: 1.4rem;
    color: color-mix(in srgb, var(--text) 86%, var(--muted));
  }
  .list li::before {
    content: '';
    position: absolute;
    left: 0.25rem;
    top: 0.72em;
    width: 7px;
    height: 7px;
    border-radius: 2px;
    background: var(--accent);
    rotate: 45deg;
  }
  .steps {
    display: grid;
    gap: 0.9rem;
    max-width: 72ch;
  }
  .steps li {
    padding: 0.2rem 0 0.2rem 1.15rem;
    border-left: 2px solid color-mix(in srgb, var(--accent) 55%, transparent);
  }
  .steps h3 {
    font-size: 1.02rem;
    margin-bottom: 0.25rem;
  }
  .steps p {
    font-size: 0.98rem;
  }
  blockquote {
    margin: 0;
    padding: 0.4rem 0 0.4rem 1.3rem;
    border-left: 3px solid var(--accent-2);
    max-width: 64ch;
  }
  blockquote p {
    font-size: 1.12rem;
    color: var(--text);
  }
  cite {
    display: block;
    margin-top: 0.5rem;
    font-style: normal;
    font-size: 0.88rem;
    color: var(--muted);
  }
  .note {
    max-width: 68ch;
    padding: 0.9rem 1.1rem;
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--accent-2) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent-2) 30%, transparent);
  }
  .note p {
    font-size: 0.97rem;
    color: var(--text);
  }
  .code {
    margin: 0;
    overflow: hidden;
    max-width: 80ch;
  }
  figcaption {
    display: flex;
    gap: 0.8rem;
    align-items: center;
    padding: 0.45rem 0.9rem;
    font-size: 0.72rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .lang {
    color: var(--accent-2-text);
  }
  pre {
    margin: 0;
    padding: 0.8rem 0;
    overflow-x: auto;
    font-size: 0.82rem;
    line-height: 1.6;
  }
  .ln {
    display: block;
    padding: 0 1rem;
    white-space: pre;
  }
  .ln.add {
    background: var(--diff-add-bg);
    color: var(--diff-add-fg);
  }
  .ln.del {
    background: var(--diff-del-bg);
    color: var(--diff-del-fg);
  }
</style>

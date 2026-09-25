<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, readingMinutes, visiblePosts } from '$lib/data';

  let { limit = Infinity, headingLevel = 3 }: { limit?: number; headingLevel?: 2 | 3 } = $props();

  const c = $derived(getContent(app.locale));
  const list = $derived(visiblePosts.slice(0, limit));
  const date = (iso: string) => new Date(iso).toLocaleDateString(app.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<ol class="posts">
  {#each list as p (p.slug)}
    {@const txt = c.posts[p.slug]}
    <li>
      <a class="post" href={app.href(`/writing/${p.slug}/`)}>
        <p class="meta mono">
          <time datetime={p.date}>{date(p.date)}</time>
          <span>{readingMinutes(txt.sections)} {c.ui.writing.minutes}</span>
          {#if p.status === 'draft'}<span class="draft">draft</span>{/if}
        </p>
        <svelte:element this={`h${headingLevel}`} class="title">{txt.title}</svelte:element>
        <p class="desc">{txt.description}</p>
        <ul class="tags">
          {#each p.tags as t (t)}<li class="tag">{t}</li>{/each}
        </ul>
      </a>
    </li>
  {:else}
    <li class="empty">{c.ui.writing.empty}</li>
  {/each}
</ol>

<style>
  .posts {
    display: grid;
    border-top: 1px solid var(--border);
  }
  .posts > li {
    border-bottom: 1px solid var(--border);
  }
  .post {
    display: grid;
    grid-template-columns: 13rem minmax(0, 1fr);
    grid-template-areas:
      'meta title'
      'meta desc'
      'meta tags';
    gap: 0.4rem 2rem;
    padding: 1.5rem 0.75rem;
    text-decoration: none;
    color: var(--text);
    border-radius: var(--radius-sm);
    transition: background 0.2s;
  }
  .post:hover {
    background: var(--surface);
  }
  .post:hover .title {
    color: var(--accent-text);
  }
  .meta {
    grid-area: meta;
    display: grid;
    align-content: start;
    gap: 0.2rem;
    font-size: 0.78rem;
    color: var(--muted);
  }
  .draft {
    justify-self: start;
    font-size: 0.65rem;
    padding: 0.05rem 0.4rem;
    border-radius: 5px;
    border: 1px dashed var(--accent-2);
    color: var(--accent-2-text);
  }
  .title {
    grid-area: title;
    font-size: clamp(1.15rem, 2.2vw, 1.4rem);
    letter-spacing: -0.02em;
    transition: color 0.2s;
  }
  .desc {
    grid-area: desc;
    color: var(--muted);
  }
  .tags {
    grid-area: tags;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.3rem;
  }
  .empty {
    padding: 1.5rem 0.75rem;
    color: var(--muted);
  }
  @media (max-width: 720px) {
    .post {
      grid-template-columns: 1fr;
      grid-template-areas: 'meta' 'title' 'desc' 'tags';
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.9rem;
    }
  }
</style>

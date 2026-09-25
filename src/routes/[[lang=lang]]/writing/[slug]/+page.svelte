<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, person, readingMinutes, siteUrl } from '$lib/data';
  import { localize } from '$lib/i18n';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Prose from '$lib/components/ui/Prose.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  let { data } = $props();

  const c = $derived(getContent(app.locale));
  const post = $derived(data.post);
  const text = $derived(c.posts[post.slug]);
  const date = $derived(new Date(post.date).toLocaleDateString(app.locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }));
  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: text.title,
    description: text.description,
    datePublished: post.date,
    inLanguage: app.locale,
    url: siteUrl + localize(`/writing/${post.slug}/`, app.locale),
    author: { '@type': 'Person', name: person.name, url: `${siteUrl}/` }
  });
</script>

<Seo title="{text.title} | Joey Oosenbrug" description={text.description} path="/writing/{post.slug}/" type="article" published={post.date} {jsonLd} />

<a class="skip" href="#main">{c.ui.nav.skip}</a>
<Nav />

<main id="main" class="page">
  <div class="container narrow">
    {#if post.status === 'draft'}
      <p class="draft mono" role="note"><strong>draft</strong> {c.ui.writing.draft}</p>
    {/if}
    <header class="head">
      <a class="back mono" href="{app.href('/')}#writing"><span aria-hidden="true">←</span> {c.ui.writing.back}</a>
      <p class="meta mono"><time datetime={post.date}>{date}</time> <span>{readingMinutes(text.sections)} {c.ui.writing.minutes}</span></p>
      <h1>{text.title}</h1>
      <p class="lede">{text.description}</p>
      <ul class="tags">
        {#each post.tags as t (t)}<li class="tag">{t}</li>{/each}
      </ul>
    </header>
    <article><Prose sections={text.sections} /></article>
  </div>
</main>

<Footer />

<style>
  .page {
    padding: calc(var(--nav-h) + clamp(1.5rem, 5vh, 3.5rem)) 0 clamp(3rem, 8vh, 6rem);
  }
  .narrow {
    max-width: 48rem;
  }
  .draft {
    margin-bottom: 1.5rem;
    padding: 0.6rem 0.9rem;
    border-radius: var(--radius-sm);
    border: 1px dashed var(--accent-2);
    color: var(--accent-2-text);
    font-size: 0.8rem;
  }
  .draft strong {
    text-transform: uppercase;
    margin-right: 0.4rem;
  }
  .head {
    display: grid;
    gap: 0.9rem;
    margin-bottom: 2.8rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border);
  }
  .back {
    justify-self: start;
    font-size: 0.82rem;
    color: var(--muted);
    text-decoration: none;
  }
  .back:hover {
    color: var(--accent-text);
  }
  .meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: var(--muted);
  }
  h1 {
    font-size: clamp(1.9rem, 5vw, 3rem);
    line-height: 1.08;
    letter-spacing: -0.035em;
    text-wrap: balance;
  }
  .lede {
    font-size: 1.15rem;
    color: var(--muted);
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
</style>

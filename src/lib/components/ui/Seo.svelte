<script lang="ts">
  import { base } from '$app/paths';
  import { app } from '$lib/app.svelte';
  import { keywords, locales, person, siteUrl } from '$lib/data';
  import { localize } from '$lib/i18n';

  let {
    title,
    description,
    path = '/',
    type = 'website',
    jsonLd,
    image: imagePath = '/og.png',
    published
  }: {
    title: string;
    description: string;
    /** Path without the locale prefix, e.g. "/cv/". */
    path?: string;
    type?: 'website' | 'profile' | 'article';
    jsonLd?: object;
    image?: string;
    /** YYYY-MM-DD, for articles */
    published?: string;
  } = $props();

  // Search results show ~155 characters; cut long descriptions at a word boundary instead of mid-word.
  const clip = (s: string, max = 160) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max - 1)) + '…');
  const desc = $derived(clip(description));
  const url = $derived(siteUrl + localize(path, app.locale));
  const image = $derived(`${siteUrl}${base}${imagePath}`);
  const imageAlt = `${person.name}, portfolio preview`;
  const locale = $derived(app.locale === 'nl' ? 'nl_NL' : 'en_US');
  const altLocale = $derived(app.locale === 'nl' ? 'en_US' : 'nl_NL');
  // Escape "<" so a string in the data can never close the script tag.
  // ('\\u003c' is the 6-character JSON escape; '\u003c' in a JS string would just be "<" again.)
  const ld = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\\u003c') : '');
  // Split so the Svelte parser doesn't read it as the end of this script block.
  const ldTag = $derived(`<script type="application/ld+json">${ld}<` + '/script>');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={desc} />
  <meta name="author" content={person.name} />
  <meta name="keywords" content={keywords.join(', ')} />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href={url} />
  {#each locales as l (l)}
    <link rel="alternate" hreflang={l} href={siteUrl + localize(path, l)} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={siteUrl + localize(path, 'en')} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={person.name} />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={desc} />
  <meta property="og:locale" content={locale} />
  <meta property="og:locale:alternate" content={altLocale} />
  <meta property="og:image" content={image} />
  <meta property="og:image:secure_url" content={image} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={imageAlt} />
  {#if type === 'article' && published}
    <meta property="article:published_time" content={published} />
    <meta property="article:author" content={person.name} />
  {/if}
  {#if type === 'profile'}
    <meta property="profile:first_name" content="Joey" />
    <meta property="profile:last_name" content="Oosenbrug" />
    <meta property="profile:username" content="joeykwispel" />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={desc} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={imageAlt} />

  {#if ld}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -- data we control, with "<" escaped above -->
    {@html ldTag}
  {/if}
</svelte:head>

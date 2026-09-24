<script lang="ts">
  import { base } from '$app/paths';
  import { app } from '$lib/app.svelte';
  import { keywords, person, siteUrl } from '$lib/data';

  let {
    title,
    description,
    path = '/',
    type = 'website',
    jsonLd
  }: { title: string; description: string; path?: string; type?: 'website' | 'profile'; jsonLd?: object } = $props();

  // Search results show ~155 characters; cut long descriptions at a word boundary instead of mid-word.
  const clip = (s: string, max = 160) => (s.length <= max ? s : s.slice(0, s.lastIndexOf(' ', max - 1)) + '…');
  const desc = $derived(clip(description));
  const url = $derived(`${siteUrl}${base}${path}`);
  const image = `${siteUrl}${base}/og.png`;
  const imageAlt = `${person.name}, portfolio preview`;
  const locale = $derived(app.locale === 'nl' ? 'nl_NL' : 'en_US');
  const altLocale = $derived(app.locale === 'nl' ? 'en_US' : 'nl_NL');
  // Escape "<" so a string in the data can never close the script tag.
  const ld = $derived(jsonLd ? JSON.stringify(jsonLd).replace(/</g, '\u003c') : '');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={desc} />
  <meta name="author" content={person.name} />
  <meta name="keywords" content={keywords.join(', ')} />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <link rel="canonical" href={url} />

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
    {@html `<script type="application/ld+json">${ld}</script>`}
  {/if}
</svelte:head>

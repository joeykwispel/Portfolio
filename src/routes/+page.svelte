<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { base } from '$app/paths';
  import { getContent, siteUrl, testimonials } from '$lib/data';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Lazy from '$lib/components/ui/Lazy.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Quip from '$lib/components/ui/Quip.svelte';

  const ui = $derived(getContent(app.locale).ui);
  const ogImage = `${siteUrl}${base}/og.png`;
  const pageUrl = `${siteUrl}${base}/`;
</script>

<svelte:head>
  <title>{ui.meta.title}</title>
  <meta name="description" content={ui.meta.description} />
  <link rel="canonical" href={pageUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={pageUrl} />
  <meta property="og:title" content={ui.meta.title} />
  <meta property="og:description" content={ui.meta.description} />
  <meta property="og:locale" content={app.locale === 'nl' ? 'nl_NL' : 'en_US'} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={ogImage} />
  <meta name="twitter:title" content={ui.meta.title} />
  <meta name="twitter:description" content={ui.meta.description} />
</svelte:head>

<a class="skip" href="#main">{ui.nav.skip}</a>
<Nav />

<main id="main">
  <Hero />
  <About />
  <Quip text={ui.quips.about} />
  <Lazy id="skills" minHeight="900px" loader={() => import('$lib/components/Skills.svelte')} />
  <Quip text={ui.quips.skills} />
  <Lazy id="insights" minHeight="900px" loader={() => import('$lib/components/Charts.svelte')} />
  <Quip text={ui.quips.insights} />
  <Lazy id="experience" minHeight="900px" loader={() => import('$lib/components/Timeline.svelte')} />
  <Quip text={ui.quips.experience} />
  <Lazy id="projects" minHeight="600px" loader={() => import('$lib/components/Projects.svelte')} />
  <Quip text={ui.quips.projects} />
  {#if testimonials.length}
    <Lazy id="testimonials" minHeight="360px" loader={() => import('$lib/components/Testimonials.svelte')} />
  {/if}
  <Lazy id="contact" minHeight="600px" loader={() => import('$lib/components/Contact.svelte')} />
</main>

<Footer />

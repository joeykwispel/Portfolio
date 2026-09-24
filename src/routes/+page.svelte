<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, testimonials } from '$lib/data';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Lazy from '$lib/components/ui/Lazy.svelte';
  import Footer from '$lib/components/Footer.svelte';

  const ui = $derived(getContent(app.locale).ui);
</script>

<svelte:head>
  <title>{ui.meta.title}</title>
  <meta name="description" content={ui.meta.description} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={ui.meta.title} />
  <meta property="og:description" content={ui.meta.description} />
  <meta property="og:locale" content={app.locale === 'nl' ? 'nl_NL' : 'en_US'} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={ui.meta.title} />
  <meta name="twitter:description" content={ui.meta.description} />
</svelte:head>

<a class="skip" href="#main">{ui.nav.skip}</a>
<Nav />

<main id="main">
  <Hero />
  <About />
  <Lazy id="skills" minHeight="900px" loader={() => import('$lib/components/Skills.svelte')} />
  <Lazy id="insights" minHeight="900px" loader={() => import('$lib/components/Charts.svelte')} />
  <Lazy id="experience" minHeight="900px" loader={() => import('$lib/components/Timeline.svelte')} />
  <Lazy id="projects" minHeight="600px" loader={() => import('$lib/components/Projects.svelte')} />
  {#if testimonials.length}
    <Lazy id="testimonials" minHeight="360px" loader={() => import('$lib/components/Testimonials.svelte')} />
  {/if}
  <Lazy id="contact" minHeight="600px" loader={() => import('$lib/components/Contact.svelte')} />
</main>

<Footer />

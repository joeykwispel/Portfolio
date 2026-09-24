<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, profileJsonLd, testimonials } from '$lib/data';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Lazy from '$lib/components/ui/Lazy.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Quip from '$lib/components/ui/Quip.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  const ui = $derived(getContent(app.locale).ui);
</script>

<Seo title={ui.meta.title} description={ui.meta.description} type="profile" jsonLd={profileJsonLd(ui.meta.description)} />

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
  <Lazy id="opensource" minHeight="900px" loader={() => import('$lib/components/OpenSource.svelte')} />
  <Quip text={ui.quips.opensource} />
  {#if testimonials.length}
    <Lazy id="testimonials" minHeight="360px" loader={() => import('$lib/components/Testimonials.svelte')} />
  {/if}
  <Lazy id="contact" minHeight="600px" loader={() => import('$lib/components/Contact.svelte')} />
</main>

<Footer />

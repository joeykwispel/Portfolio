<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent, profileJsonLd } from '$lib/data';
  import { sectionIds } from '$lib/sections';
  import Nav from '$lib/components/Nav.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import About from '$lib/components/About.svelte';
  import Lazy from '$lib/components/ui/Lazy.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Quip from '$lib/components/ui/Quip.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  const ui = $derived(getContent(app.locale).ui);
  const has = (id: (typeof sectionIds)[number]) => sectionIds.includes(id);
</script>

<Seo title={ui.meta.title} description={ui.meta.description} type="profile" jsonLd={profileJsonLd(ui.meta.description)} />

<a class="skip" href="#main">{ui.nav.skip}</a>
<Nav />

<main id="main">
  <Hero />
  <About />
  <Quip text={ui.quips.about} />
  <Lazy id="skills" minHeight="700px" loader={() => import('$lib/components/Skills.svelte')} />
  <Lazy id="insights" minHeight="900px" loader={() => import('$lib/components/Charts.svelte')} />
  <Quip text={ui.quips.insights} />
  <Lazy id="experience" minHeight="900px" loader={() => import('$lib/components/Timeline.svelte')} />
  <Lazy id="projects" minHeight="600px" loader={() => import('$lib/components/Projects.svelte')} />
  <Lazy id="opensource" minHeight="900px" loader={() => import('$lib/components/OpenSource.svelte')} />
  <Quip text={ui.quips.opensource} />
  {#if has('writing')}
    <Lazy id="writing" minHeight="420px" loader={() => import('$lib/components/Writing.svelte')} />
  {/if}
  {#if has('testimonials')}
    <Lazy id="testimonials" minHeight="360px" loader={() => import('$lib/components/Testimonials.svelte')} />
  {/if}
  <Lazy id="contact" minHeight="600px" loader={() => import('$lib/components/Contact.svelte')} />
</main>

<Footer />

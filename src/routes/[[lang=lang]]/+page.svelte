<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
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
  import { hasPendingSections, scrollToSection } from '$lib/utils/scroll';

  const ui = $derived(getContent(app.locale).ui);
  const has = (id: (typeof sectionIds)[number]) => sectionIds.includes(id);

  /* Arriving on /#writing from another page or a shared link: jump once every section has loaded. */
  afterNavigate(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) scrollToSection(id, { smooth: false });
  });

  /* In-page #links (nav, hero buttons): while sections are still loading, take over the jump so it
     does not land short. Once everything has loaded, the browser's own anchor scroll is fine. */
  onMount(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement) || a.target === '_blank') return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id) || !hasPendingSections()) return;
      e.preventDefault();
      scrollToSection(id, { pushHash: true });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  });
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

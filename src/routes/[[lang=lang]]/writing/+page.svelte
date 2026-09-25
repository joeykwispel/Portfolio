<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { getContent } from '$lib/data';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import PostList from '$lib/components/ui/PostList.svelte';
  import Seo from '$lib/components/ui/Seo.svelte';

  const c = $derived(getContent(app.locale));
</script>

<Seo title="{c.ui.writing.title} | Joey Oosenbrug" description={c.ui.writing.intro} path="/writing/" />

<a class="skip" href="#main">{c.ui.nav.skip}</a>
<Nav />

<main id="main" class="page">
  <div class="container">
    <header class="head">
      <p class="path mono" aria-hidden="true"><span class="dir">~/joey/</span>writing</p>
      <h1>{c.ui.writing.title}</h1>
      <p class="lede">{c.ui.writing.intro}</p>
    </header>
    <PostList headingLevel={2} />
  </div>
</main>

<Footer />

<style>
  .page {
    padding: calc(var(--nav-h) + clamp(1.5rem, 5vh, 3.5rem)) 0 clamp(3rem, 8vh, 6rem);
    min-height: 80vh;
  }
  .head {
    display: grid;
    gap: 0.8rem;
    margin-bottom: 2rem;
  }
  .path {
    font-size: 0.8rem;
    color: var(--muted);
  }
  h1 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    letter-spacing: -0.035em;
  }
  .lede {
    color: var(--muted);
    font-size: 1.1rem;
  }
</style>

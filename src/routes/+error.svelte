<script lang="ts">
  import { page } from '$app/state';
  import { localeOf, localize } from '$lib/i18n';
  import Scramble from '$lib/components/ui/Scramble.svelte';

  // The error page renders outside the [[lang]] layout, so read the language from the URL.
  const locale = $derived(localeOf(page.url.pathname));
  const nl = $derived(locale === 'nl');
  const path = $derived(page.url.pathname);
</script>

<svelte:head>
  <title>404 | {nl ? 'koffie niet gevonden' : 'coffee not found'}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="wrap">
  <h1 class="mono"><Scramble text={String(page.status)} trigger="mount" duration={900} /></h1>
  <div class="term glass">
    <div class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>bash</div>
    <pre class="mono"><span class="prop">joey@portfolio</span>:<span class="dir">~</span>$ cd {path}
<span class="err">Uncaught Error: {nl ? 'koffie niet gevonden' : 'coffee not found'}</span>
<span class="com">    at Joey.brew (kitchen.ts:404)
    at Morning.start (life.ts:7)
    at {nl ? 'Pagina' : 'Page'}.render ({path})</span
      >

<span class="com">// {nl ? 'Deze pagina bestaat niet, of hij is weggerefactord.' : 'This page does not exist, or it got refactored away.'}</span>
<span class="prop">joey@portfolio</span>:<span class="dir">~</span>$ <span class="caret"></span></pre>
  </div>
  <a class="btn btn-primary" href={localize('/', locale)}
    ><span aria-hidden="true">&gt;</span> cd ~ <span class="sub">({nl ? 'terug naar home' : 'back home'})</span></a
  >
</main>

<style>
  .wrap {
    min-height: 100svh;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 1.2rem;
    padding: 2rem 1rem;
    text-align: center;
  }
  h1 {
    font-size: clamp(5rem, 22vw, 11rem);
    line-height: 0.9;
    letter-spacing: -0.08em;
    background: linear-gradient(110deg, var(--accent), var(--accent-2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .term {
    width: min(560px, 100%);
    overflow: hidden;
    text-align: left;
    background: color-mix(in srgb, var(--bg) 75%, transparent);
  }
  .chrome {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.45rem 0.8rem;
    font-size: 0.7rem;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }
  .dots {
    display: flex;
    gap: 5px;
  }
  .dots i {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #ff5f57;
  }
  .dots i:nth-child(2) {
    background: #febc2e;
  }
  .dots i:nth-child(3) {
    background: #28c840;
  }
  pre {
    margin: 0;
    padding: 1rem;
    font-size: 0.78rem;
    line-height: 1.7;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .dir {
    color: var(--accent-2-text);
  }
  .err {
    color: #ff6b6b;
  }
  .sub {
    opacity: 0.7;
    font-weight: 500;
  }
</style>

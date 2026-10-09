<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { getContent } from '$lib/data';
  import { localeOf, localize } from '$lib/i18n';
  import Scramble from '$lib/components/ui/Scramble.svelte';

  /** The 418 page. Every error ends up here, and so does anyone who clicks the coffee joke. */
  let { status }: { /** The status that actually went wrong, if any. */ status?: number } = $props();

  // The error page renders outside the [[lang]] layout, so read the language from the URL.
  const locale = $derived(localeOf(page.url.pathname));
  const t = $derived(getContent(locale).ui.teapot);
  const path = $derived(page.url.pathname);
  const home = $derived(localize('/', locale));
  const original = $derived(
    !status || status === 418 ? t.original.none : status === 404 ? t.original[404] : status === 500 ? t.original[500] : `${status} ${t.original.other}`
  );

  let i = $state(0);
  const quote = $derived(t.quips[i % t.quips.length]);

  /** A different quote every time, never the same one twice in a row. */
  const refill = () => {
    i = (i + 1 + Math.floor(Math.random() * (t.quips.length - 1))) % t.quips.length;
  };
  onMount(refill);

  /** Goes back to where the visitor came from; without history (new tab, shared link) the link just goes home. */
  function back(e: MouseEvent) {
    if (history.length < 2) return;
    e.preventDefault();
    history.back();
  }

  /* The prompt at the bottom of the terminal really takes commands: "cd ~" and "cd ../" do what the home button does. */
  let input = $state('');
  let log = $state<{ cmd: string; out: string }[]>([]);
  let field: HTMLInputElement;

  function run(raw: string) {
    const cmd = raw.trim().replace(/\s+/g, ' ');
    const c = cmd.toLowerCase();
    if (!c) return;
    if (/^(cd( (~|\/|\.\.)\/?)?|home|exit)$/.test(c)) return void goto(home);
    if (c === 'cd -' || c === 'back') return history.length > 1 ? history.back() : void goto(home);
    if (c === 'clear') return void (log = []);
    let out: string;
    if (c === 'help') out = t.term.help;
    else if (c === 'ls') out = 'teapot.ts  kettle.log  coffee.404';
    else if (c === 'pwd') out = path;
    else if (/^sudo\b/.test(c)) out = t.term.sudo;
    else if (/coffee|koffie/.test(c)) out = t.term.coffee;
    else if (/tea|thee/.test(c)) {
      refill();
      out = quote;
    } else out = `bash: ${cmd.split(' ')[0]}: ${t.term.unknown}`;
    log = [...log.slice(-5), { cmd, out }];
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    run(input);
    input = '';
  }
</script>

<svelte:head>
  <title>{t.title}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<main class="wrap">
  <svg class="pot" viewBox="0 0 120 96" width="120" height="96" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <g class="steam" stroke="var(--accent-2)" stroke-width="2.5">
      <path d="M50 22c-4-4 4-7 0-12" />
      <path d="M60 20c-4-5 4-8 0-14" />
      <path d="M70 22c-4-4 4-7 0-12" />
    </g>
    <g stroke="var(--accent)" stroke-width="3">
      <path d="M48 34h24M60 34v-5" />
      <path d="M34 44c0-6 52-6 52 0 8 10 8 34-6 42H40c-14-8-14-32-6-42Z" />
      <path d="M90 52c14-6 20 22 0 26" />
      <path d="M31 56c-10 0-12-8-18-14M29 72c-8-2-12-14-16-30" />
    </g>
  </svg>

  <h1 class="mono"><Scramble text="418" trigger="mount" duration={900} /></h1>
  <p class="name mono">{t.name}</p>

  <div class="term glass">
    <div class="chrome mono" aria-hidden="true"><span class="dots"><i></i><i></i><i></i></span>bash</div>
    <!-- Clicking anywhere in the terminal focuses the prompt; keyboard users tab to it. -->
    <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
    <div class="screen mono" onclick={() => getSelection()?.isCollapsed && field.focus()}>
      <pre><span class="prop">joey@portfolio</span>:<span class="dir">~</span>$ cd {path}
<span class="err">Uncaught Error: {t.notFound}</span>
<span class="com">    at Teapot.brew (kitchen.ts:418)
    at Morning.start (life.ts:7)
    at {t.page}.render ({path})</span
        >

<span class="com"
          >// {t.explain}
// {t.was}: {original}</span
        ></pre>
      <div role="log" aria-live="polite">
        {#each log as l, n (n)}
          <pre><span class="prop">joey@portfolio</span>:<span class="dir">~</span>$ {l.cmd}
<span class="com">{l.out}</span></pre>
        {/each}
      </div>
      <label class="prompt"
        ><span><span class="prop">joey@portfolio</span>:<span class="dir">~</span>$</span><span class="sr-only">{t.term.label}</span><input
          bind:this={field}
          bind:value={input}
          {onkeydown}
          class="mono"
          type="text"
          placeholder="cd ~"
          enterkeyhint="go"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          spellcheck="false"
        /></label
      >
    </div>
  </div>
  <p class="hint mono"><span class="com">// {t.term.hint}</span></p>

  <figure class="quote">
    <figcaption class="sr-only">{t.quoteLabel}</figcaption>
    <blockquote aria-live="polite">{quote}</blockquote>
    <button type="button" class="refill mono" onclick={refill}><span aria-hidden="true">↻</span> {t.refill}</button>
  </figure>

  <div class="actions">
    <a class="btn" href={home} onclick={back}><span aria-hidden="true">←</span> {t.back}</a>
    <a class="btn btn-primary" href={home}><span aria-hidden="true">&gt;</span> cd ~ <span class="sub">({t.home})</span></a>
  </div>
</main>

<style>
  .wrap {
    min-height: 100svh;
    display: grid;
    place-content: center;
    justify-items: center;
    gap: 1.1rem;
    padding: 2rem 1rem;
    text-align: center;
  }
  .pot {
    overflow: visible;
    transform-origin: 50% 90%;
    animation: wobble 4s var(--ease) infinite;
  }
  .steam path {
    animation: steam 2.4s ease-in-out infinite;
  }
  .steam path:nth-child(2) {
    animation-delay: 0.5s;
  }
  .steam path:nth-child(3) {
    animation-delay: 1s;
  }
  @keyframes steam {
    0% {
      opacity: 0;
      translate: 0 5px;
    }
    40% {
      opacity: 0.9;
    }
    100% {
      opacity: 0;
      translate: 0 -7px;
    }
  }
  @keyframes wobble {
    0%,
    80%,
    100% {
      rotate: 0deg;
    }
    85% {
      rotate: -5deg;
    }
    92% {
      rotate: 4deg;
    }
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
  .name {
    font-weight: 600;
    color: var(--accent-text);
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
  .screen {
    padding: 1rem;
    font-size: 0.78rem;
    line-height: 1.7;
    cursor: text;
    /* JetBrains Mono draws "../" as a single glyph that reads as " ./"; a terminal should show what was typed. */
    font-variant-ligatures: none;
  }
  pre {
    margin: 0;
    font: inherit;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .prompt {
    display: flex;
    gap: 1ch;
  }
  .prompt input {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: 0;
    outline: 0;
    background: none;
    color: var(--text);
    font-size: inherit;
    line-height: inherit;
    caret-color: var(--accent);
    caret-shape: block;
    /* form controls do not inherit this from .screen */
    font-variant-ligatures: none;
  }
  .prompt input::placeholder {
    color: var(--syn-com);
    opacity: 0.7;
  }
  .term:focus-within {
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    box-shadow:
      0 0 0 4px var(--glow),
      var(--shadow);
  }
  .hint {
    font-size: 0.72rem;
    font-variant-ligatures: none;
  }
  .dir {
    color: var(--accent-2-text);
  }
  .err {
    color: var(--syn-num);
  }
  .quote {
    width: min(560px, 100%);
    margin: 0;
    display: grid;
    justify-items: center;
    gap: 0.6rem;
  }
  blockquote {
    margin: 0;
    /* room for two lines, so the buttons don't jump when a longer quote comes up */
    min-height: 3.2em;
    display: grid;
    place-items: center;
    font-size: 1.05rem;
    line-height: 1.6;
  }
  .refill {
    padding: 0.35rem 0.8rem;
    font-size: 0.76rem;
    color: var(--muted);
    border: 1px dashed var(--border);
    border-radius: 999px;
    background: var(--surface);
    cursor: pointer;
    transition:
      color 0.2s,
      border-color 0.2s;
  }
  .refill:hover {
    color: var(--accent-text);
    border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
  }
  .sub {
    opacity: 0.7;
    font-weight: 500;
  }
</style>

<script lang="ts">
  import { app } from '$lib/app.svelte';
  import { contact, getContent, person, sideProjectHref, sideProjects } from '$lib/data';
  import Scramble from './ui/Scramble.svelte';
  import Socials from './ui/Socials.svelte';
  import HeroEditor from './hero/HeroEditor.svelte';
  import HeroCanvas from './hero/HeroCanvas.svelte';
  import Marquee from './hero/Marquee.svelte';

  const c = $derived(getContent(app.locale));
  const [first, ...rest] = person.name.split(' ');
  /** Apps on their own subdomain; this site itself is not one of the quick links. */
  const apps = sideProjects.filter((p) => p.id !== 'portfolio');

  let hero: HTMLElement;

  /* ---------- cursor spotlight (hero only) ---------- */
  let spotOn = $state(false);
  function onMove(e: PointerEvent) {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--x', `${e.clientX - r.left}px`);
    hero.style.setProperty('--y', `${e.clientY - r.top}px`);
    spotOn = true;
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<section id="hero" data-section class="hero" class:spot-on={spotOn} bind:this={hero} onpointermove={onMove} onpointerleave={() => (spotOn = false)}>
  <div class="blobs" aria-hidden="true"><span></span><span></span><span></span></div>
  <div class="grid-reveal" aria-hidden="true"></div>
  <HeroCanvas />
  <div class="spot" aria-hidden="true"></div>

  <div class="container inner">
    <p class="prompt mono step" style="--i:0">
      <span class="user">joey@portfolio</span><span class="sep">:</span><span class="dir">~</span><span class="sep">$</span>
      <span class="cmd">Coffee break</span>
    </p>

    <h1 class="step" style="--i:1">
      <span class="first"><Scramble text={first} trigger="mount" delay={250} duration={700} /></span>
      <span class="last" data-text={rest.join(' ')}><Scramble text={rest.join(' ')} trigger="mount" delay={450} duration={900} /></span>
    </h1>

    <p class="role mono step" style="--i:2"><span class="com">/**</span> {c.profile.title} <span class="com">*/</span></p>
    <p class="tagline step" style="--i:3">{c.profile.tagline}</p>

    <div class="editor-slot step" style="--i:4"><HeroEditor /></div>

    <div class="cta step" style="--i:5">
      <a class="btn btn-primary" href="#projects"><span aria-hidden="true">&gt;</span> {c.ui.hero.work}</a>
      <a class="btn" href="#contact">{c.ui.hero.contact}<span class="punc" aria-hidden="true">()</span></a>
      <a class="btn" href={app.href('/cv/')}>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5" /></svg
        >
        {c.ui.hero.cv}
      </a>
    </div>

    <section class="quests step" style="--i:6" aria-labelledby="quests-title">
      <p class="quests-head mono">
        <span id="quests-title" class="quests-title">{c.ui.hero.apps}</span>
        <span class="quests-hint">{c.ui.hero.appsHint}</span>
      </p>
      <ul class="tiles">
        {#each apps as p (p.id)}
          {@const txt = c.sideProjects[p.id]}
          <li class="tile" class:wip={p.status === 'wip'}>
            <span class="tile-icon" aria-hidden="true">
              {#if p.id === 'devcity'}
                <svg viewBox="0 0 40 32" width="40" height="32"
                  >{#each [14, 24, 18, 30, 12, 20] as h, i (i)}<rect
                      class="bld"
                      x={1 + i * 6.5}
                      y={32 - h}
                      width="5"
                      height={h}
                      rx="1"
                      style="--i:{i}"
                    />{/each}</svg
                >
              {:else}
                <svg class="piece" viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"
                  ><path d="M4 7h4a2 2 0 1 1 4 0h4v4a2 2 0 1 1 0 4v4h-4a2 2 0 1 0-4 0H4v-4a2 2 0 1 0 0-4z" /></svg
                >
              {/if}
            </span>
            <span class="tile-body">
              {#if p.status === 'live'}
                <a class="tile-link" href={sideProjectHref(p, app.locale)} target="_blank" rel="noopener noreferrer"
                  ><strong>{p.name}</strong> <span class="go" aria-hidden="true">↗</span></a
                >
              {:else}
                <strong>{p.name} <span class="soon mono">{c.ui.hero.soon}</span></strong>
              {/if}
              <span class="tagline">{txt.tagline}</span>
              {#if p.status === 'live' && p.links?.length}
                <span class="districts">
                  {#each p.links as l (l.id)}
                    <a
                      class="district mono"
                      href={sideProjectHref(p, app.locale, l.path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="{p.name}: {txt.links?.[l.id]}">{txt.links?.[l.id]}</a
                    >
                  {/each}
                </span>
              {/if}
            </span>
          </li>
        {/each}
      </ul>
    </section>

    <div class="hero-socials step" style="--i:7"><Socials /></div>
    <a class="mail hero-socials mono step" style="--i:8" href="mailto:{contact.email.value}">{contact.email.value}</a>
  </div>

  <Marquee />
</section>

<style>
  .hero {
    --x: 50%;
    --y: 30%;
    position: relative;
    min-height: 100svh;
    display: grid;
    grid-template-rows: 1fr auto;
    padding-top: calc(var(--nav-h) + clamp(1.25rem, 6vh, 6rem));
    overflow: hidden;
    isolation: isolate;
  }

  /* Cursor highlight, lives only inside the hero with the dots */
  .spot {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background: radial-gradient(420px circle at var(--x) var(--y), var(--glow), transparent 65%);
    opacity: 0;
    transition: opacity 0.5s;
  }
  .grid-reveal {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      linear-gradient(color-mix(in srgb, var(--accent) 35%, transparent) 1px, transparent 1px) 0 0 / 48px 48px,
      linear-gradient(90deg, color-mix(in srgb, var(--accent) 35%, transparent) 1px, transparent 1px) 0 0 / 48px 48px;
    -webkit-mask: radial-gradient(260px circle at var(--x) var(--y), #000, transparent 70%);
    mask: radial-gradient(260px circle at var(--x) var(--y), #000, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s;
  }
  .spot-on .spot,
  .spot-on .grid-reveal {
    opacity: 1;
  }

  /* Decorative layers must stay out of the grid flow, or they eat the 1fr row and push content down. */
  .blobs {
    position: absolute;
    inset: 0;
    z-index: -2;
    overflow: hidden;
    pointer-events: none;
  }
  .blobs span {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    z-index: -2;
    animation: drift 22s ease-in-out infinite alternate;
  }
  .blobs span:nth-child(1) {
    width: 42vmax;
    height: 42vmax;
    left: -14vmax;
    top: -14vmax;
    background: color-mix(in srgb, var(--accent) 45%, transparent);
  }
  .blobs span:nth-child(2) {
    width: 38vmax;
    height: 38vmax;
    right: -12vmax;
    top: 6vmax;
    background: color-mix(in srgb, var(--accent-2) 45%, transparent);
    animation-duration: 28s;
    animation-delay: -6s;
  }
  .blobs span:nth-child(3) {
    width: 28vmax;
    height: 28vmax;
    left: 30%;
    bottom: -16vmax;
    background: color-mix(in srgb, var(--accent-2) 30%, var(--accent) 20%);
    animation-duration: 34s;
    animation-delay: -12s;
  }
  @keyframes drift {
    to {
      transform: translate3d(6vmax, 5vmax, 0) scale(1.15);
    }
  }

  .inner {
    grid-row: 1;
    display: grid;
    justify-items: center;
    /* centered in the free space, weighted towards the top by the larger bottom padding */
    align-content: safe center;
    text-align: center;
    gap: 0.85rem;
    padding-bottom: clamp(2.5rem, 9vh, 8rem);
  }
  .prompt {
    font-size: 0.9rem;
    color: var(--muted);
    padding: 0.3rem 0.8rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    backdrop-filter: blur(8px);
  }
  .user {
    color: var(--accent-text);
  }
  .dir {
    color: var(--accent-2-text);
  }
  .sep {
    color: var(--muted);
  }
  .cmd {
    color: var(--text);
    margin-left: 0.35rem;
  }
  .cmd::after {
    content: '';
    display: inline-block;
    width: 0.5em;
    height: 1em;
    margin-left: 0.15em;
    vertical-align: -0.12em;
    background: var(--accent);
    animation: blink 1.05s steps(1) infinite;
  }

  h1 {
    font-family: var(--mono);
    font-size: clamp(2.6rem, min(9vw, 11vh), 6.2rem);
    font-weight: 800;
    letter-spacing: -0.06em;
    line-height: 0.95;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 0.28em;
  }
  .first {
    color: var(--text);
  }
  .last {
    position: relative;
    /* gradient text only paints inside the box; the extra bottom padding keeps the descender of the "g" visible */
    display: inline-block;
    padding-bottom: 0.14em;
    margin-bottom: -0.14em;
    background: linear-gradient(100deg, var(--accent) 0%, var(--accent-2) 45%, var(--accent) 90%);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 6s linear infinite;
  }
  /* occasional glitch slices */
  .last::before,
  .last::after {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    color: var(--accent);
    -webkit-text-fill-color: currentColor;
    opacity: 0;
    pointer-events: none;
  }
  .last::before {
    color: var(--accent-2);
    animation: glitch-a 7s steps(1) infinite 2s;
  }
  .last::after {
    animation: glitch-b 7s steps(1) infinite 2s;
  }
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
  @keyframes glitch-a {
    0%,
    91%,
    100% {
      opacity: 0;
      transform: none;
    }
    92% {
      opacity: 0.85;
      clip-path: inset(10% 0 55% 0);
      transform: translate(-4px, -1px);
    }
    94% {
      opacity: 0.85;
      clip-path: inset(60% 0 8% 0);
      transform: translate(3px, 2px);
    }
    96% {
      opacity: 0.85;
      clip-path: inset(35% 0 40% 0);
      transform: translate(-2px, 0);
    }
  }
  @keyframes glitch-b {
    0%,
    92%,
    100% {
      opacity: 0;
      transform: none;
    }
    93% {
      opacity: 0.7;
      clip-path: inset(50% 0 20% 0);
      transform: translate(4px, 1px);
    }
    95% {
      opacity: 0.7;
      clip-path: inset(5% 0 70% 0);
      transform: translate(-3px, -2px);
    }
  }

  .role {
    font-size: clamp(0.9rem, 1.8vw, 1.1rem);
    color: var(--text);
    font-weight: 500;
  }
  .role .com {
    font-style: normal;
  }
  .tagline {
    color: var(--muted);
    font-size: clamp(0.98rem, 1.6vw, 1.1rem);
    max-width: 56ch;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
  }
  .mail {
    font-size: 0.8rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
  }
  .mail:hover {
    color: var(--accent-text);
  }

  .editor-slot {
    width: min(680px, 100%);
    margin-top: 0.4rem;
  }
  /* side quests: apps on their own subdomain */
  .quests {
    width: min(680px, 100%);
    display: grid;
    gap: 0.6rem;
    margin-top: 0.4rem;
  }
  .quests-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: baseline;
    gap: 0.2rem 0.6rem;
    font-size: 0.8rem;
  }
  .quests-title {
    color: var(--accent);
    font-weight: 600;
  }
  .quests-title::before {
    content: '// ';
    color: var(--muted);
  }
  .quests-hint {
    color: var(--muted);
  }
  .tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.6rem;
    text-align: left;
  }
  .tile {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 0.8rem 0.9rem;
    border: 1px solid color-mix(in srgb, var(--accent) 35%, var(--border));
    border-radius: var(--radius);
    background: var(--surface);
    backdrop-filter: blur(10px);
    transition:
      transform 0.25s var(--ease),
      border-color 0.25s,
      box-shadow 0.25s;
  }
  .tile:not(.wip):hover {
    transform: translateY(-3px);
    border-color: var(--accent);
    box-shadow: 0 10px 30px -12px color-mix(in srgb, var(--accent) 55%, transparent);
  }
  .tile-icon {
    flex: none;
    display: grid;
    place-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    color: var(--accent);
  }
  .bld {
    fill: currentColor;
    opacity: 0.85;
    transform-box: fill-box;
    transform-origin: bottom;
  }
  .tile:hover .bld {
    animation: bounce 0.6s var(--ease) calc(var(--i) * 60ms);
  }
  @keyframes bounce {
    40% {
      transform: scaleY(1.35);
    }
    70% {
      transform: scaleY(0.9);
    }
  }
  .piece {
    animation: wiggle 3.5s ease-in-out infinite;
  }
  @keyframes wiggle {
    0%,
    80%,
    100% {
      transform: rotate(0);
    }
    85% {
      transform: rotate(-12deg);
    }
    90% {
      transform: rotate(10deg);
    }
    95% {
      transform: rotate(-5deg);
    }
  }
  .tile-body {
    display: grid;
    gap: 0.2rem;
    min-width: 0;
  }
  .tile-body strong {
    font-size: 1rem;
  }
  .tile-link {
    color: var(--text);
    text-decoration: none;
  }
  /* The whole tile is the link to the app; the district links sit on top of it. */
  .tile-link::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
  .go {
    display: inline-block;
    color: var(--accent);
    transition: transform 0.2s var(--ease);
  }
  .tile:hover .go {
    transform: translate(2px, -2px);
  }
  .tagline {
    color: var(--muted);
    font-size: 0.85rem;
    line-height: 1.4;
  }
  .districts {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.3rem;
  }
  .district {
    padding: 0.15rem 0.55rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    font-size: 0.72rem;
    color: var(--muted);
    text-decoration: none;
    transition:
      color 0.2s,
      border-color 0.2s,
      background 0.2s;
  }
  .district:hover {
    color: var(--accent-text);
    border-color: var(--accent);
    background: var(--surface-2);
  }
  .wip {
    border-style: dashed;
    border-color: var(--border);
    background: transparent;
  }
  .wip .tile-icon {
    color: var(--muted);
    background: var(--surface);
  }
  .soon {
    margin-left: 0.3rem;
    font-size: 0.65rem;
    font-weight: 600;
    padding: 0.1rem 0.4rem;
    border-radius: 5px;
    background: var(--accent-ink);
    color: var(--accent-2-text);
    vertical-align: middle;
  }
  @media (prefers-reduced-motion: reduce) {
    .tile,
    .piece,
    .tile:hover .bld {
      animation: none;
      transition: none;
    }
  }
  .step {
    animation: fade-up 0.9s var(--ease) both;
    animation-delay: calc(var(--i) * 110ms + 100ms);
  }

  @media (min-width: 1280px) {
    .hero-socials {
      display: none;
    }
  }
  /* Large monitors: scale the whole hero up so it fills the screen instead of floating small. */
  @media (min-width: 1700px) and (min-height: 1000px) {
    .inner {
      gap: 1.1rem;
    }
    h1 {
      font-size: clamp(6.2rem, min(7vw, 11vh), 9rem);
    }
    .prompt {
      font-size: 1rem;
    }
    .role {
      font-size: 1.3rem;
    }
    .tagline {
      font-size: 1.3rem;
    }
    .editor-slot {
      width: min(860px, 100%);
    }
    .cta :global(.btn) {
      font-size: 1rem;
      --pad: 0.8rem 1.4rem;
    }
  }
</style>
